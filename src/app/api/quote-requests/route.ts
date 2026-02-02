import { NextRequest, NextResponse } from 'next/server';
import { createQuoteRequestSchema } from '@/lib/validations';
import { sendQuoteRequestNotification } from '@/lib/email';
import { QuoteRequestRepository } from '@/lib/repositories/quote-request-repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = createQuoteRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const repository = new QuoteRequestRepository();

    // Create the quote request in the database
    const quoteRequest = await repository.create(data);

    // Send email notification to the photographer
    try {
      await sendQuoteRequestNotification(quoteRequest);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      data: {
        id: quoteRequest.id,
        message: 'Quote request submitted successfully. We will get back to you within 24 hours.'
      }
    });

  } catch (error) {
    console.error('Error creating quote request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit quote request. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as any;
    const serviceType = (searchParams.get('serviceType') as import('@prisma/client').QuoteServiceType) || undefined;

    const repository = new QuoteRequestRepository();
    const { data: quoteRequests, total } = await repository.findMany({
      page,
      limit,
      status,
      serviceType
    });

    return NextResponse.json({
      success: true,
      data: quoteRequests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch quote requests' 
      },
      { status: 500 }
    );
  }
}
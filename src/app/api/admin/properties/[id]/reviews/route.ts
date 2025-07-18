import { type NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-middleware';
interface Review {
      id: string;
      user: string;
      userImage?: string;
      rating: number;
      date: string;
      comment: string;
    }

// POST - Add a new review to a property
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const { id } = await params;
    const propertyId = id;

    const { user, userImage, rating, date, comment } = await request.json();

    if (!user || !rating || !date || !comment) {
      return createAdminResponse('Missing required fields', 400);
    }

    const newReview = {
      id: `review_${Date.now()}`,
      user,
      userImage: userImage || '',
      rating,
      date,
      comment,
    };

    const result = await sql`
      UPDATE properties
      SET reviews = reviews || ${JSON.stringify(newReview)}::jsonb
      WHERE id = ${propertyId}
      RETURNING reviews;
    `;

    if (result.length === 0) {
      return createAdminResponse('Property not found', 404);
    }

    return createAdminResponse('Review added successfully', 201, { reviews: result[0].reviews });
  } catch (error) {
    console.error('Error adding review:', error);
    return createAdminResponse('Failed to add review', 500);
  }
}

// PUT - Update an existing review
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const {id } = await params;
    const propertyId = id

    const { id: reviewId, user, userImage, rating, date, comment } = await request.json();

    if (!reviewId || !user || !rating || !date || !comment) {
      return createAdminResponse('Missing required fields', 400);
    }

    const propertyResult = await sql`SELECT reviews FROM properties WHERE id = ${propertyId}`;
    if (propertyResult.length === 0) {
      return createAdminResponse('Property not found', 404);
    }

    const reviews = propertyResult[0].reviews as Review[];
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return createAdminResponse('Review not found', 404);
    }

    reviews[reviewIndex] = { id: reviewId, user, userImage, rating, date, comment };

    const result = await sql`
      UPDATE properties
      SET reviews = ${JSON.stringify(reviews)}::jsonb
      WHERE id = ${propertyId}
      RETURNING reviews;
    `;

    return createAdminResponse('Review updated successfully', 200, { reviews: result[0].reviews });
  } catch (error) {
    console.error('Error updating review:', error);
    return createAdminResponse('Failed to update review', 500);
  }
}

// DELETE - Delete a review from a property
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const { id } = await params;
    const propertyId = id;
    
    const { id: reviewId } = await request.json();

    if (!reviewId) {
      return createAdminResponse('Review ID is required', 400);
    }

    const propertyResult = await sql`SELECT reviews FROM properties WHERE id = ${propertyId}`;
    if (propertyResult.length === 0) {
      return createAdminResponse('Property not found', 404);
    }

    

    const reviews = propertyResult[0].reviews as Review[];
    const updatedReviews = reviews.filter(r => r.id !== reviewId);

    if (reviews.length === updatedReviews.length) {
      return createAdminResponse('Review not found', 404);
    }

    const result = await sql`
      UPDATE properties
      SET reviews = ${JSON.stringify(updatedReviews)}::jsonb
      WHERE id = ${propertyId}
      RETURNING reviews;
    `;

    return createAdminResponse('Review deleted successfully', 200, { reviews: result[0].reviews });
  } catch (error) {
    console.error('Error deleting review:', error);
    return createAdminResponse('Failed to delete review', 500);
  }
}

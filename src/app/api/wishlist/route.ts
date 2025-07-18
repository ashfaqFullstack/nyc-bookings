import { type NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-utils';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const tokenUser = getUserFromRequest(request);

    if (!tokenUser) {
      console.log('API: GET /wishlist - Unauthorized request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('API: GET /wishlist - Authorized request for user:', tokenUser.userId);

    // Get user's wishlist
    const result = await sql`
      SELECT "propertyId", "createdAt"
      FROM wishlist
      WHERE "userId" = ${tokenUser.userId}
      ORDER BY "createdAt" DESC
    `;

    const wishlist = result.map(item => ({
      propertyId: item.propertyId as string,
      createdAt: item.createdAt as Date
    }));

    console.log(`API: GET /wishlist - Retrieved ${wishlist.length} items for user ${tokenUser.userId}`);

    return NextResponse.json({ wishlist });

  } catch (error) {
    console.error('API: GET /wishlist - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add property to wishlist
export async function POST(request: NextRequest) {
  try {
    // Get user from JWT token
    const tokenUser = getUserFromRequest(request);

    if (!tokenUser) {
      console.log('API: POST /wishlist - Unauthorized request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      console.log('API: POST /wishlist - Missing propertyId');
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    console.log(`API: POST /wishlist - Request to add property ${propertyId} for user ${tokenUser.userId}`);

    // Check if property is already in wishlist
    const existing = await sql`
      SELECT id FROM wishlist
      WHERE "userId" = ${tokenUser.userId} AND "propertyId" = ${propertyId}
    `;

    if (existing.length > 0) {
      console.log(`API: POST /wishlist - Property ${propertyId} already in wishlist for user ${tokenUser.userId}`);
      return NextResponse.json(
        { message: 'Property already in wishlist' },
        { status: 409 }
      );
    }

    // Add to wishlist
    await sql`
      INSERT INTO wishlist ("userId", "propertyId", "createdAt")
      VALUES (${tokenUser.userId}, ${propertyId}, NOW())
    `;

    console.log(`API: POST /wishlist - Successfully added property ${propertyId} to wishlist for user ${tokenUser.userId}`);

    return NextResponse.json(
      { message: 'Property added to wishlist' },
      { status: 201 }
    );

  } catch (error) {
    console.error('API: POST /wishlist - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove property from wishlist
export async function DELETE(request: NextRequest) {
  try {
    // Get user from JWT token
    const tokenUser = getUserFromRequest(request);

    if (!tokenUser) {
      console.log('API: DELETE /wishlist - Unauthorized request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      console.log('API: DELETE /wishlist - Missing propertyId');
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    console.log(`API: DELETE /wishlist - Request to remove property ${propertyId} for user ${tokenUser.userId}`);

    // Remove from wishlist
    const result = await sql`
      DELETE FROM wishlist
      WHERE "userId" = ${tokenUser.userId} AND "propertyId" = ${propertyId}
      RETURNING id
    `;

    const deletedCount = result.length;
    console.log(`API: DELETE /wishlist - Removed ${deletedCount} entries for property ${propertyId} user ${tokenUser.userId}`);

    return NextResponse.json(
      { message: 'Property removed from wishlist', deletedCount }
    );

  } catch (error) {
    console.error('API: DELETE /wishlist - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

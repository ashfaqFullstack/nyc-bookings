import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM properties
      WHERE id = ${id} AND isactive = true
      LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }

    const property = result[0];

    // Transform property to match frontend expectations
    const transformedProperty = {
      ...property,
      coordinates: typeof property.coordinates === 'string'
        ? JSON.parse(property.coordinates)
        : property.coordinates,
      neighborhoodInfo: typeof property.neighborhoodinfo === 'string'
        ? JSON.parse(property.neighborhoodinfo)
        : property.neighborhoodinfo,
      reviewCount: property.reviewcount,
      hostImage: property.hostimage,
      hostJoinedDate: property.hostjoineddate,
      checkIn: property.checkin,
      checkOut: property.checkout,
      houseRules: property.houserules,
      cancellationPolicy: property.cancellationpolicy,
      reviews: typeof property.reviews === 'string'
        ? JSON.parse(property.reviews)
        : property.reviews,
      isWishlisted: false // This would need to be calculated based on user's wishlist
    };

    console.log(transformedProperty)
    return Response.json({
      data: {
        property: transformedProperty
      }
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return Response.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

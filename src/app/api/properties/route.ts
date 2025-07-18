import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '20');
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const guests = searchParams.get('guests');
    const offset = (page - 1) * limit;

    const whereConditions = ['isactive = true'];

    if (location) {
      whereConditions.push(`(location ILIKE '%${location}%' OR neighborhood ILIKE '%${location}%')`);
    }
    if (minPrice) {
      whereConditions.push(`price >= ${Number.parseInt(minPrice)}`);
    }
    if (maxPrice) {
      whereConditions.push(`price <= ${Number.parseInt(maxPrice)}`);
    }
    if (bedrooms) {
      whereConditions.push(`bedrooms >= ${Number.parseInt(bedrooms)}`);
    }
    if (guests) {
      whereConditions.push(`guests >= ${Number.parseInt(guests)}`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const properties = await sql`
      SELECT * FROM properties
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      ORDER BY createdat DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Transform properties to match the expected frontend format
    const transformedProperties = properties.map(property => ({
      ...property,
      coordinates: typeof property.coordinates === 'string'
        ? JSON.parse(property.coordinates)
        : property.coordinates,
      neighborhoodInfo: typeof property.neighborhoodinfo === 'string'
        ? JSON.parse(property.neighborhoodinfo)
        : property.neighborhoodinfo,
      reviewCount: property.reviewcount,
      hostImage: property.hostimage,
      listing_id : property.listing_id,
      hostJoinedDate: property.hostjoineddate,
      checkIn: property.checkin,
      checkOut: property.checkout,
      houseRules: property.houserules,
      cancellationPolicy: property.cancellationpolicy,
      reviews: typeof property.reviews === 'string'
        ? JSON.parse(property.reviews)
        : property.reviews,
      isWishlisted: false // This would need to be calculated based on user's wishlist
    }));

    const totalResult = await sql`
      SELECT COUNT(*) as total FROM properties
      ${whereClause ? sql.unsafe(whereClause) : sql``}
    `;

    const total = Number.parseInt(totalResult[0].total);

    return Response.json({
      data: {
        properties: transformedProperties,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return Response.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

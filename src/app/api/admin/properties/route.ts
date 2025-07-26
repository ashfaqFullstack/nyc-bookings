import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-middleware';

// GET - Fetch all properties
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    if (search) {
      whereClause = `WHERE title ILIKE '%${search}%' OR location ILIKE '%${search}%'`;
    }

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
      hostJoinedDate: property.hostjoineddate,
      checkIn: property.checkin,
      checkOut: property.checkout,
      houseRules: property.houserules,
      bedroomBedTypes : property.bedroomBedTypes,
      listing_id : property.listing_id,
      hostexwidgetid : property.hostexwidgetid,
      scriptsrc: property.scriptsrc,
      cancellationPolicy: property.cancellationpolicy,
    }));

    const totalResult = await sql`
      SELECT COUNT(*) as total FROM properties
      ${whereClause ? sql.unsafe(whereClause) : sql``}
    `;

    const total = Number.parseInt(totalResult[0].total);

    return createAdminResponse('Properties fetched successfully', 200, {
      properties: transformedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return createAdminResponse('Failed to fetch properties', 500);
  }
}

// POST - Create new property
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const body = await request.json();
    const {
      title, location, neighborhood, price, rating = 0, reviewCount = 0,
      images, host, hostImage, hostJoinedDate, amenities, description,
      bedrooms, bathrooms, beds, guests, checkIn, checkOut, houseRules,
      cancellationPolicy, coordinates, neighborhoodInfo, reviews , hostexwidgetid, scriptsrc, listing_id , bedroomBedTypes
    } = body;

    const id = body.id || `prop_${Date.now()}`;

    // Validation
    // if (!title || !location || !neighborhood || !price || !images || !host ||
    //     !description || !bedrooms || !bathrooms || !beds || !guests || !checkIn ||
    //     !checkOut || !coordinates || !neighborhoodInfo) {
    //   return createAdminResponse('Missing required fields', 400);
    // }


   await sql`
  ALTER TABLE properties
  ALTER COLUMN cancellationpolicy TYPE TEXT,
  ALTER COLUMN cancellationpolicy SET NOT NULL
`;



    const result = await sql`
      INSERT INTO properties (
        id, title, location, neighborhood, price, rating, reviewcount,
        images, host, hostimage, hostjoineddate, amenities, description,
        bedrooms, bathrooms, beds, guests, checkin, checkout, houserules,
        cancellationpolicy, coordinates, neighborhoodinfo, reviews,
        hostexwidgetid, scriptsrc, listing_id, bedroombedtypes, createdat 
      ) VALUES (
        ${id}, ${title}, ${location}, ${neighborhood}, ${price}, ${rating}, ${reviewCount},
        ${images}, ${host}, ${hostImage || ''}, ${hostJoinedDate || new Date().getFullYear().toString()},
        ${amenities}, ${description}, ${bedrooms}, ${bathrooms}, ${beds}, ${guests},
        ${checkIn}, ${checkOut}, ${houseRules || []}, ${cancellationPolicy || ''},
        ${JSON.stringify(coordinates)}, ${JSON.stringify(neighborhoodInfo)}, ${JSON.stringify(reviews)},
        ${hostexwidgetid}, ${scriptsrc}, ${listing_id}, ${JSON.stringify(bedroomBedTypes)},
        NOW()
      )
      RETURNING *
    `;

    // Transform the response to match frontend expectations
    const property = {
      ...result[0],
      coordinates: typeof result[0].coordinates === 'string'
        ? JSON.parse(result[0].coordinates)
        : result[0].coordinates,
      neighborhoodInfo: typeof result[0].neighborhoodinfo === 'string'
        ? JSON.parse(result[0].neighborhoodinfo)
        : result[0].neighborhoodinfo,
      reviewCount: result[0].reviewcount,
      hostImage: result[0].hostimage,
      listing_id : result[0].listing_id,
      hostJoinedDate: result[0].hostjoineddate,
      checkIn: result[0].checkin,
      checkOut: result[0].checkout,
      houseRules: result[0].houserules,
      hostexwidgetid : result[0].hostexwidgetid,
      scriptsrc: result[0].scriptsrc,
      cancellationPolicy: result[0].cancellationpolicy,
    };

    return createAdminResponse('Property created successfully', 201, { property });
  } catch (error) {
    console.error('Error creating property:', error);
    if (error instanceof Error && error.message?.includes('duplicate key')) {
      return createAdminResponse('Property ID already exists', 409);
    }
    return createAdminResponse('Failed to create property', 500);
  }
}

// DELETE - Delete property
export async function DELETE(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return createAdminResponse('Property ID is required', 400);
    }

    const result = await sql`
      DELETE FROM properties WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return createAdminResponse('Property not found', 404);
    }

    return createAdminResponse('Property deleted successfully', 200);
  } catch (error) {
    console.error('Error deleting property:', error);
    return createAdminResponse('Failed to delete property', 500);
  }
}

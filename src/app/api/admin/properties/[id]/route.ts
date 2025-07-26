import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { createAdminResponse, verifyAdminToken } from '@/lib/admin-middleware';

// GET - Fetch a single property by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const { id } = await params;
    const properties = await sql`
      SELECT * FROM properties WHERE id = ${id}
    `;

    if (properties.length === 0) {
      return createAdminResponse('Property not found', 404);
    }

    const property = properties[0];
    const transformedProperty = {
      ...property,
      coordinates: typeof property.coordinates === 'string' ? JSON.parse(property.coordinates) : property.coordinates,
      neighborhoodInfo: typeof property.neighborhoodinfo === 'string' ? JSON.parse(property.neighborhoodinfo) : property.neighborhoodinfo,
      reviewCount: property.reviewcount,
      hostImage: property.hostimage,
      bedroombedtypes : property.bedroombedtypes,
      hostJoinedDate: property.hostjoineddate,
      checkIn: property.checkin,
      listing_id : property.listing_id,
      checkOut: property.checkout,
      hostexwidgetid: property.hostexwidgetid,
      scriptsrc: property.scriptsrc,
      houseRules: property.houserules,
      cancellationPolicy: property.cancellationpolicy,
    };

    return createAdminResponse('Property fetched successfully', 200, { property: transformedProperty });
  } catch (error) {
    console.error('Error fetching property:', error);
    return createAdminResponse('Failed to fetch property', 500);
  }
}

// PUT - Update a property
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await verifyAdminToken(request);
  if (authResult.status !== 200) {
    return createAdminResponse(authResult.error || 'Authentication failed', authResult.status);
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title, location, address, neighborhood, price, rating, reviewCount,
      images, host, hostImage, hostJoinedDate, amenities, description,
      bedrooms, bathrooms, beds, guests, checkIn, checkOut, houseRules,
      cancellationPolicy, coordinates, neighborhoodInfo , hostexwidgetid ,scriptsrc, listing_id, bedroomBedTypes
    } = body;


    await sql`
      UPDATE properties
      SET
        title = ${title},
        location = ${location},
        address = ${address},
        neighborhood = ${neighborhood},
        price = ${price},
        rating = ${rating},
        reviewcount = ${reviewCount},
        images = ${images},
        host = ${host},
        hostimage = ${hostImage},
        hostjoineddate = ${hostJoinedDate},
        amenities = ${amenities},
        description = ${description},
        bedrooms = ${bedrooms},
        bathrooms = ${bathrooms},
        beds = ${beds},
        guests = ${guests},
        checkin = ${checkIn},
        checkout = ${checkOut},
        houserules = ${houseRules},
        cancellationpolicy = ${cancellationPolicy},
        coordinates = ${JSON.stringify(coordinates)},
        neighborhoodinfo = ${JSON.stringify(neighborhoodInfo)},
        hostexwidgetid = ${hostexwidgetid},
        scriptsrc = ${scriptsrc},
        listing_id = ${listing_id},
        bedroombedtypes = ${JSON.stringify(bedroomBedTypes)}
      WHERE id = ${id}
    `;

    return createAdminResponse('Property updated successfully', 200);
  } catch (error) {
    console.error('Error updating property:', error);
    return createAdminResponse('Failed to update property', 500);
  }
}

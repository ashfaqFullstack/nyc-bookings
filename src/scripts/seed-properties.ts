import { sql } from '../lib/db';
import { realProperties } from '../lib/data';

async function seedProperties() {
  console.log('Starting to seed properties...');

  try {
    // First, check if properties table exists and create it if not
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id VARCHAR(255) PRIMARY KEY,
        listing_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        neighborhood VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        rating DECIMAL(3,2) DEFAULT 0,
        reviewcount INTEGER DEFAULT 0,
        images TEXT[] NOT NULL,
        host VARCHAR(255) NOT NULL,
        hostimage VARCHAR(255),
        hostjoineddate VARCHAR(255),
        amenities TEXT[] NOT NULL,
        description TEXT NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        beds INTEGER NOT NULL,
        guests INTEGER NOT NULL,
        checkin VARCHAR(255) NOT NULL,
        checkout VARCHAR(255) NOT NULL,
        houserules TEXT[],
        cancellationpolicy VARCHAR(255),
        coordinates JSONB NOT NULL,
        neighborhoodinfo JSONB,
        reviews JSONB DEFAULT '[]'::jsonb,
        isactive BOOLEAN DEFAULT true,
        createdat TIMESTAMP DEFAULT NOW(),
        updatedat TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Properties table ready');

    // Check existing properties
    const existingProperties = await sql`SELECT id FROM properties`;
    const existingIds = new Set(existingProperties.map(p => p.id));

    // Insert properties that don't exist
    let inserted = 0;
    let skipped = 0;

    for (const property of realProperties) {
      if (existingIds.has(property.id)) {
        console.log(`Property ${property.id} already exists, skipping...`);
        skipped++;
        continue;
      }

      try {
        await sql`
          INSERT INTO properties (
            id, listing_id ,title, location, address, neighborhood, price, rating, reviewcount,
            images, host, hostimage, hostjoineddate, amenities, description,
            bedrooms, bathrooms, beds, guests, checkin, checkout, houserules,
            cancellationpolicy, coordinates, neighborhoodinfo, reviews
          ) VALUES (
            ${property.id}, ${property.listing_id},${property.title}, ${property.location}, ${property.address}, ${property.neighborhood},
            ${property.price}, ${property.rating}, ${property.reviewCount}, ${property.images},
            ${property.host}, ${property.hostImage}, ${property.hostJoinedDate}, ${property.amenities},
            ${property.description}, ${property.bedrooms}, ${property.bathrooms}, ${property.beds},
            ${property.guests}, ${property.checkIn}, ${property.checkOut}, ${property.houseRules},
            ${property.cancellationPolicy}, ${JSON.stringify(property.coordinates)},
            ${JSON.stringify(property.neighborhoodInfo)}, ${JSON.stringify(property.reviews)}
          )
        `;
        console.log(`Inserted property: ${property.title}`);
        inserted++;
      } catch (error) {
        console.error(`Failed to insert property ${property.id}:`, error);
      }
    }

    console.log('\nSeeding completed!');
    console.log(`Inserted: ${inserted} properties`);
    console.log(`Skipped: ${skipped} properties`);

    // Show total count
    const totalCount = await sql`SELECT COUNT(*) as count FROM properties`;
    console.log(`Total properties in database: ${totalCount[0].count}`);

  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProperties().then(() => {
  console.log('Seeding process finished');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

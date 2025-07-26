import { sql } from '../lib/db';
import { realProperties } from '../lib/data';
import { hashPassword } from '../lib/auth-utils';

async function createTables() {
  console.log('Starting to create tables...');

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        "passwordHash" VARCHAR(255) NOT NULL,
        role VARCHAR(10) DEFAULT 'user' NOT NULL,
        "isVerified" BOOLEAN DEFAULT false NOT NULL,
        "resetToken" VARCHAR(255),
        "resetTokenExpiry" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('Users table created or already exists.');

    

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
        cancellationpolicy TEXT NOT NULL,
        coordinates JSONB NOT NULL,
        neighborhoodinfo JSONB,
        reviews JSONB DEFAULT '[]'::jsonb,
        hostexwidgetid VARCHAR(255),
        scriptsrc VARCHAR(255),
        isactive BOOLEAN DEFAULT true,
        createdat TIMESTAMP DEFAULT NOW(),
        updatedat TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Properties table created or already exists.');

    // Create wishlist table
    await sql`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "propertyId" VARCHAR(255) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE("userId", "propertyId")
      )
    `;
    console.log('Wishlist table created or already exists.');

    console.log('\nTable creation completed!');

  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

async function seedProperties() {
  console.log('Starting to seed properties...');

  try {
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
            id, listing_id, title, location, neighborhood, price, rating, reviewcount,
            images, host, hostimage, hostjoineddate, amenities, description,
            bedrooms, bathrooms, beds, guests, checkin, checkout, houserules,
            cancellationpolicy, coordinates, neighborhoodinfo, reviews, hostexwidgetid, scriptsrc
          ) VALUES (
            ${property.id}, ${property.listing_id},${property.title}, ${property.location}, ${property.neighborhood},
            ${property.price}, ${property.rating}, ${property.reviewCount}, ${property.images},
            ${property.host}, ${property.hostImage}, ${property.hostJoinedDate}, ${property.amenities},
            ${property.description}, ${property.bedrooms}, ${property.bathrooms}, ${property.beds},
            ${property.guests}, ${property.checkIn}, ${property.checkOut}, ${property.houseRules},
            ${property.cancellationPolicy}, ${JSON.stringify(property.coordinates)},
            ${JSON.stringify(property.neighborhoodInfo)}, ${JSON.stringify(property.reviews)},
            ${property.hostexwidgetid}, ${property.scriptsrc}
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

async function seedUsers() {
  console.log('Starting to seed users...');
  try {
    const hashedPassword = await hashPassword('123456');
    
    // Create a regular user
    await sql`
      INSERT INTO users ("firstName", "lastName", email, "passwordHash", role, "isVerified")
      VALUES ('Test', 'User', 'user@test.com', ${hashedPassword}, 'user', true)
      ON CONFLICT (email) DO NOTHING;
    `;

    // Create an admin user
    await sql`
      INSERT INTO users ("firstName", "lastName", email, "passwordHash", role, "isVerified")
      VALUES ('Admin', 'User', 'admin@test.com', ${hashedPassword}, 'admin', true)
      ON CONFLICT (email) DO NOTHING;
    `;

    console.log('Users seeded successfully.');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

async function seedWishlist() {
  console.log('Starting to seed wishlist...');
  try {
    const users = await sql`SELECT id FROM users`;
    if (users.length === 0) {
      console.log('No users found, skipping wishlist seeding.');
      return;
    }
    const userId = users[0].id;

    // Clear existing wishlist for the user
    await sql`DELETE FROM wishlist WHERE "userId" = ${userId}`;

    // Add a few properties to the wishlist
    const properties = await sql`SELECT id FROM properties LIMIT 3`;
    for (const property of properties) {
      await sql`
        INSERT INTO wishlist ("userId", "propertyId")
        VALUES (${userId}, ${property.id})
        ON CONFLICT ("userId", "propertyId") DO NOTHING;
      `;
    }

    console.log('Wishlist seeded successfully.');
  } catch (error) {
    console.error('Error seeding wishlist:', error);
    process.exit(1);
  }
}

async function main() {
  await createTables();
  await seedProperties();
  await seedUsers();
  await seedWishlist();
  console.log('Database seeding finished successfully.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Database seeding failed:', error);
  process.exit(1);
});
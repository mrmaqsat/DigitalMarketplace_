import { db } from "./db";
import { users, categories, products } from "@shared/schema";
import { storage } from "./storage";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    // Create categories
    const [techCategory, designCategory, businessCategory] = await db
      .insert(categories)
      .values([
        { name: "Technology", description: "Software, apps, and digital tools" },
        { name: "Design", description: "Graphics, templates, and design assets" },
        { name: "Business", description: "Business plans, guides, and resources" }
      ])
      .returning();

    // Create users with different roles
    const testAdmin = await storage.createUser({
      username: "admin",
      email: "admin@digitalmart.com",
      password: await hashPassword("admin123"),
      role: "admin"
    });

    const testSeller = await storage.createUser({
      username: "seller1", 
      email: "seller1@digitalmart.com",
      password: await hashPassword("seller123"),
      role: "seller"
    });

    const testUser = await storage.createUser({
      username: "user1",
      email: "user1@digitalmart.com", 
      password: await hashPassword("user123"),
      role: "user"
    });

    // Create sample products
    await db.insert(products).values([
      {
        name: "E-commerce Website Template",
        description: "Complete responsive e-commerce template with modern design and shopping cart functionality.",
        price: "49.99",
        categoryId: techCategory.id,
        sellerId: testSeller.id,
        status: "approved",
        digitalFileUrl: "/uploads/sample-template.zip",
        imageUrl: "/uploads/ecommerce-template.jpg"
      },
      {
        name: "Logo Design Bundle",
        description: "Professional logo templates perfect for startups and small businesses. Includes 50+ designs.",
        price: "29.99", 
        categoryId: designCategory.id,
        sellerId: testSeller.id,
        status: "approved",
        digitalFileUrl: "/uploads/logo-bundle.zip",
        imageUrl: "/uploads/logo-designs.jpg"
      },
      {
        name: "Business Plan Template", 
        description: "Comprehensive business plan template with financial projections and market analysis sections.",
        price: "19.99",
        categoryId: businessCategory.id,
        sellerId: testSeller.id,
        status: "pending",
        digitalFileUrl: "/uploads/business-plan.pdf",
        imageUrl: "/uploads/business-plan.jpg"
      },
      {
        name: "React Component Library",
        description: "Reusable React components with TypeScript support and documentation.",
        price: "79.99",
        categoryId: techCategory.id, 
        sellerId: testSeller.id,
        status: "approved",
        digitalFileUrl: "/uploads/react-components.zip",
        imageUrl: "/uploads/react-components.jpg"
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('Test accounts created:');
    console.log('Admin: admin / admin123');
    console.log('Seller: seller1 / seller123');
    console.log('User: user1 / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function hashPassword(password: string) {
  const { scrypt, randomBytes } = await import("crypto");
  const { promisify } = await import("util");
  const scryptAsync = promisify(scrypt);
  
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}
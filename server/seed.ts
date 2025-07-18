import { connectToDatabase, disconnectFromDatabase } from './db.js';
import { User, Category, Product } from '@shared/models.js';
import { createHash, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return salt + ':' + hash;
}

export async function seedDatabase() {
  try {
    await connectToDatabase();
    
    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }
    
    console.log('🌱 Seeding database...');
    
    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Digital Art',
        slug: 'digital-art',
        description: 'Digital artwork, illustrations, and graphics',
        icon: 'palette'
      },
      {
        name: 'Software',
        slug: 'software',
        description: 'Applications, tools, and software solutions',
        icon: 'code'
      },
      {
        name: 'E-books',
        slug: 'ebooks',
        description: 'Digital books and publications',
        icon: 'book'
      },
      {
        name: 'Templates',
        slug: 'templates',
        description: 'Website templates, design templates, and more',
        icon: 'layout'
      },
      {
        name: 'Music',
        slug: 'music',
        description: 'Digital music, sound effects, and audio files',
        icon: 'music'
      }
    ]);
    
    console.log('📂 Created categories');
    
    // Create users
    const adminPassword = hashPassword('admin123');
    const sellerPassword = hashPassword('seller123');
    const userPassword = hashPassword('user123');
    
    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        fullName: 'Admin User',
        role: 'admin'
      },
      {
        username: 'johnseller',
        email: 'john@example.com',
        password: sellerPassword,
        fullName: 'John Seller',
        role: 'seller'
      },
      {
        username: 'janeseller',
        email: 'jane@example.com',
        password: sellerPassword,
        fullName: 'Jane Seller',
        role: 'seller'
      },
      {
        username: 'customer1',
        email: 'customer@example.com',
        password: userPassword,
        fullName: 'Customer User',
        role: 'user'
      }
    ]);
    
    console.log('👥 Created users');
    
    // Create sample products
    const products = await Product.insertMany([
      {
        title: 'Modern Logo Design Pack',
        description: 'A collection of 50 modern logo designs for various industries. Perfect for startups and businesses looking for professional branding.',
        price: 29.99,
        categoryId: categories[0]._id,
        sellerId: users[1]._id,
        images: ['/uploads/logo-pack-1.jpg', '/uploads/logo-pack-2.jpg'],
        files: ['/uploads/logo-pack.zip'],
        status: 'approved',
        rating: 4.5,
        reviewCount: 12,
        salesCount: 45
      },
      {
        title: 'Task Management App',
        description: 'A complete task management application built with React and Node.js. Includes source code and documentation.',
        price: 99.99,
        categoryId: categories[1]._id,
        sellerId: users[1]._id,
        images: ['/uploads/task-app-1.jpg', '/uploads/task-app-2.jpg'],
        files: ['/uploads/task-app-source.zip'],
        status: 'approved',
        rating: 4.8,
        reviewCount: 8,
        salesCount: 23
      },
      {
        title: 'Digital Marketing Guide',
        description: 'Comprehensive guide to digital marketing strategies. Covers SEO, social media, email marketing, and more.',
        price: 19.99,
        categoryId: categories[2]._id,
        sellerId: users[2]._id,
        images: ['/uploads/marketing-guide.jpg'],
        files: ['/uploads/marketing-guide.pdf'],
        status: 'approved',
        rating: 4.2,
        reviewCount: 25,
        salesCount: 78
      },
      {
        title: 'Bootstrap Admin Template',
        description: 'Professional admin dashboard template built with Bootstrap 5. Responsive and customizable.',
        price: 39.99,
        categoryId: categories[3]._id,
        sellerId: users[2]._id,
        images: ['/uploads/admin-template-1.jpg', '/uploads/admin-template-2.jpg'],
        files: ['/uploads/admin-template.zip'],
        status: 'approved',
        rating: 4.6,
        reviewCount: 15,
        salesCount: 32
      },
      {
        title: 'Ambient Music Collection',
        description: 'Collection of 20 ambient music tracks perfect for meditation, relaxation, and background music.',
        price: 24.99,
        categoryId: categories[4]._id,
        sellerId: users[1]._id,
        images: ['/uploads/ambient-music.jpg'],
        files: ['/uploads/ambient-music.zip'],
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        salesCount: 0
      }
    ]);
    
    console.log('🛍️ Created sample products');
    
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('Test accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Seller: john@example.com / seller123');
    console.log('Customer: customer@example.com / user123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await disconnectFromDatabase();
  }
}

// Run the seed function
seedDatabase();

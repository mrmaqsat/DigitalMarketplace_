import { connectToDatabase } from './server/db.ts';
import { User, Category, Product, Order, OrderItem, Cart, Review } from './shared/models.ts';

async function clearDatabase() {
  try {
    await connectToDatabase();
    
    console.log('Clearing database...');
    
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});
    
    console.log('Database cleared successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();

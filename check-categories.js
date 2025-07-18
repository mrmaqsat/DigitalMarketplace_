import { connectToDatabase } from './server/db.ts';
import { Category } from './shared/models.ts';

async function checkCategories() {
  try {
    await connectToDatabase();
    
    console.log('Checking categories in database...');
    const categories = await Category.find({});
    
    console.log('Found categories:', categories.length);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCategories();

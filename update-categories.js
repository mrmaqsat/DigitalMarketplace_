import { connectToDatabase } from './server/db.ts';
import { Category } from './shared/models.ts';

async function updateCategories() {
  try {
    await connectToDatabase();
    
    console.log('Updating categories to Russian...');
    
    const categoryUpdates = [
      { oldName: 'Digital Art', newName: 'Цифровое искусство' },
      { oldName: 'Software', newName: 'Программное обеспечение' },
      { oldName: 'E-books', newName: 'Электронные книги' },
      { oldName: 'Templates', newName: 'Шаблоны' },
      { oldName: 'Music', newName: 'Музыка' }
    ];
    
    for (const update of categoryUpdates) {
      await Category.updateOne(
        { name: update.oldName },
        { $set: { name: update.newName } }
      );
      console.log(`Updated ${update.oldName} to ${update.newName}`);
    }
    
    console.log('Categories updated successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating categories:', error);
    process.exit(1);
  }
}

updateCategories();

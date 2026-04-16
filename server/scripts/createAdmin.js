const mongoose = require('mongoose');

async function createAdmin() {
  try {
    // Connect without auth first (assuming auth is currently disabled)
    await mongoose.connect('mongodb://127.0.0.1:27017/admin');
    console.log('Connected to MongoDB');

    const adminDb = mongoose.connection.useDb('admin');
    
    // Check if user already exists (optional but good practice)
    // Actually, we can just try to create it.
    
    await mongoose.connection.db.admin().command({
      createUser: "admin",
      pwd: "admin123",
      roles: [{ role: "root", db: "admin" }]
    });

    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();

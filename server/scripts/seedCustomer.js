const mongoose = require('mongoose');
const Customer = require('../models/Customer');
require('dotenv').config({ path: '../.env' });

const seedCustomer = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/userInfo';
        console.log('Connecting to:', mongoURI);
        await mongoose.connect(mongoURI);
        
        const testUser = {
            name: "Test Customer",
            email: "test@example.com",
            phone: "03001234567",
            address: "123 Test Street, Network City",
            gender: "Male",
            password: "password123", // Note: In a real app, hash this, but we'll use literal for simplicity of this test
            role: "customer"
        };

        const existing = await Customer.findOne({ email: testUser.email });
        if (existing) {
            console.log('Test customer already exists!');
        } else {
            await Customer.create(testUser);
            console.log('✅ Test customer created successfully!');
            console.log('Email: test@example.com');
            console.log('Password: password123');
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error seeding customer:', err.message);
        process.exit(1);
    }
};

seedCustomer();

const mongoose = require('mongoose');
const Contractor = require('../models/Contractor');
require('dotenv').config({ path: '../.env' });

const seedContractor = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/userInfo';
        console.log('Connecting to:', mongoURI);
        await mongoose.connect(mongoURI);
        
        const testContractor = {
            name: "Test Contractor",
            email: "contractor@example.com",
            phone: "03112233445",
            cnicNumber: "12345-6789012-3",
            city: "Network City",
            address: "456 Builder Lane",
            gender: "Male",
            password: "password123",
            status: "approved", // auto-approve for testing
            role: "contractor"
        };

        const existing = await Contractor.findOne({ email: testContractor.email });
        if (existing) {
            console.log('Test contractor already exists!');
        } else {
            await Contractor.create(testContractor);
            console.log('✅ Test contractor created successfully!');
            console.log('Email: contractor@example.com');
            console.log('Password: password123');
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error seeding contractor:', err.message);
        process.exit(1);
    }
};

seedContractor();

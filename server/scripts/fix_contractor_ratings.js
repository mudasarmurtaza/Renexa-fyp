const mongoose = require('mongoose');
const Contractor = require('../models/Contractor');
require('dotenv').config({ path: '../.env' });

const fixContractorRatings = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/userInfo';
        console.log('Connecting to:', mongoURI);
        await mongoose.connect(mongoURI);
        
        console.log('Fetching all contractors...');
        const contractors = await Contractor.find({});
        console.log(`Found ${contractors.length} contractors.`);

        let updatedCount = 0;
        for (const contractor of contractors) {
            let needsUpdate = false;

            // Ensure reviews array exists
            if (!contractor.reviews || !Array.isArray(contractor.reviews)) {
                contractor.reviews = [];
                needsUpdate = true;
            }

            // Ensure rating field exists and is a number
            if (contractor.rating === undefined || typeof contractor.rating !== 'number') {
                contractor.rating = 0;
                needsUpdate = true;
            }

            // If reviews exist but rating is 0, recompute it
            if (contractor.reviews.length > 0 && contractor.rating === 0) {
                const total = contractor.reviews.reduce((sum, r) => sum + r.rating, 0);
                contractor.rating = parseFloat((total / contractor.reviews.length).toFixed(1));
                needsUpdate = true;
            }

            if (needsUpdate) {
                await contractor.save();
                updatedCount++;
                console.log(`✅ Updated contractor: ${contractor.name} (${contractor._id})`);
            }
        }

        console.log(`\nMaintenance complete. Updated ${updatedCount} records.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error during maintenance:', err.message);
        process.exit(1);
    }
};

fixContractorRatings();

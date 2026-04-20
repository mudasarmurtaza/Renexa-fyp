const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Contractor = require('../models/Contractor');
const Proposal = require('../models/Proposal');
require('dotenv').config();

async function findTestAccount() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/userInfo";
  await mongoose.connect(uri);
  
  const customers = await Customer.find().limit(5);
  console.log("CUSTOMERS:");
  customers.forEach(c => console.log(`${c.email} | ${c.password}`));

  const contractors = await Contractor.find().limit(5);
  console.log("\nCONTRACTORS:");
  contractors.forEach(c => console.log(`${c.email} | ${c.password}`));

  // Also check for accepted proposals to verify fix
  const acceptedProposals = await Proposal.find({ status: 'accepted' }).populate('customer').populate('contractor');
  console.log("\nACCEPTED PROPOSALS:");
  acceptedProposals.forEach(p => {
    console.log(`PropID: ${p._id} | Customer: ${p.customer?.email} | Contractor: ${p.contractor?.email}`);
  });

  process.exit();
}

findTestAccount();

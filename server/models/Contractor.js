const mongoose = require("mongoose"); 
const ContractorSchema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  phone: { type: String, required: true, unique: true },
  cnicNumber: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true }, 
   address: { type: String }, 
   city: { type: String, required: true },
   password: { type: String, required: true }, 
   gender: { type: String, enum: ["Male", "Female", "Other"], required: true }, 
   profilePic: { type: String }, 
   verificationImage: { type: String }, // ✅ New field for contractor verification image
   cnicFront: { type: String }, // ✅ CNIC front image
   cnicBack: { type: String }, // ✅ CNIC back image
   role: { type: String, default: "contractor" },  
   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, 
   resetOTP: { type: String },
   resetOTPExpires: { type: Date },

   
   // New certification and verification fields
   certifications: [{
     name: { type: String, required: true },
     issuingAuthority: { type: String, required: true },
     issueDate: { type: Date, required: true },
     expiryDate: { type: Date },
     certificateImage: { type: String, required: true },
     verified: { type: Boolean, default: false }
   }],
   
   // Additional verification documents
   verificationDocuments: [{
     documentType: { type: String, enum: ["license", "insurance", "bond", "other"], required: true },
     documentName: { type: String, required: true },
     documentImage: { type: String, required: true },
     verified: { type: Boolean, default: false },
     uploadedAt: { type: Date, default: Date.now }
   }],
   
   // Professional information
   experience: { type: String },
   specialties: [{ type: String }],
   rating: { type: Number, default: 0, min: 0, max: 5 },
   totalProjects: { type: Number, default: 0 },

   // Customer reviews
   reviews: [{
     customer:   { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
     customerName: { type: String },
     proposal:   { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
     rating:     { type: Number, required: true, min: 1, max: 5 },
     review:     { type: String, default: "" },
     createdAt:  { type: Date, default: Date.now }
   }],
   
   createdAt: { type: Date, default: Date.now }, }); 
   
   const Contractor = mongoose.model("Contractor", ContractorSchema);
   
   module.exports = Contractor;
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    sr: { type: String, required: true },
    // Možete dodati i druge jezike ovde
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  }, 
  description:{
    en: { type: String },
    sr: { type: String }, 
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    }
  },
  toObject: {
    virtuals: true
  }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;

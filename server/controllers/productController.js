import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 9, categoryId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter object
    const filter = {};
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: 'Nevalidan ID kategorije' });
      }
      filter.mainCategory = categoryId;
    }

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('mainCategory');

    res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts
    });
  } catch (error) {
    console.error('Greška u getProducts:', error);
    res.status(500).json({ message: 'Greška pri preuzimanju proizvoda' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('mainCategory');
    if (!product) {
      return res.status(404).json({ message: 'Proizvod nije pronađen' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Greška pri preuzimanju proizvoda' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    const populatedProduct = await Product.findById(newProduct._id).populate('mainCategory');
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Greška pri kreiranju proizvoda:', error);
    res.status(500).json({ message: 'Greška pri kreiranju proizvoda', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
   
    // Izbacujemo _id iz body-ja ako postoji da ne bi došlo do greške pri ažuriranju
    const { _id, ...updateData } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('mainCategory');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Proizvod nije pronađen' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Greška pri ažuriranju proizvoda:', error);
    res.status(500).json({ message: 'Greška pri ažuriranju proizvoda', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Proizvod je obrisan' });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri brisanju proizvoda' });
  }
};

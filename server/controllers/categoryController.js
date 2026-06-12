import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({parent: null});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Greška pri preuzimanju kategorija' });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const categories = await Category.find({parent: req.params.parentId}); //parentId
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Greška pri preuzimanju kategorija' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Greška pri kreiranju kategorije' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Kategorija nije pronađena' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Greška pri ažuriranju kategorije' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Kategorija je obrisana' });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri brisanju kategorije' });
  }
};

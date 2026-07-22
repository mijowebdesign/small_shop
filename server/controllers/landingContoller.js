
import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * @typedef {object} ProductProjection
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {number} price
 * @property {string} image
 * @property {string} mainCategory
 */

/**
 * @typedef {object} LandingDataResponse
 * @property {ProductProjection[]} vegetables
 * @property {ProductProjection[]} fruits
 * @property {ProductProjection[]} milk
 */

/**
 * Dohvata podatke za landing stranicu, uključujući proizvode iz ključnih kategorija.
 * Koristi jedan aggregation pipeline sa $facet za efikasnost.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const CATEGORY_SLUGS = ['vegetables', 'fruits', 'milk'];
const LIMIT = 5;

export const getLandingData = async (req, res) => {
  try {
    // 1. Dohvati _id i name za tražene kategorije po slug-u
    const categories = await Category.find(
      { slug: { $in: CATEGORY_SLUGS } },
      { slug: 1, name: 1 }
    ).lean();

    if (categories.length === 0) {
      return res.status(200).json({ success: true, data: {} });
    }

    // 2. Mapa: slug -> { _id, name }
    const categoryBySlug = Object.fromEntries(
      categories.map((c) => [c.slug, { _id: c._id, name: c.name }])
    );

    // 3. Facet pipeline po kategoriji, koristi resolved ObjectId
    const buildFacetPipeline = (categoryId) => [
      { $match: { mainCategory: categoryId } },
      { $sort: { createdAt: -1 } },
      { $limit: LIMIT },
      { $project: { title: 1, price: 1, imageUrl: 1, mainCategory: 1 } }
    ];

    const facetStage = Object.fromEntries(
      CATEGORY_SLUGS
        .filter((slug) => categoryBySlug[slug])
        .map((slug) => [slug, buildFacetPipeline(categoryBySlug[slug]._id)])
    );

    const [productsByCategory] = await Product.aggregate([{ $facet: facetStage }]);

    // 4. Sastavi finalni response: { vegetables: { name: {...}, data: [...] }, ... }
    const data = Object.fromEntries(
      CATEGORY_SLUGS
        .filter((slug) => categoryBySlug[slug])
        .map((slug) => [
          slug,
          {
            name: categoryBySlug[slug].name,
            data: productsByCategory[slug] || []
          }
        ])
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('Greška u getLandingData:', error);
    res.status(500).json({ success: false, message: 'Greška pri preuzimanju podataka za landing stranicu' });
  }
};
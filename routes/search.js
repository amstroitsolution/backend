const express = require('express');
const router = express.Router();
const WomenProduct = require('../models/WomenProduct');
const KidsProduct = require('../models/KidsProduct');

// Search endpoint
router.get('/', async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ results: [], message: 'Search query too short' });
    }

    const limitNum = parseInt(limit);
    const searchTerms = q.split(/\s+/).filter(word => word.length > 0);
    const searchRegexes = searchTerms.map(term => new RegExp(term, 'i'));

    // Base query logic for each product type
    const buildQuery = (extraConditions = []) => ({
      isActive: true,
      $and: [
        ...extraConditions,
        ...searchRegexes.map(regex => ({
          $or: [
            { title: regex },
            { description: regex },
            { category: regex },
            { material: regex }
          ]
        }))
      ]
    });

    let results = [];

    // Search in Women Products
    if (!category || category === 'women') {
      const womenProducts = await WomenProduct.find(buildQuery())
        .select('title description category categorySlug images price')
        .limit(limitNum)
        .lean();

      results = results.concat(
        womenProducts.map(product => ({
          ...product,
          type: 'women',
          productId: product._id
        }))
      );
    }

    // Search in Kids Products
    if (!category || category === 'kids') {
      const kidsQuery = buildQuery();
      // Add kids-specific fields to the $or within each $and block
      kidsQuery.$and = kidsQuery.$and.map(condition => {
        if (condition.$or) {
          condition.$or.push({ gender: condition.$or[0].title }); // Reuse regex
          condition.$or.push({ tags: condition.$or[0].title });
        }
        return condition;
      });

      const kidsProducts = await KidsProduct.find(kidsQuery)
        .select('title description category categorySlug gender images price')
        .limit(limitNum)
        .lean();

      results = results.concat(
        kidsProducts.map(product => ({
          ...product,
          type: 'kids',
          productId: product._id
        }))
      );
    }

    // Sort by relevance (title matches first)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const query = q.toLowerCase();

      if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
      if (!aTitle.startsWith(query) && bTitle.startsWith(query)) return 1;
      if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
      if (!aTitle.includes(query) && bTitle.includes(query)) return 1;
      return 0;
    });

    res.json({
      results: results.slice(0, limitNum),
      total: results.length,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

module.exports = router;

const Expert = require('../models/Expert');

// @desc    Get all experts
// @route   GET /api/experts
// @access  Public
const getExperts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const search = req.query.search || '';
    const category = req.query.category || '';

    // Build query
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const startIndex = (page - 1) * limit;
    const total = await Expert.countDocuments(query);

    const experts = await Expert.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: experts.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: experts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expert
// @route   GET /api/experts/:id
// @access  Public
const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      res.status(404);
      throw new Error('Expert not found');
    }

    res.status(200).json({
      success: true,
      data: expert
    });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      error.message = 'Expert not found';
    }
    next(error);
  }
};

module.exports = {
  getExperts,
  getExpertById
};

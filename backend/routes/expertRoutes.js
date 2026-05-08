const express = require('express');
const { getExperts, getExpertById } = require('../controllers/expertController');

const router = express.Router();

router.route('/')
  .get(getExperts);

router.route('/:id')
  .get(getExpertById);

module.exports = router;

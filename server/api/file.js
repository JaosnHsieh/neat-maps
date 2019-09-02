const express = require('express');
const router = express.Router();

// TODO
router.get('/', async (req, res, next) => {
  try {
    return res.json([{}]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    return res.json([{}]);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    return res.json([{}]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

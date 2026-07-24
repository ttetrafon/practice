const express = require('express');
const router = express.Router();

const basic = require('./controllers/BasicController.js');

router.get('/', basic.index);
router.get('/credits', basic.credits);

module.exports = router;

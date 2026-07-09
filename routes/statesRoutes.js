const express = require('express');
const router = express.Router();
const controller = require('../controllers/statesController');

router.get('/', controller.list);
router.get('/latest', controller.latest);
router.get('/stats/miles', controller.milesStats);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.remove);

module.exports = router;
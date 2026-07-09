const express = require('express');
const router = express.Router();
const controller = require('../controllers/infosController');

router.get('/', controller.list);
router.get('/withUser', controller.listWithUser);
router.get('/:car_id', controller.detail);
router.post('/', controller.create);
router.put('/:car_id', controller.update);
router.delete('/:car_id', controller.remove);

module.exports = router;
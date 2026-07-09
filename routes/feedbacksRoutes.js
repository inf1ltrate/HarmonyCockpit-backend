const express = require('express');
const router = express.Router();
const controller = require('../controllers/feedbacksController');

router.get('/', controller.list);
router.get('/:idea_id', controller.getById);
router.post('/', controller.create);
router.put('/:idea_id', controller.update);
router.delete('/:idea_id', controller.remove);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.post('/login', controller.login);
router.get('/:user_id', controller.detail);
router.put('/:user_id', controller.update);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { validateGetUsers, validateMakeAdmin } = require('../validators/user.validator');
const { validate } = require('../middlewares/validate.middleware');

router.get('/', authMiddleware, adminMiddleware, validateGetUsers, validate, userController.getAllUsers);
router.post('/:id/make-admin', authMiddleware, adminMiddleware, validateMakeAdmin, validate, userController.makeAdmin);

module.exports = router;
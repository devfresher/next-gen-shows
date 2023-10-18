import { Router } from 'express';

import ValidationMiddleware from '../../middleware/validate';
import AuthMiddleware from '../../middleware/auth';
import CategoryValidator from './category.validate';
import CategoryController from './category.controller';

const router = Router();

router.post(
	'/',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateRequest(CategoryValidator.newCategory),
	CategoryController.create
);

router.put(
	'/:categoryId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('categoryId'),
	ValidationMiddleware.validateRequest(CategoryValidator.updateCategory),
	CategoryController.updateCategory
);

router.delete(
	'/:categoryId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('categoryId'),
	CategoryController.deleteCategory
);

router.get('/', AuthMiddleware.authenticateAdmin, CategoryController.getAll);
router.get('/:categoryId', CategoryController.get);

export default router;

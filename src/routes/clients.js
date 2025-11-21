import { Router } from 'express';
import * as ctrl from '../controllers/clientsController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(ctrl.list));
router.get('/json', asyncHandler(ctrl.clientsJSON));
router.get('/new', asyncHandler(ctrl.newForm));
router.get('/:id/edit', asyncHandler(ctrl.editForm));
router.post('/', asyncHandler(ctrl.create));
router.delete('/:id', asyncHandler(ctrl.remove));
router.put('/:id', asyncHandler(ctrl.update));


export default router;

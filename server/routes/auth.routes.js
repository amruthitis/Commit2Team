import express from 'express';
import { check } from 'express-validator';
import { register } from '../controllers/auth.controller.js';

const router = express.Router();

// Registration route
router.post(
  '/register',
  [
    check('name', 'Name is required').not().empty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  register
);

export default router;
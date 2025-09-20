import express from 'express';
import { check } from 'express-validator';
import { 
  updatePortfolio, 
  getUsersForMainPage, 
  getUserByEmail,
  getFilteredUsers
} from '../controllers/portfolio.controller.js';

const router = express.Router();

// Update user portfolio
router.post(
  '/update-portfolio',
  [
    check('email', 'Email is required').isEmail(),
    check('portfolioData.year', 'Year is required').notEmpty(),
    check('portfolioData.college', 'College is required').notEmpty(),
    check('portfolioData.gender', 'Gender is required').notEmpty(),
    check('portfolioData.skillCategory', 'Skill category is required').notEmpty()
  ],
  updatePortfolio
);

// Get all users for main page
router.get('/users', getUsersForMainPage);

// Get filtered users for main page
router.get('/users/filter', getFilteredUsers);

// Get user by email
router.get('/user/:email', getUserByEmail);

export default router;

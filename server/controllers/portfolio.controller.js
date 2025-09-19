import User from '../models/user.model.js';

// Update user portfolio
export const updatePortfolio = async (req, res) => {
  try {
    const { email, portfolioData } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update portfolio data
    user.portfolio = {
      ...user.portfolio,
      ...portfolioData,
      isPortfolioComplete: true
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        portfolio: user.portfolio
      }
    });

  } catch (error) {
    console.error('Portfolio update error:', error);
    res.status(500).json({
      success: false,
      message: 'Portfolio update failed',
      error: error.message
    });
  }
};

// Get all users with complete portfolios for main page
export const getUsersForMainPage = async (req, res) => {
  try {
    const users = await User.find({ 
      'portfolio.isPortfolioComplete': true 
    })
    .select('name email portfolio createdAt')
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(20); // Limit to 20 most recent users

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      year: user.portfolio.year,
      college: user.portfolio.college,
      gender: user.portfolio.gender,
      skillCategory: user.portfolio.skillCategory,
      profilePic: user.portfolio.profilePic,
      createdAt: user.createdAt
    }));

    res.status(200).json({
      success: true,
      users: transformedUsers,
      count: transformedUsers.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email })
      .select('name email portfolio createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        portfolio: user.portfolio,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Get filtered users for main page
export const getFilteredUsers = async (req, res) => {
  try {
    const { skillCategory, gender, year, college } = req.query;

    // Build filter object
    const filter = { 'portfolio.isPortfolioComplete': true };

    if (skillCategory && skillCategory !== 'all') {
      filter['portfolio.skillCategory'] = skillCategory;
    }

    if (gender && gender !== 'all') {
      filter['portfolio.gender'] = gender;
    }

    if (year && year !== 'all') {
      filter['portfolio.year'] = { $regex: year, $options: 'i' };
    }

    if (college && college !== 'all') {
      filter['portfolio.college'] = { $regex: college, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('name email portfolio createdAt')
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Increase limit for filtered results

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      year: user.portfolio.year,
      college: user.portfolio.college,
      gender: user.portfolio.gender,
      skillCategory: user.portfolio.skillCategory,
      profilePic: user.portfolio.profilePic,
      createdAt: user.createdAt
    }));

    res.status(200).json({
      success: true,
      users: transformedUsers,
      count: transformedUsers.length,
      filters: { skillCategory, gender, year, college }
    });

  } catch (error) {
    console.error('Error fetching filtered users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered users',
      error: error.message
    });
  }
};

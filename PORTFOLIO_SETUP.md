# Portfolio & User Management Setup - Commit2Team

This document provides instructions for setting up the complete user registration and portfolio management system.

## Overview

The system now includes:
- ✅ User registration with MongoDB storage
- ✅ Portfolio upload and management
- ✅ Dynamic user display on main page
- ✅ File upload support (PDF resumes, profile pictures)
- ✅ Real-time user data fetching

## Prerequisites

1. **MongoDB**: Ensure MongoDB is running locally or use MongoDB Atlas
2. **Node.js**: Ensure Node.js is installed
3. **All dependencies**: Run `npm install` in the server directory

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the `server` directory with:

```env
MONGO_URI=mongodb://localhost:27017/commit2team
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start the Server

```bash
npm run dev
```

## User Flow

### 1. Registration Process

1. **Signup Page** (`signup.html`):
   - User enters name, email, password
   - Data is stored in MongoDB
   - User is redirected to portfolio page

2. **Portfolio Page** (`portfolio.html`):
   - User fills in academic and skill information
   - Uploads profile picture and resume PDF
   - Data is stored in MongoDB
   - User is redirected to main page

3. **Main Page** (`main.html`):
   - Displays all users with complete portfolios
   - Shows dynamic user cards with real data
   - Falls back to default cards if no users found

## API Endpoints

### Portfolio Management
- `POST /api/portfolio/register` - Register new user
- `POST /api/portfolio/update-portfolio` - Update user portfolio
- `GET /api/portfolio/users` - Get all users for main page
- `GET /api/portfolio/user/:email` - Get specific user

### Payment Integration
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify-payment` - Verify payment
- `GET /api/payment/payment/:payment_id` - Get payment details

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  portfolio: {
    year: String,
    college: String,
    skillCategory: String (enum),
    skillRating: Number (1-10),
    profilePic: String (base64),
    resumeFile: String (base64),
    isPortfolioComplete: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Features Implemented

### Backend Features
- ✅ User registration with password hashing
- ✅ Portfolio data storage and validation
- ✅ File upload handling (base64 encoding)
- ✅ Dynamic user fetching for main page
- ✅ Error handling and validation
- ✅ CORS configuration

### Frontend Features
- ✅ Seamless signup to portfolio flow
- ✅ File upload with validation
- ✅ Dynamic user card generation
- ✅ Real-time data loading
- ✅ Loading states and user feedback
- ✅ Error handling and fallbacks

### User Experience
- ✅ Pre-filled forms using localStorage
- ✅ Professional loading indicators
- ✅ Clear success/error messages
- ✅ Responsive design
- ✅ Consistent styling

## File Upload Handling

### Supported Formats
- **Resume**: PDF files only
- **Profile Picture**: JPG, PNG, GIF (optional)

### Storage Method
- Files are converted to base64 and stored in MongoDB
- Maximum file size: 10MB (configurable in server.js)

## Dynamic User Display

### Main Page Features
- **Real-time Loading**: Fetches users from database on page load
- **Dynamic Cards**: Generates user cards based on actual data
- **Fallback System**: Shows default cards if no users or API error
- **Skill Mapping**: Automatically maps skill categories to relevant tags
- **Avatar Generation**: Creates initials-based avatars

### User Card Information
- Name and skill category
- College/university
- Relevant skill tags based on category
- Professional styling matching the theme

## Testing the System

### 1. Test Registration Flow
1. Go to `signup.html`
2. Fill in registration form
3. Verify user is created in MongoDB
4. Check redirect to portfolio page

### 2. Test Portfolio Upload
1. Fill in portfolio form
2. Upload resume PDF and profile picture
3. Verify data is stored in MongoDB
4. Check redirect to main page

### 3. Test Main Page Display
1. Visit `main.html`
2. Verify user cards are loaded dynamically
3. Check that new users appear on the page
4. Test fallback to default cards

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **File Upload Issues**:
   - Check file size limits
   - Verify file format validation
   - Check browser console for errors

3. **API Connection Errors**:
   - Ensure server is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

4. **User Not Appearing**:
   - Check if portfolio is marked as complete
   - Verify user data in MongoDB
   - Check API response in browser network tab

### Debug Mode

Enable debug logging by adding console.log statements in:
- `portfolio.controller.js` for backend debugging
- `main.js` for frontend debugging

## Production Considerations

1. **File Storage**: Consider using cloud storage (AWS S3, Cloudinary) instead of base64
2. **Image Optimization**: Implement image compression for profile pictures
3. **Security**: Add rate limiting and input sanitization
4. **Performance**: Implement pagination for large user lists
5. **Monitoring**: Add logging and error tracking

## Security Notes

1. **Password Hashing**: Passwords are hashed using bcryptjs
2. **Input Validation**: Server-side validation using express-validator
3. **File Validation**: File type and size validation
4. **CORS**: Configured for frontend-backend communication

## Support

For issues related to:
- **MongoDB**: Check MongoDB documentation and connection status
- **File Uploads**: Verify file size limits and format validation
- **API Integration**: Check network requests in browser developer tools
- **User Flow**: Verify localStorage usage and form validation

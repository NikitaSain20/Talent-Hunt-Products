# Deployment Guide

## Environment Variables

### Frontend (.env.local for development, .env.production for production)

```
VITE_VITE_API_URL=http://localhost:8000
```

For production, update this to your backend URL:

```
VITE_VITE_API_URL=https://your-backend-domain.com
```

### Backend (.env)

```
MONGODB_URL=your_mongodb_connection_string
PORT=8000
```

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Production Build

### Frontend

1. Update `.env.production` with your production API URL
2. Run build:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your hosting (Vercel, Netlify, etc.)

### Backend

1. Ensure MongoDB is set up
2. Set environment variables in your hosting platform
3. Deploy backend to your server (AWS, Heroku, etc.)

## Database Setup

Before deploying, create an admin user in MongoDB:

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@gmail.com",
  password: "bcrypt_hashed_password",
  role: "admin",
});
```

**Note**: Admin login uses hardcoded credentials (admin@gmail.com / admin123) for quick access without database lookup.

## API Endpoints

All frontend API calls use the `VITE_VITE_API_URL` environment variable. Update this single variable to switch between different backend URLs.

### Key Routes

- `/auth/login` - User and Admin login
- `/auth/signup` - User registration
- `/products` - Get all products
- `/products/add` - Add new product (admin)
- `/order/place` - Place order
- `/order/admin/all` - Get all orders (admin)
- `/order/:userId` - Get user orders

## Admin Credentials

- Email: `admin@gmail.com`
- Password: `admin123`

(Configured in backend `userController.js`)

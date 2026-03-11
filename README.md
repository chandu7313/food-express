# Food Express - MERN Food Delivery App

A production-ready full-stack Food Delivery Application built with MongoDB, Express, React, and Node.js.

## 🚀 Features
- **Admin Panel**: Manage restaurants, foods, and orders.
- **User App**: Browse menus, manage cart, and place orders.
- **JWT Auth**: Role-based access control.
- **Cloudinary**: Professional image hosting.
- **Tailwind CSS**: Premium, responsive design.

## 🛠️ Setup Instructions

### 1. Backend Setup
1. Navigate to `backend` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file (see `.env.example`).
4. Start the server: `npm start` or `npm dev`.

### 2. Frontend Setup
1. Navigate to `frontend` folder.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## 🔑 Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## 🧪 Testing Steps
1. **Register User**: Go to `/register`.
2. **Login Admin**: Go to `/admin/login`.
3. **Admin Actions**: 
   - Add a Restaurant.
   - Add Food Items to that restaurant.
4. **User Actions**:
   - Browse Home.
   - View Menu.
   - Add items to Cart.
   - Proceed to Checkout.
   - Place Order.
   - View Order History.
5. **Order Tracking**: Admin updates status in `/admin/orders`, User sees update in `/orders`.

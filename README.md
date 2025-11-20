# 🗑️ WasteMap - Smart Waste Management System

A full-stack web application for efficient waste collection and management, connecting users with waste collectors through an intelligent platform.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📊 Project Resources

- **📽️ [Project Pitch Deck](https://www.canva.com/design/DAG5KA4xPjs/MYtu6v147h_w4bcb1h2YQg/edit?utm_content=DAG5KA4xPjs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)** - View the complete project presentation
- **💻 [GitHub Repository](https://github.com/Princessglory/WastemMap-Final-Project-)** - Source code and documentation

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👤 For Users
- **Request Waste Pickup**: Schedule waste collection with detailed information (waste type, quantity, location)
- **Track Pickups**: Real-time status tracking of pickup requests (pending, assigned, in-progress, completed)
- **Pickup History**: View complete history with search and filter capabilities
- **Rate Service**: Provide ratings and feedback for completed pickups
- **Dashboard**: Overview of active and past pickup requests

### 🚛 For Collectors
- **View Available Pickups**: Browse all pending waste collection requests
- **Assign to Self**: Claim pickup requests for collection
- **Update Status**: Track pickup progress through workflow stages
- **Performance Metrics**: View personal statistics and completed pickups
- **Assigned Tasks**: Manage currently assigned collection tasks

### 👨‍💼 For Admins
- **User Management**: View, manage, and modify user roles
- **System Overview**: Real-time statistics on pickups and system usage
- **Pickup Monitoring**: Monitor all pickups across the platform
- **Collector Performance**: Track collector efficiency and completion rates
- **Role Assignment**: Promote users to collectors or admins

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router DOM 6.8.0** - Client-side routing
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 7.0.0** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken 9.0.0)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Axios Interceptors** - Automatic token injection

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │Collector │  │  Admin   │  │  Auth    │   │
│  │Dashboard │  │Dashboard │  │Dashboard │  │ Context  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                     ↓ Axios (HTTP/HTTPS)                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Server (Express.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes & Middleware                  │  │
│  │  /api/auth  │  /api/pickups  │  /api/admin          │  │
│  └──────────────────────────────────────────────────────┘  │
│                     ↓ Mongoose ODM                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas Database                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Users   │  │ Pickups  │  │  Logs    │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/wastemap.git
cd WasteMap
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` file in the `server` directory:
```env
PORT=5001
MONGODB_URI=mongodb+srv://wastemap_user:wastemap@cluster0.ytvm3wu.mongodb.net/wastemap
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

5. **Create admin user**
```bash
cd server
node createAdmin.js
```

Default admin credentials:
- **Email**: admin@wastemap.com
- **Password**: admin123

6. **Start the development servers**

In one terminal (backend):
```bash
cd server
npm run dev
```

In another terminal (frontend):
```bash
cd client
npm start
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📁 Project Structure

```
WasteMap/
├── client/                      # Frontend React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/             # React Context providers
│   │   │   └── AuthContext.js   # Authentication & API client
│   │   ├── pages/               # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── RequestPickup.js
│   │   │   ├── PickupHistory.js
│   │   │   ├── CollectorDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js               # Main app component
│   │   └── index.js             # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                      # Backend Node.js/Express application
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema & model
│   │   └── Pickup.js            # Pickup schema & model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── pickups.js           # Pickup CRUD operations
│   │   ├── users.js             # User management
│   │   └── admin.js             # Admin-only routes
│   ├── createAdmin.js           # Admin user creation script
│   ├── index.js                 # Server entry point
│   ├── package.json
│   └── .env                     # Environment variables (not in repo)
│
└── README.md                    # This file
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Nairobi",
    "state": "Nairobi",
    "zipCode": "00100"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Pickup Endpoints

#### Create Pickup Request
```http
POST /api/pickups
Authorization: Bearer <token>
Content-Type: application/json

{
  "wasteType": "plastic",
  "quantity": "2 bags",
  "scheduledDate": "2025-11-20T10:00:00Z",
  "address": {
    "street": "123 Main St",
    "city": "Nairobi",
    "state": "Nairobi",
    "zipCode": "00100"
  },
  "description": "Two large bags of plastic waste"
}
```

#### Get User's Pickups
```http
GET /api/pickups/my-pickups
Authorization: Bearer <token>
```

#### Get All Pickups (Collectors/Admins)
```http
GET /api/pickups?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Assign Pickup to Collector
```http
PATCH /api/pickups/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "collectorId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

#### Update Pickup Status
```http
PATCH /api/pickups/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "actualDuration": 45
}
```

#### Rate Pickup
```http
PATCH /api/pickups/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 5,
  "comment": "Excellent service!"
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /api/admin/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "collector"
}
```

#### Get System Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

## 👥 User Roles

### 1. User (Default)
- Create pickup requests
- View own pickup history
- Rate completed pickups
- Track pickup status

### 2. Collector
- All user permissions
- View all available pickups
- Assign pickups to self
- Update pickup status (assigned → in-progress → completed)
- View assigned pickups

### 3. Admin
- All collector permissions
- View all users
- Modify user roles
- View system-wide statistics
- Monitor all pickups
- Access admin dashboard

## 🔐 Environment Variables

### Server (.env)
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wastemap

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

### Client (Optional)
```env
REACT_APP_API_URL=http://localhost:5001
```

## 📊 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: String (enum: ['user', 'collector', 'admin'], default: 'user'),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Pickup Schema
```javascript
{
  user: ObjectId (ref: 'User', required),
  wasteType: String (enum: ['plastic', 'paper', 'glass', 'metal', 'organic', 'electronic', 'other'], required),
  quantity: String (required),
  scheduledDate: Date (required),
  status: String (enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], default: 'pending'),
  assignedCollector: ObjectId (ref: 'User'),
  address: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  description: String,
  completedDate: Date,
  actualDuration: Number,
  rating: {
    score: Number (1-5),
    comment: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Screenshots

### User Dashboard
View active pickup requests and create new ones.
![User Dashboard](./client/src/screenshots/User%20dashboard.png)

### Collector Dashboard
Browse available pickups and manage assigned tasks.
![Collector Dashboard](./client/src/screenshots/collector%20dashboard.png)

### Main Page
System overview with user management and statistics.
![Main Page](./client/src/screenshots/main%20page.png)

### Pickup History
Comprehensive history with search, filter, and rating features.
![Pickup History](./client/src/screenshots/History%20dashboard.png)

### Request Dashboard
![Request Dashboard](./client/src/screenshots/Request%20dashboard.png)

## 🔄 Workflow

### User Pickup Request Flow
```
1. User creates pickup request (status: pending)
                    ↓
2. Collector sees request and assigns to self (status: assigned)
                    ↓
3. Collector starts collection (status: in-progress)
                    ↓
4. Collector completes pickup (status: completed)
                    ↓
5. User rates the service (rating added)
```

### Authentication Flow
```
1. User registers/logs in
                    ↓
2. Server generates JWT token
                    ↓
3. Token stored in localStorage
                    ↓
4. Axios interceptor adds token to all requests
                    ↓
5. Server validates token on protected routes
```

## 🧪 Testing

### Test Admin Login
```
Email: admin@wastemap.com
Password: admin123
```

### Test User Registration
Create a new user account and test the full workflow from pickup creation to rating.

## 🚧 Future Enhancements

- [ ] Google Maps integration for location selection
- [ ] Real-time notifications using Socket.io
- [ ] Payment gateway integration
- [ ] Mobile application (React Native)
- [ ] Advanced analytics and reporting
- [ ] Email notifications for status updates
- [ ] Multi-language support
- [ ] Export pickup history to PDF
- [ ] Collector route optimization
- [ ] Waste recycling tips and education section

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Okogun Princess Glory**

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Tailwind CSS for the styling framework
- React community for excellent documentation
- All contributors who helped improve this project

---

**Made with ♻️ for a cleaner environment**

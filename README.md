# Password-Manager
This App is a secure, user-friendly password manager designed to simplify your digital life. Store, organize, and access all your passwords in one encrypted vault — fast, reliable, and always in your control.

A full-stack password management application built with Node.js, Express, MongoDB, and React.

## Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Credential Management**: Store, edit, delete, and organize your passwords
- **Master Password Protection**: View passwords only after master password verification
- **User Registration**: Secure account creation with security questions
- **Responsive Web Interface**: Modern React frontend with Vite.js

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **TypeScript** - Type safety

### Frontend
- **React** - UI library
- **Vite.js** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TypeScript** - Type safety

## Project Structure

Password Manager/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── db.ts # MongoDB connection
│ │ ├── middleware/
│ │ │ └── auth.ts # JWT authentication middleware
│ │ ├── models/
│ │ │ ├── User.ts # User model
│ │ │ └── Credential.ts # Credential model
│ │ ├── routes/
│ │ │ ├── auth.ts # Authentication routes
│ │ │ └── credentials.ts # Credential management routes
│ │ ├── utils/
│ │ │ └── crypto.ts # Encryption utilities
│ │ └── app.ts # Express app setup
│ ├── package.json
│ └── .env # Environment variables
└── frontend/
├── src/
│ ├── auth/
│ │ └── AuthContext.tsx # Authentication context
│ ├── pages/
│ │ ├── Login.tsx # Login page
│ │ ├── Register.tsx # Registration page
│ │ └── Dashboard.tsx # Main dashboard
│ └── App.tsx # Main app component
├── package.json
└── vite.config.ts # Vite configuration


## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the backend directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-master` - Master password verification

### Credentials
- `GET /api/credentials` - Get all credentials
- `POST /api/credentials` - Create new credential
- `PUT /api/credentials/:id` - Update credential
- `DELETE /api/credentials/:id` - Delete credential

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Master Password Verification**: Additional security layer for viewing passwords
- **Environment Variables**: Sensitive data stored in environment variables
- **Input Validation**: Server-side validation for all inputs

## Usage

1. **Register**: Create a new account with username, password, and security questions
2. **Login**: Access your password vault
3. **Add Credentials**: Store account information including passwords
4. **View Passwords**: Click "View" button and enter master password to reveal passwords
5. **Manage**: Edit or delete credentials as needed

## Environment Variables

### Backend (.env)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



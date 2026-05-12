# SkillBridgeAI

A comprehensive AI-powered interview preparation platform that analyzes resumes, generates personalized interview questions, and provides tailored preparation roadmaps.

## Overview

SkillBridgeAI is a full-stack application that helps job seekers prepare for technical and behavioral interviews by leveraging AI to analyze their resume against job descriptions and generate customized preparation materials.

## Architecture

The application follows a client-server architecture with separate frontend and backend components:

- **Backend**: Node.js/Express REST API with MongoDB database
- **Frontend**: React SPA with modern hooks and context patterns
- **AI Integration**: Groq SDK for interview report generation
- **PDF Processing**: Puppeteer for resume generation and PDF parsing

## Features

### Core Functionality
- **Resume Analysis**: Upload and parse PDF resumes
- **Job Matching**: Calculate compatibility scores between resume and job descriptions
- **Interview Question Generation**: AI-generated technical and behavioral questions with sample answers
- **Skill Gap Analysis**: Identify areas for improvement with severity levels
- **Preparation Roadmap**: 5-day structured learning plan
- **Resume Enhancement**: Generate optimized ATS-friendly resumes

### Authentication & Security
- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Token blacklisting for secure logout
- Protected routes and middleware validation

## Project Structure

```
SkillBridgeAI/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Authentication & file handling
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # AI integration & business logic
│   │   └── utils/          # Environment configuration
│   └── server.js           # Application entry point
└── frontend/
    └── src/
        ├── features/       # Feature-based organization
        │   ├── auth/       # Authentication components
        │   └── interview/  # Interview-related components
        └── styles/         # SCSS stylesheets
```

## Technology Stack

### Backend Dependencies
- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **Groq SDK**: AI model integration
- **Puppeteer**: PDF generation
- **Multer**: File upload handling
- **JWT**: Authentication tokens
- **Zod**: Schema validation

### Frontend Dependencies
- **React**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Sass**: CSS preprocessing
- **Vite**: Build tool and development server

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Groq API key

### Backend Setup
```bash
cd Backend
npm install
```

Create `.env` file with required environment variables:
```
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Development

### Start Backend Server
```bash
cd Backend
npm run dev
```
Server runs on default port with nodemon for auto-restart.

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173` with Vite hot reload.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Interview Management
- `POST /api/interview/generate` - Generate interview report
- `GET /api/interview/:interviewId` - Get specific interview report
- `GET /api/interview/all` - Get all user interview reports
- `GET /api/interview/:interviewId/resume` - Generate optimized resume PDF

## Key Components

### AI Service
Handles integration with Groq AI models for:
- Interview question generation with structured JSON responses
- Resume optimization and HTML generation
- PDF creation using Puppeteer

### Authentication Flow
- JWT token-based authentication
- Refresh token mechanism
- Secure password hashing
- Token blacklisting for logout

### File Processing
- PDF resume parsing and text extraction
- Multipart form data handling
- File validation and security checks

## Security Considerations

The application implements several security measures:
- Input validation using Zod schemas
- JWT token expiration and refresh
- Password hashing with salt rounds
- CORS configuration for cross-origin requests
- File upload restrictions and validation

## Contributing

1. Follow the existing code structure and patterns
2. Ensure proper error handling and validation
3. Update documentation for new features
4. Test both frontend and backend components

## License

ISC License - See package.json for details.
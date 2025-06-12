# Freelancer Invoicing System

A comprehensive invoicing system for freelancers to manage clients, projects, invoices, and payments.

## Features

- Client Management (CRUD operations)
- Project Management
- Invoice Generation and Management
- Payment Tracking
- PDF Invoice Export
- Currency Conversion
- Email Reminders
- RESTful API Architecture

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer (for email notifications)
- PDFKit (for PDF generation)

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- Axios
- React Router
- Chart.js (for analytics)

## Project Structure

```
freelance-invoicing-system/
├── backend/           # Node.js/Express backend
├── frontend/         # React.js frontend
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Start the development server: `npm start`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Documentation

The API documentation will be available at `/api-docs` when running the backend server.

## License

MIT 
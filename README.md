<<<<<<< HEAD
# Freelance Invoicing System

A modern, full-featured invoicing system built with Next.js, React, and MongoDB. Perfect for freelancers who need to create, manage, and track their invoices professionally.

## Features

- 🎨 **Modern UI/UX** - Clean, professional interface built with Tailwind CSS
- 📄 **Invoice Management** - Create, edit, view, and delete invoices
- 👥 **Client Management** - Store and manage client information
- 💰 **Flexible Pricing** - Support for multiple currencies and tax rates
- 📊 **Dashboard Analytics** - Overview of invoice statistics and status
- 🖨️ **Print-Ready** - Professional invoice layouts for printing
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Real-time Updates** - Instant status updates and notifications

## Tech Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **UI Components**: Lucide React Icons
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Styling**: Tailwind CSS
=======
# FreelanceInvoicingSystem

FreelanceInvoicingSystem helps freelancers manage clients, create and track invoices, and streamline their workflow. The project is designed for scalability, security, and ease of use.

---

## Features
- Create, view, and manage invoices
- MongoDB-backed data storage
- RESTful API endpoints (Next.js API routes)
- Responsive React frontend
- Dockerized for easy local development and deployment
- Ready for AWS EC2 deployment

---

## Tech Stack
- **Frontend:** Next.js (React)
- **Backend:** Node.js (Next.js API routes)
- **Database:** MongoDB (via Mongoose ODM)
- **Containerization:** Docker, Docker Compose
- **Cloud:** AWS EC2 (deployment target)

---
>>>>>>> 846bdc829641ee97536bc10e69146d9d1699f1f9

## Getting Started

### Prerequisites
<<<<<<< HEAD

- Node.js 16+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FreelanceInvoicingSystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/freelance-invoicing
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
FreelanceInvoicingSystem/
├── src/
│   ├── lib/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── Invoice.js         # Invoice data model
│   ├── pages/
│   │   ├── api/
│   │   │   ├── invoices.js    # Invoice API endpoints
│   │   │   ├── invoices/[id].js # Individual invoice API
│   │   │   └── clients.js     # Client API endpoints
│   │   ├── invoices/
│   │   │   ├── new.js         # Create new invoice
│   │   │   └── [id].js        # View invoice
│   │   ├── _app.js            # App wrapper with global styles
│   │   └── index.js           # Dashboard
│   └── styles/
│       └── globals.css        # Global styles and Tailwind
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## API Endpoints

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/[id]` - Get specific invoice
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

### Clients
- `GET /api/clients` - Get all clients

## Invoice Features

### Invoice Status
- **Draft** - Invoice is being created/edited
- **Sent** - Invoice has been sent to client
- **Paid** - Payment received
- **Overdue** - Payment is past due date
- **Cancelled** - Invoice cancelled

### Invoice Items
- Description
- Quantity
- Rate per unit
- Automatic total calculation

### Tax & Totals
- Configurable tax rate
- Automatic tax calculation
- Subtotal and total calculations

## Usage

### Creating an Invoice
1. Click "New Invoice" on the dashboard
2. Fill in client information
3. Add your business details
4. Set invoice details (due date, payment terms, currency)
5. Add invoice items with descriptions, quantities, and rates
6. Set tax rate if applicable
7. Add any additional notes
8. Click "Create Invoice"

### Managing Invoices
- **View**: Click "View" to see the full invoice
- **Edit**: Click "Edit" to modify invoice details
- **Status Updates**: Change invoice status from draft → sent → paid
- **Download**: Print or save as PDF using browser print function

## Customization

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Global styles in `src/styles/globals.css`
- Component-specific styles inline

### Adding Features
- **Authentication**: Add user authentication with NextAuth.js
- **Email Integration**: Send invoices via email
- **Payment Processing**: Integrate with Stripe or PayPal
- **Client Portal**: Allow clients to view and pay invoices online
- **Reports**: Add detailed financial reports and analytics

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens (if adding auth) | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## Roadmap

- [ ] User authentication and authorization
- [ ] Email invoice functionality
- [ ] Payment gateway integration
- [ ] Client portal
- [ ] Advanced reporting and analytics
- [ ] Invoice templates
- [ ] Multi-language support
- [ ] Mobile app

---

Built with ❤️ for freelancers everywhere 
=======
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local development)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/FreelanceInvoicingSystem.git
cd FreelanceInvoicingSystem
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/freelance_invoicing
```

### 3. Install Dependencies
```sh
npm install
```

### 4. Run Locally with Docker
```sh
docker-compose up --build
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure
```
FreelanceInvoicingSystem/
├── src/
│   ├── pages/                # Next.js pages (frontend + API routes)
│   │   ├── api/              # API endpoints (Node.js backend)
│   │   └── index.js          # Main landing page
│   ├── components/           # React UI components
│   ├── lib/                  # Utility libraries (e.g., db connection)
│   └── models/               # Mongoose models (MongoDB schemas)
├── Dockerfile
├── docker-compose.yml
├── .env
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

##  Usage
- Access the app at [http://localhost:3000](http://localhost:3000)
- Use the UI to view invoices (add more features as you build!)
- API endpoints are available under `/api/`

>>>>>>> 846bdc829641ee97536bc10e69146d9d1699f1f9

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

## Getting Started

### Prerequisites
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


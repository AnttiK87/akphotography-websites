# 📸 AK Photography Website – Backend

This is the backend of the akphotography-websites project. It's built with Node.js and Express, providing a RESTful API for managing photos, keywords, user accounts, and access control. Backend also serves frontends staticfiles.

## 🔧 Technologies Used

Node.js + Express

Sequelize ORM (MySQL)

JSON Web Tokens (JWT) for authentication

Multer & Sharp for image upload and processing

Nodemailer for sending emails with data from contact form.

Umzug with Sequelize for database migrations

## 🚀 Getting Started

Install dependencies:
npm install

Create a .env file in the root with the following variables:
PORT=your port
DB_NAME=your_db
DB_USER=your_user
DB_PASS=your_pass
SECRET=your_jwt_secret

Run in development mode:
npm run dev

Run in production:
npm start

## 🛠 Available Scripts:

npm run dev Start development server using Nodemon
npm start Start production server
npm run lint Run ESLint on project files
npm run build:ui Build frontend and copy it to backend /dist
npm run build:uiDev Windows version of frontend build & copy
npm run migration:down Roll back last database migration
npm run generate-thumbnails-once Generate image thumbnails once for grating thumbnails of photos thhat are already in /uploads/pictures folder.

## 📁 Project Structure (Backend)

/backend  
│  
├── controllers/ # Route logic  
├── models/ # Sequelize models  
├── utils/ # Middlewares, configurations, etc.  
├── migrations/ # Database migration files  
├── dist/ # Production-ready frontend build after npm run build:ui  
├── app.js # Express routes  
├── index.js # Entry point  
├── eslint.config.mjs # eslint configuration  
├── docker-compose.yml # docker configuration for setting dev db  
└── .env # Environment variables (not committed)  

## 📬 Author

GitHub: AnttiK87

Project: akphotography-websites

Author: Antti Kortelainen

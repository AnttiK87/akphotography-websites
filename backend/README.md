# 📸 AK Photography Website – Backend

This is the backend of the akphotography-websites project. It's built with Node.js and Express, providing a RESTful API for managing photos, keywords, user accounts, and access control. The backend also serves the frontend's static files.

## 🔧 Technologies Used

- Node.js + Express

- Sequelize ORM (MySQL)

- JSON Web Tokens (JWT) for authentication

- Multer & Sharp for image upload and processing

- Nodemailer for sending emails from the contact form

- Umzug with Sequelize for database migrations

- Jest for automated testing

## 🚀 Getting Started

### Install dependencies:

npm install

### Create a .env file in the root with the following variables:

MYSQL_USER=your db-username
MYSQL_ROOT_PASSWORD=your db-root password
MYSQL_PASSWORD=your db-password
MYSQL_DATABASE=your_db
DB_HOST=your host

PORT=your port

SECRET=your_jwt_secret

EMAIL_HOST=your email host
EMAIL_USER=your email username
EMAIL_PASS=your email password

ADMIN_PASSWORD=password for admin user generaten on first launch

### Establish the development database with Docker

docker compose -f docker-compose.yml --env-file .env up -d

### Run in development mode:

npm run dev

### Run in production:

npm run build
npm start

## 🛠 Available Scripts:

| Script                             | Description                                                   |
| ---------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                      | Start development server                                      |
| `npm start`                        | Start production server                                       |
| `npm run lint`                     | Run ESLint on project files                                   |
| `npm run build`                    | Build backend for production                                  |
| `npm run build:beDev`              | Build backend for local development                           |
| `npm run build:uiDev`              | Windows-compatible frontend build & copy to backend           |
| `npm run migration:down`           | Roll back the last database migration                         |
| `npm run generate-thumbnails-once` | Generate thumbnails for images already in `/uploads/pictures` |

## 📁 Project Structure (Backend)

````/backend
│
├── buildBackend/                 # Compiled backend code
│   └── dist/                     # Compiled frontend copied into backend
├── src/
│   ├── controllers/              # Route logic
│   ├── errors/                   # Custom AppError logic
│   ├── middleware/               # Middlewares (error handling, auth, etc.)
│   ├── migrations/               # Sequelize migration files
│   ├── models/                   # Sequelize models
│   ├── schemas/                  # Zod schemas for validation
│   ├── services/                 # Application logic and DB access
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Logger, DB connection, config helpers
│   ├── app.js                    # Express app and route setup
│   └── index.js                  # Entry point
├── docker-compose.yml            # Docker config for dev database
├── docker-compose.test.yml       # Docker config for test database
├── ecosystem.config.cjs          # PM2 config for production deployment
├── eslint.config.mjs             # ESLint configuration
├── jest.config.mjs               # Jest configuration for testing
├── tsconfig.json                 # Base TypeScript config
├── tsconfig.build.json           # TypeScript config for production build
├── .env                          # Environment variables (not committed)
└── .env.test                     # Test environment variables (not committed)```


## 🧪 Testing

This project uses Jest as the testing framework for backend tests.

To run tests, there are several npm scripts defined that help with setting up and tearing down a test database environment using Docker Compose.

### Available test scripts:

- "test:db:up": Starts the test database containers in the background using Docker Compose with the configuration file docker-compose.test.yml and environment variables from .env.test.

- "test:db:down": Stops and removes the test database containers and associated volumes.

- "test:only": Runs Jest tests only, with environment variable NODE_ENV=test and special Node options for proper Jest behavior.

- "test": Runs the full test sequence — first brings the test DB up (test:db:up), then runs tests (test:only), and finally tears down the test DB (test:db:down).

### How to run tests manually:

npm run test
This command will handle starting the test database, running the tests, and cleaning up the test database afterward.

## 📬 Author

GitHub: AnttiK87
Project: akphotography-websites
Author: Antti Kortelainen
````

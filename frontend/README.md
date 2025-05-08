## 📸 AK Photography Website – Frontend

This is the frontend of the akphotography-websites project. It's a modern single-page application built with React, aiming to renew a personal photography portfolio and serve as a full-stack learning project (e.g., for Full Stack Open).

# ⚛️ Technologies & Libraries

React 18 with Vite for fast development

React Router DOM – SPA routing

Redux + Redux Thunk – State management

Axios – HTTP client

PropTypes – Prop validation

Framer Motion – Animations

React-Bootstrap – UI components

React-Slick – Image carousels

FontAwesome – Icons

EXIFR – Image metadata parsing

# 🚀 Getting Started

1. Install dependencies
   npm install

2. Start development server
   npm run dev

3. Build for production
   npm run build

4. Preview production build locally
   npm run preview

## 🧩 Notable Features:

# 🔄 State Management with Redux

This project utilizes Redux for global state management across the application. The Redux store is configured to handle user authentication, photo metadata, and UI states like lightbox and language preferences. Redux Thunk is used for managing side effects and asynchronous API calls.

Redux slices and reducers are located in the /src/reducers/ directory.

Redux Toolkit simplifies store setup and slice management.

# 🌐 Communication with Backend via Axios

The application communicates with the backend API using Axios for HTTP requests. API calls are abstracted in the /src/services/ directory, where an Axios instance is configured for sending requests and handling responses (including interceptors for handling errors and JWT authentication).

# 🔁 Navigation

Routing is handled with react-router-dom, enabling page navigation without reloads.

# 📍 Navbar

The responsive navigation bar is created using components from react-bootstrap.

# 🖼️ Carousel

Image sliders (e.g., home page and gallery) are implemented with react-slick.

# 🔠 Animated Text

The homepage header animation uses Framer Motion for staggered reveal effects. Inspiration and help came from:

Staggered Text Animations with Framer Motion – Frontend FYI

# 📦 Prop Validation

Props in components are validated using Facebook’s prop-types library to ensure correct usage.

# 🎨 Icons

Icons are a mix of self made assets and Font Awesome icons via the @fortawesome packages.

# 📂 Project Structure (Simplified):

/frontend
│
├── public/ # Static assets (images, favicon, etc.)
├── src/
│ ├── components/ # UI components organized by views (e.g., Navbar, Gallery, etc.)
│ ├── assets/ # Icons, images, and other assets (e.g., logo)
│ ├── context/ # Context providers for managing lightbox and language state
│ ├── hooks/ # Custom hooks for reusable logic (e.g., useFetch, useAuth)
│ ├── utils/ # Utility functions (e.g., date formatting, image resizing)
│ ├── reducers/ # Redux reducers and slices for global state management
│ ├── services/ # API calls and backend communication (e.g., Axios instance)
│ ├── app.jsx # Main routing configuration
│ └── main.jsx # Application entry point
├── index.html # Main HTML template
├── vite.config.js # Vite build configuration
└── .eslintrc # ESLint configuration

# 📬 Author

GitHub: AnttiK87
Project: akphotography-websites
Author: Antti Kortelainen

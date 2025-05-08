# 📸 AK Photography Website

This project aims to renew and recreate personal web site with more modern web-development practices.Also this could serve as my full stack open courses project work and/or thesis work. This is a full-stack photography website project that features a backend for managing images and related data from admin user ui. As well as it has a frontend for the user interface and interactions such as viewing, reviewing and commenting photographs on the site.

# Project Structure

The project is organized into two main directories:

/backend: The backend of the application, which serves as the API for the frontend. Built with Node.js, Express, and Sequelize for database interactions.

/frontend: The frontend of the application, built with React and Vite. This serves the user interface for commonusers and andmin user for browsing, uploading, and managing photos.

# Automation and Deployment

This project includes an automated deployment pipeline configured with GitHub Actions, located in the /.github/workflows directory. The pipeline is designed to automatically deploy the application to the web hosting server whenever there are changes pushed to the main branch.

Workflow
The GitHub Actions workflow automates the following steps:

Build the Frontend: The frontend is built using Vite.

Build the Backend: The backend is built and prepared for deployment.

Deploy to Web Hosting Server: The application is deployed directly to the web hosting server.

This deployment pipeline ensures that updates to the project are automatically pushed to the production environment.

# Technologies Used

Frontend: React, Redux, Axios, Vite

Backend: Node.js, Express, Sequelize (MySQL), JWT, Multer, Sharp, Nodemailer

Other: Docker (for development environment), ESLint/Prettier (for code quality)

More detailed description on own backend and frontend README-files

# 📬 Author

GitHub: AnttiK87
Project: akphotography-websites
Author: Antti Kortelainen

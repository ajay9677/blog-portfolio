# Blog Portfolio Web Application

A full-stack Blog Portfolio Web Application built using **React.js, Node.js, Express.js, MongoDB, and Firebase Authentication**. The application allows users to authenticate securely, view blog posts, and provides authorized administrators with blog management capabilities.

## 🎯 Project Objective

The objective of this project is to integrate MongoDB and Firebase into the provided starter project to demonstrate database connectivity, user authentication, and secure administrative access for managing blog content.

## ✨ Features

- **User Authentication:** Login and signup using Firebase Authentication.
- **Protected Pages:** Restrict access to application pages to authenticated users.
- **MongoDB Integration:** Store and retrieve blog posts and contact form submissions.
- **Blog Management:** Add and view blog posts.
- **Like Functionality:** Allow users to like blog posts.
- **Admin Access:** Provide authorized administrators with access to blog management features.
- **Contact Form:** Collect contact messages and send email notifications.
- **Responsive Design:** User-friendly interface across desktop and mobile devices.
- **REST API:** Communicate between the React frontend and Express backend.

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Firebase Authentication integration
- Resend API for email notifications
- Validator.js

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Authentication:** Firebase Authentication

## 📂 GitHub Repositories

- **Frontend Repository:** https://github.com/errormakesclever/blog-project-starter-frontend
- **Backend Repository:** https://github.com/errormakesclever/blog-project-starter-backend


## 🔐 Firebase Authentication

Firebase Authentication provides the login and signup functionality.

- Users can create an account and log in.
- Authentication status is maintained using Firebase Authentication.
- Protected pages are available only to authenticated users.
- Users can log out of their accounts.
- Appropriate success and error messages are displayed during authentication.

## 👨‍💻 Admin Access

The application includes an admin-specific interface for managing blog content.

Authorized administrators can access the blog creation form, while regular users can view published blog posts.

For secure administration, the backend must verify the authenticated user's identity and admin permissions before allowing blog creation, editing, or deletion.

## 🌐 Deployment

The application can be deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Configure the production API URL and required environment variables in the hosting dashboards before deploying. Redeploy the frontend after changing its environment variables.

## 🧪 Expected Outcome

A functional full-stack Blog Portfolio Web Application featuring:

- MongoDB database integration
- Firebase-based user authentication
- Login and signup functionality
- Protected application pages
- Blog listing and creation
- Blog likes
- Contact form and email notifications
- Administrator access controls

## 🚀 Future Enhancements

- Edit and delete blog posts
- Blog image uploads
- Blog categories and search
- Pagination
- User profile management
- Enhanced server-side authorization and validation

## 👨‍🎓 Project Purpose

This project demonstrates practical skills in full-stack web development, REST API integration, NoSQL database management, authentication, access control, and cloud deployment.

---

**Developed as a Full Stack Blog Portfolio Web Application project.**

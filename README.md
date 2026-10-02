# 🎵 Sukoon

A modern full-stack music streaming web application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and the JioSaavn API.

Sukoon is designed to provide a clean, responsive, and immersive music listening experience with music search, playback, lyrics, authentication, email verification, queue management, and a global music player.

---

## 🌐 Live Demo

Live Website: https://sukoon-2ja.pages.dev/

---

## 📂 Project Repositories

Frontend:
https://github.com/Mayankdubey22/sukoon-frontend

Backend:
https://github.com/Mayankdubey22/sukoon-backend

Production Backend:
https://sukoon-backend-5rl8.onrender.com

---

# ✨ About Sukoon

Sukoon is a full-stack music streaming web application developed using modern web technologies.

The frontend is built with React and Vite, while the backend is powered by Node.js and Express. MongoDB Atlas is used for application data and user accounts.

Music discovery and playback data are powered by the JioSaavn API, while Mailjet is used for email-based OTP verification.

The application is designed to provide a responsive music experience across desktop, laptop, tablet, and mobile devices.

---

# 🚀 Features

## 🎵 Music & Playback

- Search for songs
- Display song artwork
- Display artist information
- Display song information
- Play and pause songs
- Previous and next song controls
- Progress tracking
- Seek through songs
- Volume control
- Shuffle
- Repeat
- Queue management
- Global music player
- Desktop bottom player
- Desktop Now Playing interface
- Mobile mini player
- Mobile full-screen player
- Continuous player experience while navigating the application

## 🎤 Lyrics

- Lyrics support for available songs
- Lyrics panel inside the player
- Desktop lyrics interface
- Mobile lyrics interface
- Lyrics connected to the currently playing song

## 🔐 Authentication

- User signup
- User login
- User logout
- Email verification
- OTP verification
- OTP resend
- JWT-based authentication
- Protected user information

## 📧 Email Verification

- 6-digit OTP
- 10-minute OTP expiration
- OTP resend functionality
- OTP attempt limits
- Email verification status
- Mailjet HTTP API integration
- HTML email
- Plain-text email fallback

## 👋 Welcome Experience

Sukoon provides different welcome experiences for new and returning users.

### New Users

After successfully verifying their email, new users receive a welcome experience.

### Returning Users

After successfully logging in, returning users receive a welcome experience before continuing to the application.

The welcome experience uses session storage so it does not repeatedly appear during the same session.

## 📱 Responsive Design

The application is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The music player and navigation experience adapt according to screen size.

---

# 🏗️ Application Architecture

    SUKOON
       │
       ▼
    React + Vite Frontend
       │
       │ REST API
       ▼
    Node.js + Express Backend
       │
       ├───────────────┬────────────────┐
       │               │                │
       ▼               ▼                ▼
    MongoDB Atlas   JioSaavn API    Mailjet API
       │               │                │
       ▼               ▼                ▼
      Users           Music             OTP
      OTPs            Songs            Emails
      Lyrics          Albums
                      Artists

---

# 🔄 Application Flow

    User
     │
     ├── Search Music
     │       │
     │       ▼
     │   React Frontend
     │       │
     │       ▼
     │   Sukoon Backend
     │       │
     │       ▼
     │   JioSaavn API
     │       │
     │       ▼
     │   Music Results
     │
     ├── Authentication
     │       │
     │       ▼
     │   Sukoon Backend
     │       │
     │       ├── MongoDB Atlas
     │       │
     │       └── Mailjet
     │
     └── Play Music
             │
             ▼
         Global Player
             │
             ├── Progress
             ├── Volume
             ├── Queue
             ├── Shuffle
             ├── Repeat
             └── Lyrics

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React
- HTML5 Audio API

## Backend

- Node.js
- Express.js
- JavaScript
- REST API
- JWT
- bcryptjs

## Database

- MongoDB
- MongoDB Atlas
- Mongoose

## External Services

- JioSaavn API
- Mailjet API

## Deployment

- Cloudflare Pages — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

# 📂 Project Structure

    sukoon-frontend/
    │
    ├── public/
    │   └── sukoon-logo.png
    │
    ├── src/
    │   │
    │   ├── components/
    │   │   ├── GlobalPlayer.jsx
    │   │   ├── WelcomeModal.jsx
    │   │   └── ...
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Search.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── VerifyEmail.jsx
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── config.js
    │   └── index.css
    │
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── README.md

The project may contain additional components and files as the application continues to grow.

---

# 🔐 Authentication Flow

    User
     │
     ▼
    Signup
     │
     ▼
    Create Account
     │
     ▼
    Generate OTP
     │
     ▼
    Mailjet API
     │
     ▼
    User Email
     │
     ▼
    Enter 6-Digit OTP
     │
     ▼
    Verify Email
     │
     ▼
    Generate JWT
     │
     ▼
    Authenticated User
     │
     ▼
    Sukoon

## Login Flow

    User
     │
     ▼
    Login
     │
     ▼
    Email + Password
     │
     ▼
    Backend Validation
     │
     ├── Not Verified
     │       │
     │       ▼
     │   Verify Email
     │
     └── Verified
             │
             ▼
          JWT Token
             │
             ▼
        Authenticated
             │
             ▼
            Home

---

# 🎧 Global Music Player

The global player manages the application's music playback experience.

It provides:

- Play / Pause
- Previous / Next
- Progress bar
- Seek
- Volume
- Shuffle
- Repeat
- Queue
- Lyrics
- Liked song interaction
- Desktop bottom player
- Desktop Now Playing
- Mobile mini player
- Mobile full-screen player

The player maintains the currently playing song while users navigate through the application.

---

# 🖥️ Desktop Player

The desktop experience includes:

- Bottom music player
- Current song information
- Artwork
- Playback controls
- Progress
- Volume
- Queue
- Lyrics
- Full Now Playing interface

The desktop Now Playing interface provides a larger music-focused experience.

---

# 📱 Mobile Player

The mobile experience includes:

- Mini player
- Full-screen player
- Lyrics panel
- Queue panel
- Playback controls
- Progress
- Volume
- Song artwork

The mobile player is optimized for smaller screens.

---

# 🔎 Music Search

Music search follows this flow:

    Search Input
         │
         ▼
    React Frontend
         │
         ▼
    Sukoon Backend
         │
         ▼
    JioSaavn API
         │
         ▼
    Music Results
         │
         ▼
    React UI

The backend acts as the communication layer between the frontend and the external music service.

---

# 🎤 Lyrics

Lyrics are requested through the Sukoon backend.

    Currently Playing Song
             │
             ▼
        Lyrics Request
             │
             ▼
       Sukoon Backend
             │
             ▼
        Lyrics Service
             │
             ▼
        Lyrics Response
             │
             ▼
        Player Lyrics UI

---

# 🌍 Environment Variables

Create a `.env` file in the frontend project.

    VITE_API_URL=http://localhost:5000

For production:

    VITE_API_URL=https://sukoon-backend-5rl8.onrender.com

Do not commit `.env` files containing private credentials to GitHub.

---

# 💻 Getting Started

## 1. Clone the repository

    git clone https://github.com/Mayankdubey22/sukoon-frontend.git

## 2. Enter the project

    cd sukoon-frontend

## 3. Install dependencies

    npm install

## 4. Configure environment variables

Create a `.env` file and add:

    VITE_API_URL=http://localhost:5000

## 5. Start the development server

    npm run dev

The Vite development server will normally run at:

    http://localhost:5173

---

# 🔗 Backend Integration

The frontend communicates with the Sukoon backend through REST APIs.

Backend Repository:

https://github.com/Mayankdubey22/sukoon-backend

Production Backend:

https://sukoon-backend-5rl8.onrender.com

---

# 🚀 Deployment

The frontend is deployed using Cloudflare Pages.

The backend is deployed using Render.

MongoDB Atlas is used as the production database.

    GitHub
       │
       ├───────────────┐
       │               │
       ▼               ▼
    Sukoon          Sukoon
    Frontend        Backend
       │               │
       ▼               ▼
    Cloudflare        Render
    Pages              │
                       ▼
                 MongoDB Atlas

---

# 🔒 Security

The application uses:

- JWT authentication
- Protected API requests
- bcryptjs password hashing
- Email verification
- OTP expiration
- OTP attempt limits
- Environment variables
- Backend authentication middleware
- HTTPS in production

Private API credentials, database credentials, and JWT secrets are stored through environment variables.

---

# 🎯 Project Goals

Sukoon was developed to practice and demonstrate:

- React development
- Modern frontend architecture
- Responsive UI development
- Tailwind CSS
- REST API integration
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Password hashing
- OTP verification
- Email API integration
- External API integration
- Audio playback
- Queue management
- Lyrics integration
- Full-stack deployment

---

# 🔮 Future Improvements

Possible future improvements include:

- Persistent liked songs
- User playlists
- Recently played songs
- Listening history
- Personalized recommendations
- Artist pages
- Album pages
- Advanced search
- Listening statistics
- Progressive Web App support
- Additional account security
- More personalization

---

# 👨‍💻 Author

**Mayank Kumar**

Computer Science & Engineering Student

GitHub:

https://github.com/Mayankdubey22

---

# 📄 License

This project was created for learning, development, and personal project purposes.

# 🎵 Sukoon

> A modern full-stack music streaming web application built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

## 🌐 Live Demo

👉 **[Open Sukoon](https://sukoon-2ja.pages.dev/)**

## 🔗 Project Repositories

- **Frontend:** [Sukoon Frontend](https://github.com/Mayankdubey22/sukoon-frontend)
- **Backend:** [Sukoon Backend](https://github.com/Mayankdubey22/sukoon-backend)

---

## 📖 About Sukoon

Sukoon is a full-stack music streaming web application designed to provide a clean, modern, and responsive music listening experience.

The application allows users to search for songs, discover music, play songs, view lyrics, create an account, verify their email, and enjoy a responsive music player across desktop and mobile devices.

The frontend is built using React and Vite and communicates with a Node.js and Express backend through REST APIs.

The project was developed as a practical full-stack application to gain hands-on experience with frontend development, backend development, REST APIs, authentication, database management, third-party API integration, responsive UI design, and cloud deployment.

---

# ✨ Features

## 🎧 Music & Playback

- Search for songs
- Display song information
- Display album artwork
- Display artist information
- Play songs directly in the browser
- Global music player
- Play / Pause controls
- Previous / Next controls
- Progress tracking
- Volume control
- Shuffle playback
- Repeat playback
- Queue management
- Desktop Now Playing interface
- Mobile mini player
- Mobile full-screen player

---

## 🎤 Lyrics

- View lyrics for the currently playing song
- Lyrics integrated into the music player
- Desktop lyrics interface
- Mobile lyrics interface
- Backend-powered lyrics service

---

## 🔐 Authentication

- User signup
- User login
- JWT-based authentication
- Protected application routes
- Persistent authentication
- Email verification
- OTP verification
- OTP resend functionality
- Logout
- Current-user authentication
- Password hashing on the backend

---

## 📧 Email Verification

Sukoon uses the Mailjet API for transactional email delivery.

The signup flow works as:

```text
Create Account
      ↓
Generate OTP
      ↓
Send OTP through Mailjet
      ↓
User receives OTP
      ↓
Verify OTP
      ↓
Email Verified
      ↓
Authenticated User

# Tattooista

A full-stack web application for tattoo studios — featuring artist portfolios, a booking system, and an admin panel for studio management.

<!-- 🔗 **Live Demo:** [tattooista.example.com](https://tattooista.example.com) -->

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Redux, TypeScript, SCSS |
| Backend | Node.js, Express |
| Database | MongoDB |

## Features

- **Artist Profiles** — portfolio galleries showcasing each artist's work and style
- **Booking System** — clients can request consultations and schedule appointments
- **Admin Panel** — manage artists, bookings, gallery content, and studio settings
- **Responsive Design** — optimized for desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- MongoDB (local instance or Atlas connection string)

### Installation

```bash
git clone https://github.com/Menolas/Tattooista.git
cd Tattooista
```

Install dependencies for both client and server:

```bash
cd Server && npm install
cd ../Client && npm install
```

### Running the App

Start the backend (from the `Server` directory):

```bash
npm run devStart
```

Start the frontend (from the `Client` directory):

```bash
npm run start
```

The client will be available at `http://localhost:3000` (or whichever port is configured).

## Project Structure

```
Tattooista/
├── Client/          # React frontend (Redux, TypeScript, SCSS)
├── Server/          # Express API server
├── package.json
└── README.md
```

## Screenshots

<!-- Add screenshots of the app here -->
<!-- ![Home Page](./screenshots/home.png) -->
<!-- ![Admin Panel](./screenshots/admin.png) -->

# EBUDDY Technical Test

## Technology Stack

### Backend

- Express.js
- Firebase SDK (Authentication, Firestore)
- TypeScript

### Frontend

- Next.js
- React MUI
- Redux Toolkit
- Firebase JavaScript SDK
- TypeScript

### Shared

- Common TypeScript interfaces and utilities

## Project Structure

```
ebuddy/
├── apps/
│   ├── backend-repo/        # Express.js backend
│   └── frontend-repo/       # Next.js frontend
├── packages/
│   └── shared/              # Shared types and utilities
├── package.json             # Root package.json
└── turbo.json               # Turborepo configuration
```

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or newer)
- npm or yarn
- Firebase CLI (for emulators)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hapidzfadli/ebuddy.git
cd ebuddy
```

### 2. Install Dependencies

From the root directory, run:

```bash
npm install
# or
yarn install
```

This will install all dependencies for the monorepo, including backend, frontend, and shared packages.

### 3. Environment Configuration

#### Backend Environment Setup

Create a `.env` file in the `apps/backend-repo` directory:

```
NODE_ENV=development
PORT=5000
```

#### Frontend Environment Setup

Create a `.env.local` file in the `apps/frontend-repo` directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace the placeholder values with your Firebase project configuration.

### 4. Running Firebase Emulators

This project supports local development using Firebase Emulators. To start the emulators, run:

```bash
cd apps/backend-repo
npm run build && firebase emulators:start --only functions,firestore
```

This will start the Firebase emulators for both Cloud Functions and Firestore.

### 5. Running the Application

From the root directory, run:

```bash
npm run dev
# or
yarn dev
```

This will start both the frontend and backend applications in development mode.

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Firebase Emulator UI: http://localhost:4000

### 6. Building for Production

To build the entire application for production:

```bash
npm run build
# or
yarn build
```

## Application Features

### Backend

- **Authentication Middleware**: Validates Firebase authentication tokens
- **User Management**: CRUD operations for user data
- **Activity Tracking**: Automatic tracking of user activity
- **Potential Score Calculation**: Advanced algorithm to rank users by potential

### Frontend

- **Firebase Authentication**: Email/password authentication
- **Responsive Dashboard**: Mobile-friendly user interface
- **User Profile Management**: Update user information
- **User Listing**: View all users with sorting and pagination
- **Potential Score Visualization**: View users ranked by combined potential score

## API Endpoints

### User Management

- `GET /fetch-user-data/:userId?`: Fetch a specific user's data (or current user if no ID provided)
- `PUT /update-user-data/:userId?`: Update a user's data
- `GET /fetch-all-users`: Fetch all users with pagination and sorting
- `POST /update-activity`: Update the current user's activity timestamp

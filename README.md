# Destination Together

Destination Together is a full-stack collaborative travel web application that helps travelers in the United States find others heading the same route, split travel costs, coordinate trips through group chat, and pay each other directly using Venmo or Zelle.

The application is built as a microservices architecture with a React frontend, five independent Node.js backend services, a PostgreSQL database, and Google Gemini AI for intelligent route suggestions. Everything runs in Docker containers and can be started with a single command.

Live demo: Run locally using docker-compose up -d and open http://localhost


## The Problem It Solves

Traveling between cities is expensive and often lonely when done alone. Destination Together matches travelers heading the same way so they can share rides, split costs, and make the journey social. Whether someone is taking an Uber, renting a car with a group, or driving their own vehicle, the app handles fare splitting, group coordination, and payment links automatically.


## Tech Stack

Frontend: React 18, Vite, React Router v6

Backend: Node.js, Express.js (5 independent microservices)

Database: PostgreSQL 15

Authentication: JSON Web Tokens with bcryptjs password hashing

AI: Google Gemini 1.5 Flash API

Real-time Messaging: Socket.io with REST polling fallback

Containerization: Docker, Docker Compose

Web Server: Nginx reverse proxy

Version Control: Git, GitHub


## Architecture Overview

The application follows a microservices pattern where each service handles one domain of the application independently.

A React frontend served by Nginx sends all API requests to an API Gateway. The gateway validates JWT tokens and forwards requests to the correct backend service. All backend services connect to a shared PostgreSQL database. The AI service makes external calls to Google Gemini.

```
React Frontend (Port 80 via Nginx)
         |
    API Gateway (Port 4000)
         |
  -----------------------------------------------
  |          |          |         |             |
User      Trip        Fare      Chat           AI
Service   Service    Service   Service       Service
(4001)    (4002)     (4003)    (4004)        (4005)
  |          |          |         |
  -----------------------------------------------
                    |
             PostgreSQL Database
```


## Services and What They Do

API Gateway listens on port 4000. It is the single entry point for all client requests. It validates JWT tokens on every protected route and forwards requests to the correct microservice using Node.js built-in HTTP module. Public routes like register and login bypass authentication.

User Service listens on port 4001. It handles registration, login, and profile management. Passwords are hashed using bcryptjs with 10 salt rounds. On successful login or registration it returns a signed JWT token containing the user ID and email.

Trip Service listens on port 4002. It manages trip creation, searching, and joining. Search uses partial city name matching so Atlanta matches atlanta or Atlanta GA. Joining a trip uses a PostgreSQL transaction to atomically insert the member record and decrement available seats, preventing race conditions when multiple users join at the same time.

Fare Service listens on port 4003. It calculates per-person fare splits for three trip types. For rideshare trips it applies group discounts ranging from 20 percent off for 2 people up to 50 percent off for 6 or more people. For private vehicle trips it calculates fuel cost based on distance and MPG, adds toll estimates and vehicle wear cost, then divides by the number of passengers.

Chat Service listens on port 4004. It handles group conversations and messages. Messages are stored in PostgreSQL and the frontend polls every 3 seconds for new messages. Socket.io is also initialized for real-time delivery when available.

AI Service listens on port 4005. It sends structured prompts to Google Gemini 1.5 Flash and returns two types of data. POI alerts suggest 2 to 3 interesting stops along the route between two cities. Route info returns estimated miles, estimated hours, best travel time, a road tip specific to the route, and typical weather conditions.


## Database Schema

The database has 6 tables.

Users stores account details including hashed password, city, and travel style preference.

Trips stores route details, departure time, available seats, trip type (rideshare, vehicle, or rental), vehicle model, MPG, Venmo handle, and Zelle handle.

Trip Members links users to trips they have joined and tracks their membership status.

Conversations stores group chat rooms linked to trips.

Conversation Members links users to conversations.

Messages stores individual chat messages with sender ID, sender name, message text, and timestamp.


## Features

User registration and login with JWT authentication

Trip creation with three types: rideshare using Uber or Lyft, group rental car using Enterprise or Hertz or Budget, and private vehicle with the driver's own car

Trip search with partial city name matching and date filtering

Joining trips with real-time seat count updates using database transactions

Group chat with message history persisted in PostgreSQL

Fare split calculator supporting all three trip types with group discounts

Payment flow for private vehicle trips showing a Venmo deep link pre-filled with amount and trip note, and a Zelle handle for direct transfer

AI-powered route suggestions using Google Gemini showing points of interest, estimated travel time, road tips, and weather

Full Docker containerization with one-command startup


## How to Run Locally

Requirements: Docker Desktop installed and running

Step 1: Clone the repository
```
git clone https://github.com/raghava7261/destination-together.git
cd destination-together
```

Step 2: Add your Gemini API key. Get a free key at https://aistudio.google.com
```
echo "GEMINI_API_KEY=your_key_here" > .env
```

Step 3: Start all services
```
docker-compose up -d
```

Step 4: Open the app at http://localhost

To stop all services run docker-compose down


## API Endpoints

POST /api/auth/register - Create a new account

POST /api/auth/login - Login and receive JWT token

GET /api/auth/profile - Get current user profile

POST /api/trips - Create a new trip

GET /api/trips/search - Search trips by from city, to city, and date

GET /api/trips/my - Get all trips for the logged in user

POST /api/trips/:id/join - Join a specific trip

POST /api/fare/calculate - Calculate fare split by trip type and passengers

POST /api/chat - Create a new conversation

GET /api/chat - Get all conversations for the logged in user

POST /api/chat/:id/messages - Send a message

POST /api/ai/poi-alerts - Get AI-generated points of interest for a route

POST /api/ai/route-info - Get AI-generated route statistics and tips


## Project Structure

```
destination-together/
    docker-compose.yml
    .env
    infra/
        init.sql
    Frontend/
        Dockerfile
        nginx.conf
        src/
            App.jsx
            pages/
                Home.jsx
                Login.jsx
                TripPlanning.jsx
                Chat.jsx
                Profile.jsx
    services/
        api-gateway/
        user-service/
        trip-service/
        fare-service/
        chat-service/
        ai-service/
```


## Docker Containers

The application runs 8 containers.

dt-postgres runs PostgreSQL 15 with persistent volume storage and automatic schema initialization on first run.

dt-user-service, dt-trip-service, dt-fare-service, dt-chat-service, and dt-ai-service are the five backend microservices.

dt-api-gateway is the single entry point that routes all API traffic.

dt-frontend serves the React application via Nginx and proxies API calls to the gateway.

All containers communicate over a dedicated Docker bridge network called dt-network.


## Environment Variables

GEMINI_API_KEY is the only required environment variable. It goes in the .env file at the root of the project. The Gemini API is free with 1500 requests per day on the free tier.

All other configuration values like database credentials, JWT secret, and service URLs are already set in docker-compose.yml for local development.


## Author

Raghava Sammeta

GitHub: https://github.com/raghava7261

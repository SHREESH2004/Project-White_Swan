## 🕊️ White Swan – Flight Booking Microservices Platform

**White Swan** is a modular and scalable backend system built using **Node.js**, **Express**, and **Sequelize ORM** with a **MySQL** database. The platform powers a complete flight booking ecosystem where:

* Admins can manage cities, airports, airplanes, and flights.
* Users can register, log in, browse flights, and make bookings with secure payments.
* All services are separated into independent microservices for scalability and clarity.


### 📦 Microservices Overview

| Service                | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| **Auth Service**       | User registration and login with JWT-based authentication       |
| **Flight Service**     | Admins can manage flights, airplanes, airports, and cities      |
| **Booking Service**    | Manages booking creation, payment, and automatic booking expiry |
| **Gateway (optional)** | Central API gateway for routing and auth forwarding             |

---

### 📁 Project Structure

```plaintext
white-swan/
│
├── auth-service/           # Login / Register / JWT
├── flight-service/         # Cities, Airports, Flights, Airplanes
├── booking-service/        # Bookings and Payments
├── shared/                 # Common utilities and enums
├── .env                    # Environment variables
└── README.md               # You're here!
```

---

## 🚀 Features

* ✈️ **Flight Management** – Admins can add/edit cities, airports, airplanes, and flights
* 👤 **User Auth** – Secure login and signup using JWT
* 🧾 **Bookings** – Real-time seat availability check and booking logic
* ⌛ **Auto Expiry** – Bookings expire after 5 minutes if unpaid (cron job)
* 💳 **Payments** – Simple payment confirmation logic with validations
* 🧩 **Microservices Architecture** – Clean, maintainable, and scalable

---

## ⚙️ Tech Stack

* **Node.js**
* **Express.js**
* **Sequelize ORM**
* **MySQL**
* **JWT Authentication**
* **Axios** for inter-service communication
* **node-schedule** for scheduled tasks
* **dotenv** for environment configs

---

## 🔧 Installation & Setup

### 🛠 Prerequisites

* Node.js (v18+ recommended)
* MySQL Server (local or remote)

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/white-swan.git
cd white-swan
```

### 2. Set Up Environment Variables

Each service (`auth-service`, `flight-service`, `booking-service`) contains a `.env` file.

Here's an example `.env` for **booking-service**:

```env
PORT=3002
DB_NAME=booking_db
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
FLIGHT=http://localhost:3001/api/v1/flights/
FLIGHT_UPDATE_URL=http://localhost:3001/api/v1/flights/updateSeats
```

### 3. Install Dependencies

Run this inside each service folder:

```bash
cd auth-service
npm install

cd ../flight-service
npm install

cd ../booking-service
npm install
```

### 4. Database Migration (via Sequelize)

```bash
npx sequelize-cli db:migrate
```

Repeat inside each service if they have separate databases.

### 5. Start Services

```bash
# Inside each service
npm run dev
```

## 📅 Cron Job (Booking Expiry)

The booking service runs a background job every 10 seconds to auto-cancel unpaid bookings after 5 minutes.

You can adjust this in:

```js
schedule.scheduleJob('*/10 * * * * *', async () => {
  await bookingService.cancelOldBookings();
});
```

## 📫 API Endpoints Overview

### 🔐 Auth Service

| Method | Route       | Description       |
| ------ | ----------- | ----------------- |
| POST   | `/register` | Register a user   |
| POST   | `/login`    | Login and get JWT |

### ✈️ Flight Service

| Method | Route                  | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/cities`              | Add a new city           |
| POST   | `/airports`            | Add an airport           |
| POST   | `/airplanes`           | Add an airplane          |
| POST   | `/flights`             | Create a flight          |
| PATCH  | `/flights/updateSeats` | Update flight seat count |
| GET    | `/flights/:id`         | Get flight details       |

🧾 Booking Service

| Method | Route           | Description             |
| ------ | --------------- | ----------------------- |
| POST   | `/bookings`     | Create a booking        |
| POST   | `/payments`     | Confirm and pay booking |
| GET    | `/bookings/:id` | Get booking details     |


## 👨‍💻 Contributing

Want to improve the system, report bugs, or request features? Feel free to fork and contribute!

```bash
git clone https://github.com/your-username/white-swan.git
cd white-swan
```

---

 ✅ To-Do / Future Roadmap

* ✅ Email or notification service for users
* ✅ Integration with real payment gateway
* ✅ Docker support for easier deployments
* ✅ Kubernetes (K8s) config for cloud hosting
* ✅ API Gateway with rate limiting and service discovery

## 👋 Author
Developed by Shreesh Sanyal


## 📜 License

MIT License – feel free to use, share, and improve.
 separate `README.md` files per service (auth, flight, booking)?

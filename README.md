# Demo Credit 💳

Demo Credit is a wallet management application that allows users to easily register, manage their wallets, and perform various financial transactions, including funding, withdrawing, and transferring money to other users.

## Features

- **User Registration and Authentication**: Secure registration and login process.

- **Wallet Management**: Users can fund, withdraw, and transfer funds securely programmatically.

- **User-to-User Transfers**: Send money to other users within the system using wallet addresses.

### Authentication

This project uses JWT-based authentication with secure cookie storage. On successful login, the server sets the following HTTP-only cookies:

- `accessToken`: Used to authenticate protected routes. Automatically included in requests via cookies.
- `refreshToken`: Used to request new access tokens when the current one expires.

Tokens are not accessible via JavaScript (HTTP-only), enhancing protection against XSS attacks.


## Database Schema

### ER Diagram

The database structure is defined using two main tables: users and transactions.

- **Users Table**: Stores user information like email, username, password, and wallet details.

- **Transactions Table**: Tracks all transactions performed by users, including wallet transfers, deposits, and withdrawals.

Here’s a visual representation of the schema:
<img width="1248" alt="ER-diagram" src="./src/assets/e-r-diagram.png">

## Technologies Used

The Project technologies used:

- [x] Nodejs
- [x] Typescript
- [x] MySQL
- [x] Knexjs ORM


### Testing the API

Use tools like Postman or Insomnia to test the API.

Example endpoints:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/wallet/transfer`

### Prerequisites

Make sure you have the following installed:

- Node.js (v22 LTS recommended)
- npm
- MySQL (or access to a running MySQL instance)

## Getting Started

### Installation

To install Demo Credit locally:

1. Clone the repository:

```bash
   git clone https://github.com/Davheed2/lendSqrr.git
```

2. Change to the project directory:

```bash
   cd lendSqrr
```

3. Install dependencies

```bash
   npm install
```

4. Set up environment variables by copying `.env.example` to `.env` and filling in your credentials.

### Database Setup

1. Create your MySQL database (e.g., demo_credit_db)
2. Configure your environment variables in the .env file (you can copy from .env.example)
3. Run the development server this will automatically apply all database migrations

### Running the Project

To start the server:

```bash
   npm run dev
```

You should be able to access the API at `http://localhost:your-port`.

### Running Tests

To run tests:

```bash
npm run test
```

## License

By contributing to Demo Credit, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).

---

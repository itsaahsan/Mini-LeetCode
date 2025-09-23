# Mini LeetCode

A coding practice platform with containerized code execution, test cases, and leaderboard functionality.

![Project Status](https://img.shields.io/badge/status-in%20development-orange) ![License](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Containerized Code Execution](#containerized-code-execution)
- [Database Models](#database-models)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## About

Mini LeetCode is a web-based coding practice platform designed to help developers improve their programming skills by solving coding challenges. The platform provides a secure environment for code execution using containerization technology, supports multiple programming languages, and includes features like user authentication, problem solving, and leaderboards.

## Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Coding Problems**: Problems categorized by difficulty levels (Easy, Medium, Hard)
- **Multi-language Support**: Write solutions in JavaScript, Python, Java, or C++
- **Secure Code Execution**: Containerized execution environment for safety
- **Test Case Validation**: Automated testing of user submissions against predefined test cases
- **Leaderboard System**: Track and compare your progress with other users
- **Submission History**: View and review your previous submissions
- **Modern UI**: Clean and responsive interface built with React and Material-UI

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Fast, unopinionated web framework
- **MongoDB** with **Mongoose** - Flexible NoSQL database
- **Docker** - Containerization for secure code execution
- **JWT** - Secure authentication mechanism

### Frontend
- **React.js** - Component-based UI library
- **Material-UI** - Modern React UI framework
- **Monaco Editor** - Code editor with syntax highlighting
- **React Router** - Declarative routing for React

## Screenshots

*(Add screenshots of your application here)*

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Docker Desktop
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/itsaahsan/Mini-LeetCode.git
   cd Mini-LeetCode
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client && npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your `MONGO_URI` and `JWT_SECRET`

5. Start Docker Desktop and ensure it's running

6. Run the development server:
   ```bash
   cd .. && npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create a new problem (protected)

### Submissions
- `POST /api/submissions` - Submit code for a problem (protected)
- `GET /api/submissions` - Get user submissions (protected)
- `GET /api/submissions/:id` - Get submission by ID (protected)

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard

### Code Execution
- `POST /api/code/execute` - Execute code with test cases (protected)

## Containerized Code Execution

The application uses Docker to execute user code in isolated containers for security. This approach provides:

- **Isolation**: Each code execution runs in its own container
- **Resource Limits**: Memory and CPU usage are controlled
- **Security**: Network access is disabled to prevent malicious code
- **Multi-language Support**: Supports JavaScript (Node.js), Python, Java, and C++

Each code execution is limited by:
- Memory: 100MB
- Network: Disabled
- Time: Docker default timeout

## Database Models

### User
- username
- email
- password (hashed)
- score
- problemsSolved
- createdAt

### Problem
- title
- description
- difficulty (Easy, Medium, Hard)
- points
- testCases (array)
- constraints
- examples
- tags
- createdAt

### Submission
- userId (reference to User)
- problemId (reference to Problem)
- code
- language
- status (Pending, Accepted, Wrong Answer, etc.)
- executionTime
- memoryUsage
- testCasesPassed
- totalTestCases
- submittedAt

## Future Enhancements

- Real-time code execution with timeouts
- More sophisticated test case validation
- Syntax highlighting in code editor
- Discussion forums for problems
- Company-specific interview questions
- Progress tracking and statistics
- Dark mode support
- Mobile-responsive design

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Ahsan]
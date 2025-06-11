# Ryder Rookie

A modern mobile application built with React Native and Expo.

## Project Structure

```
ryder-rookie/
├── frontend/           # React Native/Expo mobile app
│   ├── app/           # Expo Router app directory
│   ├── assets/        # Static assets
│   └── src/           # Source code
├── backend/           # Backend server
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Python 3.8+ (for backend)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
python manage.py runserver
```

## Features

- Modern mobile UI with Expo Router
- Real-time updates
- Secure authentication
- Cross-platform compatibility

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
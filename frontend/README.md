# Rookie Ryder

A React Native app for golf enthusiasts built with Expo.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Fill in your API keys in the `.env` file:
     - Firebase configuration from your Firebase Console
     - Google Maps API key from Google Cloud Console
     - Other API keys as needed

4. Start the development server:
```bash
npx expo start
```

5. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Features

- User Authentication
- Interactive Map with Location Services
- Weather Integration
- YouTube Integration
- Golf Course Tracking

## Troubleshooting

If you encounter any issues:

1. Clear Metro bundler cache:
```bash
npx expo start --clear
```

2. Ensure all environment variables are properly set
3. Check that you have the latest Expo Go app installed on your device
4. Verify that your API keys are valid and have the necessary permissions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 
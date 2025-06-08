# TripTab

**A proof-of-concept React Native expense tracking app** that demonstrates AI-powered receipt scanning to automatically extract and organize trip expenses.

## What It Does

**TripTab** is a proof-of-concept app that demonstrates how AI can streamline expense tracking during trips. By scanning receipts with your phone's camera and using OpenAI's GPT-4 Vision API, it automatically extracts item names, prices, and quantities from receipt photos.

> **Note**: This is a demonstration project showcasing the potential of AI-powered receipt scanning technology, not a production-ready application.

### Key Features

- **📷 Smart Receipt Scanning**: Point your camera at any receipt and get instant item extraction
- **🤖 AI-Powered**: Uses OpenAI GPT-4 Vision to accurately read receipt text and extract structured data
- **✏️ Edit Items**: Review and modify scanned items before adding them to your trip
- **📊 Running Total**: Automatic calculation of your trip expenses with real-time updates
- **📱 Camera & Gallery**: Take new photos or select existing receipt images from your gallery
- **🎨 Modern UI**: Beautiful Material Design interface with smooth animations

### How It Works

1. **Scan**: Tap the scan tab and point your camera at a receipt
2. **Review**: The AI extracts items, prices, and quantities for your confirmation
3. **Edit**: Tap the pencil icon to modify any incorrectly scanned items
4. **Add**: Confirm to add all items to your running trip total
5. **Track**: View all expenses in an organized table on the home screen

### Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Native Paper** for Material Design UI
- **OpenAI GPT-4 Vision API** for receipt scanning
- **Zustand** for state management
- **Expo Camera** for photo capture

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up OpenAI API key (see `RECEIPT_SETUP.md` for detailed instructions)

3. Start the app

   ```bash
   npx expo start
   ```

## Note

This is a **proof-of-concept application** built to demonstrate AI-powered receipt scanning capabilities. The app includes fallback mock data, so it works even without an OpenAI API key configured. Real receipt scanning requires an OpenAI API key with Vision API access.

**Not intended for production use** - this project serves as a technical demonstration of integrating AI vision capabilities with mobile app development.

## Development

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Resources

To learn more about developing with Expo:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

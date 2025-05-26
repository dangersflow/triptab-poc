# Receipt Scanning Setup Guide

## OpenAI Integration Setup

Your TripTab app now includes AI-powered receipt scanning! Here's how to set it up:

### 1. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys"
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-`)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```powershell
   Copy-Item .env.example .env.local
   ```

2. Edit `.env.local` and add your OpenAI API key:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Features Implemented

✅ **Receipt Scanning**: Uses OpenAI GPT-4 Vision to extract items and prices from receipt photos
✅ **Confirmation Screen**: Review and edit scanned items before adding to your trip
✅ **Items Table**: View all receipt items in a organized table on the home screen
✅ **Automatic Totaling**: Running total updates automatically when items are added/removed
✅ **Gallery/Camera Support**: Take new photos or select from gallery
✅ **Fallback Mode**: Works with mock data if OpenAI API is not configured

### 4. How to Use

1. **Scan Tab**: Tap the scan tab (receipt icon) in bottom navigation
2. **Take Photo**: Use camera button to capture receipt (or gallery button for existing photos)
3. **Review**: Check the extracted items on the confirmation screen
4. **Confirm**: Tap "Add to Trip" to add items to your expense tracking
5. **View**: See all items in the table on the Home tab with running total

### 5. Cost Considerations

- OpenAI Vision API costs approximately $0.01-0.03 per image
- The app includes fallback mock data for testing without API costs
- Consider setting spending limits in your OpenAI dashboard

### 6. Troubleshooting

**No items detected**: Ensure receipt is well-lit and text is clearly visible
**API errors**: Check your API key is correct and account has sufficient credits
**Mock data appears**: This means OpenAI API failed; check your key and internet connection

### 7. Future Enhancements

The foundation is set for:

- Item editing functionality
- Receipt categorization
- Export to expense reports
- Multi-receipt batch processing
- OCR accuracy improvements

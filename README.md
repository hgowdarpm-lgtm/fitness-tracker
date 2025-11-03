# 90-Day Fitness Tracker - Mobile PWA

A Progressive Web App (PWA) for tracking your 90-day transformation journey from 83kg to 70kg.

## Features

✅ **Daily Workout Checklists** - Office (20 min) and Non-Office (45-60 min) workouts with direct YouTube links
✅ **Weekly Weight Tracker** - Track your weight progress week by week
✅ **Progress Dashboard** - See workouts completed, completion rate, and weight loss progress
✅ **Offline Support** - Works without internet connection
✅ **Mobile-First Design** - Optimized for phone use
✅ **Add to Home Screen** - Install as an app on your phone

## Installation on Your Phone

### iPhone (Safari)

1. Open Safari browser on your iPhone
2. Navigate to the fitness-tracker folder and open `index.html`
   - Or if hosted online, open the URL
3. Tap the Share button (square with arrow)
4. Scroll down and tap "Add to Home Screen"
5. Tap "Add" to confirm
6. The app icon will appear on your home screen!

### Android (Chrome)

1. Open Chrome browser on your Android phone
2. Navigate to the fitness-tracker folder and open `index.html`
   - Or if hosted online, open the URL
3. Tap the menu (3 dots) in the top right
4. Tap "Add to Home Screen" or "Install App"
5. Tap "Add" or "Install" to confirm
6. The app icon will appear on your home screen!

## Using the App

### Daily Workout Tab

1. Select whether today is an **Office Day** (20 min) or **Non-Office Day** (45-60 min)
2. Tap the YouTube links to open workout videos
3. Check off each item as you complete it:
   - Warm-up
   - Main workout
   - Cool-down (if non-office day)
4. Mark "Workout Complete!" when finished

### Weight Tracker Tab

1. Enter your current weight (in kg)
2. Tap "Add" to record it
3. View your weekly weight history in the table
4. See progress bar showing weight loss progress

### Progress Dashboard Tab

- **Workouts Completed** - Total number of workouts done
- **Completion Rate** - Percentage of workouts completed
- **Current Weight** - Your most recent recorded weight
- **Total Lost** - Total weight lost since start
- **Days Remaining** - Days left in your 90-day journey
- **Overall Progress** - Visual progress bar toward your goal

## Data Storage

All your data is saved locally on your phone using browser storage:
- Workout completions
- Weight entries
- Daily checklists
- Progress calculations

**Your data stays private** - nothing is sent to any server.

## Files Structure

```
fitness-tracker/
├── index.html      # Main app file
├── app.js          # JavaScript functionality
├── manifest.json   # PWA configuration
├── sw.js          # Service worker for offline support
├── icon-192.png   # App icon (192x192)
├── icon-512.png   # App icon (512x512)
└── README.md      # This file
```

## Creating Icons (Optional)

If you want custom app icons:

1. Create two PNG images:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)
2. Place them in the fitness-tracker folder
3. The app will use them automatically

You can use online tools like:
- [Favicon.io](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

Or use any image editor to create simple icons with a fitness/weights theme.

## Local Development

To test locally:

1. Open the `fitness-tracker` folder
2. Open `index.html` in your browser
3. The app will work fully offline!

## Hosting Online (Optional)

If you want to access it from any device:

1. Upload the fitness-tracker folder to a web host
2. Or use free hosting:
   - GitHub Pages
   - Netlify
   - Vercel
   - Firebase Hosting

## Troubleshooting

**App doesn't install?**
- Make sure you're using a modern browser (Safari on iOS, Chrome on Android)
- Make sure you've visited the page at least once before trying to install

**Data not saving?**
- Check that your browser allows local storage
- Try clearing browser cache and reloading

**Links not working?**
- Make sure you have internet connection (for YouTube videos)
- Check that YouTube is accessible in your region

## Support

This is a standalone app - all functionality works locally on your device. No accounts, no subscriptions, no ads!

Enjoy your transformation journey! 💪


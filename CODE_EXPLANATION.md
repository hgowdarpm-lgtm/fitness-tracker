# Code Explanation - Fitness Tracker App

## Overview
This document explains how the fitness tracker app works, step by step, in plain English.

## File Structure

The app is now organized into multiple files for better understanding:

```
fitness-tracker/
├── index.html          # The main HTML page (the UI)
├── app.js              # Main application logic (coordinates everything)
├── js/
│   ├── config.js       # Configuration and workout data
│   ├── storage.js      # All data storage operations
│   └── dayCalculator.js # Day/week calculation logic
├── sw.js               # Service worker (for offline support)
└── manifest.json       # PWA configuration
```

## How the App Works - Step by Step

### 1. When the Page Loads

**What happens:**
- The browser loads `index.html`
- HTML loads all the JavaScript files in order
- When the page is ready, `DOMContentLoaded` event fires
- The app initializes

**Code location:** `app.js` - bottom of file

**In plain English:**
Think of it like turning on a computer - the HTML is the screen, JavaScript files are the programs, and when everything is loaded, the app starts.

---

### 2. Initialization Process

**What happens:**
1. Load saved data from browser storage (weights, workouts, etc.)
2. Calculate which day the user is on (Day 1, Day 2, etc.)
3. Update all displays (workouts, weights, progress)
4. Set up event listeners (for button clicks, etc.)

**Code location:** `app.js` - `DOMContentLoaded` event handler

**In plain English:**
When you open the app, it:
- Checks if you've used it before (loads your saved data)
- Figures out what day you're on
- Shows you today's workout
- Makes buttons clickable

---

### 3. Day Calculation

**How it works:**
The app needs to know which day of the 90-day program you're on.

**Two modes:**

**A. Automatic Mode (Default)**
- Calculates day based on when you started
- Day 1 = your start date
- Day 2 = start date + 1 day
- Continues automatically

**B. Manual Mode**
- You can manually set any day (1-90)
- Useful for testing or catching up
- Overrides automatic calculation

**Code location:** `js/dayCalculator.js`

**In plain English:**
- Automatic: "Today is 5 days since I started, so I'm on Day 5"
- Manual: "I want to jump to Day 15" (you set it manually)

---

### 4. Workout Selection

**How it works:**
Each day, the app shows you:
- 1 warm-up exercise (rotates through available options)
- 1 main exercise (rotates through: main, HIIT, sprint, or resistance)
- 1 cool-down exercise (rotates through available options)

**Why different each day:**
- Uses the day number to pick which exercise to show
- Cycles through all exercises before repeating
- Formula: `exerciseIndex = (currentDay - 1) % numberOfExercises`

**Code location:** `app.js` - `updateWorkoutDisplay()` function

**In plain English:**
- Day 1: Shows exercise #1 from each category
- Day 2: Shows exercise #2 from each category
- Day 3: Shows exercise #3 (or wraps back to #1 if only 2 options)
- This ensures variety - you won't see the same workout twice until you've done all of them

---

### 5. Data Storage

**How it works:**
The app uses `localStorage` - a built-in browser feature that saves data locally.

**What gets saved:**
- Start date
- Weight entries (with dates)
- Completed workouts
- Daily checklists
- Fasting sessions
- Period tracking
- Manual day settings

**Code location:** `js/storage.js`

**In plain English:**
Think of localStorage like a filing cabinet in your browser:
- Each drawer has a label (key) like "weights" or "workouts"
- You put data in (save) and take it out (load)
- It persists even after closing the browser
- All data stays on your device (private)

---

### 6. Link Click Tracking

**How it works:**
When you click a workout link:
1. The app marks it as "completed" for that day
2. The link gets a green checkmark
3. This status is saved per day

**Why per day:**
- Day 1: You click a link → marked as done for Day 1
- Day 2: All links reset (fresh start for new day)
- This lets you track what you did each day separately

**Code location:** `app.js` - click event listener and `updateLinkCompletionStatus()`

**In plain English:**
- Click a workout link → it turns green (marked as done)
- Next day → all links reset to normal (new day, fresh start)
- Each day tracks its own completion status

---

### 7. Tab Navigation

**How it works:**
The app has 4 tabs:
- Workout
- Weight
- Fasting
- Progress

**What happens when you click a tab:**
1. Hide all tab contents
2. Show the selected tab's content
3. Update the tab button to show it's active
4. Refresh data if needed (e.g., weight table)

**Code location:** `app.js` - `showTab()` function

**In plain English:**
Like switching between apps on your phone - only one is visible at a time, and clicking switches to it.

---

### 8. Weight Tracking

**How it works:**
1. User enters weight and clicks "Add"
2. App validates the number (must be between 1-200 kg)
3. Saves weight with today's date
4. Updates the weight table
5. Recalculates progress

**Data structure:**
```javascript
{
  "2024-01-15": { weight: 82.5, date: "...", timestamp: ... },
  "2024-01-22": { weight: 81.8, date: "...", timestamp: ... }
}
```

**Code location:** `app.js` - `addWeight()` and `updateWeightTable()`

**In plain English:**
- You enter your weight → app saves it with the date
- Shows a table of all your weight entries
- Calculates how much you've lost
- Shows progress toward your goal

---

### 9. Progress Calculation

**How it works:**
The app calculates several metrics:
- **Workouts completed:** Counts days with completed workouts
- **Completion rate:** (Workouts done / Days passed) × 100
- **Weight lost:** Starting weight - Current weight
- **Days remaining:** 90 - Current day
- **Overall progress:** (Weight lost / Goal weight loss) × 100

**Code location:** `app.js` - `updateProgress()` function

**In plain English:**
The app does math to show you:
- How many workouts you've done
- What percentage you're completing
- How much weight you've lost
- How many days are left
- Overall progress toward your goal

---

## Key Concepts Explained

### Variables
Variables store data that can change:
```javascript
let currentDay = 1;  // Can change (let)
const TOTAL_DAYS = 90;  // Never changes (const)
```

### Functions
Functions are reusable blocks of code:
```javascript
function calculateCurrentDay() {
    // Code that calculates the day
}
```

### Objects
Objects group related data together:
```javascript
const workout = {
    name: "20-Min HIIT",
    url: "https://youtube.com/..."
};
```

### Arrays
Arrays store lists of items:
```javascript
const warmups = [
    { name: "Warm-up 1", url: "..." },
    { name: "Warm-up 2", url: "..." }
];
```

### Event Listeners
Listen for user actions (clicks, etc.):
```javascript
button.addEventListener('click', function() {
    // Do something when clicked
});
```

### localStorage
Browser's built-in storage:
```javascript
localStorage.setItem('key', 'value');  // Save
localStorage.getItem('key');  // Load
```

---

## Data Flow Example

**Scenario: User clicks a workout link**

1. **User action:** Clicks workout link
2. **Event fires:** Click event listener catches it
3. **Check:** Is it a workout link? (has class "workout-link")
4. **Get data:** Extract link type from data attribute
5. **Save:** Mark link as visited for current day
6. **Update UI:** Add "completed" class (green checkmark)
7. **Persist:** Save to localStorage

**Code flow:**
```
Click → Event Listener → Check Link Type → Save to Storage → Update Display
```

---

## Why This Structure?

**Modular files:**
- **Easier to find code:** Each file has a specific purpose
- **Easier to update:** Change workout data without touching logic
- **Easier to understand:** Smaller files are less overwhelming
- **Easier to test:** Can test each part separately

**Comments:**
- Explain **what** the code does
- Explain **why** it exists
- Help future you (or others) understand the code

**Clean variable names:**
- `currentDay` instead of `d` or `day`
- `selectedDayType` instead of `type` or `dt`
- Makes code self-documenting

---

## Common Patterns

### 1. Get or Create Pattern
```javascript
// Get saved data, or create default if none exists
const data = getSavedData() || createDefaultData();
```

### 2. Validate Before Save
```javascript
if (isValid(weight)) {
    saveWeight(weight);
} else {
    showError("Invalid weight");
}
```

### 3. Update Display After Change
```javascript
saveData();
updateDisplay();  // Always refresh UI after data changes
```

### 4. Check Before Using
```javascript
const element = document.getElementById('myElement');
if (element) {
    element.textContent = "Updated";
}
```

---

## Tips for Understanding the Code

1. **Start with the flow:** Follow what happens when you click something
2. **Read comments:** They explain the "why"
3. **Look at variable names:** They often explain the "what"
4. **Break it down:** Complex functions do multiple things - break them into steps
5. **Test changes:** Make small changes and see what happens

---

## Questions?

If you're confused about any part:
1. Find the function name in the code
2. Read the comments above it
3. Follow the code line by line
4. Check what data it uses and what it returns

Remember: Code is just instructions for the computer, written in a way humans can (hopefully) understand!


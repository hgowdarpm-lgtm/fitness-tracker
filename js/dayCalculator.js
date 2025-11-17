/**
 * DAYCALCULATOR.JS
 * 
 * This file handles all calculations related to days and weeks.
 * It figures out which day of the 90-day program the user is on.
 * 
 * WHY THIS FILE EXISTS:
 * - Separates day calculation logic from other features
 * - Makes it easy to change how days are calculated
 * - Supports both automatic (date-based) and manual day selection
 * 
 * HOW IT WORKS:
 * 1. Automatic Mode: Calculates day based on start date
 *    - Day 1 = start date
 *    - Day 2 = start date + 1 day
 *    - etc.
 * 
 * 2. Manual Mode: Uses the day number the user manually set
 *    - User can jump to any day (1-90)
 *    - Useful for testing or catching up
 */

// Global variables that track the current state
// These are shared across the app
let appStartDate = new Date();
appStartDate.setHours(0, 0, 0, 0); // Set to midnight for accurate day calculations
let currentWeek = 1;
let currentDay = 1;

/**
 * Calculate which day and week the user is currently on
 * 
 * HOW IT WORKS:
 * 1. First checks if manual day mode is active
 * 2. If manual mode: uses the manually set day
 * 3. If automatic mode: calculates day from start date
 * 4. Updates the week number (week = day / 7, rounded up)
 * 5. Updates the display in the header
 */
function calculateCurrentDay() {
    // Check if user has manually set a day
    const manualDay = getManualDay();
    const isManualMode = isManualDayMode();
    
    if (isManualMode && manualDay) {
        // MANUAL MODE: Use the day the user set
        // Clamp the day between 1 and 90 to prevent invalid values
        currentDay = Math.max(1, Math.min(APP_CONFIG.TOTAL_DAYS, parseInt(manualDay, 10)));
        currentWeek = Math.ceil(currentDay / APP_CONFIG.DAYS_PER_WEEK);
    } else {
        // AUTOMATIC MODE: Calculate day from start date
        const savedStartDate = getStartDate();
        
        // If no start date exists, create one (first time using the app)
        if (savedStartDate) {
            appStartDate = savedStartDate;
        } else {
            // First time: set today as the start date
            appStartDate = new Date();
            appStartDate.setHours(0, 0, 0, 0);
            saveStartDate(appStartDate);
        }
        
        // Calculate how many days have passed since start date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate calculation
        
        // Get difference in milliseconds, convert to days
        const timeDifference = today - appStartDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
        
        // Clamp day between 1 and 90
        currentDay = Math.max(1, Math.min(APP_CONFIG.TOTAL_DAYS, daysDifference));
        
        // Calculate week number (Day 1-7 = Week 1, Day 8-14 = Week 2, etc.)
        currentWeek = Math.ceil(currentDay / APP_CONFIG.DAYS_PER_WEEK);
    }
    
    // Update the display in the header
    updateDayDisplay();
}

/**
 * Update the day and week display in the header
 * This shows "Week X | Day Y" at the top of the app
 */
function updateDayDisplay() {
    const weekElement = document.getElementById('currentWeek');
    const dayElement = document.getElementById('currentDay');
    
    if (weekElement) {
        weekElement.textContent = `Week ${currentWeek}`;
    }
    if (dayElement) {
        dayElement.textContent = `Day ${currentDay}`;
    }
}

/**
 * Get the current day number
 * @returns {number} Current day (1-90)
 */
function getCurrentDay() {
    return currentDay;
}

/**
 * Get the current week number
 * @returns {number} Current week (1-13)
 */
function getCurrentWeek() {
    return currentWeek;
}

/**
 * Get the app start date
 * @returns {Date} The date when the 90-day program started
 */
function getAppStartDate() {
    return appStartDate;
}

/**
 * Set a manual day override
 * This allows the user to jump to any day (1-90)
 * 
 * @param {number|string} dayNumber - The day to jump to
 * @returns {boolean} True if successful, false if invalid
 */
function setManualDay(dayNumber) {
    // Convert to number and validate
    const day = parseInt(dayNumber, 10);
    
    // Check if the day number is valid (between 1 and 90)
    if (isNaN(day) || day < 1 || day > APP_CONFIG.TOTAL_DAYS) {
        alert(`Please enter a valid day number between 1 and ${APP_CONFIG.TOTAL_DAYS}`);
        return false;
    }
    
    // Save the manual day setting
    saveManualDay(day);
    
    // Recalculate day (will now use manual mode)
    calculateCurrentDay();
    
    // Note: Display updates are handled by app.js after this function returns
    // This prevents circular dependencies
    
    return true;
}

/**
 * Clear manual day override and return to automatic mode
 * After this, the app will calculate days based on the start date again
 */
function clearManualDayOverride() {
    clearManualDay();
    calculateCurrentDay();
    // Note: Display updates are handled by app.js after this function returns
}

/**
 * Refresh all displays after day changes
 * This function is called from app.js after day changes
 * It doesn't directly call display functions to avoid circular dependencies
 * Instead, app.js calls this and then updates displays itself
 */
function refreshAllDisplays() {
    // This function is a placeholder - actual display updates happen in app.js
    // We keep it here for consistency, but app.js handles the actual updates
    // This prevents circular dependencies between modules
}


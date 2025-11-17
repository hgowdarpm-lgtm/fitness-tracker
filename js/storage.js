/**
 * STORAGE.JS
 * 
 * This file handles all data storage operations using localStorage.
 * localStorage is like a small database in your browser that saves data
 * even after you close the browser.
 * 
 * WHY THIS FILE EXISTS:
 * - Centralizes all storage operations in one place
 * - Makes it easy to change storage method later (e.g., to a server)
 * - Provides consistent error handling
 * - Makes the code easier to test
 * 
 * HOW IT WORKS:
 * - localStorage stores data as strings (text)
 * - We use JSON.stringify() to convert objects to strings before saving
 * - We use JSON.parse() to convert strings back to objects when reading
 */

/**
 * Storage Keys
 * These are the names we use to store different types of data
 */
const STORAGE_KEYS = {
    START_DATE: 'startDate',
    SELECTED_DAY_TYPE: 'selectedDayType',
    WEIGHTS: 'weights',
    COMPLETED_WORKOUTS: 'completedWorkouts',
    CHECKLIST: 'checklist',
    VISITED_LINKS: 'visitedLinks',
    FASTING_DATA: 'fastingData',
    ACTIVE_FASTING: 'activeFasting',
    PERIOD_DATA: 'periodData',
    MANUAL_DAY_OVERRIDE: 'manualDayOverride',
    MANUAL_DAY_MODE: 'manualDayMode'
};

/**
 * ============================================
 * START DATE FUNCTIONS
 * ============================================
 * The start date is when the user began their 90-day journey.
 * We use this to calculate which day they're currently on.
 */

/**
 * Save the start date to storage
 * @param {Date} date - The date to save
 */
function saveStartDate(date) {
    try {
        localStorage.setItem(STORAGE_KEYS.START_DATE, date.toISOString());
    } catch (error) {
        console.error('Error saving start date:', error);
    }
}

/**
 * Get the start date from storage
 * @returns {Date|null} The start date or null if not found
 */
function getStartDate() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.START_DATE);
        return saved ? new Date(saved) : null;
    } catch (error) {
        console.error('Error getting start date:', error);
        return null;
    }
}

/**
 * ============================================
 * DAY TYPE FUNCTIONS
 * ============================================
 * Day type is either 'office' (20 min) or 'nonoffice' (45-60 min)
 */

function saveDayType(dayType) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DAY_TYPE, dayType);
}

function getDayType() {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_DAY_TYPE) || 'nonoffice';
}

/**
 * ============================================
 * WEIGHT TRACKING FUNCTIONS
 * ============================================
 * Stores weight entries with dates
 */

/**
 * Save weight data
 * @param {Object} weights - Object with dates as keys and weight data as values
 */
function saveWeights(weights) {
    try {
        localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
    } catch (error) {
        console.error('Error saving weights:', error);
    }
}

/**
 * Get all weight entries
 * @returns {Object} Object with dates as keys and weight data as values
 */
function getWeights() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting weights:', error);
        return {};
    }
}

/**
 * ============================================
 * WORKOUT COMPLETION FUNCTIONS
 * ============================================
 * Tracks which days the user completed workouts
 */

function saveCompletedWorkouts(workouts) {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_WORKOUTS, JSON.stringify(workouts));
}

function getCompletedWorkouts() {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_WORKOUTS);
    return saved ? JSON.parse(saved) : {};
}

/**
 * ============================================
 * CHECKLIST FUNCTIONS
 * ============================================
 * Saves daily workout checklist (warmup done, main done, etc.)
 */

function saveChecklistData(checklist) {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
}

function getChecklistData() {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    return saved ? JSON.parse(saved) : null;
}

/**
 * ============================================
 * LINK VISITATION FUNCTIONS
 * ============================================
 * Tracks which workout links were clicked (per day)
 * Structure: { day1: { linkType1: true, linkType2: true }, day2: {...} }
 */

function saveVisitedLinks(visitedLinks) {
    localStorage.setItem(STORAGE_KEYS.VISITED_LINKS, JSON.stringify(visitedLinks));
}

function getVisitedLinks() {
    const saved = localStorage.getItem(STORAGE_KEYS.VISITED_LINKS);
    return saved ? JSON.parse(saved) : {};
}

/**
 * ============================================
 * FASTING TRACKING FUNCTIONS
 * ============================================
 */

function saveFastingData(fastingData) {
    localStorage.setItem(STORAGE_KEYS.FASTING_DATA, JSON.stringify(fastingData));
}

function getFastingData() {
    const saved = localStorage.getItem(STORAGE_KEYS.FASTING_DATA);
    return saved ? JSON.parse(saved) : {};
}

function saveActiveFasting(activeFasting) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FASTING, JSON.stringify(activeFasting));
}

function getActiveFasting() {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_FASTING);
    return saved ? JSON.parse(saved) : null;
}

/**
 * ============================================
 * PERIOD TRACKING FUNCTIONS
 * ============================================
 */

function savePeriodData(periodData) {
    localStorage.setItem(STORAGE_KEYS.PERIOD_DATA, JSON.stringify(periodData));
}

function getPeriodData() {
    const saved = localStorage.getItem(STORAGE_KEYS.PERIOD_DATA);
    return saved ? JSON.parse(saved) : { active: false, startDate: null, endDate: null };
}

/**
 * ============================================
 * MANUAL DAY CONTROL FUNCTIONS
 * ============================================
 * Allows user to manually set which day they're on
 */

function saveManualDay(dayNumber) {
    localStorage.setItem(STORAGE_KEYS.MANUAL_DAY_OVERRIDE, dayNumber.toString());
    localStorage.setItem(STORAGE_KEYS.MANUAL_DAY_MODE, 'true');
}

function getManualDay() {
    return localStorage.getItem(STORAGE_KEYS.MANUAL_DAY_OVERRIDE);
}

function isManualDayMode() {
    return localStorage.getItem(STORAGE_KEYS.MANUAL_DAY_MODE) === 'true';
}

function clearManualDay() {
    localStorage.removeItem(STORAGE_KEYS.MANUAL_DAY_OVERRIDE);
    localStorage.removeItem(STORAGE_KEYS.MANUAL_DAY_MODE);
}

/**
 * ============================================
 * CLEAR ALL DATA FUNCTION
 * ============================================
 * Removes all stored data (used when resetting the app)
 */

function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}


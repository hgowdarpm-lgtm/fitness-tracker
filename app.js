/**
 * APP.JS - Main Application File
 * 
 * This is the main file that coordinates all the app's features.
 * It handles user interactions, updates the UI, and manages the app's state.
 * 
 * FILE STRUCTURE:
 * 1. Global Variables - App state that's shared across functions
 * 2. Workout Data - Exercise videos organized by type
 * 3. Initialization - Sets up the app when page loads
 * 4. Day Calculation - Figures out which day/week user is on
 * 5. Manual Day Control - Allows user to manually set the day
 * 6. Tab Management - Handles switching between tabs
 * 7. Workout Management - Displays and manages workouts
 * 8. Weight Tracking - Handles weight entries and display
 * 9. Fasting Tracking - Handles fasting sessions
 * 10. Period Tracking - Handles period mode
 * 11. Progress Display - Shows statistics and progress
 * 12. Link Tracking - Tracks which workout links were clicked
 * 
 * NOTE: Some functions are now in separate modules (config.js, storage.js, dayCalculator.js)
 * but this file still contains the main application logic.
 */

// ============================================
// GLOBAL VARIABLES
// ============================================
// These variables store the app's current state
// They're used throughout the app to track what's happening

// Start date: When the user began their 90-day journey
// This is used to calculate which day they're currently on
let startDate = new Date();
startDate.setHours(0, 0, 0, 0); // Set to midnight for accurate day calculations

// Current week and day: Tracks progress through the 90-day program
let currentWeek = 1;  // Week 1-13 (90 days / 7 days per week)
let currentDay = 1;    // Day 1-90

// Selected day type: 'office' (20 min) or 'nonoffice' (45-60 min)
// Determines which workout set to show
let selectedDayType = 'nonoffice';

// Workout data for all 12 weeks
const workoutData = {
    weeks: {
        1: {
            office: {
                warmup: [{ name: "5-Min Full Body Dynamic Warm-Up", url: "https://www.youtube.com/watch?v=3qyWpJ34dWw" }],
                main: [{ name: "20-Min Full Body HIIT (No Equipment)", url: "https://www.youtube.com/watch?v=HhdYlniTjvg" }]
            },
            nonoffice: {
                warmup: [
                    { name: "5-Min Warm-Up for At-Home Workouts", url: "https://www.youtube.com/watch?v=f3zOrYCwquE" },
                    { name: "10-Min Cardio Warm-Up (Alternative)", url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" }
                ],
                main: [
                    { name: "40-Min Upper Body Strength (Dumbbells)", url: "https://www.youtube.com/watch?v=3x1cZIExciE" },
                    { name: "45-Min Lower Body & Glutes (Dumbbells)", url: "https://www.youtube.com/watch?v=DENm10PI8Xc" },
                    { name: "30-Min Core & Cardio Workout", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" }
                ],
                sprint: [
                    { name: "15-Min Sprint Interval Training", url: "https://www.youtube.com/watch?v=HhdYlniTjvg" },
                    { name: "20-Min HIIT Sprint Workout", url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" },
                    { name: "10-Min Quick Sprint Burst", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" }
                ],
                resistance: [
                    { name: "30-Min Full Body Resistance Training", url: "https://www.youtube.com/watch?v=PoLFAhJU-SY" },
                    { name: "25-Min Bodyweight Resistance Workout", url: "https://www.youtube.com/watch?v=DENm10PI8Xc" },
                    { name: "35-Min Dumbbell Resistance Training", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" }
                ],
                hiit: [
                    { name: "20-Min Full Body HIIT (No Equipment)", url: "https://www.youtube.com/watch?v=HhdYlniTjvg" },
                    { name: "25-Min High-Intensity Interval Training", url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" },
                    { name: "15-Min Quick HIIT Workout", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" },
                    { name: "30-Min HIIT Cardio & Strength", url: "https://www.youtube.com/watch?v=XeYkCenyldM" }
                ],
                cooldown: [
                    { name: "20-Min Full Body Stretch & Mobility", url: "https://www.youtube.com/watch?v=DppDOK2SvP0" },
                    { name: "20-Min Yoga Cool-Down", url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" }
                ]
            }
        }
        // Weeks 2-12 follow similar structure with progressive intensity
        // For now, we'll use Week 1 structure for all weeks
    }
};

// ============================================
// INITIALIZATION
// ============================================
/**
 * APP INITIALIZATION
 * 
 * This runs when the page finishes loading.
 * It sets up the app by:
 * 1. Loading saved data from browser storage
 * 2. Calculating which day the user is on
 * 3. Updating all displays to show current data
 * 
 * WHY IT'S NEEDED:
 * - Without this, the app would be blank when you open it
 * - It restores your previous session (weights, workouts, etc.)
 * - It ensures everything is in sync
 */
document.addEventListener('DOMContentLoaded', function() {
    // Step 1: Load saved user data (weights, workouts, settings)
    loadSavedData();
    
    // Step 2: Figure out which day of the program we're on
    calculateCurrentDay();
    
    // Step 3: Update all displays with current data
    updateDisplay();              // General display updates
    updateWeightTable();          // Show weight entries
    updateProgress();             // Show progress stats
    updatePeriodDisplay();       // Show period mode status
    updateFastingDisplay();       // Show fasting data
    updateDayTypeButtons();       // Show/hide office/non-office buttons
    updateWorkoutDisplay();       // Show today's workouts
    updateManualDayUI();          // Show manual day control status
    updateLinkCompletionStatus(); // Show which links were clicked today
});

/**
 * Calculate Current Day
 * 
 * Figures out which day of the 90-day program the user is on.
 * Uses storage module functions to get saved data.
 * 
 * HOW IT WORKS:
 * 1. Checks if manual day mode is active (user manually set a day)
 * 2. If manual: uses the manually set day
 * 3. If automatic: calculates day from start date
 * 4. Updates the week number and display
 */
function calculateCurrentDay() {
    // Get manual day setting from storage (if user manually set a day)
    const manualDay = getManualDay();
    const isManualMode = isManualDayMode();
    
    if (isManualMode && manualDay) {
        // MANUAL MODE: User has manually set a day
        // Clamp the day between 1 and 90 to prevent invalid values
        currentDay = Math.max(1, Math.min(APP_CONFIG.TOTAL_DAYS, parseInt(manualDay, 10)));
        currentWeek = Math.ceil(currentDay / APP_CONFIG.DAYS_PER_WEEK);
    } else {
        // AUTOMATIC MODE: Calculate day from start date
        // Get the start date from storage
        const savedStartDate = getStartDate();
        
        if (savedStartDate) {
            // Use the saved start date
            startDate = savedStartDate;
        } else {
            // First time using app: set today as start date
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0); // Set to midnight for accurate calculation
            saveStartDate(startDate);
        }
        
        // Calculate how many days have passed since start date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate calculation
        
        // Get difference in milliseconds, convert to days
        const timeDifference = today - startDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
        
        // Clamp day between 1 and 90
        currentDay = Math.max(1, Math.min(APP_CONFIG.TOTAL_DAYS, daysDifference));
        
        // Calculate week number (Day 1-7 = Week 1, Day 8-14 = Week 2, etc.)
        currentWeek = Math.ceil(currentDay / APP_CONFIG.DAYS_PER_WEEK);
    }
    
    // Update the display in the header
    const weekElement = document.getElementById('currentWeek');
    const dayElement = document.getElementById('currentDay');
    
    if (weekElement) {
        weekElement.textContent = `Week ${currentWeek}`;
    }
    if (dayElement) {
        dayElement.textContent = `Day ${currentDay}`;
    }
}

// ==================== MANUAL DAY CONTROL ====================

/**
 * Check if manual day mode is active
 * Uses the storage module's STORAGE_KEYS constant
 */
function isManualDayMode() {
    // Access localStorage directly using the storage module's key constant
    return localStorage.getItem(STORAGE_KEYS.MANUAL_DAY_MODE) === 'true';
}

/**
 * Set Manual Day
 * 
 * Allows user to manually jump to any day (1-90).
 * Uses the storage module to save the setting.
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
    
    // Save the manual day setting using storage module
    saveManualDay(day);
    
    // Recalculate day (will now use manual mode)
    calculateCurrentDay();
    
    // Refresh all displays to show the new day's data
    updateWorkoutDisplay();
    updateProgress();
    updateManualDayUI();
    updateLinkCompletionStatus();
    
    return true;
}

/**
 * Clear Manual Day Override
 * 
 * Returns to automatic day calculation based on start date.
 * Uses storage module to clear the manual day setting.
 */
function clearManualDay() {
    // Use storage module to clear the manual day setting
    // We access localStorage directly to avoid function name conflicts
    localStorage.removeItem(STORAGE_KEYS.MANUAL_DAY_OVERRIDE);
    localStorage.removeItem(STORAGE_KEYS.MANUAL_DAY_MODE);
    
    // Return to automatic calculation and refresh displays
    calculateCurrentDay();
    updateWorkoutDisplay();
    updateProgress();
    updateManualDayUI();
    updateLinkCompletionStatus();
}

function updateManualDayUI() {
    const manualMode = isManualDayMode();
    const manualDayInput = document.getElementById('manual-day-input');
    const dayModeStatus = document.getElementById('day-mode-status');
    
    if (manualDayInput) {
        if (manualMode) {
            const savedDay = localStorage.getItem('manualDayOverride');
            manualDayInput.value = savedDay || currentDay;
            if (dayModeStatus) {
                dayModeStatus.textContent = `Mode: Manual (Day ${savedDay || currentDay})`;
                dayModeStatus.style.color = '#667eea';
            }
        } else {
            manualDayInput.value = currentDay;
            if (dayModeStatus) {
                dayModeStatus.textContent = 'Mode: Automatic';
                dayModeStatus.style.color = '#666';
            }
        }
    }
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Activate the correct button
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach((btn, index) => {
        if ((tabName === 'workout' && index === 0) || 
            (tabName === 'weight' && index === 1) || 
            (tabName === 'fasting' && index === 2) ||
            (tabName === 'progress' && index === 3)) {
            btn.classList.add('active');
        }
    });
    
    if (tabName === 'weight') {
        updateWeightTable();
    } else if (tabName === 'fasting') {
        updateFastingDisplay();
    } else if (tabName === 'progress') {
        updateProgress();
        updateManualDayUI();
    }
}

function selectDayType(type) {
    // If period is active, force office workout only
    if (isPeriodActive() && type === 'nonoffice') {
        alert('🌸 Period mode is active. Only the 20-minute office workout is available during your period.');
        return;
    }
    
    selectedDayType = type;
    
    // Update button states
    const buttons = document.querySelectorAll('.day-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (type === 'office') {
        buttons[0].classList.add('active');
    } else {
        buttons[1].classList.add('active');
    }
    
    // Show/hide workout sections
    if (type === 'office') {
        document.getElementById('office-workout').classList.remove('hidden');
        document.getElementById('nonoffice-workout').classList.add('hidden');
    } else {
        document.getElementById('office-workout').classList.add('hidden');
        document.getElementById('nonoffice-workout').classList.remove('hidden');
    }
    
    localStorage.setItem('selectedDayType', type);
    loadChecklist();
    updateWorkoutDisplay(); // This will call updateLinkCompletionStatus() at the end
}

function addWeight() {
    const input = document.getElementById('weight-input');
    const weight = parseFloat(input.value);
    
    if (isNaN(weight) || weight <= 0 || weight > 200) {
        alert('Please enter a valid weight between 1 and 200 kg');
        return;
    }
    
    const weights = getWeights();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if weight already exists for today
    if (weights[today]) {
        const overwrite = confirm(`You already logged weight for today (${weights[today].weight} kg).\n\nDo you want to update it to ${weight} kg?`);
        if (!overwrite) {
            return;
        }
    }
    
    weights[today] = {
        weight: weight,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    localStorage.setItem('weights', JSON.stringify(weights));
    input.value = '';
    
    updateWeightTable();
    updateProgress();
}

function getWeights() {
    const saved = localStorage.getItem('weights');
    return saved ? JSON.parse(saved) : {};
}

function deleteWeight(date) {
    const confirmed = confirm('Are you sure you want to delete this weight entry?');
    if (confirmed) {
        const weights = getWeights();
        delete weights[date];
        localStorage.setItem('weights', JSON.stringify(weights));
        updateWeightTable();
        updateProgress();
    }
}

function updateWeightTable() {
    const weights = getWeights();
    const tbody = document.getElementById('weight-table-body');
    tbody.innerHTML = '';
    
    const startingWeight = 83.0;
    
    // Get all entries, sort by date (newest first)
    const entries = Object.entries(weights)
        .map(([date, data]) => ({
            date: date,
            weight: typeof data === 'object' ? data.weight : data,
            timestamp: typeof data === 'object' ? (data.timestamp || new Date(date).getTime()) : new Date(date).getTime()
        }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 30); // Show last 30 entries
    
    if (entries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">No weight entries yet. Add your first weight!</td></tr>';
    } else {
        let previousWeight = startingWeight;
        
        entries.forEach((entry, index) => {
            const row = document.createElement('tr');
            const dateObj = new Date(entry.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const change = index < entries.length - 1 
                ? (previousWeight - entry.weight).toFixed(1)
                : (startingWeight - entry.weight).toFixed(1);
            
            const totalLost = (startingWeight - entry.weight).toFixed(1);
            const changeStr = parseFloat(change) > 0 ? `-${change}` : (parseFloat(change) < 0 ? `+${Math.abs(change)}` : '0.0');
            
            row.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${entry.weight.toFixed(1)}</strong></td>
                <td style="color: ${parseFloat(change) > 0 ? '#28a745' : parseFloat(change) < 0 ? '#dc3545' : '#666'};">${changeStr}</td>
                <td><strong>${totalLost}</strong></td>
                <td><button onclick="deleteWeight('${entry.date}')" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Delete</button></td>
            `;
            
            tbody.appendChild(row);
            previousWeight = entry.weight;
        });
    }
    
    // Update progress bar
    const latestEntry = entries.length > 0 ? entries[0] : null;
    const latestWeight = latestEntry ? latestEntry.weight : startingWeight;
    
    const progress = ((startingWeight - latestWeight) / 13) * 100;
    const progressBar = document.getElementById('weight-progress');
    progressBar.style.width = Math.max(0, Math.min(100, progress)) + '%';
    progressBar.textContent = Math.round(Math.max(0, Math.min(100, progress))) + '%';
    
    // Update weekly summary
    updateWeeklySummary(weights);
}

function updateWeeklySummary(weights) {
    const summaryDiv = document.getElementById('weekly-summary');
    const startingWeight = 83.0;
    
    // Group weights by week
    const weeklyData = {};
    
    Object.entries(weights).forEach(([date, data]) => {
        const weight = typeof data === 'object' ? data.weight : data;
        const dateObj = new Date(date);
        const weekStart = new Date(startDate);
        const daysDiff = Math.floor((dateObj - weekStart) / (1000 * 60 * 60 * 24));
        const weekNum = Math.ceil((daysDiff + 1) / 7);
        
        if (weekNum >= 1 && weekNum <= 12) {
            if (!weeklyData[weekNum]) {
                weeklyData[weekNum] = [];
            }
            weeklyData[weekNum].push({ date, weight });
        }
    });
    
    let summaryHTML = '<div style="font-size: 14px;">';
    
    for (let week = 1; week <= 12; week++) {
        if (weeklyData[week] && weeklyData[week].length > 0) {
            const weekWeights = weeklyData[week].map(w => w.weight);
            const avgWeight = (weekWeights.reduce((a, b) => a + b, 0) / weekWeights.length).toFixed(1);
            const firstWeight = weekWeights[weekWeights.length - 1]; // First entry of week
            const lastWeight = weekWeights[0]; // Last entry of week
            const weekChange = (firstWeight - lastWeight).toFixed(1);
            
            summaryHTML += `
                <div style="padding: 8px; background: #f9f9f9; border-radius: 5px; margin-bottom: 5px;">
                    <strong>Week ${week}:</strong> ${lastWeight.toFixed(1)} kg 
                    ${weekChange != 0 ? `(${weekChange > 0 ? '-' : '+'}${Math.abs(weekChange)} kg)` : ''}
                    <span style="color: #666; font-size: 12px;">| Avg: ${avgWeight} kg</span>
                </div>
            `;
        }
    }
    
    if (summaryHTML === '<div style="font-size: 14px;">') {
        summaryHTML += '<div style="color: #999; text-align: center; padding: 10px;">No weekly data yet</div>';
    }
    
    summaryHTML += '</div>';
    summaryDiv.innerHTML = summaryHTML;
}

function markWorkoutComplete() {
    const workouts = getCompletedWorkouts();
    const dateKey = new Date().toISOString().split('T')[0];
    
    if (!workouts[dateKey]) {
        workouts[dateKey] = {
            completed: true,
            type: selectedDayType,
            date: dateKey
        };
        localStorage.setItem('completedWorkouts', JSON.stringify(workouts));
        updateProgress();
    }
}

function getCompletedWorkouts() {
    const saved = localStorage.getItem('completedWorkouts');
    return saved ? JSON.parse(saved) : {};
}

function saveChecklist() {
    const checklist = {
        office: {
            warmup: document.getElementById('office-warmup-check').checked,
            main: document.getElementById('office-main-check').checked,
            done: document.getElementById('office-done-check').checked
        },
        nonoffice: {
            warmup: document.getElementById('nonoffice-warmup-check').checked,
            main: document.getElementById('nonoffice-main-check').checked,
            cooldown: document.getElementById('nonoffice-cooldown-check').checked,
            done: document.getElementById('nonoffice-done-check').checked
        },
        date: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem('checklist', JSON.stringify(checklist));
}

function loadChecklist() {
    const saved = localStorage.getItem('checklist');
    if (!saved) return;
    
    const checklist = JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    
    // Only load if it's from today
    if (checklist.date === today) {
        if (selectedDayType === 'office') {
            document.getElementById('office-warmup-check').checked = checklist.office.warmup;
            document.getElementById('office-main-check').checked = checklist.office.main;
            document.getElementById('office-done-check').checked = checklist.office.done;
        } else {
            document.getElementById('nonoffice-warmup-check').checked = checklist.nonoffice.warmup;
            document.getElementById('nonoffice-main-check').checked = checklist.nonoffice.main;
            document.getElementById('nonoffice-cooldown-check').checked = checklist.nonoffice.cooldown;
            document.getElementById('nonoffice-done-check').checked = checklist.nonoffice.done;
        }
    }
}

function updateProgress() {
    const workouts = getCompletedWorkouts();
    const workoutCount = Object.keys(workouts).length;
    
    const weights = getWeights();
    
    // Get latest weight from daily entries
    let latestWeight = 83.0;
    if (Object.keys(weights).length > 0) {
        const entries = Object.entries(weights)
            .map(([date, data]) => ({
                date: date,
                weight: typeof data === 'object' ? data.weight : data,
                timestamp: typeof data === 'object' ? (data.timestamp || new Date(date).getTime()) : new Date(date).getTime()
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
        
        if (entries.length > 0) {
            latestWeight = entries[0].weight;
        }
    }
    
    const totalLost = 83.0 - latestWeight;
    const completionRate = Math.round((workoutCount / currentDay) * 100);
    const overallProgress = ((83.0 - latestWeight) / 13) * 100;
    const daysRemaining = Math.max(0, 90 - currentDay);
    
    document.getElementById('workouts-completed').textContent = workoutCount;
    document.getElementById('completion-rate').textContent = completionRate + '%';
    document.getElementById('current-weight-display').textContent = latestWeight.toFixed(1);
    document.getElementById('total-lost').textContent = totalLost.toFixed(1);
    document.getElementById('days-remaining').textContent = daysRemaining;
    
    const overallProgressBar = document.getElementById('overall-progress');
    overallProgressBar.style.width = Math.max(0, Math.min(100, overallProgress)) + '%';
    overallProgressBar.textContent = Math.round(Math.max(0, Math.min(100, overallProgress))) + '%';
}

function loadSavedData() {
    // Load selected day type
    const savedType = localStorage.getItem('selectedDayType');
    
    // If period is active, force office workout
    if (isPeriodActive()) {
        selectedDayType = 'office';
        localStorage.setItem('selectedDayType', 'office');
    } else if (savedType) {
        selectedDayType = savedType;
    }
    
    selectDayType(selectedDayType);
    loadChecklist();
}

function updateDisplay() {
    calculateCurrentDay();
    updateWeightTable();
    updateProgress();
}

// Track workout link clicks - per day
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('workout-link')) {
        // Mark link as visited for current day
        const linkType = e.target.getAttribute('data-type');
        const visitedLinks = JSON.parse(localStorage.getItem('visitedLinks') || '{}');
        const dayKey = `day${currentDay}`;
        
        if (!visitedLinks[dayKey]) {
            visitedLinks[dayKey] = {};
        }
        visitedLinks[dayKey][linkType] = true;
        localStorage.setItem('visitedLinks', JSON.stringify(visitedLinks));
        e.target.classList.add('completed');
    }
});

// Load visited links for current day
function updateLinkCompletionStatus() {
    const visitedLinks = JSON.parse(localStorage.getItem('visitedLinks') || '{}');
    const dayKey = `day${currentDay}`;
    const dayLinks = visitedLinks[dayKey] || {};
    
    document.querySelectorAll('.workout-link').forEach(link => {
        const linkType = link.getAttribute('data-type');
        // Remove completed class first
        link.classList.remove('completed');
        // Add completed class if this link was visited today
        if (dayLinks[linkType]) {
            link.classList.add('completed');
        }
    });
}

// Load visited links on page load
window.addEventListener('load', function() {
    updateLinkCompletionStatus();
});

function resetApp() {
    // Show confirmation dialog
    const confirmed = confirm(
        '⚠️ WARNING: This will delete ALL your data!\n\n' +
        'This includes:\n' +
        '• All workout completions\n' +
        '• All weight entries\n' +
        '• All progress data\n' +
        '• Daily checklists\n\n' +
        'Are you absolutely sure you want to reset?\n\n' +
        'Click OK to reset, or Cancel to keep your data.'
    );
    
    if (confirmed) {
        // Double confirmation
        const doubleConfirm = confirm(
            'Last chance! This action cannot be undone.\n\n' +
            'Are you REALLY sure you want to delete everything?\n\n' +
            'Click OK to proceed with reset.'
        );
        
        if (doubleConfirm) {
            // Clear all localStorage data
            localStorage.removeItem('weights');
            localStorage.removeItem('completedWorkouts');
            localStorage.removeItem('checklist');
            localStorage.removeItem('startDate');
            localStorage.removeItem('selectedDayType');
            localStorage.removeItem('visitedLinks');
            localStorage.removeItem('fastingData');
            localStorage.removeItem('activeFasting');
            localStorage.removeItem('periodData');
            localStorage.removeItem('manualDayOverride');
            localStorage.removeItem('manualDayMode');
            
            // Reset start date to today
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            localStorage.setItem('startDate', startDate.toISOString());
            
            // Reset UI
            selectedDayType = 'nonoffice';
            
            // Clear checklists
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            
            // Clear weight input
            document.getElementById('weight-input').value = '';
            
            // Reset display
            calculateCurrentDay();
            updateWeightTable();
            updateProgress();
            updatePeriodDisplay();
            updateFastingDisplay();
            updateWorkoutDisplay();
            updateManualDayUI();
            
            // Reset day type selector
            selectDayType('nonoffice');
            
            // Show success message
            alert('✅ App reset successfully!\n\nYour journey starts fresh from today (Day 1).');
            
            // Refresh to ensure clean state
            location.reload();
        }
    }
}

// ==================== FASTING TRACKER ====================

let fastingTimerInterval = null;
let currentFastingStart = null;

function getFastingData() {
    const saved = localStorage.getItem('fastingData');
    return saved ? JSON.parse(saved) : {};
}

function saveFastingData(data) {
    localStorage.setItem('fastingData', JSON.stringify(data));
}

function formatDuration(hours, minutes, seconds) {
    const h = String(Math.floor(hours)).padStart(2, '0');
    const m = String(Math.floor(minutes)).padStart(2, '0');
    const s = String(Math.floor(seconds)).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function formatTime(hours, minutes) {
    const h = String(Math.floor(hours)).padStart(2, '0');
    const m = String(Math.floor(minutes)).padStart(2, '0');
    return `${h}:${m}`;
}

function startFasting() {
    const now = new Date();
    currentFastingStart = now.getTime();
    
    // Save active fasting session
    localStorage.setItem('activeFasting', JSON.stringify({
        startTime: currentFastingStart,
        startDate: now.toISOString().split('T')[0]
    }));
    
    // Update UI
    document.getElementById('start-fasting-btn').style.display = 'none';
    document.getElementById('end-fasting-btn').style.display = 'block';
    
    // Start timer
    if (fastingTimerInterval) {
        clearInterval(fastingTimerInterval);
    }
    fastingTimerInterval = setInterval(updateFastingTimer, 1000);
    updateFastingTimer();
}

function endFasting() {
    if (!currentFastingStart) {
        const active = localStorage.getItem('activeFasting');
        if (active) {
            const activeData = JSON.parse(active);
            currentFastingStart = new Date(activeData.startTime).getTime();
        } else {
            alert('No active fasting session found.');
            return;
        }
    }
    
    const now = new Date();
    const endTime = now.getTime();
    const duration = (endTime - currentFastingStart) / 1000; // in seconds
    const hours = duration / 3600;
    const minutes = (duration % 3600) / 60;
    
    const startDate = new Date(currentFastingStart);
    const dateKey = startDate.toISOString().split('T')[0];
    const startTimeStr = formatTime(startDate.getHours(), startDate.getMinutes());
    const endTimeStr = formatTime(now.getHours(), now.getMinutes());
    
    // Save fasting session
    const fastingData = getFastingData();
    if (!fastingData[dateKey]) {
        fastingData[dateKey] = [];
    }
    
    fastingData[dateKey].push({
        startTime: startTimeStr,
        endTime: endTimeStr,
        duration: hours,
        startTimestamp: currentFastingStart,
        endTimestamp: endTime
    });
    
    saveFastingData(fastingData);
    
    // Clear active fasting
    localStorage.removeItem('activeFasting');
    currentFastingStart = null;
    
    // Stop timer
    if (fastingTimerInterval) {
        clearInterval(fastingTimerInterval);
        fastingTimerInterval = null;
    }
    
    // Update UI
    document.getElementById('start-fasting-btn').style.display = 'block';
    document.getElementById('end-fasting-btn').style.display = 'none';
    document.getElementById('fasting-timer').textContent = '00:00:00';
    
    updateFastingDisplay();
}

function updateFastingTimer() {
    if (!currentFastingStart) {
        const active = localStorage.getItem('activeFasting');
        if (active) {
            const activeData = JSON.parse(active);
            currentFastingStart = new Date(activeData.startTime).getTime();
        } else {
            if (fastingTimerInterval) {
                clearInterval(fastingTimerInterval);
                fastingTimerInterval = null;
            }
            return;
        }
    }
    
    const now = new Date().getTime();
    const elapsed = (now - currentFastingStart) / 1000; // in seconds
    const hours = elapsed / 3600;
    const minutes = (elapsed % 3600) / 60;
    const seconds = elapsed % 60;
    
    document.getElementById('fasting-timer').textContent = formatDuration(hours, minutes, seconds);
}

function addManualFasting() {
    const startTimeInput = document.getElementById('fasting-start-time').value;
    const endTimeInput = document.getElementById('fasting-end-time').value;
    
    if (!startTimeInput || !endTimeInput) {
        alert('Please enter both start and end times.');
        return;
    }
    
    const [startHour, startMin] = startTimeInput.split(':').map(Number);
    const [endHour, endMin] = endTimeInput.split(':').map(Number);
    
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMin);
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMin);
    
    if (endDate <= startDate) {
        // Assume it's next day
        endDate.setDate(endDate.getDate() + 1);
    }
    
    const duration = (endDate - startDate) / (1000 * 60 * 60); // in hours
    const dateKey = startDate.toISOString().split('T')[0];
    const startTimeStr = formatTime(startHour, startMin);
    const endTimeStr = formatTime(endHour, endMin);
    
    // Save fasting session
    const fastingData = getFastingData();
    if (!fastingData[dateKey]) {
        fastingData[dateKey] = [];
    }
    
    fastingData[dateKey].push({
        startTime: startTimeStr,
        endTime: endTimeStr,
        duration: duration,
        startTimestamp: startDate.getTime(),
        endTimestamp: endDate.getTime()
    });
    
    saveFastingData(fastingData);
    
    // Clear inputs
    document.getElementById('fasting-start-time').value = '';
    document.getElementById('fasting-end-time').value = '';
    
    updateFastingDisplay();
}

function deleteFasting(date, index) {
    const confirmed = confirm('Are you sure you want to delete this fasting entry?');
    if (confirmed) {
        const fastingData = getFastingData();
        if (fastingData[date] && fastingData[date][index]) {
            fastingData[date].splice(index, 1);
            if (fastingData[date].length === 0) {
                delete fastingData[date];
            }
            saveFastingData(fastingData);
            updateFastingDisplay();
        }
    }
}

function updateFastingDisplay() {
    const fastingData = getFastingData();
    const today = new Date().toISOString().split('T')[0];
    
    // Check for active fasting
    const active = localStorage.getItem('activeFasting');
    if (active) {
        const activeData = JSON.parse(active);
        if (activeData.startDate === today) {
            currentFastingStart = new Date(activeData.startTime).getTime();
            document.getElementById('start-fasting-btn').style.display = 'none';
            document.getElementById('end-fasting-btn').style.display = 'block';
            if (!fastingTimerInterval) {
                fastingTimerInterval = setInterval(updateFastingTimer, 1000);
            }
            updateFastingTimer();
        }
    }
    
    // Update today's fasting display
    const todayFasting = fastingData[today] || [];
    const todayDisplay = document.getElementById('today-fasting-display');
    if (todayFasting.length === 0) {
        todayDisplay.innerHTML = 'No fasting logged for today';
    } else {
        const totalHours = todayFasting.reduce((sum, session) => sum + session.duration, 0);
        todayDisplay.innerHTML = `
            <strong>Total: ${totalHours.toFixed(1)} hours</strong><br>
            <span style="font-size: 12px; color: #999;">${todayFasting.length} session${todayFasting.length > 1 ? 's' : ''}</span>
        `;
    }
    
    // Update history table
    const tbody = document.getElementById('fasting-table-body');
    tbody.innerHTML = '';
    
    // Get all entries, sort by date (newest first)
    const allEntries = [];
    Object.entries(fastingData).forEach(([date, sessions]) => {
        sessions.forEach((session, index) => {
            allEntries.push({
                date: date,
                index: index,
                ...session,
                timestamp: session.endTimestamp || new Date(date).getTime()
            });
        });
    });
    
    allEntries.sort((a, b) => b.timestamp - a.timestamp).slice(0, 30).forEach(entry => {
        const row = document.createElement('tr');
        const dateObj = new Date(entry.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const durationStr = `${entry.duration.toFixed(1)}h`;
        
        row.innerHTML = `
            <td>${dateStr}</td>
            <td>${entry.startTime}</td>
            <td>${entry.endTime}</td>
            <td><strong>${durationStr}</strong></td>
            <td><button onclick="deleteFasting('${entry.date}', ${entry.index})" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
    
    if (allEntries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">No fasting entries yet. Start your first fast!</td></tr>';
    }
    
    // Update weekly summary
    updateFastingWeeklySummary(fastingData);
}

function updateFastingWeeklySummary(fastingData) {
    const summaryDiv = document.getElementById('fasting-weekly-summary');
    const weeklyData = {};
    
    Object.entries(fastingData).forEach(([date, sessions]) => {
        const dateObj = new Date(date);
        const weekStart = new Date(startDate);
        const daysDiff = Math.floor((dateObj - weekStart) / (1000 * 60 * 60 * 24));
        const weekNum = Math.ceil((daysDiff + 1) / 7);
        
        if (weekNum >= 1 && weekNum <= 12) {
            if (!weeklyData[weekNum]) {
                weeklyData[weekNum] = [];
            }
            sessions.forEach(session => {
                weeklyData[weekNum].push(session.duration);
            });
        }
    });
    
    let summaryHTML = '<div style="font-size: 14px;">';
    
    for (let week = 1; week <= 12; week++) {
        if (weeklyData[week] && weeklyData[week].length > 0) {
            const totalHours = weeklyData[week].reduce((a, b) => a + b, 0);
            const avgHours = (totalHours / weeklyData[week].length).toFixed(1);
            const totalHoursStr = totalHours.toFixed(1);
            
            summaryHTML += `
                <div style="padding: 8px; background: #f9f9f9; border-radius: 5px; margin-bottom: 5px;">
                    <strong>Week ${week}:</strong> ${totalHoursStr} hours total
                    <span style="color: #666; font-size: 12px;">| Avg: ${avgHours}h per session</span>
                </div>
            `;
        }
    }
    
    if (summaryHTML === '<div style="font-size: 14px;">') {
        summaryHTML += '<div style="color: #999; text-align: center; padding: 10px;">No weekly data yet</div>';
    }
    
    summaryHTML += '</div>';
    summaryDiv.innerHTML = summaryHTML;
}

// ==================== PERIOD TRACKER ====================

function getPeriodData() {
    const saved = localStorage.getItem('periodData');
    return saved ? JSON.parse(saved) : { active: false, startDate: null, endDate: null };
}

function savePeriodData(data) {
    localStorage.setItem('periodData', JSON.stringify(data));
}

function isPeriodActive() {
    const periodData = getPeriodData();
    if (!periodData.active) return false;
    
    const today = new Date().toISOString().split('T')[0];
    const startDate = periodData.startDate;
    const endDate = periodData.endDate || startDate; // If no end date, assume single day
    
    return today >= startDate && today <= endDate;
}

function togglePeriod() {
    const periodData = getPeriodData();
    const today = new Date().toISOString().split('T')[0];
    
    if (periodData.active && isPeriodActive()) {
        // End period
        periodData.active = false;
        periodData.endDate = today;
    } else {
        // Start period
        periodData.active = true;
        periodData.startDate = today;
        periodData.endDate = null;
        // Force office workout when period starts
        selectedDayType = 'office';
        localStorage.setItem('selectedDayType', 'office');
    }
    
    savePeriodData(periodData);
    updatePeriodDisplay();
    updateDayTypeButtons(); // Update button states and visibility
    selectDayType(selectedDayType); // Refresh workout display
    updateWorkoutDisplay(); // Refresh workout display to show period-appropriate exercises
}

function updatePeriodDisplay() {
    const isActive = isPeriodActive();
    const periodIndicator = document.getElementById('period-indicator');
    const periodStatusText = document.getElementById('period-status-text');
    const periodToggleBtn = document.getElementById('period-toggle-btn');
    
    if (isActive) {
        periodIndicator.classList.remove('hidden');
        periodStatusText.textContent = 'Period: On';
        periodToggleBtn.style.background = '#ffc107';
        periodToggleBtn.style.color = '#333';
    } else {
        periodIndicator.classList.add('hidden');
        periodStatusText.textContent = 'Period: Off';
        periodToggleBtn.style.background = '#f5f5f5';
        periodToggleBtn.style.color = '#333';
    }
    
    // Update day type buttons based on period status
    updateDayTypeButtons();
}

function updateDayTypeButtons() {
    const isActive = isPeriodActive();
    const buttons = document.querySelectorAll('.day-btn');
    const nonOfficeBtn = buttons[1]; // Non-office button is the second one
    
    if (isActive) {
        // Disable and hide non-office button during period
        nonOfficeBtn.style.display = 'none';
        nonOfficeBtn.style.pointerEvents = 'none';
        nonOfficeBtn.style.opacity = '0.5';
        
        // Ensure office is selected
        if (selectedDayType !== 'office') {
            selectedDayType = 'office';
            localStorage.setItem('selectedDayType', 'office');
            selectDayType('office');
        }
    } else {
        // Show and enable non-office button when period is off
        nonOfficeBtn.style.display = 'block';
        nonOfficeBtn.style.pointerEvents = 'auto';
        nonOfficeBtn.style.opacity = '1';
    }
}

// ==================== PERIOD WORKOUTS ====================

const periodWorkouts = {
    office: {
        warmup: [
            { name: "5-Min Gentle Warm-Up", url: "https://www.youtube.com/watch?v=3qyWpJ34dWw" }
        ],
        main: [
            { name: "15-Min Gentle Yoga Flow", url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" },
            { name: "10-Min Light Stretching", url: "https://www.youtube.com/watch?v=DppDOK2SvP0" }
        ]
    },
    nonoffice: {
        warmup: [
            { name: "5-Min Gentle Warm-Up", url: "https://www.youtube.com/watch?v=f3zOrYCwquE" }
        ],
        main: [
            { name: "30-Min Gentle Yoga for Periods", url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" },
            { name: "20-Min Light Walking Workout", url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" },
            { name: "25-Min Restorative Stretching", url: "https://www.youtube.com/watch?v=DppDOK2SvP0" }
        ],
        cooldown: [
            { name: "15-Min Gentle Stretch & Relaxation", url: "https://www.youtube.com/watch?v=DppDOK2SvP0" },
            { name: "20-Min Restorative Yoga", url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" }
        ]
    }
};

function updateWorkoutDisplay() {
    const isActive = isPeriodActive();
    const workoutSection = selectedDayType === 'office' ? 
        document.getElementById('office-workout') : 
        document.getElementById('nonoffice-workout');
    
    if (!workoutSection) return;
    
    // Get workouts to show - use period workouts if active, otherwise use regular workouts
    // Fallback to week 1 if current week doesn't exist
    let workoutsToShow;
    if (isActive) {
        workoutsToShow = periodWorkouts[selectedDayType];
    } else {
        const weekData = workoutData.weeks[currentWeek];
        if (weekData && weekData[selectedDayType]) {
            workoutsToShow = weekData[selectedDayType];
        } else {
            // Fallback to week 1
            workoutsToShow = workoutData.weeks[1][selectedDayType];
        }
    }
    
    if (!workoutsToShow) return;
    
    // Helper function to get exercise for today - cycles through all options without repeating
    function getExerciseForToday(exerciseArray, categoryName) {
        if (!exerciseArray || exerciseArray.length === 0) return null;
        // Use currentDay to cycle through exercises, ensuring no repeat until all are used
        const index = (currentDay - 1) % exerciseArray.length;
        return exerciseArray[index];
    }
    
    // Collect all main exercise categories for rotation (main, HIIT, sprint, resistance)
    const allMainCategories = [];
    if (workoutsToShow.main) {
        workoutsToShow.main.forEach(ex => allMainCategories.push({...ex, category: 'main'}));
    }
    if (workoutsToShow.hiit) {
        workoutsToShow.hiit.forEach(ex => allMainCategories.push({...ex, category: 'hiit'}));
    }
    if (workoutsToShow.sprint) {
        workoutsToShow.sprint.forEach(ex => allMainCategories.push({...ex, category: 'sprint'}));
    }
    if (workoutsToShow.resistance) {
        workoutsToShow.resistance.forEach(ex => allMainCategories.push({...ex, category: 'resistance'}));
    }
    
    // Get today's main exercise (rotates through all categories)
    const selectedMainExercise = allMainCategories.length > 0 
        ? allMainCategories[(currentDay - 1) % allMainCategories.length]
        : null;
    
    // Get today's warmup
    const selectedWarmup = getExerciseForToday(workoutsToShow.warmup, 'warmup');
    
    // Get today's cooldown (only for non-office)
    const selectedCooldown = selectedDayType === 'nonoffice' 
        ? getExerciseForToday(workoutsToShow.cooldown, 'cooldown')
        : null;
    
    // Update warmup - show only one
    const warmupGroup = workoutSection.querySelector('.link-group:first-of-type');
    if (warmupGroup && workoutsToShow.warmup) {
        const warmupLinks = warmupGroup.querySelectorAll('.workout-link');
        // Hide all warmup links first
        warmupLinks.forEach(link => {
            link.style.display = 'none';
        });
        // Show only the selected one
        if (selectedWarmup && warmupLinks[0]) {
            warmupLinks[0].style.display = 'block';
            warmupLinks[0].href = selectedWarmup.url;
            warmupLinks[0].textContent = `✅ ${selectedWarmup.name}`;
            warmupLinks[0].setAttribute('data-type', `${selectedDayType}-warmup-day${currentDay}`);
        }
        // Update warmup title
        const warmupH3 = warmupGroup.querySelector('h3');
        if (warmupH3) {
            warmupH3.textContent = '🌡️ Warm-Up (Today\'s Exercise)';
        }
    }
    
    // Find all main workout groups
    const mainGroups = workoutSection.querySelectorAll('.link-group');
    const groupIndices = {
        main: -1,
        hiit: -1,
        sprint: -1,
        resistance: -1
    };
    
    mainGroups.forEach((group, idx) => {
        const h3 = group.querySelector('h3');
        if (h3) {
            const text = h3.textContent;
            if (text.includes('Main') || text.includes('💪')) {
                groupIndices.main = idx;
            } else if (text.includes('HIIT') || text.includes('⚡')) {
                groupIndices.hiit = idx;
            } else if (text.includes('Sprint') || text.includes('🏃')) {
                groupIndices.sprint = idx;
            } else if (text.includes('Resistance') || text.includes('🏋️')) {
                groupIndices.resistance = idx;
            }
        }
    });
    
    // Hide all main workout groups first
    Object.values(groupIndices).forEach(idx => {
        if (idx >= 0) {
            const group = mainGroups[idx];
            const links = group.querySelectorAll('.workout-link');
            links.forEach(link => {
                link.style.display = 'none';
            });
            // Hide the entire group if it's not the selected category
            if (selectedMainExercise && idx !== groupIndices[selectedMainExercise.category]) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        }
    });
    
    // Show only the selected main exercise
    if (selectedMainExercise && groupIndices[selectedMainExercise.category] >= 0) {
        const selectedGroup = mainGroups[groupIndices[selectedMainExercise.category]];
        const selectedLinks = selectedGroup.querySelectorAll('.workout-link');
        
        // Show only the first link with the selected exercise
        if (selectedLinks[0]) {
            selectedLinks[0].style.display = 'block';
            selectedLinks[0].href = selectedMainExercise.url;
            selectedLinks[0].textContent = `✅ ${selectedMainExercise.name}`;
            selectedLinks[0].setAttribute('data-type', `${selectedDayType}-${selectedMainExercise.category}-day${currentDay}`);
        }
        
        // Update the group title to show it's today's main workout
        const h3 = selectedGroup.querySelector('h3');
        if (h3) {
            const categoryNames = {
                main: '💪 Main Workout',
                hiit: '⚡ HIIT Workout',
                sprint: '🏃 Sprint Training',
                resistance: '🏋️ Resistance Training'
            };
            h3.textContent = categoryNames[selectedMainExercise.category] || h3.textContent;
        }
    }
    
    // Update cooldown - show only one (for non-office only)
    if (selectedDayType === 'nonoffice' && workoutsToShow.cooldown) {
        let cooldownIndex = -1;
        mainGroups.forEach((group, idx) => {
            const h3 = group.querySelector('h3');
            if (h3 && (h3.textContent.includes('Cool-Down') || h3.textContent.includes('🧘'))) {
                cooldownIndex = idx;
            }
        });
        
        if (cooldownIndex >= 0) {
            const cooldownGroup = mainGroups[cooldownIndex];
            const cooldownLinks = cooldownGroup.querySelectorAll('.workout-link');
            // Hide all cooldown links first
            cooldownLinks.forEach(link => {
                link.style.display = 'none';
            });
            // Show only the selected one
            if (selectedCooldown && cooldownLinks[0]) {
                cooldownLinks[0].style.display = 'block';
                cooldownLinks[0].href = selectedCooldown.url;
                cooldownLinks[0].textContent = `✅ ${selectedCooldown.name}`;
                cooldownLinks[0].setAttribute('data-type', `${selectedDayType}-cooldown-day${currentDay}`);
            }
            // Update cooldown title
            const cooldownH3 = cooldownGroup.querySelector('h3');
            if (cooldownH3) {
                cooldownH3.textContent = '🧘 Cool-Down (Today\'s Exercise)';
            }
        }
    }
    
    // Update link completion status after workout display is updated
    updateLinkCompletionStatus();
}


// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/fitness-tracker/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}


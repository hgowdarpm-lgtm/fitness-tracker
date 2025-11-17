// Initialize app
let startDate = new Date();
startDate.setHours(0, 0, 0, 0);
let currentWeek = 1;
let currentDay = 1;
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
                    { name: "40-Min Upper Body Strength (Dumbbells)", url: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo" },
                    { name: "45-Min Lower Body & Glutes (Dumbbells)", url: "https://www.youtube.com/watch?v=DENm10PI8Xc" },
                    { name: "30-Min Core & Cardio Workout", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" }
                ],
                sprint: [
                    { name: "15-Min Sprint Interval Training", url: "https://www.youtube.com/watch?v=HhdYlniTjvg" },
                    { name: "20-Min HIIT Sprint Workout", url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" },
                    { name: "10-Min Quick Sprint Burst", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" }
                ],
                resistance: [
                    { name: "30-Min Full Body Resistance Training", url: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo" },
                    { name: "25-Min Bodyweight Resistance Workout", url: "https://www.youtube.com/watch?v=DENm10PI8Xc" },
                    { name: "35-Min Dumbbell Resistance Training", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" }
                ],
                hiit: [
                    { name: "20-Min Full Body HIIT (No Equipment)", url: "https://www.youtube.com/watch?v=HhdYlniTjvg" },
                    { name: "25-Min High-Intensity Interval Training", url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" },
                    { name: "15-Min Quick HIIT Workout", url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" },
                    { name: "30-Min HIIT Cardio & Strength", url: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo" }
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    calculateCurrentDay();
    updateDisplay();
    updateWeightTable();
    updateProgress();
    updatePeriodDisplay();
    updateFastingDisplay();
    updateDayTypeButtons(); // Update button visibility based on period status
    updateWorkoutDisplay();
});

function calculateCurrentDay() {
    const saved = localStorage.getItem('startDate');
    if (saved) {
        startDate = new Date(saved);
    } else {
        localStorage.setItem('startDate', startDate.toISOString());
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    currentDay = Math.max(1, Math.min(90, diffDays));
    currentWeek = Math.ceil(currentDay / 7);
    
    document.getElementById('currentWeek').textContent = `Week ${currentWeek}`;
    document.getElementById('currentDay').textContent = `Day ${currentDay}`;
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
    updateWorkoutDisplay();
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

// Track workout link clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('workout-link')) {
        // Mark link as visited in local storage
        const linkType = e.target.getAttribute('data-type');
        const visitedLinks = JSON.parse(localStorage.getItem('visitedLinks') || '{}');
        visitedLinks[linkType] = true;
        localStorage.setItem('visitedLinks', JSON.stringify(visitedLinks));
        e.target.classList.add('completed');
    }
});

// Load visited links on page load
window.addEventListener('load', function() {
    const visitedLinks = JSON.parse(localStorage.getItem('visitedLinks') || '{}');
    document.querySelectorAll('.workout-link').forEach(link => {
        const linkType = link.getAttribute('data-type');
        if (visitedLinks[linkType]) {
            link.classList.add('completed');
        }
    });
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
    
    // Update warmup links
    const warmupGroup = workoutSection.querySelector('.link-group:first-of-type');
    if (warmupGroup && workoutsToShow.warmup) {
        const warmupLinks = warmupGroup.querySelectorAll('.workout-link');
        workoutsToShow.warmup.forEach((workout, index) => {
            if (warmupLinks[index]) {
                warmupLinks[index].href = workout.url;
                warmupLinks[index].textContent = `✅ ${workout.name}`;
                warmupLinks[index].setAttribute('data-type', `${selectedDayType}-warmup${index > 0 ? index + 1 : ''}`);
            }
        });
    }
    
    // Update main workout links
    const mainGroups = workoutSection.querySelectorAll('.link-group');
    let mainIndex = -1;
    mainGroups.forEach((group, idx) => {
        const h3 = group.querySelector('h3');
        if (h3 && (h3.textContent.includes('Main') || h3.textContent.includes('💪'))) {
            mainIndex = idx;
        }
    });
    
    if (mainIndex >= 0 && workoutsToShow.main) {
        const mainGroup = mainGroups[mainIndex];
        const mainLinks = mainGroup.querySelectorAll('.workout-link');
        workoutsToShow.main.forEach((workout, index) => {
            if (mainLinks[index]) {
                mainLinks[index].href = workout.url;
                mainLinks[index].textContent = `✅ ${workout.name}`;
                mainLinks[index].setAttribute('data-type', `${selectedDayType}-main${index > 0 ? index + 1 : ''}`);
            }
        });
    }
    
    // Update HIIT links (for non-office)
    if (selectedDayType === 'nonoffice' && workoutsToShow.hiit) {
        let hiitIndex = -1;
        mainGroups.forEach((group, idx) => {
            const h3 = group.querySelector('h3');
            if (h3 && (h3.textContent.includes('HIIT') || h3.textContent.includes('⚡'))) {
                hiitIndex = idx;
            }
        });
        
        if (hiitIndex >= 0) {
            const hiitGroup = mainGroups[hiitIndex];
            const hiitLinks = hiitGroup.querySelectorAll('.workout-link');
            workoutsToShow.hiit.forEach((workout, index) => {
                if (hiitLinks[index]) {
                    hiitLinks[index].href = workout.url;
                    hiitLinks[index].textContent = `✅ ${workout.name}`;
                    hiitLinks[index].setAttribute('data-type', `${selectedDayType}-hiit${index > 0 ? index + 1 : ''}`);
                }
            });
        }
    }
    
    // Update sprint links (for non-office)
    if (selectedDayType === 'nonoffice' && workoutsToShow.sprint) {
        let sprintIndex = -1;
        mainGroups.forEach((group, idx) => {
            const h3 = group.querySelector('h3');
            if (h3 && (h3.textContent.includes('Sprint') || h3.textContent.includes('🏃'))) {
                sprintIndex = idx;
            }
        });
        
        if (sprintIndex >= 0) {
            const sprintGroup = mainGroups[sprintIndex];
            const sprintLinks = sprintGroup.querySelectorAll('.workout-link');
            workoutsToShow.sprint.forEach((workout, index) => {
                if (sprintLinks[index]) {
                    sprintLinks[index].href = workout.url;
                    sprintLinks[index].textContent = `✅ ${workout.name}`;
                    sprintLinks[index].setAttribute('data-type', `${selectedDayType}-sprint${index > 0 ? index + 1 : ''}`);
                }
            });
        }
    }
    
    // Update resistance training links (for non-office)
    if (selectedDayType === 'nonoffice' && workoutsToShow.resistance) {
        let resistanceIndex = -1;
        mainGroups.forEach((group, idx) => {
            const h3 = group.querySelector('h3');
            if (h3 && (h3.textContent.includes('Resistance') || h3.textContent.includes('🏋️'))) {
                resistanceIndex = idx;
            }
        });
        
        if (resistanceIndex >= 0) {
            const resistanceGroup = mainGroups[resistanceIndex];
            const resistanceLinks = resistanceGroup.querySelectorAll('.workout-link');
            workoutsToShow.resistance.forEach((workout, index) => {
                if (resistanceLinks[index]) {
                    resistanceLinks[index].href = workout.url;
                    resistanceLinks[index].textContent = `✅ ${workout.name}`;
                    resistanceLinks[index].setAttribute('data-type', `${selectedDayType}-resistance${index > 0 ? index + 1 : ''}`);
                }
            });
        }
    }
    
    // Update cooldown links (for non-office)
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
            workoutsToShow.cooldown.forEach((workout, index) => {
                if (cooldownLinks[index]) {
                    cooldownLinks[index].href = workout.url;
                    cooldownLinks[index].textContent = `✅ ${workout.name}`;
                    cooldownLinks[index].setAttribute('data-type', `${selectedDayType}-cooldown${index > 0 ? index + 1 : ''}`);
                }
            });
        }
    }
}


// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/fitness-tracker/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}


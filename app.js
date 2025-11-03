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
            (tabName === 'progress' && index === 2)) {
            btn.classList.add('active');
        }
    });
    
    if (tabName === 'weight') {
        updateWeightTable();
    } else if (tabName === 'progress') {
        updateProgress();
    }
}

function selectDayType(type) {
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
    if (savedType) {
        selectedDayType = savedType;
        selectDayType(savedType);
    }
    
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
            
            // Reset day type selector
            selectDayType('nonoffice');
            
            // Show success message
            alert('✅ App reset successfully!\n\nYour journey starts fresh from today (Day 1).');
            
            // Refresh to ensure clean state
            location.reload();
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


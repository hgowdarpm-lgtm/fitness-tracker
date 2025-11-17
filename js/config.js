/**
 * CONFIG.JS
 * 
 * This file contains all the configuration data and constants for the app.
 * Think of it as a settings file that stores workout videos and app settings.
 * 
 * WHY THIS FILE EXISTS:
 * - Keeps all workout data in one place, making it easy to update videos
 * - Separates data from logic, making the code cleaner
 * - Makes it easy to add more weeks or exercises later
 */

// App-wide constants
const APP_CONFIG = {
    // Total duration of the fitness program (90 days)
    TOTAL_DAYS: 90,
    
    // Starting weight for progress calculations
    STARTING_WEIGHT_KG: 83.0,
    
    // Goal weight for progress calculations
    GOAL_WEIGHT_KG: 70.0,
    
    // Days per week (used for week calculations)
    DAYS_PER_WEEK: 7
};

/**
 * WORKOUT_DATA
 * 
 * This object stores all the workout videos organized by:
 * - Week number (currently only week 1, but structure allows for more)
 * - Day type (office = 20 min, nonoffice = 45-60 min)
 * - Exercise category (warmup, main, hiit, sprint, resistance, cooldown)
 * 
 * Each exercise has:
 * - name: What the workout is called
 * - url: YouTube link to the workout video
 */
const WORKOUT_DATA = {
    weeks: {
        1: {
            // Office workouts are shorter (20 minutes total)
            office: {
                warmup: [
                    { 
                        name: "5-Min Full Body Dynamic Warm-Up", 
                        url: "https://www.youtube.com/watch?v=3qyWpJ34dWw" 
                    }
                ],
                main: [
                    { 
                        name: "20-Min Full Body HIIT (No Equipment)", 
                        url: "https://www.youtube.com/watch?v=HhdYlniTjvg" 
                    }
                ]
            },
            
            // Non-office workouts are longer (45-60 minutes)
            nonoffice: {
                // Warm-up exercises (choose one per day)
                warmup: [
                    { 
                        name: "5-Min Warm-Up for At-Home Workouts", 
                        url: "https://www.youtube.com/watch?v=f3zOrYCwquE" 
                    },
                    { 
                        name: "10-Min Cardio Warm-Up (Alternative)", 
                        url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" 
                    }
                ],
                
                // Main strength workouts (choose one per day)
                main: [
                    { 
                        name: "40-Min Upper Body Strength (Dumbbells)", 
                        url: "https://www.youtube.com/watch?v=3x1cZIExciE" 
                    },
                    { 
                        name: "45-Min Lower Body & Glutes (Dumbbells)", 
                        url: "https://www.youtube.com/watch?v=DENm10PI8Xc" 
                    },
                    { 
                        name: "30-Min Core & Cardio Workout", 
                        url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" 
                    }
                ],
                
                // Sprint training workouts (choose one per day)
                sprint: [
                    { 
                        name: "15-Min Sprint Interval Training", 
                        url: "https://www.youtube.com/watch?v=HhdYlniTjvg" 
                    },
                    { 
                        name: "20-Min HIIT Sprint Workout", 
                        url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" 
                    },
                    { 
                        name: "10-Min Quick Sprint Burst", 
                        url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" 
                    }
                ],
                
                // Resistance training workouts (choose one per day)
                resistance: [
                    { 
                        name: "30-Min Full Body Resistance Training", 
                        url: "https://www.youtube.com/watch?v=PoLFAhJU-SY" 
                    },
                    { 
                        name: "25-Min Bodyweight Resistance Workout", 
                        url: "https://www.youtube.com/watch?v=DENm10PI8Xc" 
                    },
                    { 
                        name: "35-Min Dumbbell Resistance Training", 
                        url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" 
                    }
                ],
                
                // HIIT workouts (choose one per day)
                hiit: [
                    { 
                        name: "20-Min Full Body HIIT (No Equipment)", 
                        url: "https://www.youtube.com/watch?v=HhdYlniTjvg" 
                    },
                    { 
                        name: "25-Min High-Intensity Interval Training", 
                        url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" 
                    },
                    { 
                        name: "15-Min Quick HIIT Workout", 
                        url: "https://www.youtube.com/watch?v=AG3lA6ZTfVc" 
                    },
                    { 
                        name: "30-Min HIIT Cardio & Strength", 
                        url: "https://www.youtube.com/watch?v=XeYkCenyldM" 
                    }
                ],
                
                // Cool-down exercises (choose one per day)
                cooldown: [
                    { 
                        name: "20-Min Full Body Stretch & Mobility", 
                        url: "https://www.youtube.com/watch?v=DppDOK2SvP0" 
                    },
                    { 
                        name: "20-Min Yoga Cool-Down", 
                        url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" 
                    }
                ]
            }
        }
        // Note: Weeks 2-12 can be added here with the same structure
        // For now, we use Week 1 structure for all weeks
    }
};

/**
 * PERIOD_WORKOUTS
 * 
 * Special gentle workouts to use during period days.
 * These are easier and more suitable for when you're on your period.
 */
const PERIOD_WORKOUTS = {
    office: {
        warmup: [
            { 
                name: "5-Min Gentle Warm-Up", 
                url: "https://www.youtube.com/watch?v=3qyWpJ34dWw" 
            }
        ],
        main: [
            { 
                name: "15-Min Gentle Yoga Flow", 
                url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" 
            },
            { 
                name: "10-Min Light Stretching", 
                url: "https://www.youtube.com/watch?v=DppDOK2SvP0" 
            }
        ]
    },
    nonoffice: {
        warmup: [
            { 
                name: "5-Min Gentle Warm-Up", 
                url: "https://www.youtube.com/watch?v=f3zOrYCwquE" 
            }
        ],
        main: [
            { 
                name: "30-Min Gentle Yoga for Periods", 
                url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" 
            },
            { 
                name: "20-Min Light Walking Workout", 
                url: "https://www.youtube.com/watch?v=M0uO8X3_tEA" 
            },
            { 
                name: "25-Min Restorative Stretching", 
                url: "https://www.youtube.com/watch?v=DppDOK2SvP0" 
            }
        ],
        cooldown: [
            { 
                name: "15-Min Gentle Stretch & Relaxation", 
                url: "https://www.youtube.com/watch?v=DppDOK2SvP0" 
            },
            { 
                name: "20-Min Restorative Yoga", 
                url: "https://www.youtube.com/watch?v=v7AYKMP6rOE" 
            }
        ]
    }
};


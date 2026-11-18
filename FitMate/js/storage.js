/**
 * FitMate Storage Engine
 * Manages LocalStorage persistence, data seeding, export/import, and transactions.
 */

const STORAGE_KEYS = {
  PROFILE: "fitmate_user_profile",
  ROUTINES: "fitmate_routines",
  ACTIVE_WORKOUT: "fitmate_active_workout",
  WORKOUT_HISTORY: "fitmate_workout_history",
  NUTRITION_LOGS: "fitmate_nutrition_logs",
  WATER_LOGS: "fitmate_water_logs",
  WEIGHT_HISTORY: "fitmate_weight_history",
  BODY_MEASUREMENTS: "fitmate_body_measurements",
  CHAT_HISTORY: "fitmate_chat_history",
  CALENDAR_EVENTS: "fitmate_calendar_events",
  SETTINGS: "fitmate_settings",
  ONBOARDED: "fitmate_has_onboarded"
};

const Storage = {
  // Get item safely from localStorage
  getItem: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`FitMate Storage read error for key: ${key}`, e);
      return defaultValue;
    }
  },

  // Set item safely
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`FitMate Storage write error for key: ${key}`, e);
      return false;
    }
  },

  // Remove item
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`FitMate Storage remove error for key: ${key}`, e);
    }
  },

  // --- USER PROFILE ---
  getUserProfile: () => {
    let profile = Storage.getItem(STORAGE_KEYS.PROFILE);
    if (profile) {
      let changed = false;
      // Clean up legacy email default if present
      if (profile.email === "jhonto@fitmate.app") {
        profile.email = "";
        changed = true;
      }
      if (profile.name === "Jhonto") {
        profile.name = "Athlete";
        changed = true;
      }
      if (changed) {
        Storage.setItem(STORAGE_KEYS.PROFILE, profile);
      }
      return profile;
    }

    // Default profile
    const defaultProfile = {
      name: "Athlete",
      email: "",
      age: 25,
      gender: "Male",
      heightCm: 175,
      currentWeightKg: 74.5,
      targetWeightKg: 70.0,
      experienceLevel: "Intermediate", // Beginner, Intermediate, Advanced
      primaryGoal: "Muscle Gain", // Weight Loss, Muscle Gain, Strength Building, General Fitness, Weight Maintenance
      availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
      workoutDuration: 60, // in minutes
      equipment: "Full Gym", // Full Gym, Dumbbells only, Bodyweight
      dailyCalorieTarget: 2400,
      proteinTargetGrams: 150,
      carbTargetGrams: 270,
      fatTargetGrams: 65,
      waterTargetMl: 3000,
      stepTarget: 10000,
      avatarUrl: ""
    };
    Storage.setItem(STORAGE_KEYS.PROFILE, defaultProfile);
    return defaultProfile;
  },

  saveUserProfile: (profile) => {
    return Storage.setItem(STORAGE_KEYS.PROFILE, profile);
  },

  isOnboarded: () => {
    return !!Storage.getItem(STORAGE_KEYS.ONBOARDED, false);
  },

  setOnboarded: (status = true) => {
    return Storage.setItem(STORAGE_KEYS.ONBOARDED, status);
  },

  // --- WORKOUT ROUTINES ---
  getRoutines: () => {
    const routines = Storage.getItem(STORAGE_KEYS.ROUTINES);
    if (routines && routines.length > 0) return routines;

    // Seed preset routines if empty
    const presets = [
      {
        id: "routine-push",
        name: "Push Day (Hypertrophy)",
        split: "Push / Pull / Legs",
        days: ["Monday", "Thursday"],
        targetMuscles: ["Chest", "Shoulders", "Triceps"],
        description: "Chest, front delts, and tricep focus with compound and isolation work.",
        exercises: [
          { exerciseId: "barbell-bench-press", sets: 4, reps: 8, weightKg: 70, restSeconds: 90, notes: "Warm up with bar first" },
          { exerciseId: "incline-dumbbell-press", sets: 3, reps: 10, weightKg: 24, restSeconds: 75, notes: "Squeeze at peak" },
          { exerciseId: "overhead-barbell-press", sets: 3, reps: 8, weightKg: 45, restSeconds: 90, notes: "Brace glutes tightly" },
          { exerciseId: "dumbbell-lateral-raise", sets: 4, reps: 15, weightKg: 10, restSeconds: 60, notes: "Lead with elbows" },
          { exerciseId: "tricep-rope-pushdown", sets: 3, reps: 12, weightKg: 25, restSeconds: 60, notes: "Flare outward at bottom" }
        ],
        createdDate: new Date().toISOString()
      },
      {
        id: "routine-pull",
        name: "Pull Day (Lats & Arms)",
        split: "Push / Pull / Legs",
        days: ["Tuesday", "Friday"],
        targetMuscles: ["Back", "Biceps", "Rear Delts"],
        description: "Build a broad V-taper with vertical and horizontal pull movements.",
        exercises: [
          { exerciseId: "lat-pulldown-machine", sets: 4, reps: 10, weightKg: 60, restSeconds: 75, notes: "Drive elbows down to waist" },
          { exerciseId: "seated-cable-row", sets: 3, reps: 12, weightKg: 55, restSeconds: 75, notes: "Pause 1s on contraction" },
          { exerciseId: "pull-ups", sets: 3, reps: 8, weightKg: 0, restSeconds: 90, notes: "Dead hang at bottom" },
          { exerciseId: "face-pulls-cable", sets: 4, reps: 15, weightKg: 20, restSeconds: 60, notes: "Rotate shoulders back" },
          { exerciseId: "barbell-bicep-curl", sets: 3, reps: 10, weightKg: 30, restSeconds: 60, notes: "Strict form, no swinging" },
          { exerciseId: "hammer-curls", sets: 3, reps: 12, weightKg: 14, restSeconds: 60, notes: "Focus on brachialis" }
        ],
        createdDate: new Date().toISOString()
      },
      {
        id: "routine-legs",
        name: "Legs & Core Blast",
        split: "Push / Pull / Legs",
        days: ["Wednesday", "Saturday"],
        targetMuscles: ["Legs", "Abs"],
        description: "Heavy quad, hamstring, and abdominal training.",
        exercises: [
          { exerciseId: "barbell-back-squat", sets: 4, reps: 8, weightKg: 85, restSeconds: 120, notes: "Hit full depth" },
          { exerciseId: "leg-press-machine", sets: 3, reps: 12, weightKg: 160, restSeconds: 90, notes: "Do not lock knees" },
          { exerciseId: "romanian-deadlift", sets: 3, reps: 10, weightKg: 70, restSeconds: 90, notes: "Deep hamstring stretch" },
          { exerciseId: "leg-extension-machine", sets: 3, reps: 15, weightKg: 45, restSeconds: 60, notes: "Quad burnout" },
          { exerciseId: "hanging-leg-raise", sets: 3, reps: 12, weightKg: 0, restSeconds: 60, notes: "Curl pelvis upward" }
        ],
        createdDate: new Date().toISOString()
      }
    ];

    Storage.setItem(STORAGE_KEYS.ROUTINES, presets);
    return presets;
  },

  saveRoutine: (routine) => {
    const routines = Storage.getRoutines();
    const existingIndex = routines.findIndex(r => r.id === routine.id);
    if (existingIndex >= 0) {
      routines[existingIndex] = routine;
    } else {
      if (!routine.id) routine.id = "routine-" + Date.now();
      routines.push(routine);
    }
    Storage.setItem(STORAGE_KEYS.ROUTINES, routines);
    return routine;
  },

  deleteRoutine: (routineId) => {
    let routines = Storage.getRoutines();
    routines = routines.filter(r => r.id !== routineId);
    Storage.setItem(STORAGE_KEYS.ROUTINES, routines);
    return routines;
  },

  duplicateRoutine: (routineId) => {
    const routines = Storage.getRoutines();
    const target = routines.find(r => r.id === routineId);
    if (!target) return null;

    const copy = JSON.parse(JSON.stringify(target));
    copy.id = "routine-" + Date.now();
    copy.name = target.name + " (Copy)";
    copy.createdDate = new Date().toISOString();
    routines.push(copy);
    Storage.setItem(STORAGE_KEYS.ROUTINES, routines);
    return copy;
  },

  // --- ACTIVE WORKOUT STATE ---
  getActiveWorkout: () => {
    return Storage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT, null);
  },

  saveActiveWorkout: (activeWorkout) => {
    if (!activeWorkout) {
      Storage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    } else {
      Storage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, activeWorkout);
    }
  },

  clearActiveWorkout: () => {
    Storage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  },

  // --- WORKOUT HISTORY ---
  getWorkoutHistory: () => {
    const history = Storage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    if (history && history.length > 0) return history;

    // Seed realistic recent history
    const sampleHistory = [
      {
        id: "session-1",
        routineId: "routine-push",
        routineName: "Push Day (Hypertrophy)",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        durationSeconds: 3120, // 52 mins
        totalVolumeKg: 6420,
        totalSets: 17,
        caloriesBurned: 380,
        completedExercises: [
          { name: "Barbell Bench Press", setsCompleted: 4, bestWeight: 70, bestReps: 8 },
          { name: "Incline Dumbbell Press", setsCompleted: 3, bestWeight: 24, bestReps: 10 },
          { name: "Overhead Barbell Press", setsCompleted: 3, bestWeight: 45, bestReps: 8 },
          { name: "Dumbbell Lateral Raise", setsCompleted: 4, bestWeight: 10, bestReps: 15 },
          { name: "Tricep Rope Pushdown", setsCompleted: 3, bestWeight: 25, bestReps: 12 }
        ],
        notes: "Felt strong on bench press today! Added +2.5kg."
      },
      {
        id: "session-2",
        routineId: "routine-pull",
        routineName: "Pull Day (Lats & Arms)",
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        durationSeconds: 2880, // 48 mins
        totalVolumeKg: 5890,
        totalSets: 16,
        caloriesBurned: 350,
        completedExercises: [
          { name: "Lat Pulldown Machine", setsCompleted: 4, bestWeight: 60, bestReps: 10 },
          { name: "Seated Cable Row", setsCompleted: 3, bestWeight: 55, bestReps: 12 },
          { name: "Pull-Ups", setsCompleted: 3, bestWeight: 0, bestReps: 8 },
          { name: "Barbell Bicep Curl", setsCompleted: 3, bestWeight: 30, bestReps: 10 },
          { name: "Hammer Curls", setsCompleted: 3, bestWeight: 14, bestReps: 12 }
        ],
        notes: "Great bicep pump and back engagement."
      },
      {
        id: "session-3",
        routineId: "routine-legs",
        routineName: "Legs & Core Blast",
        date: new Date(Date.now() - 86400000 * 6).toISOString(),
        durationSeconds: 3400, // 56 mins
        totalVolumeKg: 7850,
        totalSets: 16,
        caloriesBurned: 440,
        completedExercises: [
          { name: "Barbell Back Squat", setsCompleted: 4, bestWeight: 85, bestReps: 8 },
          { name: "Leg Press Machine", setsCompleted: 3, bestWeight: 160, bestReps: 12 },
          { name: "Romanian Deadlift", setsCompleted: 3, bestWeight: 70, bestReps: 10 },
          { name: "Leg Extension Machine", setsCompleted: 3, bestWeight: 45, bestReps: 15 },
          { name: "Hanging Leg Raise", setsCompleted: 3, bestWeight: 0, bestReps: 12 }
        ],
        notes: "Tough squat session. Pushed depth."
      }
    ];

    Storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, sampleHistory);
    return sampleHistory;
  },

  saveWorkoutSession: (session) => {
    const history = Storage.getWorkoutHistory();
    if (!session.id) session.id = "session-" + Date.now();
    if (!session.date) session.date = new Date().toISOString();
    history.unshift(session); // prepend latest
    Storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, history);
    return session;
  },

  // --- NUTRITION LOGS ---
  // Structure: { "YYYY-MM-DD": [ { id, name, category, meal: "breakfast"|"lunch"|"dinner"|"snack", calories, protein, carbs, fat, quantityGrams, time } ] }
  getNutritionLogs: (dateStr) => {
    const allLogs = Storage.getItem(STORAGE_KEYS.NUTRITION_LOGS, {});
    const dateKey = dateStr || new Date().toISOString().split("T")[0];
    return allLogs[dateKey] || [];
  },

  addNutritionLog: (logEntry, dateStr) => {
    const allLogs = Storage.getItem(STORAGE_KEYS.NUTRITION_LOGS, {});
    const dateKey = dateStr || new Date().toISOString().split("T")[0];
    if (!allLogs[dateKey]) allLogs[dateKey] = [];
    
    if (!logEntry.id) logEntry.id = "food-log-" + Date.now();
    if (!logEntry.time) logEntry.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    allLogs[dateKey].push(logEntry);
    Storage.setItem(STORAGE_KEYS.NUTRITION_LOGS, allLogs);
    return logEntry;
  },

  deleteNutritionLog: (logId, dateStr) => {
    const allLogs = Storage.getItem(STORAGE_KEYS.NUTRITION_LOGS, {});
    const dateKey = dateStr || new Date().toISOString().split("T")[0];
    if (allLogs[dateKey]) {
      allLogs[dateKey] = allLogs[dateKey].filter(item => item.id !== logId);
      Storage.setItem(STORAGE_KEYS.NUTRITION_LOGS, allLogs);
    }
  },

  // --- WATER LOGS ---
  // Structure: { "YYYY-MM-DD": currentMl }
  getWaterIntake: (dateStr) => {
    const allWater = Storage.getItem(STORAGE_KEYS.WATER_LOGS, {});
    const dateKey = dateStr || new Date().toISOString().split("T")[0];
    return allWater[dateKey] || 1750; // default seed for today
  },

  setWaterIntake: (amountMl, dateStr) => {
    const allWater = Storage.getItem(STORAGE_KEYS.WATER_LOGS, {});
    const dateKey = dateStr || new Date().toISOString().split("T")[0];
    allWater[dateKey] = Math.max(0, amountMl);
    Storage.setItem(STORAGE_KEYS.WATER_LOGS, allWater);
    return allWater[dateKey];
  },

  addWaterIntake: (deltaMl, dateStr) => {
    const current = Storage.getWaterIntake(dateStr);
    return Storage.setWaterIntake(current + deltaMl, dateStr);
  },

  // --- WEIGHT HISTORY ---
  getWeightHistory: () => {
    const weights = Storage.getItem(STORAGE_KEYS.WEIGHT_HISTORY);
    if (weights && weights.length > 0) return weights;

    // Seed weight history with realistic progression
    const now = Date.now();
    const seedWeights = [
      { id: "w-1", date: new Date(now - 86400000 * 28).toISOString().split("T")[0], weightKg: 76.8, note: "Start of program" },
      { id: "w-2", date: new Date(now - 86400000 * 21).toISOString().split("T")[0], weightKg: 76.2, note: "Feeling good" },
      { id: "w-3", date: new Date(now - 86400000 * 14).toISOString().split("T")[0], weightKg: 75.5, note: "Strict diet consistency" },
      { id: "w-4", date: new Date(now - 86400000 * 7).toISOString().split("T")[0], weightKg: 74.9, note: "Muscle tone visible" },
      { id: "w-5", date: new Date().toISOString().split("T")[0], weightKg: 74.5, note: "Current check-in" }
    ];
    Storage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, seedWeights);
    return seedWeights;
  },

  addWeightEntry: (weightKg, dateStr, note = "") => {
    const weights = Storage.getWeightHistory();
    const date = dateStr || new Date().toISOString().split("T")[0];
    
    // Check if an entry for this date already exists
    const idx = weights.findIndex(w => w.date === date);
    if (idx >= 0) {
      weights[idx].weightKg = parseFloat(weightKg);
      if (note) weights[idx].note = note;
    } else {
      weights.push({
        id: "w-" + Date.now(),
        date: date,
        weightKg: parseFloat(weightKg),
        note: note
      });
    }

    // Sort chronologically
    weights.sort((a, b) => new Date(a.date) - new Date(b.date));
    Storage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, weights);

    // Also update current weight on user profile
    const profile = Storage.getUserProfile();
    profile.currentWeightKg = parseFloat(weightKg);
    Storage.saveUserProfile(profile);

    return weights;
  },

  // --- BODY MEASUREMENTS ---
  getBodyMeasurements: () => {
    const measurements = Storage.getItem(STORAGE_KEYS.BODY_MEASUREMENTS);
    if (measurements && measurements.length > 0) return measurements;

    const seed = [
      {
        id: "bm-1",
        date: new Date(Date.now() - 86400000 * 21).toISOString().split("T")[0],
        waistCm: 84.0,
        chestCm: 102.0,
        armsCm: 36.5,
        thighsCm: 57.0
      },
      {
        id: "bm-2",
        date: new Date().toISOString().split("T")[0],
        waistCm: 81.5,
        chestCm: 104.0,
        armsCm: 37.5,
        thighsCm: 58.0
      }
    ];
    Storage.setItem(STORAGE_KEYS.BODY_MEASUREMENTS, seed);
    return seed;
  },

  addBodyMeasurement: (entry) => {
    const measurements = Storage.getBodyMeasurements();
    entry.id = "bm-" + Date.now();
    if (!entry.date) entry.date = new Date().toISOString().split("T")[0];
    measurements.push(entry);
    Storage.setItem(STORAGE_KEYS.BODY_MEASUREMENTS, measurements);
    return measurements;
  },

  // --- CHAT HISTORY ---
  getChatHistory: () => {
    return Storage.getItem(STORAGE_KEYS.CHAT_HISTORY, []);
  },

  saveChatMessage: (message) => {
    const chat = Storage.getChatHistory();
    chat.push(message);
    Storage.setItem(STORAGE_KEYS.CHAT_HISTORY, chat);
    return chat;
  },

  clearChatHistory: () => {
    Storage.setItem(STORAGE_KEYS.CHAT_HISTORY, []);
  },

  // --- CALENDAR EVENTS ---
  getCalendarEvents: () => {
    return Storage.getItem(STORAGE_KEYS.CALENDAR_EVENTS, {});
  },

  saveCalendarEvent: (dateStr, eventData) => {
    const events = Storage.getCalendarEvents();
    events[dateStr] = eventData;
    Storage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, events);
    return events;
  },

  // --- SETTINGS ---
  getSettings: () => {
    const defaults = {
      theme: "obsidian-amber", // obsidian-amber, mint-emerald, cyber-blue
      unit: "metric", // metric (kg/cm) or imperial (lbs/in)
      soundEffects: true,
      haptics: true,
      restTimerDefault: 90,
      notifications: true
    };
    return Storage.getItem(STORAGE_KEYS.SETTINGS, defaults);
  },

  saveSettings: (settings) => {
    return Storage.setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  // --- SEED INITIAL DEMO NUTRITION ---
  seedInitialDataIfNew: () => {
    const today = new Date().toISOString().split("T")[0];
    const allLogs = Storage.getItem(STORAGE_KEYS.NUTRITION_LOGS, {});
    
    if (!allLogs[today] || allLogs[today].length === 0) {
      allLogs[today] = [
        {
          id: "seed-food-1",
          name: "Whole Wheat Ruti (Attar Ruti)",
          category: "Bangladeshi Staples",
          meal: "breakfast",
          calories: 220,
          protein: 7.6,
          carbs: 45.0,
          fat: 1.6,
          quantityGrams: 80,
          portionDesc: "2 pieces",
          time: "08:15 AM"
        },
        {
          id: "seed-food-2",
          name: "Egg Omelette (Dim Bhaji)",
          category: "Eggs & Dairy",
          meal: "breakfast",
          calories: 135,
          protein: 6.8,
          carbs: 2.1,
          fat: 11.2,
          quantityGrams: 65,
          portionDesc: "1 egg",
          time: "08:20 AM"
        },
        {
          id: "seed-food-3",
          name: "Steamed White Rice (Shada Bhat)",
          category: "Bangladeshi Staples",
          meal: "lunch",
          calories: 260,
          protein: 5.4,
          carbs: 58.0,
          fat: 0.7,
          quantityGrams: 200,
          portionDesc: "1.3 cups",
          time: "01:30 PM"
        },
        {
          id: "seed-food-4",
          name: "Chicken Curry (Murgir Jhol)",
          category: "Poultry & Meat",
          meal: "lunch",
          calories: 275,
          protein: 28.5,
          carbs: 5.2,
          fat: 15.0,
          quantityGrams: 180,
          portionDesc: "1 bowl",
          time: "01:35 PM"
        },
        {
          id: "seed-food-5",
          name: "Red Lentil Soup (Mosur Dal)",
          category: "Lentils & Legumes",
          meal: "lunch",
          calories: 145,
          protein: 9.2,
          carbs: 21.0,
          fat: 2.8,
          quantityGrams: 160,
          portionDesc: "1 bowl",
          time: "01:40 PM"
        },
        {
          id: "seed-food-6",
          name: "Whey Protein Isolate",
          category: "Supplements",
          meal: "snack",
          calories: 120,
          protein: 24.5,
          carbs: 2.5,
          fat: 1.2,
          quantityGrams: 30,
          portionDesc: "1 scoop",
          time: "05:00 PM"
        }
      ];
      Storage.setItem(STORAGE_KEYS.NUTRITION_LOGS, allLogs);
    }
  },

  // --- BACKUP & RESTORE ---
  exportBackupJSON: () => {
    const backup = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      userProfile: Storage.getUserProfile(),
      routines: Storage.getRoutines(),
      workoutHistory: Storage.getWorkoutHistory(),
      nutritionLogs: Storage.getItem(STORAGE_KEYS.NUTRITION_LOGS, {}),
      waterLogs: Storage.getItem(STORAGE_KEYS.WATER_LOGS, {}),
      weightHistory: Storage.getWeightHistory(),
      bodyMeasurements: Storage.getBodyMeasurements(),
      chatHistory: Storage.getChatHistory(),
      calendarEvents: Storage.getCalendarEvents(),
      settings: Storage.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupJSON: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== "object") throw new Error("Invalid JSON structure");
      
      if (data.userProfile) Storage.setItem(STORAGE_KEYS.PROFILE, data.userProfile);
      if (data.routines) Storage.setItem(STORAGE_KEYS.ROUTINES, data.routines);
      if (data.workoutHistory) Storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, data.workoutHistory);
      if (data.nutritionLogs) Storage.setItem(STORAGE_KEYS.NUTRITION_LOGS, data.nutritionLogs);
      if (data.waterLogs) Storage.setItem(STORAGE_KEYS.WATER_LOGS, data.waterLogs);
      if (data.weightHistory) Storage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, data.weightHistory);
      if (data.bodyMeasurements) Storage.setItem(STORAGE_KEYS.BODY_MEASUREMENTS, data.bodyMeasurements);
      if (data.chatHistory) Storage.setItem(STORAGE_KEYS.CHAT_HISTORY, data.chatHistory);
      if (data.calendarEvents) Storage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, data.calendarEvents);
      if (data.settings) Storage.setItem(STORAGE_KEYS.SETTINGS, data.settings);

      return { success: true, message: "Backup successfully restored!" };
    } catch (err) {
      console.error("Backup import error", err);
      return { success: false, message: err.message || "Failed to parse backup JSON" };
    }
  },

  resetAllData: () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    location.reload();
  }
};

if (typeof window !== "undefined") {
  window.Storage = Storage;
  window.STORAGE_KEYS = STORAGE_KEYS;
}

# FitMate — Your Personal Fitness Companion

> **FitMate** is an all-in-one mobile fitness application engineered for beginners, intermediate lifters, and advanced athletes. Built with a high-performance vanilla stack, an ultra-smooth dark luxury obsidian & amber-glow design system, intelligent AI gym equipment recognition, custom workout builders, nutrition tracking (including authentic Bangladeshi foods), and analytics.

---

## 📱 Visual Design System & Branding

Inspired by modern luxury mobile dashboards (as specified in design references):
- **Background**: Deep obsidian & charcoal (`#0c0b0b` / `#141211`)
- **Accent**: Warm glowing ember & vibrant orange gradient (`#ff7a29` to `#ff5500`)
- **Status Accents**: Soft emerald green badges for positive progress (`#34d399` / `+8.5%`)
- **Cards**: Frosted glassmorphism (`backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08)`)
- **Navigation**: Floating smoky glass bottom pill dock with circular glowing active indicator
- **Typography & Motion**: Modern system font stack, springy micro-interactions, tap scales, and bottom sheets.

---

## 🚀 Key Features

### 1. Personal Workout Routine Builder
- Create, customize, duplicate, and delete routines.
- Choose splits: *Push/Pull/Legs*, *Upper/Lower*, *Bro Split*, *Full Body*, or *Custom Split*.
- Configure Sets, Reps, Weight (kg), Rest time (sec), and Notes for each exercise.
- Search and pick exercises from categorized database; reorder exercises up/down.

### 2. Active Workout Session & Smart Rest Timer
- Real-time elapsed duration stopwatch with pause and resume.
- Interactive set checkboxes with instant visual completion feedback.
- **Progressive Overload Tracking**: Displays previous session's weight and reps for instant comparison.
- **Auto Rest Timer**: Automatically triggers countdown overlay upon completing a set, featuring a synthesizer audio beep upon timer completion, `+30s` extension, or `Skip`.
- **Finish Workout Summary**: Automatically computes total volume lifted (kg), total sets completed, duration, and estimated calories burned, then saves to workout history.

### 3. FitMate AI Coach & Gym Machine Scanner
- **Gym Machine Identification**: Take live camera snapshots or upload gallery images of unfamiliar gym machines (Lat Pulldown, Leg Press, Smith Machine, Cable Crossover, Pec Deck, Seated Row, etc.).
- The AI provides structured analysis:
  - Machine Name & Purpose
  - Primary & Secondary Target Muscles
  - Setup & Execution instructions
  - Common mistakes to avoid
  - Safety precautions & alternative exercises
  - One-tap button to open complete exercise guides or save directly to routines.
- **AI Workout Generator**: Generates custom 3-day or 4-day workout routines and saves them to user routines with one tap.
- **AI Diet & Bangladeshi Food Breakdown**: Estimates calories and macronutrients for local dishes.

### 4. Nutrition & Diet Tracker (With Authentic Bangladeshi Staples)
- Daily Calorie Intake vs Goal with progress bar and remaining calories.
- Macronutrient tracking: Protein, Carbs, Fat (current vs target grams).
- Four daily meals: Breakfast, Lunch, Dinner, Snacks.
- Searchable food database featuring authentic Bangladeshi items:
  - Steamed Rice (Shada Bhat), Whole Wheat Ruti, Hard Boiled Egg, Egg Omelette (Dim Bhaji), Chicken Curry (Murgir Jhol), Rui Fish Curry, Ilish Fish Curry, Tilapia Curry, Red Lentil Soup (Mosur Dal), Mixed Vegetable Sabji, Fresh Cow Milk, Plain Sour Yogurt (Tok Doi), Banana, Apple, Mango, Beef Curry, Bhuna Khichuri, Boiled Chickpeas (Chana Boot), Whey Protein, Oats, Peanut Butter, Sweet Potato, Almonds, Canned Tuna, Paneer.
- Interactive portion calculator (grams/units) with automatic real-time recalculation of calories and macros.
- Water Intake Tracker: Quick `+250ml`, `+500ml`, and reset controls.

### 5. Progress Analytics & Fitness Calculators
- **Weight Tracking Line Chart**: Interactive Chart.js graph with glowing amber gradient fill.
- **Weekly Workout Volume Bar Chart**: Visualizes total weekly tonnage lifted.
- **Body Tape Measurements**: Track Waist, Chest, Arms, and Thighs in centimeters.
- **Personal Records (PRs)**: Bench Press, Squat, Deadlift, Overhead Press, etc.
- **Achievement Badges**: Unlocks milestones based on workout count and weight lifted.
- **Before & After Gallery**: Store transformation photos locally.
- **Fitness Calculators**:
  - BMI Calculator with classification.
  - BMR (Mifflin-St Jeor formula).
  - TDEE (Total Daily Energy Expenditure) with activity multipliers.
  - Goal Calorie Requirement (Deficit, Maintenance, Surplus).
  - Protein & Macronutrient ratio estimator.
  - One-tap **"Apply Targets to My Profile"** button to synchronize calculated targets into your user profile!

### 6. Workout Calendar
- Interactive monthly calendar with real dates.
- Visual status indicators: Completed Workouts (orange glow dot), Scheduled days (blue dot).
- Tap any date to view day details (workouts and meals logged) or schedule a routine.
- Active workout streak tracker.

### 7. User Profile, Settings & Offline Data Persistence
- Full athlete profile editing (Name, Age, Gender, Height, Current Weight, Target Weight, Experience Level, Goal, Equipment).
- Theme switcher: *Obsidian Amber*, *Mint Emerald*, and *Cyber Blue*.
- **Full JSON Backup & Restore**: Export all app data to a `.json` backup file or import from a file.
- Reset to clean sample data at any time.

---

## 🛠️ Technology Stack

- **HTML5 & CSS3**: Semantic mobile layout, custom CSS variables, glassmorphic effects, and responsive safe-area insets.
- **Vanilla JavaScript (ES6+)**: Zero framework bloat (No React, Vue, or Angular), modular architecture.
- **Chart.js**: Smooth line charts and bar graphs for weight and volume analytics.
- **Lucide Icons**: Crisp SVG iconography.
- **LocalStorage**: Instant offline data persistence with fallback and auto-seeding.
- **Capacitor**: Mobile wrapper configuration (`capacitor.config.json`) ready for Android APK and iOS IPA packaging.

---

## 📂 Project Directory Structure

```
FitMate/
├── index.html                   # Master single-page app container & all 20 views
├── capacitor.config.json        # Capacitor mobile packaging configuration
├── README.md                    # Project documentation & user guide
├── assets/
│   ├── images/
│   │   └── sample-lat-pulldown.svg   # Sample gym machine illustration
│   └── icons/
├── css/
│   ├── style.css                # Obsidian amber theme, typography, header, floating dock
│   ├── components.css           # Cards, buttons, inputs, heatmaps, rest timer, chat bubbles
│   └── responsive.css           # Safe-area insets, mobile viewport, desktop frame toggle
├── data/
│   ├── exercises.js             # Categorized exercise database (Chest, Back, Legs, etc.)
│   └── foods.js                 # Food database with authentic Bangladeshi dishes & macros
└── js/
    ├── app.js                   # Main initialization and startup sequence
    ├── storage.js               # LocalStorage transactions, data seeding, JSON export/import
    ├── navigation.js            # Router, screen switcher, back-stack, modals & toasts
    ├── dashboard.js             # Personalized home dashboard, 2x2 stats, heatmap matrix
    ├── workout.js               # Routine builder, live workout session, set logging, rest timer
    ├── exercise.js              # Exercise library, search/filter, instructions & details
    ├── ai-chat.js               # FitMate AI coach, machine scanner, workout generator
    ├── nutrition.js             # Calorie & macro tracking, meal logging, water counter
    ├── progress.js              # Chart.js graphs, weight history, measurements, PRs, badges
    ├── calculators.js           # BMI, BMR, TDEE, macro split, profile synchronizer
    ├── calendar.js              # Monthly workout schedule, day drawer, streaks
    └── profile.js               # Profile settings, theme switcher, onboarding flow
```

---

## 📲 How to Run and Test Locally

1. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).
2. On desktop, the app automatically renders inside an **iPhone 15 Pro mobile frame**.
3. Tap the **"Full View"** button at the top-right corner to toggle between the mobile device frame and a full-width responsive layout.
4. Test live camera access or use the sample equipment selector inside the **Scan Gym Machine** modal.
5. All routines, meals, sets, and weight entries persist in your browser's LocalStorage even after closing or refreshing the tab.

---

## 📦 Packaging with Capacitor for Android / iOS

To compile FitMate into a native Android APK or iOS app:

```bash
# 1. Install Capacitor CLI
npm install @capacitor/core @capacitor/cli

# 2. Add Android or iOS platform
npx cap add android
npx cap add ios

# 3. Copy web assets to native project
npx cap copy

# 4. Open Android Studio or Xcode to build and run
npx cap open android
npx cap open ios
```

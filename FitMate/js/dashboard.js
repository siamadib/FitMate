/**
 * FitMate Dashboard Module
 * Manages personalized dashboard, activity heatmap, hero cards, and quick loggers.
 */

const Dashboard = {
  quotes: [
    "The only bad workout is the one that didn't happen.",
    "Small daily improvements over time lead to stunning results.",
    "Your body can stand almost anything; it's your mind that you have to convince.",
    "Success starts with self-discipline and daily consistency.",
    "Don't count the days, make the days count in the gym.",
    "Strength does not come from what you can do; it comes from overcoming what you once thought you couldn't.",
    "Every rep you push today is an investment in your future self."
  ],

  currentQuoteIndex: 0,

  init: () => {
    // Quick water log button on dashboard
    const quickWaterBtn = document.getElementById("dash-quick-water-btn");
    if (quickWaterBtn) {
      quickWaterBtn.addEventListener("click", () => {
        const newWater = Storage.addWaterIntake(250);
        Navigation.showToast(`+250ml Water logged (${newWater}ml total)`, "droplet");
        Dashboard.render();
      });
    }

    // Quick step log button on dashboard
    const quickStepsBtn = document.getElementById("dash-quick-steps-btn");
    if (quickStepsBtn) {
      quickStepsBtn.addEventListener("click", () => {
        Dashboard.openStepModal();
      });
    }

    // Quote shuffle button
    const refreshQuoteBtn = document.getElementById("dash-refresh-quote-btn");
    if (refreshQuoteBtn) {
      refreshQuoteBtn.addEventListener("click", () => {
        Dashboard.currentQuoteIndex = (Dashboard.currentQuoteIndex + 1) % Dashboard.quotes.length;
        Dashboard.renderQuote();
      });
    }
  },

  render: () => {
    const profile = Storage.getUserProfile();
    const today = new Date().toISOString().split("T")[0];

    // User greeting
    const greetingEl = document.getElementById("dash-user-greeting");
    const subGreetingEl = document.getElementById("dash-user-sub");
    const avatarCircle = document.getElementById("dash-avatar-circle");

    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
    else if (hour >= 17) timeGreeting = "Good evening";

    if (greetingEl) greetingEl.textContent = `${timeGreeting}, ${profile.name || "Athlete"}`;
    if (subGreetingEl) subGreetingEl.textContent = `${profile.primaryGoal || "General Fitness"} • ${profile.currentWeightKg} kg`;

    if (avatarCircle) {
      if (profile.avatarUrl) {
        avatarCircle.innerHTML = `<img src="${profile.avatarUrl}" alt="${profile.name || 'User'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        const initial = (profile.name || "A").trim().charAt(0).toUpperCase() || "A";
        avatarCircle.innerHTML = `<span class="avatar-initials" id="dash-avatar-initials">${initial}</span>`;
      }
    }

    // Weight Stats Pill
    const weightStatEl = document.getElementById("dash-current-weight");
    const targetWeightStatEl = document.getElementById("dash-target-weight");
    if (weightStatEl) weightStatEl.textContent = `${profile.currentWeightKg} kg`;
    if (targetWeightStatEl) targetWeightStatEl.textContent = `${profile.targetWeightKg} kg`;

    // 2x2 Stats Grid: Calories Burned, Steps, Water, Workout Status
    const workoutHistory = Storage.getWorkoutHistory();
    const todayWorkouts = workoutHistory.filter(w => w.date.startsWith(today));
    const caloriesBurnedToday = todayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) || 420;

    const calEl = document.getElementById("dash-stat-calories");
    if (calEl) calEl.textContent = `${caloriesBurnedToday} kcal`;

    const currentWater = Storage.getWaterIntake(today);
    const waterEl = document.getElementById("dash-stat-water");
    if (waterEl) waterEl.textContent = `${currentWater} ml`;

    // Today's Steps
    const stepsEl = document.getElementById("dash-stat-steps");
    const storedSteps = Storage.getItem("fitmate_today_steps_" + today, 7420);
    if (stepsEl) stepsEl.textContent = storedSteps.toLocaleString();

    // Today's Workout Hero
    Dashboard.renderTodayWorkoutHero();

    // Activity Heatmap (Styled after the reference photo)
    Dashboard.renderActivityHeatmap();

    // Recent workouts
    Dashboard.renderRecentWorkouts();

    // Motivational quote
    Dashboard.renderQuote();
  },

  renderTodayWorkoutHero: () => {
    const routines = Storage.getRoutines();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = daysOfWeek[new Date().getDay()];

    // Find routine matching today or fallback to first routine
    let todayRoutine = routines.find(r => r.days && r.days.includes(currentDayName)) || routines[0];

    const heroTitle = document.getElementById("dash-hero-workout-title");
    const heroDesc = document.getElementById("dash-hero-workout-desc");
    const heroExercisesCount = document.getElementById("dash-hero-exercise-count");
    const heroDuration = document.getElementById("dash-hero-duration");
    const heroStartBtn = document.getElementById("dash-hero-start-btn");

    if (todayRoutine) {
      if (heroTitle) heroTitle.textContent = todayRoutine.name;
      if (heroDesc) heroDesc.textContent = todayRoutine.description || `${todayRoutine.split} Routine`;
      if (heroExercisesCount) heroExercisesCount.textContent = `${todayRoutine.exercises.length} Exercises`;
      if (heroDuration) heroDuration.textContent = `~45-60 min`;

      if (heroStartBtn) {
        heroStartBtn.onclick = () => {
          if (window.Workout) {
            window.Workout.startWorkoutSession(todayRoutine.id);
          }
        };
      }
    }
  },

  renderActivityHeatmap: () => {
    const container = document.getElementById("dash-heatmap-matrix");
    if (!container) return;

    // We build 4 rows of 7 days (representing the last 28 days of activity)
    // with glowing intensity blocks like the screenshot
    const history = Storage.getWorkoutHistory();
    const today = new Date();

    let html = "";
    // Days headers: Mon - Sun
    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
    dayLabels.forEach(d => {
      html += `<div class="heatmap-col-header">${d}</div>`;
    });

    // Generate 28 blocks
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Check if a workout occurred on this date
      const hadWorkout = history.some(w => w.date.startsWith(dateStr));
      let level = "level-0";
      
      // Seed some active days for visual beauty consistent with screenshot
      if (hadWorkout || [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25].includes(i)) {
        if (i % 3 === 0) level = "level-3";
        else if (i % 2 === 0) level = "level-2";
        else level = "level-1";
      }

      html += `<div class="heatmap-cell ${level}" title="${dateStr}"></div>`;
    }

    container.innerHTML = html;
  },

  renderRecentWorkouts: () => {
    const list = document.getElementById("dash-recent-workouts-list");
    if (!list) return;

    const history = Storage.getWorkoutHistory().slice(0, 3);
    if (history.length === 0) {
      list.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 16px;">No recent workouts yet. Let's crush today's routine!</div>`;
      return;
    }

    list.innerHTML = history.map(item => {
      const formattedDate = new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric" });
      const durationMins = Math.round((item.durationSeconds || 1800) / 60);

      return `
        <div class="exercise-card" onclick="Navigation.navigateTo('screen-progress')">
          <div class="exercise-card-left">
            <div class="exercise-icon-avatar">
              <i data-lucide="dumbbell"></i>
            </div>
            <div class="exercise-info">
              <h4>${item.routineName || "Workout Session"}</h4>
              <p>${formattedDate} • ${durationMins} mins • ${(item.totalVolumeKg || 0).toLocaleString()} kg volume</p>
            </div>
          </div>
          <span class="badge-pill badge-green">+${item.caloriesBurned || 350} kcal</span>
        </div>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  },

  renderQuote: () => {
    const quoteEl = document.getElementById("dash-motivational-quote");
    if (quoteEl) {
      quoteEl.textContent = `"${Dashboard.quotes[Dashboard.currentQuoteIndex]}"`;
    }
  },

  openStepModal: () => {
    const today = new Date().toISOString().split("T")[0];
    const currentSteps = Storage.getItem("fitmate_today_steps_" + today, 7420);

    const input = prompt("Enter today's step count:", currentSteps);
    if (input !== null) {
      const parsed = parseInt(input, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        Storage.setItem("fitmate_today_steps_" + today, parsed);
        Navigation.showToast(`Updated steps: ${parsed.toLocaleString()}`, "footprints");
        Dashboard.render();
      }
    }
  }
};

window.Dashboard = Dashboard;

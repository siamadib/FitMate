/**
 * FitMate Main Application Entrypoint
 * Bootstraps all subsystems, seeds demo data, dismisses splash screen, and starts status clock.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("⚡ Bootstrapping FitMate Fitness Companion...");

  // 1. Seed demo nutrition and workout data if new
  Storage.seedInitialDataIfNew();

  // 2. Initialize Navigation Router
  Navigation.init();

  // 3. Initialize all functional modules
  if (window.Dashboard) Dashboard.init();
  if (window.Workout) Workout.init();
  if (window.ExerciseModule) ExerciseModule.init();
  if (window.AIChat) AIChat.init();
  if (window.Nutrition) Nutrition.init();
  if (window.Progress) Progress.init();
  if (window.Calculators) Calculators.init();
  if (window.CalendarModule) CalendarModule.init();
  if (window.Profile) Profile.init();

  // 4. Start top device status clock
  startDeviceClock();

  // 5. Initial render of Home Dashboard
  Dashboard.render();

  // 6. Check Onboarding status
  Profile.showOnboardingIfRequired();

  // 7. Dismiss Splash Screen with sleek transition
  setTimeout(() => {
    const splash = document.getElementById("fitmate-splash-screen");
    if (splash) {
      splash.classList.add("hide");
    }
  }, 1200);

  // 8. Create Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

function startDeviceClock() {
  const timeEl = document.getElementById("device-status-time");
  if (!timeEl) return;

  function update() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "" : "";
    hours = hours % 12 || 12;
    timeEl.textContent = `${hours}:${String(minutes).padStart(2, "0")}`;
  }

  update();
  setInterval(update, 30000);
}

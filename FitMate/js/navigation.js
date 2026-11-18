/**
 * FitMate Navigation & Modal Router
 * Manages screen transitions, dock state, back stack, modals, and toasts.
 */

const Navigation = {
  activeScreenId: "screen-home",
  screenHistory: ["screen-home"],

  init: () => {
    // Bottom dock click handlers
    document.querySelectorAll(".dock-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetScreen = item.getAttribute("data-screen");
        if (targetScreen) {
          Navigation.navigateTo(targetScreen, true);
        }
      });
    });

    // Close modal on backdrop click or close button click
    document.querySelectorAll(".fitmate-modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          Navigation.closeModal(backdrop.id);
        }
      });
    });

    document.querySelectorAll(".modal-close-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".fitmate-modal-backdrop");
        if (modal) Navigation.closeModal(modal.id);
      });
    });

    // Setup desktop frame view mode toggle
    const toggleBtn = document.getElementById("toggle-view-mode");
    const wrapper = document.querySelector(".desktop-wrapper");
    if (toggleBtn && wrapper) {
      toggleBtn.addEventListener("click", () => {
        wrapper.classList.toggle("full-view");
        const isFull = wrapper.classList.contains("full-view");
        toggleBtn.innerHTML = isFull 
          ? `<i data-lucide="smartphone"></i> Mobile Frame` 
          : `<i data-lucide="maximize"></i> Full View`;
        if (window.lucide) window.lucide.createIcons();
      });
    }
  },

  navigateTo: (screenId, isMainTab = false) => {
    if (Navigation.activeScreenId === screenId) return;

    const currentScreen = document.getElementById(Navigation.activeScreenId);
    const nextScreen = document.getElementById(screenId);

    if (!nextScreen) {
      console.warn(`Screen with ID "${screenId}" not found.`);
      return;
    }

    if (currentScreen) {
      currentScreen.classList.remove("active");
    }

    nextScreen.classList.add("active");
    nextScreen.scrollTop = 0;

    if (isMainTab) {
      Navigation.screenHistory = [screenId];
    } else {
      Navigation.screenHistory.push(screenId);
    }

    Navigation.activeScreenId = screenId;

    // Update bottom dock active pill state
    Navigation.updateDockActive(screenId);

    // Call screen-specific refresh hooks
    Navigation.triggerScreenHook(screenId);

    // Re-render Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  goBack: () => {
    if (Navigation.screenHistory.length > 1) {
      Navigation.screenHistory.pop(); // remove current
      const previousScreenId = Navigation.screenHistory[Navigation.screenHistory.length - 1];
      Navigation.navigateTo(previousScreenId, false);
    } else {
      Navigation.navigateTo("screen-home", true);
    }
  },

  updateDockActive: (screenId) => {
    document.querySelectorAll(".dock-item").forEach(item => {
      item.classList.remove("active");
      const target = item.getAttribute("data-screen");
      if (target === screenId) {
        item.classList.add("active");
      }
    });

    // Hide or show bottom dock on full-screen modals like active workout
    const dockContainer = document.querySelector(".dock-nav-container");
    if (dockContainer) {
      if (screenId === "screen-active-workout" || screenId === "screen-camera-scanner") {
        dockContainer.style.display = "none";
      } else {
        dockContainer.style.display = "flex";
      }
    }
  },

  triggerScreenHook: (screenId) => {
    switch (screenId) {
      case "screen-home":
        if (window.Dashboard) window.Dashboard.render();
        break;
      case "screen-workout":
        if (window.Workout) window.Workout.renderRoutines();
        break;
      case "screen-ai-chat":
        if (window.AIChat) window.AIChat.render();
        break;
      case "screen-progress":
        if (window.Progress) window.Progress.render();
        break;
      case "screen-nutrition":
        if (window.Nutrition) window.Nutrition.render();
        break;
      case "screen-exercises":
        if (window.ExerciseModule) window.ExerciseModule.render();
        break;
      case "screen-calendar":
        if (window.CalendarModule) window.CalendarModule.render();
        break;
      case "screen-calculators":
        if (window.Calculators) window.Calculators.init();
        break;
      case "screen-profile":
        if (window.Profile) window.Profile.render();
        break;
    }
  },

  openModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("show");
      if (window.lucide) window.lucide.createIcons();
    }
  },

  closeModal: (modalId) => {
    const modal = modalId ? document.getElementById(modalId) : document.querySelector(".fitmate-modal-backdrop.show");
    if (modal) {
      modal.classList.remove("show");
    }
  },

  showToast: (message, icon = "check-circle", duration = 3000) => {
    let container = document.querySelector(".fitmate-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "fitmate-toast-container";
      document.querySelector(".mobile-device-frame").appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "fitmate-toast";
    toast.innerHTML = `
      <i data-lucide="${icon}" style="color: var(--accent-primary); width: 20px; height: 20px;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.add("out");
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
};

window.Navigation = Navigation;

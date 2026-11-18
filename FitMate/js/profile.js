/**
 * FitMate Profile, Settings, Backup/Restore, and Onboarding Engine
 */

const Profile = {
  init: () => {
    // Save profile form
    const saveProfileBtn = document.getElementById("profile-save-form-btn");
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", Profile.saveProfileForm);
    }

    // Avatar upload handler
    const avatarInput = document.getElementById("profile-avatar-file-input");
    if (avatarInput) {
      avatarInput.addEventListener("change", Profile.handleAvatarUpload);
    }

    // Theme selector buttons
    document.querySelectorAll(".theme-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");
        Profile.setTheme(theme);
      });
    });

    // Backup Export
    const exportBtn = document.getElementById("settings-export-json-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", Profile.exportBackup);
    }

    // Backup Import
    const importFileInput = document.getElementById("settings-import-json-file");
    if (importFileInput) {
      importFileInput.addEventListener("change", Profile.importBackup);
    }

    // Reset Data
    const resetBtn = document.getElementById("settings-reset-data-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset FitMate to fresh sample data? All local changes will be replaced.")) {
          Storage.resetAllData();
        }
      });
    }

    // Load initial theme
    const settings = Storage.getSettings();
    Profile.setTheme(settings.theme || "obsidian-amber");

    // Onboarding handlers
    Profile.initOnboarding();
  },

  handleAvatarUpload: (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const p = Storage.getUserProfile();
      p.avatarUrl = event.target.result;
      Storage.saveUserProfile(p);
      Navigation.showToast("Profile picture updated! 📸", "camera");
      Profile.render();
      if (window.Dashboard) window.Dashboard.render();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  },

  removeAvatar: () => {
    if (confirm("Remove your profile picture?")) {
      const p = Storage.getUserProfile();
      p.avatarUrl = "";
      Storage.saveUserProfile(p);
      Navigation.showToast("Profile picture removed", "trash-2");
      Profile.render();
      if (window.Dashboard) window.Dashboard.render();
    }
  },

  render: () => {
    const p = Storage.getUserProfile();
    const settings = Storage.getSettings();

    // Summary Card
    const nameEl = document.getElementById("profile-display-name");
    const subEl = document.getElementById("profile-display-sub");
    const avatarCircle = document.getElementById("profile-display-avatar-circle");
    const removePhotoBtn = document.getElementById("profile-remove-avatar-btn");

    if (nameEl) nameEl.textContent = p.name || "Athlete";
    if (subEl) {
      const emailPart = (p.email && p.email.trim() && p.email !== "jhonto@fitmate.app") ? `${p.email} • ` : "";
      subEl.textContent = `${emailPart}${p.primaryGoal || "Muscle Gain"} • ${p.experienceLevel || 'Intermediate'}`;
    }

    if (avatarCircle) {
      if (p.avatarUrl) {
        avatarCircle.innerHTML = `<img src="${p.avatarUrl}" alt="${p.name || 'User'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        if (removePhotoBtn) removePhotoBtn.style.display = "inline";
      } else {
        const initial = (p.name || "A").trim().charAt(0).toUpperCase() || "A";
        avatarCircle.innerHTML = `<span class="avatar-initials" style="font-size: 22px;">${initial}</span>`;
        if (removePhotoBtn) removePhotoBtn.style.display = "none";
      }
    }

    // Stats row
    document.getElementById("profile-stat-weight").textContent = `${p.currentWeightKg || 74.5} kg`;
    document.getElementById("profile-stat-target").textContent = `${p.targetWeightKg || 70.0} kg`;
    document.getElementById("profile-stat-height").textContent = `${p.heightCm || 175} cm`;
    document.getElementById("profile-stat-goal").textContent = p.primaryGoal || "Muscle Gain";

    // Edit form fields
    document.getElementById("edit-profile-name").value = (p.name && p.name !== "Jhonto") ? p.name : (p.name || "");
    document.getElementById("edit-profile-email").value = (p.email && p.email !== "jhonto@fitmate.app") ? p.email : "";
    document.getElementById("edit-profile-age").value = p.age || 26;
    document.getElementById("edit-profile-gender").value = p.gender || "Male";
    document.getElementById("edit-profile-height").value = p.heightCm || 175;
    document.getElementById("edit-profile-weight").value = p.currentWeightKg || 74.5;
    document.getElementById("edit-profile-target-weight").value = p.targetWeightKg || 70.0;
    document.getElementById("edit-profile-experience").value = p.experienceLevel || "Intermediate";
    document.getElementById("edit-profile-goal").value = p.primaryGoal || "Muscle Gain";
    document.getElementById("edit-profile-equipment").value = p.equipment || "Full Gym";
    document.getElementById("edit-profile-calorie-target").value = p.dailyCalorieTarget || 2400;
    document.getElementById("edit-profile-water-target").value = p.waterTargetMl || 3000;

    // Theme active state
    document.querySelectorAll(".theme-option-btn").forEach(btn => {
      btn.classList.toggle("selected", btn.getAttribute("data-theme") === settings.theme);
    });

    if (window.lucide) window.lucide.createIcons();
  },

  saveProfileForm: () => {
    const p = Storage.getUserProfile();

    p.name = document.getElementById("edit-profile-name").value.trim() || p.name;
    const rawEmail = document.getElementById("edit-profile-email").value.trim();
    p.email = (rawEmail === "jhonto@fitmate.app") ? "" : rawEmail;
    p.age = parseInt(document.getElementById("edit-profile-age").value, 10) || p.age;
    p.gender = document.getElementById("edit-profile-gender").value || p.gender;
    p.heightCm = parseFloat(document.getElementById("edit-profile-height").value) || p.heightCm;
    p.currentWeightKg = parseFloat(document.getElementById("edit-profile-weight").value) || p.currentWeightKg;
    p.targetWeightKg = parseFloat(document.getElementById("edit-profile-target-weight").value) || p.targetWeightKg;
    p.experienceLevel = document.getElementById("edit-profile-experience").value || p.experienceLevel;
    p.primaryGoal = document.getElementById("edit-profile-goal").value || p.primaryGoal;
    p.equipment = document.getElementById("edit-profile-equipment").value || p.equipment;
    p.dailyCalorieTarget = parseInt(document.getElementById("edit-profile-calorie-target").value, 10) || p.dailyCalorieTarget;
    p.waterTargetMl = parseInt(document.getElementById("edit-profile-water-target").value, 10) || p.waterTargetMl;

    Storage.saveUserProfile(p);
    Navigation.showToast("Profile updated successfully!", "check-circle");
    Profile.render();
    if (window.Dashboard) window.Dashboard.render();
  },

  setTheme: (themeName) => {
    document.documentElement.setAttribute("data-theme", themeName);
    const settings = Storage.getSettings();
    settings.theme = themeName;
    Storage.saveSettings(settings);

    document.querySelectorAll(".theme-option-btn").forEach(btn => {
      btn.classList.toggle("selected", btn.getAttribute("data-theme") === themeName);
    });
  },

  exportBackup: () => {
    const jsonStr = Storage.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FitMate_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Navigation.showToast("Data backup downloaded!", "download");
  },

  importBackup: (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = Storage.importBackupJSON(event.target.result);
      if (res.success) {
        Navigation.showToast(res.message, "check-circle");
        setTimeout(() => location.reload(), 800);
      } else {
        alert("Failed to restore backup: " + res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  },

  // ==================== ONBOARDING WIZARD ====================
  onboardingData: {},
  currentOnboardingStep: 1,

  initOnboarding: () => {
    const nextBtn = document.getElementById("onboarding-next-btn");
    const prevBtn = document.getElementById("onboarding-prev-btn");

    if (nextBtn) {
      nextBtn.addEventListener("click", Profile.handleOnboardingNext);
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", Profile.handleOnboardingPrev);
    }

    // Selectable cards in onboarding
    document.querySelectorAll(".onboarding-option-card").forEach(card => {
      card.addEventListener("click", () => {
        const group = card.getAttribute("data-group");
        document.querySelectorAll(`.onboarding-option-card[data-group="${group}"]`).forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });
  },

  showOnboardingIfRequired: () => {
    if (!Storage.isOnboarded()) {
      const screen = document.getElementById("screen-onboarding");
      if (screen) {
        screen.classList.remove("hide");
        Profile.currentOnboardingStep = 1;
        Profile.updateOnboardingUI();
      }
    }
  },

  updateOnboardingUI: () => {
    // Hide all step views, show active
    for (let i = 1; i <= 4; i++) {
      const stepView = document.getElementById(`onboarding-step-${i}`);
      const stepBar = document.getElementById(`onboarding-bar-${i}`);
      if (stepView) stepView.classList.toggle("active", i === Profile.currentOnboardingStep);
      if (stepBar) stepBar.classList.toggle("active", i <= Profile.currentOnboardingStep);
    }

    const prevBtn = document.getElementById("onboarding-prev-btn");
    const nextBtn = document.getElementById("onboarding-next-btn");

    if (prevBtn) prevBtn.style.visibility = Profile.currentOnboardingStep === 1 ? "hidden" : "visible";
    if (nextBtn) {
      nextBtn.textContent = Profile.currentOnboardingStep === 4 ? "Complete Setup 🚀" : "Next Step →";
    }
  },

  handleOnboardingNext: () => {
    if (Profile.currentOnboardingStep === 1) {
      const name = document.getElementById("onboard-name").value.trim();
      const age = parseInt(document.getElementById("onboard-age").value, 10);
      if (!name) {
        alert("Please enter your name.");
        return;
      }
      Profile.onboardingData.name = name;
      Profile.onboardingData.age = age || 25;
      Profile.onboardingData.gender = document.getElementById("onboard-gender").value;
    } else if (Profile.currentOnboardingStep === 2) {
      const height = parseFloat(document.getElementById("onboard-height").value);
      const weight = parseFloat(document.getElementById("onboard-weight").value);
      const target = parseFloat(document.getElementById("onboard-target-weight").value);
      if (!height || !weight) {
        alert("Please enter height and current weight.");
        return;
      }
      Profile.onboardingData.heightCm = height;
      Profile.onboardingData.currentWeightKg = weight;
      Profile.onboardingData.targetWeightKg = target || weight;
    } else if (Profile.currentOnboardingStep === 3) {
      const selectedExp = document.querySelector(`.onboarding-option-card[data-group="exp"].selected`);
      const selectedGoal = document.querySelector(`.onboarding-option-card[data-group="goal"].selected`);
      Profile.onboardingData.experienceLevel = selectedExp ? selectedExp.getAttribute("data-val") : "Intermediate";
      Profile.onboardingData.primaryGoal = selectedGoal ? selectedGoal.getAttribute("data-val") : "Muscle Gain";
    } else if (Profile.currentOnboardingStep === 4) {
      const selectedEquip = document.querySelector(`.onboarding-option-card[data-group="equip"].selected`);
      Profile.onboardingData.equipment = selectedEquip ? selectedEquip.getAttribute("data-val") : "Full Gym";

      // Finalize onboarding
      Profile.completeOnboarding();
      return;
    }

    Profile.currentOnboardingStep++;
    Profile.updateOnboardingUI();
  },

  handleOnboardingPrev: () => {
    if (Profile.currentOnboardingStep > 1) {
      Profile.currentOnboardingStep--;
      Profile.updateOnboardingUI();
    }
  },

  completeOnboarding: () => {
    const profile = Storage.getUserProfile();
    Object.assign(profile, Profile.onboardingData);

    // Calculate baseline calorie target from goal
    let calTarget = 2400;
    if (profile.primaryGoal === "Weight Loss") calTarget = 1900;
    else if (profile.primaryGoal === "Muscle Gain") calTarget = 2600;
    else if (profile.primaryGoal === "Strength Building") calTarget = 2500;
    profile.dailyCalorieTarget = calTarget;

    Storage.saveUserProfile(profile);
    Storage.addWeightEntry(profile.currentWeightKg, new Date().toISOString().split("T")[0], "Starting check-in");
    Storage.setOnboarded(true);

    const screen = document.getElementById("screen-onboarding");
    if (screen) screen.classList.add("hide");

    Navigation.showToast(`Welcome to FitMate, ${profile.name}! 🏋️‍♂️`, "award", 4000);
    Navigation.navigateTo("screen-home");
    if (window.Dashboard) window.Dashboard.render();
  }
};

window.Profile = Profile;

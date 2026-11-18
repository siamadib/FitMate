/**
 * FitMate Fitness Calculators
 * BMI, BMR, TDEE, Macro split, Goal estimator with profile synchronization.
 */

const Calculators = {
  activeCalcTab: "bmi",

  init: () => {
    // Calculator tab selectors
    document.querySelectorAll(".calc-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        Calculators.switchTab(tab);
      });
    });

    // BMI inputs
    const bmiWeight = document.getElementById("calc-bmi-weight");
    const bmiHeight = document.getElementById("calc-bmi-height");
    if (bmiWeight && bmiHeight) {
      const calcBMI = () => Calculators.calculateBMI();
      bmiWeight.addEventListener("input", calcBMI);
      bmiHeight.addEventListener("input", calcBMI);
    }

    // TDEE inputs
    const tdeeWeight = document.getElementById("calc-tdee-weight");
    const tdeeHeight = document.getElementById("calc-tdee-height");
    const tdeeAge = document.getElementById("calc-tdee-age");
    const tdeeGender = document.getElementById("calc-tdee-gender");
    const tdeeActivity = document.getElementById("calc-tdee-activity");
    const tdeeGoal = document.getElementById("calc-tdee-goal");

    [tdeeWeight, tdeeHeight, tdeeAge, tdeeGender, tdeeActivity, tdeeGoal].forEach(el => {
      if (el) el.addEventListener("change", Calculators.calculateTDEE);
      if (el) el.addEventListener("input", Calculators.calculateTDEE);
    });

    // Apply calculated targets to profile
    const applyBtn = document.getElementById("calc-apply-to-profile-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", Calculators.applyTargetsToProfile);
    }

    // Auto-fill from user profile
    Calculators.prefillFromProfile();
    Calculators.calculateBMI();
    Calculators.calculateTDEE();
  },

  prefillFromProfile: () => {
    const p = Storage.getUserProfile();
    if (!p) return;

    if (document.getElementById("calc-bmi-weight")) document.getElementById("calc-bmi-weight").value = p.currentWeightKg || 74.5;
    if (document.getElementById("calc-bmi-height")) document.getElementById("calc-bmi-height").value = p.heightCm || 175;

    if (document.getElementById("calc-tdee-weight")) document.getElementById("calc-tdee-weight").value = p.currentWeightKg || 74.5;
    if (document.getElementById("calc-tdee-height")) document.getElementById("calc-tdee-height").value = p.heightCm || 175;
    if (document.getElementById("calc-tdee-age")) document.getElementById("calc-tdee-age").value = p.age || 26;
    if (document.getElementById("calc-tdee-gender")) document.getElementById("calc-tdee-gender").value = (p.gender || "male").toLowerCase();
  },

  switchTab: (tabName) => {
    Calculators.activeCalcTab = tabName;
    document.querySelectorAll(".calc-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });

    document.querySelectorAll(".calc-tab-content").forEach(content => {
      content.style.display = content.id === `calc-view-${tabName}` ? "block" : "none";
    });
  },

  calculateBMI: () => {
    const weight = parseFloat(document.getElementById("calc-bmi-weight").value);
    const heightCm = parseFloat(document.getElementById("calc-bmi-height").value);

    if (!weight || !heightCm || heightCm <= 0) return;

    const heightM = heightCm / 100;
    const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;

    let category = "Normal weight";
    let badgeClass = "badge-green";
    if (bmi < 18.5) {
      category = "Underweight";
      badgeClass = "badge-orange";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      badgeClass = "badge-orange";
    } else if (bmi >= 30) {
      category = "Obesity range";
      badgeClass = "badge-orange";
    }

    const valEl = document.getElementById("calc-bmi-result-val");
    const catEl = document.getElementById("calc-bmi-result-cat");
    if (valEl) valEl.textContent = `${bmi}`;
    if (catEl) {
      catEl.textContent = category;
      catEl.className = `badge-pill ${badgeClass}`;
    }
  },

  calculateTDEE: () => {
    const weight = parseFloat(document.getElementById("calc-tdee-weight").value) || 74.5;
    const height = parseFloat(document.getElementById("calc-tdee-height").value) || 175;
    const age = parseInt(document.getElementById("calc-tdee-age").value, 10) || 26;
    const gender = document.getElementById("calc-tdee-gender").value || "male";
    const activityMult = parseFloat(document.getElementById("calc-tdee-activity").value) || 1.55;
    const goal = document.getElementById("calc-tdee-goal").value || "maintain";

    // Mifflin-St Jeor formula
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    bmr = Math.round(bmr);

    const tdee = Math.round(bmr * activityMult);

    let targetCalories = tdee;
    if (goal === "loss") targetCalories = Math.max(1200, tdee - 500); // 500 kcal deficit
    else if (goal === "gain") targetCalories = tdee + 400; // 400 kcal surplus

    // Protein: 2.0g per kg for muscle gain/loss
    const proteinGrams = Math.round(weight * 2.0);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);
    const carbGrams = Math.round((targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

    document.getElementById("calc-bmr-result-val").textContent = `${bmr} kcal`;
    document.getElementById("calc-tdee-result-val").textContent = `${tdee} kcal`;
    document.getElementById("calc-target-calories-val").textContent = `${targetCalories} kcal`;

    document.getElementById("calc-macro-protein-val").textContent = `${proteinGrams}g`;
    document.getElementById("calc-macro-carbs-val").textContent = `${carbGrams}g`;
    document.getElementById("calc-macro-fat-val").textContent = `${fatGrams}g`;

    Calculators.lastCalculatedTargets = {
      targetCalories,
      proteinGrams,
      carbGrams,
      fatGrams
    };
  },

  applyTargetsToProfile: () => {
    if (!Calculators.lastCalculatedTargets) Calculators.calculateTDEE();
    const targets = Calculators.lastCalculatedTargets;

    const profile = Storage.getUserProfile();
    profile.dailyCalorieTarget = targets.targetCalories;
    profile.proteinTargetGrams = targets.proteinGrams;
    profile.carbTargetGrams = targets.carbGrams;
    profile.fatTargetGrams = targets.fatGrams;

    Storage.saveUserProfile(profile);
    Navigation.showToast(`Applied: ${targets.targetCalories} kcal / ${targets.proteinGrams}g protein!`, "check-circle");
  }
};

window.Calculators = Calculators;

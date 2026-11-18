/**
 * FitMate Nutrition & Diet Tracker
 * Meal logging, Bangladeshi food database, macro breakdowns, and water intake.
 */

const Nutrition = {
  currentMealType: "breakfast", // breakfast, lunch, dinner, snack
  selectedFoodForLog: null,
  foodQuantityGrams: 100,

  init: () => {
    // Water tracker buttons
    const add250Btn = document.getElementById("water-add-250-btn");
    const add500Btn = document.getElementById("water-add-500-btn");
    const resetWaterBtn = document.getElementById("water-reset-btn");

    if (add250Btn) add250Btn.addEventListener("click", () => Nutrition.updateWater(250));
    if (add500Btn) add500Btn.addEventListener("click", () => Nutrition.updateWater(500));
    if (resetWaterBtn) resetWaterBtn.addEventListener("click", () => Nutrition.resetWater());

    // Food search input in modal
    const foodSearchInput = document.getElementById("nutrition-food-search-input");
    if (foodSearchInput) {
      foodSearchInput.addEventListener("input", (e) => {
        Nutrition.renderFoodPicker(e.target.value);
      });
    }

    // Grams / quantity change in portion modal
    const gramsInput = document.getElementById("portion-modal-grams-input");
    if (gramsInput) {
      gramsInput.addEventListener("input", (e) => {
        Nutrition.foodQuantityGrams = parseFloat(e.target.value) || 0;
        Nutrition.recalculatePortionMacros();
      });
    }

    // Save food entry button
    const confirmAddFoodBtn = document.getElementById("portion-modal-confirm-btn");
    if (confirmAddFoodBtn) {
      confirmAddFoodBtn.addEventListener("click", Nutrition.confirmLogFood);
    }
  },

  render: () => {
    const today = new Date().toISOString().split("T")[0];
    const profile = Storage.getUserProfile();
    const logs = Storage.getNutritionLogs(today);

    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const mealsMap = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    logs.forEach(item => {
      totalCalories += (item.calories || 0);
      totalProtein += (item.protein || 0);
      totalCarbs += (item.carbs || 0);
      totalFat += (item.fat || 0);

      const m = (item.meal || "snack").toLowerCase();
      if (mealsMap[m]) {
        mealsMap[m].push(item);
      } else {
        mealsMap.snack.push(item);
      }
    });

    // Update calorie hero summary
    const calTarget = profile.dailyCalorieTarget || 2400;
    const calLeft = Math.max(0, calTarget - Math.round(totalCalories));
    const calPercent = Math.min(100, Math.round((totalCalories / calTarget) * 100));

    const totalCalEl = document.getElementById("nutri-total-calories");
    const targetCalEl = document.getElementById("nutri-target-calories");
    const leftCalEl = document.getElementById("nutri-calories-left");
    const calFillEl = document.getElementById("nutri-calories-fill");

    if (totalCalEl) totalCalEl.textContent = `${Math.round(totalCalories)}`;
    if (targetCalEl) targetCalEl.textContent = `${calTarget}`;
    if (leftCalEl) leftCalEl.textContent = `${calLeft} kcal left`;
    if (calFillEl) calFillEl.style.width = `${calPercent}%`;

    // Update Macro Bars
    const protTarget = profile.proteinTargetGrams || 150;
    const carbTarget = profile.carbTargetGrams || 270;
    const fatTarget = profile.fatTargetGrams || 65;

    Nutrition.updateMacroBar("protein", totalProtein, protTarget, "g");
    Nutrition.updateMacroBar("carbs", totalCarbs, carbTarget, "g");
    Nutrition.updateMacroBar("fat", totalFat, fatTarget, "g");

    // Render Meals Lists
    Nutrition.renderMealSection("breakfast", mealsMap.breakfast);
    Nutrition.renderMealSection("lunch", mealsMap.lunch);
    Nutrition.renderMealSection("dinner", mealsMap.dinner);
    Nutrition.renderMealSection("snack", mealsMap.snack);

    // Water section
    Nutrition.renderWater();

    if (window.lucide) window.lucide.createIcons();
  },

  updateMacroBar: (name, current, target, unit) => {
    const curEl = document.getElementById(`nutri-${name}-current`);
    const tarEl = document.getElementById(`nutri-${name}-target`);
    const fillEl = document.getElementById(`nutri-${name}-fill`);

    if (curEl) curEl.textContent = `${Math.round(current)}${unit}`;
    if (tarEl) tarEl.textContent = `${target}${unit}`;
    if (fillEl) {
      const pct = Math.min(100, Math.round((current / target) * 100));
      fillEl.style.width = `${pct}%`;
    }
  },

  renderMealSection: (mealType, items) => {
    const container = document.getElementById(`meal-${mealType}-items-list`);
    const calBadge = document.getElementById(`meal-${mealType}-cal-total`);
    if (!container) return;

    const mealCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);
    if (calBadge) calBadge.textContent = `${Math.round(mealCalories)} kcal`;

    if (items.length === 0) {
      container.innerHTML = `
        <div style="font-size: 12px; color: var(--text-muted); padding: 8px 0;">
          No foods logged yet for ${mealType}.
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
        <div>
          <div style="font-size: 13.5px; font-weight: 700; color: #ffffff;">${item.name}</div>
          <div style="font-size: 11.5px; color: var(--text-secondary);">
            ${item.portionDesc || (item.quantityGrams + 'g')} • P: ${Math.round(item.protein)}g | C: ${Math.round(item.carbs)}g | F: ${Math.round(item.fat)}g
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 13px; font-weight: 700; color: var(--accent-primary);">${Math.round(item.calories)} kcal</span>
          <button class="icon-button" style="width: 28px; height: 28px; color: var(--danger);" onclick="Nutrition.deleteFoodItem('${item.id}')">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
    `).join("");
  },

  deleteFoodItem: (itemId) => {
    Storage.deleteNutritionLog(itemId);
    Navigation.showToast("Food item removed", "trash");
    Nutrition.render();
    if (window.Dashboard) window.Dashboard.render();
  },

  // ==================== FOOD PICKER MODAL ====================
  openFoodPicker: (mealType) => {
    Nutrition.currentMealType = mealType;
    const titleEl = document.getElementById("modal-picker-meal-name");
    if (titleEl) {
      titleEl.textContent = mealType.charAt(0).toUpperCase() + mealType.slice(1);
    }

    Navigation.openModal("modal-nutrition-food-picker");
    Nutrition.renderFoodPicker();
  },

  renderFoodPicker: (searchQuery = "") => {
    const listEl = document.getElementById("nutrition-picker-list");
    if (!listEl) return;

    let foods = FITMATE_FOODS;
    if (searchQuery) {
      foods = FoodData.search(searchQuery);
    }

    listEl.innerHTML = foods.map(food => `
      <div class="exercise-card" onclick="Nutrition.selectFoodForPortion('${food.id}')">
        <div class="exercise-card-left">
          <div class="exercise-icon-avatar" style="font-size: 22px;">
            ${food.icon || "🥗"}
          </div>
          <div class="exercise-info">
            <h4>${food.name}</h4>
            <p>${food.servingSize} • P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g</p>
          </div>
        </div>
        <span class="badge-pill badge-orange">${food.calories} kcal</span>
      </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
  },

  selectFoodForPortion: (foodId) => {
    const food = FoodData.getById(foodId);
    if (!food) return;

    Nutrition.selectedFoodForLog = food;
    Nutrition.foodQuantityGrams = food.servingGrams || 100;

    Navigation.closeModal("modal-nutrition-food-picker");

    // Populate portion modal
    document.getElementById("portion-modal-food-name").textContent = food.name;
    document.getElementById("portion-modal-serving-desc").textContent = `Standard serving: ${food.servingSize}`;
    document.getElementById("portion-modal-grams-input").value = Nutrition.foodQuantityGrams;

    Nutrition.recalculatePortionMacros();
    Navigation.openModal("modal-food-portion-adjust");
  },

  recalculatePortionMacros: () => {
    const food = Nutrition.selectedFoodForLog;
    if (!food) return;

    const ratio = Nutrition.foodQuantityGrams / (food.servingGrams || 100);
    const cal = Math.round(food.calories * ratio);
    const prot = Math.round(food.protein * ratio * 10) / 10;
    const carbs = Math.round(food.carbs * ratio * 10) / 10;
    const fat = Math.round(food.fat * ratio * 10) / 10;

    document.getElementById("portion-calc-calories").textContent = `${cal} kcal`;
    document.getElementById("portion-calc-protein").textContent = `${prot}g`;
    document.getElementById("portion-calc-carbs").textContent = `${carbs}g`;
    document.getElementById("portion-calc-fat").textContent = `${fat}g`;
  },

  confirmLogFood: () => {
    const food = Nutrition.selectedFoodForLog;
    if (!food) return;

    const ratio = Nutrition.foodQuantityGrams / (food.servingGrams || 100);
    const entry = {
      name: food.name,
      category: food.category,
      meal: Nutrition.currentMealType,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      quantityGrams: Nutrition.foodQuantityGrams,
      portionDesc: `${Nutrition.foodQuantityGrams}g`
    };

    Storage.addNutritionLog(entry);
    Navigation.closeModal("modal-food-portion-adjust");
    Navigation.showToast(`Logged ${food.name} to ${Nutrition.currentMealType}!`, "check-circle");

    Nutrition.render();
    if (window.Dashboard) window.Dashboard.render();
  },

  // ==================== WATER TRACKER ====================
  renderWater: () => {
    const today = new Date().toISOString().split("T")[0];
    const profile = Storage.getUserProfile();
    const current = Storage.getWaterIntake(today);
    const target = profile.waterTargetMl || 3000;
    const percent = Math.min(100, Math.round((current / target) * 100));

    const amountEl = document.getElementById("water-current-amount");
    const targetEl = document.getElementById("water-target-amount");
    const percentEl = document.getElementById("water-percent-badge");
    const fillEl = document.getElementById("water-fill-bar");

    if (amountEl) amountEl.textContent = `${current} ml`;
    if (targetEl) targetEl.textContent = `Goal: ${target} ml`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;
  },

  updateWater: (delta) => {
    const newAmount = Storage.addWaterIntake(delta);
    Nutrition.renderWater();
    Navigation.showToast(`Water updated: ${newAmount} ml`, "droplet");
    if (window.Dashboard) window.Dashboard.render();
  },

  resetWater: () => {
    Storage.setWaterIntake(0);
    Nutrition.renderWater();
    Navigation.showToast("Water reset for today", "rotate-ccw");
    if (window.Dashboard) window.Dashboard.render();
  }
};

window.Nutrition = Nutrition;

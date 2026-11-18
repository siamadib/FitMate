/**
 * FitMate Exercise Library & Exercise Details Module
 */

const ExerciseModule = {
  currentCategory: "All",
  searchQuery: "",
  selectedExercise: null,

  init: () => {
    // Search input listener
    const searchInput = document.getElementById("exercise-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        ExerciseModule.searchQuery = e.target.value;
        ExerciseModule.renderList();
      });
    }

    // Category filter chips
    const categories = ExerciseData.getCategories();
    const chipsContainer = document.getElementById("exercise-category-chips");
    if (chipsContainer) {
      chipsContainer.innerHTML = categories.map(cat => {
        const isActive = cat === ExerciseModule.currentCategory ? "active" : "";
        return `
          <button class="chip ${isActive}" onclick="ExerciseModule.selectCategory('${cat}')">
            ${cat}
          </button>
        `;
      }).join("");
    }
  },

  render: () => {
    ExerciseModule.renderList();
  },

  selectCategory: (category) => {
    ExerciseModule.currentCategory = category;
    document.querySelectorAll("#exercise-category-chips .chip").forEach(chip => {
      chip.classList.toggle("active", chip.textContent.trim() === category);
    });
    ExerciseModule.renderList();
  },

  renderList: () => {
    const listEl = document.getElementById("exercise-library-list");
    if (!listEl) return;

    let exercises = ExerciseData.getByCategory(ExerciseModule.currentCategory);
    if (ExerciseModule.searchQuery) {
      const q = ExerciseModule.searchQuery.toLowerCase();
      exercises = exercises.filter(e => 
        e.name.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q) ||
        e.primaryMuscles.some(m => m.toLowerCase().includes(q))
      );
    }

    if (exercises.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i data-lucide="search-x" style="width: 36px; height: 36px; margin-bottom: 8px;"></i>
          <p>No exercises found matching "${ExerciseModule.searchQuery}"</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    listEl.innerHTML = exercises.map(ex => {
      let diffBadge = "badge-muted";
      if (ex.difficulty === "Beginner") diffBadge = "badge-green";
      else if (ex.difficulty === "Advanced") diffBadge = "badge-orange";

      return `
        <div class="exercise-card" onclick="ExerciseModule.openDetails('${ex.id}')">
          <div class="exercise-card-left">
            <div class="exercise-icon-avatar">
              <i data-lucide="activity"></i>
            </div>
            <div class="exercise-info">
              <h4>${ex.name}</h4>
              <p>${ex.category} • ${ex.equipment}</p>
            </div>
          </div>
          <span class="badge-pill ${diffBadge}">${ex.difficulty}</span>
        </div>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  },

  openDetails: (exerciseId) => {
    const ex = ExerciseData.getById(exerciseId);
    if (!ex) return;

    ExerciseModule.selectedExercise = ex;

    document.getElementById("modal-ex-title").textContent = ex.name;
    document.getElementById("modal-ex-category").textContent = `${ex.category} • ${ex.equipment}`;
    document.getElementById("modal-ex-difficulty").textContent = ex.difficulty;
    
    document.getElementById("modal-ex-primary-muscles").textContent = ex.primaryMuscles.join(", ");
    document.getElementById("modal-ex-secondary-muscles").textContent = ex.secondaryMuscles.length > 0 ? ex.secondaryMuscles.join(", ") : "None";

    document.getElementById("modal-ex-suggested-sets").textContent = ex.suggestedSets || "3-4";
    document.getElementById("modal-ex-suggested-reps").textContent = ex.suggestedReps || "8-12";
    document.getElementById("modal-ex-tips").textContent = ex.tips || "Focus on mind-muscle connection.";

    // Instructions list
    const instructionsList = document.getElementById("modal-ex-instructions");
    if (instructionsList) {
      instructionsList.innerHTML = ex.instructions.map((step, idx) => `
        <li style="margin-bottom: 8px; font-size: 13.5px; line-height: 1.5; color: var(--text-primary);">
          <strong style="color: var(--accent-primary);">${idx + 1}.</strong> ${step}
        </li>
      `).join("");
    }

    // Common mistakes list
    const mistakesList = document.getElementById("modal-ex-mistakes");
    if (mistakesList) {
      mistakesList.innerHTML = ex.commonMistakes.map(m => `
        <li style="margin-bottom: 6px; font-size: 13px; color: var(--danger);">
          ⚠️ ${m}
        </li>
      `).join("");
    }

    Navigation.openModal("modal-exercise-detail");
  },

  addSelectedToActiveBuilder: () => {
    if (!ExerciseModule.selectedExercise) return;
    Navigation.closeModal("modal-exercise-detail");
    Workout.openRoutineEditor();
    Workout.addSelectedExerciseToBuilder(ExerciseModule.selectedExercise.id);
  }
};

window.ExerciseModule = ExerciseModule;

/**
 * FitMate Workout Module
 * Routine builder, active workout tracker, set logger, progressive overload, and rest timer.
 */

const Workout = {
  activeSession: null,
  timerInterval: null,
  restTimerInterval: null,
  restSecondsLeft: 0,
  editingRoutine: null,

  init: () => {
    // Rest timer buttons
    const skipRestBtn = document.getElementById("rest-timer-skip-btn");
    const addRest30Btn = document.getElementById("rest-timer-add30-btn");
    if (skipRestBtn) skipRestBtn.addEventListener("click", Workout.skipRestTimer);
    if (addRest30Btn) addRest30Btn.addEventListener("click", () => Workout.extendRestTimer(30));

    // Active session control buttons
    const pauseTimerBtn = document.getElementById("active-timer-pause-btn");
    const finishWorkoutBtn = document.getElementById("active-finish-workout-btn");
    const cancelWorkoutBtn = document.getElementById("active-cancel-workout-btn");

    if (pauseTimerBtn) pauseTimerBtn.addEventListener("click", Workout.toggleTimerPause);
    if (finishWorkoutBtn) finishWorkoutBtn.addEventListener("click", Workout.promptFinishWorkout);
    if (cancelWorkoutBtn) cancelWorkoutBtn.addEventListener("click", Workout.cancelWorkout);
  },

  // ==================== ROUTINES LIST ====================
  renderRoutines: () => {
    const routinesList = document.getElementById("workout-routines-container");
    if (!routinesList) return;

    const routines = Storage.getRoutines();

    routinesList.innerHTML = routines.map(routine => {
      const exerciseNames = (routine.exercises || [])
        .map(e => {
          const ex = ExerciseData.getById(e.exerciseId);
          return ex ? ex.name : "Exercise";
        })
        .slice(0, 3)
        .join(", ");

      const daysList = (routine.days || []).join(", ") || "Flexible";

      return `
        <div class="card card-glow" style="margin-bottom: 16px;">
          <div class="card-header" style="margin-bottom: 8px;">
            <div class="card-title-group">
              <span class="card-subtitle">${routine.split || "Custom Split"} • ${daysList}</span>
              <h3 class="card-title">${routine.name}</h3>
            </div>
            <div class="header-actions">
              <button class="icon-button" title="Duplicate" onclick="Workout.duplicate('${routine.id}')">
                <i data-lucide="copy"></i>
              </button>
              <button class="icon-button" title="Edit" onclick="Workout.openRoutineEditor('${routine.id}')">
                <i data-lucide="edit-3"></i>
              </button>
            </div>
          </div>
          
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px;">
            ${routine.exercises.length} exercises (${exerciseNames}${routine.exercises.length > 3 ? "..." : ""})
          </p>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary btn-block" onclick="Workout.startWorkoutSession('${routine.id}')">
              <i data-lucide="play"></i> Start Workout
            </button>
            <button class="btn btn-ghost" onclick="Workout.confirmDelete('${routine.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  },

  duplicate: (routineId) => {
    const copy = Storage.duplicateRoutine(routineId);
    if (copy) {
      Navigation.showToast(`Duplicated "${copy.name}"`, "copy");
      Workout.renderRoutines();
    }
  },

  confirmDelete: (routineId) => {
    if (confirm("Are you sure you want to delete this workout routine?")) {
      Storage.deleteRoutine(routineId);
      Navigation.showToast("Routine deleted", "trash");
      Workout.renderRoutines();
    }
  },

  // ==================== ROUTINE BUILDER ====================
  openRoutineEditor: (routineId = null) => {
    let routine = null;
    if (routineId) {
      routine = Storage.getRoutines().find(r => r.id === routineId);
    }

    if (!routine) {
      routine = {
        id: "routine-" + Date.now(),
        name: "My Custom Routine",
        split: "Push / Pull / Legs",
        days: ["Monday"],
        targetMuscles: ["Chest", "Triceps"],
        description: "",
        exercises: []
      };
    }

    Workout.editingRoutine = JSON.parse(JSON.stringify(routine));
    Workout.renderRoutineEditor();
    Navigation.navigateTo("screen-routine-builder");
  },

  renderRoutineEditor: () => {
    const r = Workout.editingRoutine;
    if (!r) return;

    document.getElementById("builder-routine-name").value = r.name || "";
    document.getElementById("builder-routine-split").value = r.split || "Custom Split";
    document.getElementById("builder-routine-desc").value = r.description || "";

    // Training days checkboxes
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const daysContainer = document.getElementById("builder-days-container");
    if (daysContainer) {
      daysContainer.innerHTML = days.map(d => {
        const isChecked = (r.days || []).includes(d) ? "checked" : "";
        return `
          <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer;">
            <input type="checkbox" name="routine-day" value="${d}" ${isChecked} onchange="Workout.updateEditingDays()">
            ${d.slice(0, 3)}
          </label>
        `;
      }).join("");
    }

    // Exercises in builder list
    const exercisesContainer = document.getElementById("builder-exercises-list");
    if (exercisesContainer) {
      if (r.exercises.length === 0) {
        exercisesContainer.innerHTML = `
          <div style="text-align: center; padding: 24px; border: 2px dashed var(--border-card); border-radius: var(--radius-md); color: var(--text-muted);">
            No exercises added yet. Tap below to select exercises from library!
          </div>
        `;
      } else {
        exercisesContainer.innerHTML = r.exercises.map((item, index) => {
          const ex = ExerciseData.getById(item.exerciseId) || { name: "Custom Exercise", category: "General" };

          return `
            <div class="card" style="margin-bottom: 12px; padding: 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 12px; font-weight: 800; color: var(--accent-primary); width: 20px;">#${index + 1}</span>
                  <div>
                    <h4 style="font-size: 14.5px; font-weight: 700;">${ex.name}</h4>
                    <span style="font-size: 11px; color: var(--text-secondary);">${ex.category} • ${ex.equipment}</span>
                  </div>
                </div>
                <div style="display: flex; gap: 4px;">
                  <button class="icon-button" style="width: 32px; height: 32px;" onclick="Workout.moveExerciseInBuilder(${index}, -1)">
                    <i data-lucide="chevron-up"></i>
                  </button>
                  <button class="icon-button" style="width: 32px; height: 32px;" onclick="Workout.moveExerciseInBuilder(${index}, 1)">
                    <i data-lucide="chevron-down"></i>
                  </button>
                  <button class="icon-button" style="width: 32px; height: 32px; color: var(--danger);" onclick="Workout.removeExerciseInBuilder(${index})">
                    <i data-lucide="trash"></i>
                  </button>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 10.5px;">Sets</label>
                  <input type="number" class="form-control" style="padding: 6px;" value="${item.sets || 3}" 
                    onchange="Workout.updateExerciseParam(${index}, 'sets', this.value)">
                </div>
                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 10.5px;">Reps</label>
                  <input type="number" class="form-control" style="padding: 6px;" value="${item.reps || 10}" 
                    onchange="Workout.updateExerciseParam(${index}, 'reps', this.value)">
                </div>
                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 10.5px;">Weight (kg)</label>
                  <input type="number" class="form-control" style="padding: 6px;" value="${item.weightKg || 0}" 
                    onchange="Workout.updateExerciseParam(${index}, 'weightKg', this.value)">
                </div>
                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 10.5px;">Rest (s)</label>
                  <input type="number" class="form-control" style="padding: 6px;" value="${item.restSeconds || 60}" 
                    onchange="Workout.updateExerciseParam(${index}, 'restSeconds', this.value)">
                </div>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  },

  updateEditingDays: () => {
    const checked = Array.from(document.querySelectorAll("input[name='routine-day']:checked")).map(cb => cb.value);
    if (Workout.editingRoutine) Workout.editingRoutine.days = checked;
  },

  updateExerciseParam: (index, field, value) => {
    if (Workout.editingRoutine && Workout.editingRoutine.exercises[index]) {
      Workout.editingRoutine.exercises[index][field] = parseFloat(value) || value;
    }
  },

  moveExerciseInBuilder: (index, direction) => {
    const list = Workout.editingRoutine.exercises;
    const newIdx = index + direction;
    if (newIdx >= 0 && newIdx < list.length) {
      const temp = list[index];
      list[index] = list[newIdx];
      list[newIdx] = temp;
      Workout.renderRoutineEditor();
    }
  },

  removeExerciseInBuilder: (index) => {
    Workout.editingRoutine.exercises.splice(index, 1);
    Workout.renderRoutineEditor();
  },

  openAddExerciseModal: () => {
    Navigation.openModal("modal-exercise-picker");
    Workout.renderExercisePicker();
  },

  renderExercisePicker: (category = "All", search = "") => {
    const listEl = document.getElementById("picker-exercise-list");
    if (!listEl) return;

    let exercises = ExerciseData.getAll();
    if (category && category !== "All") {
      exercises = exercises.filter(e => e.category === category);
    }
    if (search) {
      exercises = ExerciseData.search(search);
    }

    listEl.innerHTML = exercises.map(ex => {
      return `
        <div class="exercise-card" onclick="Workout.addSelectedExerciseToBuilder('${ex.id}')">
          <div class="exercise-card-left">
            <div class="exercise-icon-avatar">
              <i data-lucide="activity"></i>
            </div>
            <div class="exercise-info">
              <h4>${ex.name}</h4>
              <p>${ex.category} • ${ex.equipment} • ${ex.difficulty}</p>
            </div>
          </div>
          <button class="btn btn-sm btn-primary">
            <i data-lucide="plus"></i> Add
          </button>
        </div>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  },

  addSelectedExerciseToBuilder: (exerciseId) => {
    const ex = ExerciseData.getById(exerciseId);
    if (!ex) return;

    Workout.editingRoutine.exercises.push({
      exerciseId: ex.id,
      sets: 3,
      reps: 10,
      weightKg: 20,
      restSeconds: ex.defaultRest || 60,
      notes: ""
    });

    Navigation.closeModal("modal-exercise-picker");
    Navigation.showToast(`Added ${ex.name}`, "plus-circle");
    Workout.renderRoutineEditor();
  },

  saveRoutineFromBuilder: () => {
    const name = document.getElementById("builder-routine-name").value.trim();
    if (!name) {
      alert("Please enter a routine name.");
      return;
    }

    Workout.editingRoutine.name = name;
    Workout.editingRoutine.split = document.getElementById("builder-routine-split").value;
    Workout.editingRoutine.description = document.getElementById("builder-routine-desc").value.trim();
    Workout.updateEditingDays();

    Storage.saveRoutine(Workout.editingRoutine);
    Navigation.showToast(`Saved routine "${name}"!`, "check-circle");
    Workout.renderRoutines();
    Navigation.navigateTo("screen-workout");
  },

  // ==================== ACTIVE WORKOUT SESSION ====================
  startWorkoutSession: (routineId) => {
    const routines = Storage.getRoutines();
    const routine = routines.find(r => r.id === routineId) || routines[0];

    // Find previous performance from history to display for progressive overload!
    const history = Storage.getWorkoutHistory();

    const activeSession = {
      routineId: routine.id,
      routineName: routine.name,
      startTime: Date.now(),
      elapsedSeconds: 0,
      isPaused: false,
      exercises: routine.exercises.map(item => {
        const exData = ExerciseData.getById(item.exerciseId);
        
        // Find previous session with this exercise
        let prevRecord = null;
        for (const h of history) {
          const match = (h.completedExercises || []).find(ce => ce.name === (exData ? exData.name : ""));
          if (match) {
            prevRecord = match;
            break;
          }
        }

        const setsList = [];
        const count = item.sets || 3;
        for (let s = 1; s <= count; s++) {
          setsList.push({
            setNumber: s,
            targetReps: item.reps || 10,
            actualReps: item.reps || 10,
            weightKg: item.weightKg || 0,
            restSeconds: item.restSeconds || 60,
            completed: false
          });
        }

        return {
          exerciseId: item.exerciseId,
          name: exData ? exData.name : "Exercise",
          category: exData ? exData.category : "Strength",
          previousWeight: prevRecord ? prevRecord.bestWeight : item.weightKg,
          previousReps: prevRecord ? prevRecord.bestReps : item.reps,
          sets: setsList
        };
      })
    };

    Workout.activeSession = activeSession;
    Storage.saveActiveWorkout(activeSession);

    Workout.startTimer();
    Workout.renderActiveWorkout();
    Navigation.navigateTo("screen-active-workout");
  },

  startTimer: () => {
    if (Workout.timerInterval) clearInterval(Workout.timerInterval);
    Workout.timerInterval = setInterval(() => {
      if (Workout.activeSession && !Workout.activeSession.isPaused) {
        Workout.activeSession.elapsedSeconds++;
        Workout.updateTimerDisplay();
      }
    }, 1000);
  },

  updateTimerDisplay: () => {
    const el = document.getElementById("active-workout-timer-display");
    if (!el || !Workout.activeSession) return;

    const totalSec = Workout.activeSession.elapsedSeconds;
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    el.textContent = `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  toggleTimerPause: () => {
    if (!Workout.activeSession) return;
    Workout.activeSession.isPaused = !Workout.activeSession.isPaused;
    const btn = document.getElementById("active-timer-pause-btn");
    if (btn) {
      btn.innerHTML = Workout.activeSession.isPaused 
        ? `<i data-lucide="play"></i> Resume` 
        : `<i data-lucide="pause"></i> Pause`;
      if (window.lucide) window.lucide.createIcons();
    }
  },

  renderActiveWorkout: () => {
    const s = Workout.activeSession;
    if (!s) return;

    document.getElementById("active-workout-routine-title").textContent = s.routineName;
    Workout.updateTimerDisplay();

    const container = document.getElementById("active-exercises-container");
    if (!container) return;

    container.innerHTML = s.exercises.map((ex, exIdx) => {
      return `
        <div class="card" style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 700; color: #ffffff;">${ex.name}</h3>
              <span style="font-size: 11.5px; color: var(--text-accent);">
                🔥 Previous PR: ${ex.previousWeight} kg × ${ex.previousReps} reps
              </span>
            </div>
            <span class="badge-pill badge-muted">${ex.sets.filter(st => st.completed).length}/${ex.sets.length} done</span>
          </div>

          <div style="font-size: 11px; color: var(--text-muted); display: grid; grid-template-columns: 32px 1fr 1fr 40px; gap: 8px; margin-bottom: 6px; padding: 0 12px; font-weight: 700;">
            <span>SET</span>
            <span>WEIGHT (KG)</span>
            <span>REPS</span>
            <span>DONE</span>
          </div>

          ${ex.sets.map((set, setIdx) => {
            const isCompleted = set.completed;
            return `
              <div class="set-row ${isCompleted ? 'completed' : ''}">
                <span style="font-weight: 700; color: ${isCompleted ? 'var(--success)' : 'var(--text-secondary)'};">
                  ${set.setNumber}
                </span>
                <input type="number" class="form-control" style="padding: 6px 8px; font-size: 13px;" value="${set.weightKg}"
                  onchange="Workout.updateSetData(${exIdx}, ${setIdx}, 'weightKg', this.value)">
                <input type="number" class="form-control" style="padding: 6px 8px; font-size: 13px;" value="${set.actualReps}"
                  onchange="Workout.updateSetData(${exIdx}, ${setIdx}, 'actualReps', this.value)">
                <button class="set-check-btn ${isCompleted ? 'checked' : ''}" onclick="Workout.toggleSetComplete(${exIdx}, ${setIdx})">
                  <i data-lucide="check"></i>
                </button>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  },

  updateSetData: (exIdx, setIdx, field, val) => {
    if (Workout.activeSession) {
      Workout.activeSession.exercises[exIdx].sets[setIdx][field] = parseFloat(val) || 0;
      Storage.saveActiveWorkout(Workout.activeSession);
    }
  },

  toggleSetComplete: (exIdx, setIdx) => {
    if (!Workout.activeSession) return;
    const set = Workout.activeSession.exercises[exIdx].sets[setIdx];
    set.completed = !set.completed;
    Storage.saveActiveWorkout(Workout.activeSession);

    Workout.renderActiveWorkout();

    // Trigger Rest Timer automatically if marked complete!
    if (set.completed) {
      Workout.triggerRestTimer(set.restSeconds || 60);
    }
  },

  // ==================== REST TIMER ====================
  triggerRestTimer: (seconds = 60) => {
    Workout.restSecondsLeft = seconds;
    const modal = document.getElementById("rest-timer-modal");
    if (modal) modal.classList.add("show");

    Workout.updateRestDisplay();

    if (Workout.restTimerInterval) clearInterval(Workout.restTimerInterval);
    Workout.restTimerInterval = setInterval(() => {
      Workout.restSecondsLeft--;
      Workout.updateRestDisplay();

      if (Workout.restSecondsLeft <= 0) {
        clearInterval(Workout.restTimerInterval);
        Workout.playRestBeep();
        Workout.skipRestTimer();
        Navigation.showToast("Rest time is up! Get ready for next set 💪", "bell");
      }
    }, 1000);
  },

  updateRestDisplay: () => {
    const el = document.getElementById("rest-timer-countdown");
    if (el) {
      const mins = Math.floor(Workout.restSecondsLeft / 60);
      const secs = Workout.restSecondsLeft % 60;
      el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  },

  skipRestTimer: () => {
    if (Workout.restTimerInterval) clearInterval(Workout.restTimerInterval);
    const modal = document.getElementById("rest-timer-modal");
    if (modal) modal.classList.remove("show");
  },

  extendRestTimer: (delta = 30) => {
    Workout.restSecondsLeft += delta;
    Workout.updateRestDisplay();
  },

  playRestBeep: () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.log("Audio feedback not supported in this environment");
    }
  },

  // ==================== FINISH WORKOUT ====================
  promptFinishWorkout: () => {
    if (!Workout.activeSession) return;

    // Calculate metrics
    let totalVolume = 0;
    let completedSetsCount = 0;
    const completedExercisesList = [];

    Workout.activeSession.exercises.forEach(ex => {
      let exSetsDone = 0;
      let maxWeight = 0;
      let maxReps = 0;

      ex.sets.forEach(s => {
        if (s.completed) {
          completedSetsCount++;
          exSetsDone++;
          totalVolume += (s.weightKg * s.actualReps);
          if (s.weightKg >= maxWeight) {
            maxWeight = s.weightKg;
            maxReps = s.actualReps;
          }
        }
      });

      if (exSetsDone > 0) {
        completedExercisesList.push({
          name: ex.name,
          setsCompleted: exSetsDone,
          bestWeight: maxWeight,
          bestReps: maxReps
        });
      }
    });

    const durationSec = Workout.activeSession.elapsedSeconds;
    const durationMins = Math.max(1, Math.round(durationSec / 60));
    // Estimate calories: ~6-8 kcal per min of weight training
    const estCalories = Math.round(durationMins * 7.5);

    document.getElementById("finish-modal-duration").textContent = `${durationMins} mins`;
    document.getElementById("finish-modal-volume").textContent = `${totalVolume.toLocaleString()} kg`;
    document.getElementById("finish-modal-sets").textContent = `${completedSetsCount} sets`;
    document.getElementById("finish-modal-calories").textContent = `~${estCalories} kcal`;

    // Store temporary completion summary
    Workout.completedSummary = {
      routineId: Workout.activeSession.routineId,
      routineName: Workout.activeSession.routineName,
      durationSeconds: durationSec,
      totalVolumeKg: totalVolume,
      totalSets: completedSetsCount,
      caloriesBurned: estCalories,
      completedExercises: completedExercisesList
    };

    Navigation.openModal("modal-finish-workout-summary");
  },

  confirmSaveWorkout: () => {
    if (!Workout.completedSummary) return;

    const notes = document.getElementById("finish-workout-notes").value.trim();
    Workout.completedSummary.notes = notes;

    Storage.saveWorkoutSession(Workout.completedSummary);
    Storage.clearActiveWorkout();
    if (Workout.timerInterval) clearInterval(Workout.timerInterval);
    Workout.activeSession = null;

    Navigation.closeModal("modal-finish-workout-summary");
    Navigation.showToast("🎉 Incredible session! Workout saved.", "award", 4000);
    Navigation.navigateTo("screen-progress");
  },

  cancelWorkout: () => {
    if (confirm("Are you sure you want to cancel and discard this active workout?")) {
      Storage.clearActiveWorkout();
      if (Workout.timerInterval) clearInterval(Workout.timerInterval);
      Workout.activeSession = null;
      Navigation.showToast("Workout cancelled", "x");
      Navigation.navigateTo("screen-workout");
    }
  }
};

window.Workout = Workout;

/**
 * FitMate Progress Analytics & Charts Module
 * Interactive Chart.js graphs, weight history, measurements, PRs, and achievement badges.
 */

const Progress = {
  weightChartInstance: null,
  volumeChartInstance: null,

  init: () => {
    // Weight log confirm button
    const saveWeightBtn = document.getElementById("modal-save-weight-btn");
    if (saveWeightBtn) {
      saveWeightBtn.addEventListener("click", Progress.saveWeightLog);
    }

    // Body measurements save button
    const saveMeasurementsBtn = document.getElementById("modal-save-measurements-btn");
    if (saveMeasurementsBtn) {
      saveMeasurementsBtn.addEventListener("click", Progress.saveMeasurementsLog);
    }

    // Add PR button
    const savePRBtn = document.getElementById("modal-save-pr-btn");
    if (savePRBtn) {
      savePRBtn.addEventListener("click", Progress.savePersonalRecord);
    }

    // Photo gallery file input
    const photoInput = document.getElementById("progress-photo-gallery-input");
    if (photoInput) {
      photoInput.addEventListener("change", Progress.handlePhotoUpload);
    }
  },

  render: () => {
    Progress.renderWeightSummary();
    Progress.renderWeightChart();
    Progress.renderVolumeChart();
    Progress.renderBodyMeasurements();
    Progress.renderPersonalRecords();
    Progress.renderBadges();
    Progress.renderPhotoGallery();
  },

  // ==================== WEIGHT TRACKING & CHARTS ====================
  renderWeightSummary: () => {
    const profile = Storage.getUserProfile();
    const history = Storage.getWeightHistory();
    const curWeight = profile.currentWeightKg || 74.5;
    const targetWeight = profile.targetWeightKg || 70.0;

    let delta = 0;
    if (history.length >= 2) {
      const first = history[0].weightKg;
      delta = Math.round((curWeight - first) * 10) / 10;
    }

    const curEl = document.getElementById("progress-current-weight-val");
    const targetEl = document.getElementById("progress-target-weight-val");
    const deltaEl = document.getElementById("progress-weight-delta-badge");

    if (curEl) curEl.textContent = `${curWeight} kg`;
    if (targetEl) targetEl.textContent = `${targetWeight} kg`;
    if (deltaEl) {
      const isLoss = delta <= 0;
      deltaEl.textContent = `${delta > 0 ? '+' : ''}${delta} kg`;
      deltaEl.className = `badge-pill ${isLoss ? 'badge-green' : 'badge-orange'}`;
    }
  },

  renderWeightChart: () => {
    const canvas = document.getElementById("progress-weight-chart-canvas");
    if (!canvas || !window.Chart) return;

    const history = Storage.getWeightHistory();
    const labels = history.map(h => {
      const d = new Date(h.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const dataPoints = history.map(h => h.weightKg);

    if (Progress.weightChartInstance) {
      Progress.weightChartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, "rgba(255, 122, 41, 0.4)");
    gradient.addColorStop(1, "rgba(255, 122, 41, 0.0)");

    Progress.weightChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Weight (kg)",
          data: dataPoints,
          borderColor: "#ff7a29",
          borderWidth: 3,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#ff7a29",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: gradient,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(26, 23, 21, 0.95)",
            borderColor: "rgba(255, 122, 41, 0.3)",
            borderWidth: 1,
            titleColor: "#ffffff",
            bodyColor: "#ff7a29",
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `Weight: ${context.parsed.y} kg`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: { size: 11 } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#64748b", font: { size: 11 } }
          }
        }
      }
    });
  },

  renderVolumeChart: () => {
    const canvas = document.getElementById("progress-volume-chart-canvas");
    if (!canvas || !window.Chart) return;

    const history = Storage.getWorkoutHistory().slice(0, 7).reverse();
    const labels = history.map(h => {
      const d = new Date(h.date);
      return d.toLocaleDateString([], { weekday: 'short' });
    });
    const volumes = history.map(h => Math.round((h.totalVolumeKg || 4000) / 1000)); // in tons

    if (Progress.volumeChartInstance) {
      Progress.volumeChartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");
    const barGradient = ctx.createLinearGradient(0, 0, 0, 160);
    barGradient.addColorStop(0, "#ff7a29");
    barGradient.addColorStop(1, "#261d19");

    Progress.volumeChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels.length > 0 ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Volume (Tons)",
          data: volumes.length > 0 ? volumes : [4.5, 6.2, 0, 5.8, 7.1, 0, 6.4],
          backgroundColor: barGradient,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(26, 23, 21, 0.95)",
            borderColor: "rgba(255, 122, 41, 0.3)",
            borderWidth: 1,
            callbacks: {
              label: (context) => `Volume: ${context.parsed.y}k kg`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: { size: 11 } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#64748b", font: { size: 11 } }
          }
        }
      }
    });
  },

  openLogWeightModal: () => {
    const profile = Storage.getUserProfile();
    document.getElementById("modal-weight-input").value = profile.currentWeightKg || 74.5;
    document.getElementById("modal-weight-date-input").value = new Date().toISOString().split("T")[0];
    document.getElementById("modal-weight-note-input").value = "";
    Navigation.openModal("modal-log-weight");
  },

  saveWeightLog: () => {
    const weightVal = parseFloat(document.getElementById("modal-weight-input").value);
    const dateVal = document.getElementById("modal-weight-date-input").value;
    const noteVal = document.getElementById("modal-weight-note-input").value.trim();

    if (!weightVal || weightVal <= 20 || weightVal >= 350) {
      alert("Please enter a valid weight in kg.");
      return;
    }

    Storage.addWeightEntry(weightVal, dateVal, noteVal);
    Navigation.closeModal("modal-log-weight");
    Navigation.showToast(`Logged weight: ${weightVal} kg`, "check-circle");

    Progress.render();
    if (window.Dashboard) window.Dashboard.render();
  },

  // ==================== BODY MEASUREMENTS ====================
  renderBodyMeasurements: () => {
    const measurements = Storage.getBodyMeasurements();
    const latest = measurements[measurements.length - 1] || { waistCm: 82, chestCm: 104, armsCm: 37, thighsCm: 58 };

    document.getElementById("measure-waist-val").textContent = `${latest.waistCm || 82} cm`;
    document.getElementById("measure-chest-val").textContent = `${latest.chestCm || 104} cm`;
    document.getElementById("measure-arms-val").textContent = `${latest.armsCm || 37} cm`;
    document.getElementById("measure-thighs-val").textContent = `${latest.thighsCm || 58} cm`;
  },

  openMeasurementsModal: () => {
    const measurements = Storage.getBodyMeasurements();
    const latest = measurements[measurements.length - 1] || {};

    document.getElementById("modal-measure-waist").value = latest.waistCm || "";
    document.getElementById("modal-measure-chest").value = latest.chestCm || "";
    document.getElementById("modal-measure-arms").value = latest.armsCm || "";
    document.getElementById("modal-measure-thighs").value = latest.thighsCm || "";

    Navigation.openModal("modal-log-measurements");
  },

  saveMeasurementsLog: () => {
    const waist = parseFloat(document.getElementById("modal-measure-waist").value) || 0;
    const chest = parseFloat(document.getElementById("modal-measure-chest").value) || 0;
    const arms = parseFloat(document.getElementById("modal-measure-arms").value) || 0;
    const thighs = parseFloat(document.getElementById("modal-measure-thighs").value) || 0;

    Storage.addBodyMeasurement({
      waistCm: waist,
      chestCm: chest,
      armsCm: arms,
      thighsCm: thighs
    });

    Navigation.closeModal("modal-log-measurements");
    Navigation.showToast("Body measurements recorded!", "check-circle");
    Progress.renderBodyMeasurements();
  },

  // ==================== PERSONAL RECORDS (PRs) ====================
  getPersonalRecords: () => {
    return Storage.getItem("fitmate_prs", [
      { exercise: "Barbell Bench Press", weightKg: 85, reps: 5, date: "2026-11-10" },
      { exercise: "Barbell Back Squat", weightKg: 110, reps: 3, date: "2026-11-12" },
      { exercise: "Barbell Deadlift", weightKg: 135, reps: 2, date: "2026-11-05" },
      { exercise: "Overhead Barbell Press", weightKg: 55, reps: 6, date: "2026-11-08" },
      { exercise: "Lat Pulldown Machine", weightKg: 75, reps: 8, date: "2026-11-14" }
    ]);
  },

  renderPersonalRecords: () => {
    const container = document.getElementById("progress-prs-container");
    if (!container) return;

    const prs = Progress.getPersonalRecords();
    container.innerHTML = prs.map(pr => `
      <div class="card" style="margin-bottom: 10px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 14px; font-weight: 700; color: #ffffff;">${pr.exercise}</div>
          <div style="font-size: 11.5px; color: var(--text-secondary);">${pr.reps} Reps • ${pr.date}</div>
        </div>
        <div style="font-size: 18px; font-weight: 800; color: var(--accent-primary);">${pr.weightKg} kg</div>
      </div>
    `).join("");
  },

  openAddPRModal: () => {
    Navigation.openModal("modal-add-pr");
  },

  savePersonalRecord: () => {
    const exName = document.getElementById("modal-pr-exercise").value.trim();
    const weight = parseFloat(document.getElementById("modal-pr-weight").value);
    const reps = parseInt(document.getElementById("modal-pr-reps").value, 10);

    if (!exName || !weight) {
      alert("Please enter exercise name and weight.");
      return;
    }

    const prs = Progress.getPersonalRecords();
    prs.push({
      exercise: exName,
      weightKg: weight,
      reps: reps || 1,
      date: new Date().toISOString().split("T")[0]
    });

    Storage.setItem("fitmate_prs", prs);
    Navigation.closeModal("modal-add-pr");
    Navigation.showToast(`New PR logged: ${exName} ${weight}kg! 🔥`, "award");
    Progress.renderPersonalRecords();
  },

  // ==================== ACHIEVEMENT BADGES ====================
  renderBadges: () => {
    const container = document.getElementById("progress-badges-grid");
    if (!container) return;

    const history = Storage.getWorkoutHistory();
    const workoutCount = history.length;

    const badges = [
      { id: "b1", title: "First Workout", desc: "Completed your first session", unlocked: workoutCount >= 1, icon: "dumbbell" },
      { id: "b2", title: "Iron Warrior", desc: "Completed 5+ workout sessions", unlocked: workoutCount >= 3, icon: "zap" },
      { id: "b3", title: "Century Club", desc: "Squat or Deadlift over 100 kg", unlocked: true, icon: "award" },
      { id: "b4", title: "Hydration Hero", desc: "Hit 3,000ml water intake", unlocked: true, icon: "droplet" }
    ];

    container.innerHTML = badges.map(b => `
      <div class="card" style="padding: 14px; text-align: center; border-color: ${b.unlocked ? 'var(--border-accent)' : 'var(--border-card)'}; opacity: ${b.unlocked ? 1 : 0.45};">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: ${b.unlocked ? 'var(--accent-gradient)' : '#201c1a'}; color: #ffffff; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto; box-shadow: ${b.unlocked ? 'var(--glow-orange-sm)' : 'none'};">
          <i data-lucide="${b.icon}"></i>
        </div>
        <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 2px;">${b.title}</div>
        <div style="font-size: 10.5px; color: var(--text-secondary);">${b.desc}</div>
      </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
  },

  // ==================== PHOTO GALLERY ====================
  getPhotos: () => {
    return Storage.getItem("fitmate_progress_photos", []);
  },

  renderPhotoGallery: () => {
    const container = document.getElementById("progress-photos-container");
    if (!container) return;

    const photos = Progress.getPhotos();
    if (photos.length === 0) {
      container.innerHTML = `
        <div style="font-size: 12.5px; color: var(--text-muted); text-align: center; padding: 20px 0;">
          No transformation photos yet. Tap below to upload!
        </div>
      `;
      return;
    }

    container.innerHTML = photos.map((p, index) => `
      <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-card); aspect-ratio: 1;">
        <img src="${p.dataUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
        <span style="position: absolute; bottom: 6px; left: 6px; background: rgba(0,0,0,0.7); font-size: 10px; font-weight: 700; color: white; padding: 2px 6px; border-radius: 4px;">
          ${p.date}
        </span>
      </div>
    `).join("");
  },

  handlePhotoUpload: (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const photos = Progress.getPhotos();
      photos.unshift({
        id: "photo-" + Date.now(),
        date: new Date().toISOString().split("T")[0],
        dataUrl: event.target.result
      });
      Storage.setItem("fitmate_progress_photos", photos);
      Navigation.showToast("Progress photo added!", "image");
      Progress.renderPhotoGallery();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
};

window.Progress = Progress;

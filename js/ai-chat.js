/**
 * FitMate AI Coach & Gym Machine Scanner
 * Intelligent fitness assistant, vision identification engine, workout generator, and diet assistant.
 */

const AIChat = {
  attachedImages: [], // array of base64 images
  isTyping: false,
  cameraStream: null,

  // Knowledge base for gym machine identification
  machineDatabase: [
    {
      keywords: ["lat pull", "pulldown", "lat pulldown", "pulley bar", "cable bar overhead", "lat"],
      name: "Lat Pulldown Machine",
      purpose: "Builds upper back width, V-taper, and latissimus dorsi strength without requiring full bodyweight pull-ups.",
      primaryMuscles: ["Latissimus Dorsi (Lats)"],
      secondaryMuscles: ["Biceps Brachii", "Rhomboids", "Rear Deltoids", "Brachialis"],
      equipmentType: "Plate-Loaded / Pin-Selected Cable Machine",
      setup: "Adjust the thigh roller pads so your thighs are snugly wedged underneath with your feet flat on the floor.",
      steps: [
        "Reach up and grip the wide bar with an overhand grip slightly wider than shoulder-width.",
        "Sit down and secure your knees firmly under the padded rollers.",
        "Lean your torso back slightly (approx 10-15 degrees) with chest lifted tall.",
        "Pull the bar down toward your upper chest, leading with your elbows driving down toward your hips.",
        "Squeeze your shoulder blades together at the bottom for 1 second.",
        "Slowly resist the weight as the bar ascends back overhead to full stretch."
      ],
      mistakes: [
        "Swinging violently backward using momentum to yank the bar down.",
        "Pulling the bar behind the neck (causes severe cervical spine compression).",
        "Letting elbows flare backward rather than driving down in the plane of the torso."
      ],
      safety: "Never release the bar abruptly at the top; control the eccentric return to protect shoulder labrum and rotator cuff.",
      alternatives: ["Pull-Ups", "Chin-Ups", "Inverted Rows", "Banded Lat Pulldowns"],
      exerciseId: "lat-pulldown-machine"
    },
    {
      keywords: ["leg press", "sled", "45 degree", "incline leg", "foot plate", "press machine"],
      name: "45-Degree Incline Leg Press Machine",
      purpose: "High-volume lower body strength and hypertrophy without compressive spinal load of free-weight squats.",
      primaryMuscles: ["Quadriceps (Rectus Femoris, Vastus Lateralis)"],
      secondaryMuscles: ["Gluteus Maximus", "Hamstrings", "Adductor Magnus"],
      equipmentType: "Plate-Loaded Sled Machine",
      setup: "Sit with your lower back and glutes pressed completely flush against the padded seat. Release safety handles only when feet are set.",
      steps: [
        "Place feet shoulder-width apart in the center of the sled platform.",
        "Disengage the safety levers using the side handles.",
        "Lower the weighted sled smoothly until your knees reach roughly a 90-degree angle.",
        "Ensure lower back does not round off the seat pad at bottom depth.",
        "Drive forcefully through your entire foot (especially heels) to push the platform back up.",
        "Stop just short of full knee lockout at the top."
      ],
      mistakes: [
        "Hyperextending or violently locking knees out at the top (extremely dangerous!).",
        "Letting knees cave inward during the push (valgus collapse).",
        "Descending too low, causing pelvis to tilt up and lower back to round."
      ],
      safety: "Always keep safety stops adjusted at a height where the sled cannot crush your chest if your legs give out.",
      alternatives: ["Barbell Back Squat", "Bulgarian Split Squat", "Goblet Squats", "Hack Squats"],
      exerciseId: "leg-press-machine"
    },
    {
      keywords: ["smith", "smith machine", "guided barbell", "fixed bar", "track bar", "rack with tracks"],
      name: "Smith Machine",
      purpose: "Fixed vertical (or near-vertical) track barbell allowing heavy lifting with built-in safety catches and zero balance requirement.",
      primaryMuscles: ["Target depends on movement (Quads, Chest, or Shoulders)"],
      secondaryMuscles: ["Synergist stabilizers"],
      equipmentType: "Fixed-Rail Barbell System",
      setup: "Rotate the bar slightly to unhook the safety hooks from the rack pins.",
      steps: [
        "Position yourself directly under the bar path according to your chosen exercise (Squat, Incline Bench, Overhead Press).",
        "Set the safety stopper pins to your lowest safe descent point.",
        "Unhook the bar with a twist of your wrists.",
        "Perform movement with controlled cadence along the fixed linear rail.",
        "Re-rack by twisting wrists forward or back to lock onto the nearest catch rung."
      ],
      mistakes: [
        "Assuming free-weight foot positions without accounting for the fixed bar path.",
        "Failing to set the lower mechanical safety stoppers."
      ],
      safety: "Always practice rotating your wrists to engage the safety hooks with an empty bar before loading heavy weights.",
      alternatives: ["Free Barbell Squats", "Dumbbell Press", "Power Rack Barbell"],
      exerciseId: "barbell-back-squat"
    },
    {
      keywords: ["cable crossover", "cables", "dual cable", "cable station", "crossover", "pulley station"],
      name: "Cable Crossover & Functional Trainer",
      purpose: "Versatile dual adjustable pulleys providing continuous muscular tension throughout all planes of motion.",
      primaryMuscles: ["Pectoralis Major (Chest Flyes)", "Triceps / Biceps", "Shoulders"],
      secondaryMuscles: ["Core / Abdominal Stabilizers"],
      equipmentType: "Dual Cable Pulley System",
      setup: "Adjust both pulley sliders to equal heights (high for downward flyes, low for upward scooping flyes).",
      steps: [
        "Attach D-handles or rope attachments.",
        "Take a handle in each hand and step forward into a staggered stance.",
        "Maintain a slight bend in your elbows and brace your core.",
        "Bring hands forward in a wide arc until knuckles meet at the center.",
        "Hold the peak contraction for 1 second, then control handles back to a deep stretch."
      ],
      mistakes: [
        "Using excessive weight that forces momentum and jerky movement.",
        "Bending elbows excessively and turning flies into presses."
      ],
      safety: "Ensure the height adjustment selector pins are completely clicked into locked position before applying weight.",
      alternatives: ["Dumbbell Flyes", "Pec Deck Machine", "Resistance Band Flyes"],
      exerciseId: "cable-pec-fly"
    },
    {
      keywords: ["pec deck", "chest fly machine", "butterfly", "seated fly", "rear delt fly", "reverse pec"],
      name: "Pec Deck / Rear Delt Fly Machine",
      purpose: "Isolated chest adduction or rear deltoid horizontal abduction with zero shoulder stabilizer fatigue.",
      primaryMuscles: ["Pectoralis Major (Chest) OR Posterior Deltoids (Rear Delts)"],
      secondaryMuscles: ["Anterior Deltoids / Rhomboids"],
      equipmentType: "Leverage Cam / Pin-Selected Machine",
      setup: "Adjust seat so handles align with mid-chest level. For rear delts, sit facing the pad.",
      steps: [
        "Sit with back flat against pad, feet planted firmly.",
        "Grip handles with elbows slightly bent and shoulders down.",
        "Bring handles together in front of your chest with a smooth squeezing arc.",
        "Touch gently or stop 1 inch apart to maintain continuous muscle tension.",
        "Return slowly until you feel a comfortable stretch in your pecs."
      ],
      mistakes: [
        "Letting elbows drop below wrists during the fly.",
        "Over-stretching shoulders beyond natural range on the return."
      ],
      safety: "Do not let weights slam against the stack; keep tension constant throughout the repetition.",
      alternatives: ["Cable Pec Fly", "Dumbbell Chest Fly", "Face Pulls"],
      exerciseId: "cable-pec-fly"
    },
    {
      keywords: ["seated row", "cable row", "low row", "seated cable row", "v-bar row"],
      name: "Seated Cable Row Machine",
      purpose: "Horizontal pulling to thicken the middle back, rhomboids, and lower lats while improving spinal posture.",
      primaryMuscles: ["Rhomboids", "Middle & Lower Trapezius", "Latissimus Dorsi"],
      secondaryMuscles: ["Biceps Brachii", "Rear Deltoids", "Erector Spinae"],
      equipmentType: "Low-Pulley Cable Station",
      setup: "Place feet against footplates with knees slightly bent. Grasp the V-handle attachment with arms extended.",
      steps: [
        "Sit upright with chest proud and shoulders back.",
        "Initiate pull by retracting your shoulder blades.",
        "Drive elbows straight back alongside your ribcage, pulling handle to your lower ribcage/navel.",
        "Pause and squeeze your back muscles hard for 1 second.",
        "Extend arms forward with control, allowing lats to stretch without slumping your lower spine."
      ],
      mistakes: [
        "Swinging back and forth like a rowing boat to move the weight.",
        "Shrugging shoulders up to ears."
      ],
      safety: "Never round your lower back under heavy cable loads. Maintain natural lumbar arch.",
      alternatives: ["Bent-Over Barbell Row", "One-Arm Dumbbell Row", "T-Bar Row"],
      exerciseId: "seated-cable-row"
    }
  ],

  init: () => {
    // Send message on Enter or click
    const sendBtn = document.getElementById("ai-chat-send-btn");
    const input = document.getElementById("ai-chat-input-text");
    if (sendBtn && input) {
      sendBtn.addEventListener("click", AIChat.handleSendMessage);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          AIChat.handleSendMessage();
        }
      });
    }

    // Gallery upload input
    const fileInput = document.getElementById("ai-chat-gallery-input");
    if (fileInput) {
      fileInput.addEventListener("change", AIChat.handleFileSelection);
    }

    // Camera button
    const cameraBtn = document.getElementById("ai-chat-camera-trigger");
    if (cameraBtn) {
      cameraBtn.addEventListener("click", AIChat.openCameraModal);
    }

    // Capture photo from live camera
    const snapBtn = document.getElementById("scanner-capture-snap-btn");
    if (snapBtn) {
      snapBtn.addEventListener("click", AIChat.captureCameraPhoto);
    }

    // Close camera
    const closeCamBtn = document.getElementById("scanner-close-camera-btn");
    if (closeCamBtn) {
      closeCamBtn.addEventListener("click", AIChat.closeCameraModal);
    }

    // Clear chat
    const clearBtn = document.getElementById("ai-chat-clear-history-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Clear your conversation history with FitMate AI?")) {
          Storage.clearChatHistory();
          AIChat.render();
          Navigation.showToast("Chat history cleared", "trash");
        }
      });
    }

    // Prompt chips
    document.querySelectorAll(".ai-quick-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const promptText = chip.getAttribute("data-prompt");
        const actionType = chip.getAttribute("data-action");

        if (actionType === "scan-machine") {
          AIChat.openCameraModal();
        } else if (promptText) {
          AIChat.sendUserMessage(promptText);
        }
      });
    });
  },

  render: () => {
    const messagesContainer = document.getElementById("ai-chat-messages-scroll");
    if (!messagesContainer) return;

    const chatHistory = Storage.getChatHistory();
    const profile = Storage.getUserProfile();
    const userName = (profile && profile.name) ? profile.name : "Athlete";

    if (chatHistory.length === 0) {
      // Welcome message personalized with the logged-in user's name
      messagesContainer.innerHTML = `
        <div class="chat-bubble ai">
          <div class="ai-badge-label">
            <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> FitMate AI
          </div>
          <p>Hi ${userName}! I am <strong>FitMate AI</strong>, your personal intelligent fitness & gym companion. 🏋️‍♂️</p>
          <p style="margin-top: 8px;">Here is how I can assist you:</p>
          <ul style="margin: 8px 0 8px 18px; font-size: 13px; line-height: 1.6;">
            <li>📸 <strong>Identify Unfamiliar Gym Machines</strong>: Snap or upload a photo of any gym equipment to learn how to adjust it, target muscles, and avoid mistakes.</li>
            <li>🥗 <strong>Food & Nutrition Analyzer</strong>: Ask me about Bangladeshi dishes or fitness macros.</li>
            <li>⚡ <strong>Custom Workout Generator</strong>: Tell me your goal and available days.</li>
            <li>💬 <strong>Form & Exercise Tips</strong>: Ask any question about form, injury prevention, or progressive overload.</li>
          </ul>
          <p style="font-size: 12.5px; color: var(--text-accent); margin-top: 4px;">Tap a quick action chip above or snap a photo of any machine to begin!</p>
        </div>
      `;
    } else {
      messagesContainer.innerHTML = chatHistory.map(msg => {
        if (msg.role === "user") {
          const imgHtml = msg.images && msg.images.length > 0 
            ? msg.images.map(src => `<img src="${src}" class="chat-attached-image-preview" alt="User upload" />`).join("")
            : "";
          return `
            <div class="chat-bubble user">
              <div>${msg.text}</div>
              ${imgHtml}
            </div>
          `;
        } else {
          return `
            <div class="chat-bubble ai">
              <div class="ai-badge-label">
                <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> FitMate AI
              </div>
              <div>${msg.htmlContent || msg.text}</div>
            </div>
          `;
        }
      }).join("");
    }

    if (window.lucide) window.lucide.createIcons();
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },

  // ==================== IMAGE ATTACHMENTS ====================
  handleFileSelection: (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        AIChat.attachedImages.push(event.target.result);
        AIChat.renderAttachmentPreviews();
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ""; // reset input
  },

  renderAttachmentPreviews: () => {
    const previewContainer = document.getElementById("ai-chat-attachments-preview-row");
    if (!previewContainer) return;

    if (AIChat.attachedImages.length === 0) {
      previewContainer.style.display = "none";
      previewContainer.innerHTML = "";
      return;
    }

    previewContainer.style.display = "flex";
    previewContainer.innerHTML = AIChat.attachedImages.map((src, index) => `
      <div style="position: relative; width: 60px; height: 60px; border-radius: 10px; overflow: hidden; border: 1.5px solid var(--accent-primary); flex-shrink: 0;">
        <img src="${src}" style="width: 100%; height: 100%; object-fit: cover;" />
        <button onclick="AIChat.removeAttachedImage(${index})" 
          style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.8); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px;">
          ✕
        </button>
      </div>
    `).join("");
  },

  removeAttachedImage: (index) => {
    AIChat.attachedImages.splice(index, 1);
    AIChat.renderAttachmentPreviews();
  },

  // ==================== LIVE CAMERA ACCESS ====================
  openCameraModal: () => {
    const modal = document.getElementById("scanner-camera-modal");
    if (modal) modal.classList.add("show");

    const video = document.getElementById("scanner-live-video");
    if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      }).then(stream => {
        AIChat.cameraStream = stream;
        video.srcObject = stream;
        video.play();
      }).catch(err => {
        console.warn("Could not access environment camera; falling back to gallery/sample picker.", err);
        // Show fallback instruction
        Navigation.showToast("Camera access unavailable in preview sandbox. Tap 'Upload Photo' instead!", "camera-off");
      });
    }
  },

  closeCameraModal: () => {
    if (AIChat.cameraStream) {
      AIChat.cameraStream.getTracks().forEach(t => t.stop());
      AIChat.cameraStream = null;
    }
    const modal = document.getElementById("scanner-camera-modal");
    if (modal) modal.classList.remove("show");
  },

  captureCameraPhoto: () => {
    const video = document.getElementById("scanner-live-video");
    let photoData = null;

    if (video && video.videoWidth > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      photoData = canvas.toDataURL("image/jpeg", 0.85);
    } else {
      // Simulate snapshot of gym machine
      photoData = "assets/images/sample-lat-pulldown.svg";
    }

    AIChat.closeCameraModal();
    AIChat.attachedImages.push(photoData);
    AIChat.renderAttachmentPreviews();
    AIChat.handleSendMessage("Please identify this gym machine and explain how to use it safely!");
  },

  // Pick sample test machine for instant demo
  testIdentifyPresetMachine: (machineIndex = 0) => {
    const m = AIChat.machineDatabase[machineIndex];
    AIChat.closeCameraModal();
    AIChat.sendUserMessage(`Identify this gym machine: ${m.name}`);
  },

  // ==================== SENDING MESSAGES ====================
  handleSendMessage: (customText = null) => {
    const input = document.getElementById("ai-chat-input-text");
    const text = customText || (input ? input.value.trim() : "");
    const images = [...AIChat.attachedImages];

    if (!text && images.length === 0) return;

    if (input) input.value = "";
    AIChat.attachedImages = [];
    AIChat.renderAttachmentPreviews();

    AIChat.sendUserMessage(text, images);
  },

  sendUserMessage: (text, images = []) => {
    const userMsg = {
      role: "user",
      text: text || "Analyze attached gym photo",
      images: images,
      timestamp: Date.now()
    };

    Storage.saveChatMessage(userMsg);
    AIChat.render();

    // Show AI typing animation
    AIChat.showTypingIndicator();

    // Generate intelligent AI response after realistic thinking delay
    setTimeout(() => {
      AIChat.hideTypingIndicator();
      const responseHtml = AIChat.generateAIResponse(userMsg);
      const aiMsg = {
        role: "assistant",
        text: responseHtml.replace(/<[^>]*>?/gm, ""), // plain text fallback
        htmlContent: responseHtml,
        timestamp: Date.now()
      };
      Storage.saveChatMessage(aiMsg);
      AIChat.render();
    }, 1100);
  },

  showTypingIndicator: () => {
    const messagesContainer = document.getElementById("ai-chat-messages-scroll");
    if (!messagesContainer) return;

    let indicator = document.getElementById("ai-live-typing-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "ai-live-typing-indicator";
      indicator.className = "ai-typing-indicator";
      indicator.innerHTML = `<span></span><span></span><span></span>`;
      messagesContainer.appendChild(indicator);
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },

  hideTypingIndicator: () => {
    const indicator = document.getElementById("ai-live-typing-indicator");
    if (indicator) indicator.remove();
  },

  // ==================== SIMULATED INTELLIGENCE ENGINE ====================
  generateAIResponse: (userMsg) => {
    const text = (userMsg.text || "").toLowerCase();
    const hasImage = userMsg.images && userMsg.images.length > 0;

    // 1. Check if user wants to IDENTIFY A GYM MACHINE
    if (hasImage || text.includes("machine") || text.includes("equipment") || text.includes("identify") || text.includes("scan")) {
      return AIChat.generateMachineAnalysis(text, hasImage);
    }

    // 2. AI WORKOUT GENERATOR
    if (text.includes("generate workout") || text.includes("routine") || text.includes("split") || text.includes("workout plan") || text.includes("create plan")) {
      return AIChat.generateWorkoutRoutineResponse(text);
    }

    // 3. FOOD & DIET ANALYZER
    if (text.includes("food") || text.includes("calorie") || text.includes("protein") || text.includes("diet") || text.includes("rice") || text.includes("ruti") || text.includes("chicken") || text.includes("curry") || text.includes("egg")) {
      return AIChat.generateDietResponse(text);
    }

    // 4. EXERCISE ALTERNATIVE & FORM TIPS
    if (text.includes("alternative") || text.includes("replace") || text.includes("swap") || text.includes("instead of")) {
      return AIChat.generateAlternativeExerciseResponse(text);
    }

    // 5. GENERAL FITNESS Q&A
    return AIChat.generateFitnessQAResponse(text);
  },

  // 9.1 Gym Machine Identification Response
  generateMachineAnalysis: (text, hasImage) => {
    // Match against our machine knowledge database
    let matched = AIChat.machineDatabase.find(m => {
      return m.keywords.some(kw => text.includes(kw));
    });

    // Default to Lat Pulldown or Leg Press if generic "identify"
    if (!matched) {
      matched = AIChat.machineDatabase[0]; // Lat Pulldown default
    }

    return `
      <div style="background: rgba(255, 122, 41, 0.08); border-left: 3px solid var(--accent-primary); padding: 10px 14px; border-radius: 8px; margin-bottom: 12px;">
        <span style="font-size: 11px; text-transform: uppercase; color: var(--accent-primary); font-weight: 800;">
          📸 Vision AI Equipment Recognition
        </span>
        <h3 style="font-size: 17px; font-weight: 800; color: #ffffff; margin-top: 2px;">${matched.name}</h3>
        <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">${matched.equipmentType}</p>
      </div>

      <p style="margin-bottom: 10px; font-size: 13.5px; line-height: 1.5;">${matched.purpose}</p>

      <div style="margin-bottom: 12px; background: #191615; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border-subtle);">
        <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">🎯 Targeted Muscles</div>
        <div style="font-size: 12.5px; color: var(--accent-primary); font-weight: 600;">Primary: ${matched.primaryMuscles.join(", ")}</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Secondary: ${matched.secondaryMuscles.join(", ")}</div>
      </div>

      <div style="font-size: 12.5px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">⚙️ Setup & Execution:</div>
      <p style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 8px;"><strong>Setup:</strong> ${matched.setup}</p>
      
      <ol style="padding-left: 18px; font-size: 12.5px; color: var(--text-primary); line-height: 1.6; margin-bottom: 12px;">
        ${matched.steps.map(s => `<li>${s}</li>`).join("")}
      </ol>

      <div style="font-size: 12.5px; font-weight: 700; color: var(--danger); margin-bottom: 4px;">⚠️ Common Mistakes:</div>
      <ul style="padding-left: 18px; font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">
        ${matched.mistakes.map(m => `<li>${m}</li>`).join("")}
      </ul>

      <div style="font-size: 12px; color: var(--warning); margin-bottom: 12px; background: rgba(251, 191, 36, 0.08); padding: 8px 10px; border-radius: 6px;">
        🛡️ <strong>Safety Caution:</strong> ${matched.safety}
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
        <button class="btn btn-sm btn-primary" onclick="ExerciseModule.openDetails('${matched.exerciseId}')">
          <i data-lucide="book-open"></i> Full Exercise Guide
        </button>
        <button class="btn btn-sm btn-secondary" onclick="AIChat.handleSendMessage('Find alternative exercise for ${matched.name}')">
          🔄 Alternatives
        </button>
      </div>
    `;
  },

  // 9.2 Workout Routine Generator
  generateWorkoutRoutineResponse: (text) => {
    const isStrength = text.includes("strength") || text.includes("power");
    const routineTitle = isStrength ? "AI 4-Day Strength & Density Split" : "AI Hypertrophy Push/Pull/Legs Split";

    return `
      <p>I have designed a custom workout routine tailored to your fitness goals:</p>
      
      <div class="card card-glow" style="margin: 12px 0; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="badge-pill badge-orange">FitMate AI Plan</span>
          <span style="font-size: 12px; color: var(--text-secondary);">4 Days / Week</span>
        </div>
        <h4 style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 6px;">${routineTitle}</h4>
        <p style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 12px;">
          Optimized for maximum muscle recovery and progressive overload.
        </p>

        <div style="font-size: 12.5px; line-height: 1.8; color: var(--text-primary);">
          <div>🔹 <strong>Day 1 (Chest & Triceps):</strong> Bench Press (4x8), Incline Dumbbells (3x10), Tricep Rope Pushdowns (3x12)</div>
          <div>🔹 <strong>Day 2 (Back & Biceps):</strong> Lat Pulldown (4x10), Seated Cable Row (3x12), Barbell Bicep Curls (3x10)</div>
          <div>🔹 <strong>Day 3 (Rest & Active Recovery):</strong> 30-min walk & mobility</div>
          <div>🔹 <strong>Day 4 (Legs & Abs):</strong> Squats (4x8), Leg Press (3x12), Hanging Leg Raises (3x15)</div>
        </div>

        <button class="btn btn-primary btn-block btn-sm" style="margin-top: 14px;" onclick="AIChat.saveAIGeneratedRoutine('${routineTitle}')">
          <i data-lucide="plus-circle"></i> Save Routine to My Routines
        </button>
      </div>

      <p style="font-size: 12.5px; color: var(--text-secondary);">
        Would you like me to adjust the sets, rest periods, or replace any exercises?
      </p>
    `;
  },

  saveAIGeneratedRoutine: (title) => {
    const newRoutine = {
      id: "routine-" + Date.now(),
      name: title,
      split: "Push / Pull / Legs",
      days: ["Monday", "Tuesday", "Thursday", "Friday"],
      targetMuscles: ["Chest", "Back", "Legs", "Arms"],
      description: "Custom split generated by FitMate AI.",
      exercises: [
        { exerciseId: "barbell-bench-press", sets: 4, reps: 8, weightKg: 65, restSeconds: 90 },
        { exerciseId: "incline-dumbbell-press", sets: 3, reps: 10, weightKg: 22, restSeconds: 75 },
        { exerciseId: "lat-pulldown-machine", sets: 4, reps: 10, weightKg: 55, restSeconds: 75 },
        { exerciseId: "seated-cable-row", sets: 3, reps: 12, weightKg: 50, restSeconds: 75 },
        { exerciseId: "barbell-back-squat", sets: 4, reps: 8, weightKg: 80, restSeconds: 120 }
      ],
      createdDate: new Date().toISOString()
    };

    Storage.saveRoutine(newRoutine);
    Navigation.showToast(`Saved "${title}"!`, "check-circle");
    Workout.renderRoutines();
    Navigation.navigateTo("screen-workout");
  },

  // Diet & Food Analysis
  generateDietResponse: (text) => {
    if (text.includes("rice") || text.includes("bhat")) {
      return `
        <p><strong>Nutrition Breakdown: Steamed White Rice (1 cup cooked / 150g)</strong></p>
        <ul style="padding-left: 18px; margin: 8px 0; font-size: 13px; line-height: 1.6;">
          <li>Calories: <strong>195 kcal</strong></li>
          <li>Carbohydrates: <strong>43.5g</strong> (Fast digesting energy)</li>
          <li>Protein: <strong>4.1g</strong></li>
          <li>Fat: <strong>0.5g</strong></li>
        </ul>
        <p style="font-size: 13px; color: var(--text-secondary);">
          💡 <strong>Fitness Tip:</strong> Pair your rice with a high-protein source like grilled chicken (Murgir Mangsho) or Rui fish and lentils (Dal) to lower the glycemic spike and promote sustained muscle recovery!
        </p>
      `;
    }

    if (text.includes("ruti") || text.includes("roti")) {
      return `
        <p><strong>Nutrition Breakdown: Whole Wheat Ruti (1 piece / 40g)</strong></p>
        <ul style="padding-left: 18px; margin: 8px 0; font-size: 13px; line-height: 1.6;">
          <li>Calories: <strong>110 kcal</strong></li>
          <li>Carbohydrates: <strong>22.5g</strong> (Complex carbs)</li>
          <li>Protein: <strong>3.8g</strong></li>
          <li>Fiber: <strong>3.2g</strong> (Promotes fullness)</li>
          <li>Fat: <strong>0.8g</strong></li>
        </ul>
        <p style="font-size: 13px; color: var(--text-secondary);">
          💡 <strong>Weight Loss Tip:</strong> 2-3 whole wheat rutis with boiled eggs and vegetable sabji make an ideal low-calorie, high-fiber dinner!
        </p>
      `;
    }

    return `
      <p>Here is my macro advice for your fitness nutrition:</p>
      <div style="background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; padding: 12px; margin: 8px 0;">
        <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">🥗 Ideal Macro Distribution:</div>
        <p style="font-size: 12.5px; color: var(--text-secondary);">
          • <strong>Protein:</strong> Aim for 1.6g - 2.0g per kg of bodyweight (e.g. 120-150g for 75kg).<br>
          • <strong>Healthy Carbs:</strong> Rice, Ruti, Oats, Sweet Potatoes.<br>
          • <strong>Essential Fats:</strong> Mustard oil in moderation, nuts (almonds), egg yolks.
        </p>
      </div>
      <p style="font-size: 12.5px; color: var(--text-secondary);">
        You can log foods directly into your <strong>FitMate Nutrition Tracker</strong> with one tap!
      </p>
    `;
  },

  generateAlternativeExerciseResponse: (text) => {
    return `
      <p>Here are high-yield alternative exercises you can swap seamlessly:</p>
      <div style="margin: 10px 0; display: flex; flex-direction: column; gap: 8px;">
        <div class="card" style="padding: 12px;">
          <div style="font-weight: 700; color: #ffffff; font-size: 13.5px;">Instead of Barbell Squats:</div>
          <div style="font-size: 12.5px; color: var(--text-accent);">👉 Leg Press Machine or Bulgarian Split Squats</div>
          <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Removes spinal loading while isolating quadriceps and glutes.</div>
        </div>
        <div class="card" style="padding: 12px;">
          <div style="font-weight: 700; color: #ffffff; font-size: 13.5px;">Instead of Pull-Ups:</div>
          <div style="font-size: 12.5px; color: var(--text-accent);">👉 Lat Pulldown Machine or Inverted Bar Rows</div>
          <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Allows scalable resistance for progressive overload.</div>
        </div>
      </div>
    `;
  },

  generateFitnessQAResponse: (text) => {
    return `
      <p>That is an excellent fitness question!</p>
      <p style="margin-top: 8px; font-size: 13.5px; line-height: 1.6;">
        For best results, prioritize <strong>progressive overload</strong> (adding 1 rep or +1kg each week) and keep your rest intervals between 60 to 90 seconds for hypertrophy.
      </p>
      <div style="margin-top: 10px; background: rgba(255, 122, 41, 0.1); border: 1px solid rgba(255, 122, 41, 0.25); border-radius: 10px; padding: 10px 14px;">
        <span style="font-size: 12px; font-weight: 700; color: var(--accent-primary);">💡 FitMate Pro Tip:</span>
        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
          Hydration plays a direct role in muscle power output. Drink at least 500ml water 30 minutes before your workout!
        </p>
      </div>
    `;
  }
};

window.AIChat = AIChat;

/**
 * FitMate Exercise Database
 * Comprehensive categorized exercise dataset with target muscles, instructions, and tips.
 */

const FITMATE_EXERCISES = [
  // --- CHEST ---
  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    category: "Chest",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Anterior Deltoids", "Triceps"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie flat on the bench with eyes directly beneath the bar.",
      "Grip the bar slightly wider than shoulder-width with wrists straight.",
      "Retract your shoulder blades and plant your feet firmly on the floor.",
      "Unrack the bar and slowly lower it with control to your mid-chest.",
      "Drive the barbell straight up by contracting your chest and extending your arms."
    ],
    commonMistakes: [
      "Bouncing the bar off your ribcage.",
      "Flaring elbows out at a 90-degree angle (keep at 45-70 degrees).",
      "Lifting hips and glutes off the bench."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "6 - 10",
    defaultRest: 90,
    tips: "Keep your shoulder blades pinched together like holding a pencil between them."
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: "Chest",
    primaryMuscles: ["Upper Pectoralis (Clavicular Head)"],
    secondaryMuscles: ["Anterior Deltoids", "Triceps"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    instructions: [
      "Set an adjustable bench to an incline of 30-45 degrees.",
      "Sit back with dumbbells resting on thighs, then kick them up to shoulder height.",
      "Press the dumbbells overhead with palms facing forward, without clanking them at top.",
      "Lower dumbbells smoothly until elbows reach slightly below chest level."
    ],
    commonMistakes: [
      "Setting bench angle too steep (>45 deg shifts load onto front deltoids).",
      "Arching lower back excessively off the bench."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "8 - 12",
    defaultRest: 75,
    tips: "Focus on bringing your biceps together at the peak contraction."
  },
  {
    id: "cable-pec-fly",
    name: "Cable Pec Fly",
    category: "Chest",
    primaryMuscles: ["Pectoralis Major (Sternal & Clavicular)"],
    secondaryMuscles: ["Anterior Deltoids"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Set cable pulleys at chest height with D-handles attached.",
      "Step forward into a staggered stance with a slight forward torso lean.",
      "Keep a slight bend in your elbows and open arms wide to feel a deep chest stretch.",
      "Bring hands together in front of your chest in a hugging motion, squeezing hard."
    ],
    commonMistakes: [
      "Bending and straightening elbows like a press.",
      "Using momentum instead of continuous cable tension."
    ],
    suggestedSets: "3",
    suggestedReps: "12 - 15",
    defaultRest: 60,
    tips: "Hold the squeeze for 1 full second at the center for maximum hypertrophy."
  },
  {
    id: "chest-press-machine",
    name: "Chest Press Machine",
    category: "Chest",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Triceps", "Front Delts"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust seat height so handles align with mid-chest.",
      "Keep feet flat, back pressed firmly against pad, and grip handles.",
      "Push handles forward until arms are almost extended, without locking elbows.",
      "Return slowly, feeling the stretch across your chest."
    ],
    commonMistakes: [
      "Letting weights slam down on the eccentric return.",
      "Slumping shoulders forward."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "10 - 12",
    defaultRest: 60,
    tips: "Ideal for beginners and for burning out chest safely without a spotter."
  },
  {
    id: "dips-chest",
    name: "Parallel Bar Dips",
    category: "Chest",
    primaryMuscles: ["Lower Pectoralis Major"],
    secondaryMuscles: ["Triceps", "Anterior Deltoid"],
    equipment: "Bodyweight",
    difficulty: "Advanced",
    instructions: [
      "Grip the parallel bars and push yourself up to the starting position.",
      "Lean torso forward roughly 30 degrees to shift emphasis to the chest.",
      "Lower your body until your shoulders are slightly below your elbows.",
      "Drive yourself back up smoothly to arm extension."
    ],
    commonMistakes: [
      "Staying completely upright (shifts load to triceps).",
      "Going too deep if you have shoulder mobility limitations."
    ],
    suggestedSets: "3",
    suggestedReps: "8 - 12",
    defaultRest: 90,
    tips: "Add a dipping belt with weight plates as you build strength."
  },

  // --- BACK ---
  {
    id: "lat-pulldown-machine",
    name: "Lat Pulldown Machine",
    category: "Back",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Biceps", "Rhomboids", "Rear Delts"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust thigh pads securely to hold your knees in place.",
      "Take a wide overhand grip on the bar.",
      "Lean back slightly (10-15 degrees) and draw your shoulder blades down and back.",
      "Pull the bar down toward your upper chest, pulling through your elbows.",
      "Slowly return the bar overhead to full extension."
    ],
    commonMistakes: [
      "Swinging torso backwards to jerk the weight down.",
      "Pulling behind the neck (dangerous for cervical spine and rotator cuff)."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "8 - 12",
    defaultRest: 75,
    tips: "Think of your hands as hooks; drive your elbows down towards your back pockets."
  },
  {
    id: "barbell-deadlift",
    name: "Barbell Deadlift",
    category: "Back",
    primaryMuscles: ["Erector Spinae", "Glutes", "Hamstrings"],
    secondaryMuscles: ["Latissimus Dorsi", "Trapezius", "Forearms", "Core"],
    equipment: "Barbell",
    difficulty: "Advanced",
    instructions: [
      "Stand with mid-foot directly under the barbell, hip-width stance.",
      "Hinge at hips and grip bar just outside knees.",
      "Pull chest up, drop hips slightly, and engage lats to take slack out of bar.",
      "Drive through your heels, pushing floor away until standing tall.",
      "Lower the bar by hinging hips back with a straight, neutral spine."
    ],
    commonMistakes: [
      "Rounding the lower or upper back.",
      "Hyperextending spine at the top of the lift."
    ],
    suggestedSets: "3 - 5",
    suggestedReps: "5 - 8",
    defaultRest: 120,
    tips: "Pack your lats and imagine bending the bar around your shins before lifting."
  },
  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    category: "Back",
    primaryMuscles: ["Rhomboids", "Middle Trapezius", "Lats"],
    secondaryMuscles: ["Biceps", "Rear Deltoids"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Sit at the row station with feet on footplates, knees slightly bent.",
      "Grip the V-bar handle with arms outstretched and sit tall with neutral spine.",
      "Pull the handle to your lower abdomen while driving elbows back and squeezing shoulder blades.",
      "Pause for a second, then extend arms slowly forward."
    ],
    commonMistakes: [
      "Excessive torso swinging back and forth.",
      "Shrugging shoulders up toward ears."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "10 - 12",
    defaultRest: 75,
    tips: "Keep your chest puffed out tall throughout the entire range of motion."
  },
  {
    id: "bent-over-barbell-row",
    name: "Bent-Over Barbell Row",
    category: "Back",
    primaryMuscles: ["Lats", "Rhomboids", "Middle Traps"],
    secondaryMuscles: ["Biceps", "Spinal Erectors", "Rear Delts"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Hinge hips back until torso is roughly 45 degrees to the floor.",
      "Hold barbell with an overhand grip, arms hanging straight down.",
      "Row the bar into your lower belly button, squeezing your lats.",
      "Lower the bar with control until arms are fully extended."
    ],
    commonMistakes: [
      "Rounding lower back due to poor hip hinge.",
      "Standing up too upright and turning it into a shrug."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "8 - 10",
    defaultRest: 90,
    tips: "Brace your core tight as if preparing for a punch."
  },
  {
    id: "pull-ups",
    name: "Pull-Ups",
    category: "Back",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Biceps", "Teres Major", "Forearms"],
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    instructions: [
      "Grasp the pull-up bar with an overhand grip slightly wider than shoulder width.",
      "Hang with arms fully extended and shoulders engaged.",
      "Pull yourself up by driving elbows down until your chin clears the bar.",
      "Lower yourself smoothly back to a full dead-hang position."
    ],
    commonMistakes: [
      "Kicking legs or kipping for momentum.",
      "Cutting range of motion short at top or bottom."
    ],
    suggestedSets: "3",
    suggestedReps: "6 - 12",
    defaultRest: 90,
    tips: "Use resistance bands or an assisted pull-up machine if building up to full bodyweight."
  },

  // --- SHOULDERS ---
  {
    id: "overhead-barbell-press",
    name: "Overhead Barbell Press",
    category: "Shoulders",
    primaryMuscles: ["Anterior Deltoids", "Medial Deltoids"],
    secondaryMuscles: ["Triceps", "Upper Trapezius", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Rest bar on front collarbones with elbows forward and wrists neutral.",
      "Squeeze glutes and brace abdominal wall.",
      "Press the bar overhead in a vertical path, pulling head slightly back to let bar pass.",
      "Lock out overhead with arms straight and head pushed slightly forward."
    ],
    commonMistakes: [
      "Arching lower back excessively to compensate for shoulder mobility.",
      "Flaring elbows straight out to the sides."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "6 - 10",
    defaultRest: 90,
    tips: "Squeezing your glutes hard protects your lumbar spine."
  },
  {
    id: "dumbbell-lateral-raise",
    name: "Dumbbell Lateral Raise",
    category: "Shoulders",
    primaryMuscles: ["Lateral Deltoids (Side Delts)"],
    secondaryMuscles: ["Supraspinatus", "Upper Traps"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Stand with dumbbells at sides, palms facing inward, slight forward torso tilt.",
      "Raise dumbbells out to the sides with elbows slightly bent.",
      "Lift until arms are parallel to the ground (elbows at shoulder level).",
      "Control the descent slowly back to your sides."
    ],
    commonMistakes: [
      "Using heavy momentum and swinging hips.",
      "Leading with wrists rather than elbows."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "12 - 15",
    defaultRest: 60,
    tips: "Lead with your elbows and imagine pouring water from pitchers at the top."
  },
  {
    id: "face-pulls-cable",
    name: "Cable Face Pulls",
    category: "Shoulders",
    primaryMuscles: ["Rear Deltoids", "Rotator Cuff"],
    secondaryMuscles: ["Rhomboids", "Middle Trapezius"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Attach a rope to the cable station at eye or forehead height.",
      "Grip the ends of the rope with thumbs pointing back towards you.",
      "Step back, pull rope directly towards your forehead/eyes while separating hands.",
      "Externally rotate your shoulders at the end, showing your biceps."
    ],
    commonMistakes: [
      "Pulling too low to the chest instead of face level.",
      "Using too much weight and jerking torso."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "15 - 20",
    defaultRest: 60,
    tips: "One of the absolute best exercises for bulletproofing shoulder joints."
  },

  // --- BICEPS ---
  {
    id: "barbell-bicep-curl",
    name: "Barbell Bicep Curl",
    category: "Biceps",
    primaryMuscles: ["Biceps Brachii (Long & Short Head)"],
    secondaryMuscles: ["Brachialis", "Brachioradialis"],
    equipment: "Barbell",
    difficulty: "Beginner",
    instructions: [
      "Stand tall holding the barbell with an underhand shoulder-width grip.",
      "Pin your elbows close to your ribcage.",
      "Curl the barbell upward contracting your biceps until fully squeezed.",
      "Lower the barbell under strict control to full arm extension."
    ],
    commonMistakes: [
      "Swinging your back to propel the weight up.",
      "Letting elbows drift far forward."
    ],
    suggestedSets: "3",
    suggestedReps: "8 - 12",
    defaultRest: 60,
    tips: "Keep your upper arms locked in place like hinges."
  },
  {
    id: "incline-dumbbell-curl",
    name: "Incline Dumbbell Curl",
    category: "Biceps",
    primaryMuscles: ["Biceps Brachii (Long Head)"],
    secondaryMuscles: ["Brachialis"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    instructions: [
      "Set bench to a 45-degree incline and lie back with arms hanging straight down.",
      "Curl dumbbells upward while supinating wrists (palms turned upward).",
      "Squeeze biceps at the top peak, then lower slowly into the deep stretch."
    ],
    commonMistakes: [
      "Lifting shoulders off the bench to assist the curl.",
      "Rushing the negative eccentric phase."
    ],
    suggestedSets: "3",
    suggestedReps: "10 - 12",
    defaultRest: 60,
    tips: "The deep stretch on the long head produces fantastic bicep peaks."
  },
  {
    id: "hammer-curls",
    name: "Dumbbell Hammer Curls",
    category: "Biceps",
    primaryMuscles: ["Brachialis", "Brachioradialis"],
    secondaryMuscles: ["Biceps Brachii"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Stand holding dumbbells with palms facing each other (neutral grip).",
      "Curl dumbbells up toward shoulders while keeping palms facing in.",
      "Squeeze forearms and brachialis at the top, then lower with control."
    ],
    commonMistakes: [
      "Rotating wrists during the curl.",
      "Swinging weights backwards."
    ],
    suggestedSets: "3",
    suggestedReps: "10 - 14",
    defaultRest: 60,
    tips: "Builds thickness across the arm and improves grip strength."
  },

  // --- TRICEPS ---
  {
    id: "tricep-rope-pushdown",
    name: "Tricep Rope Pushdown",
    category: "Triceps",
    primaryMuscles: ["Triceps Lateral & Medial Head"],
    secondaryMuscles: ["Triceps Long Head"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Attach rope attachment to high cable pulley.",
      "Tuck elbows tightly at your sides with a slight forward lean.",
      "Push rope straight down, flaring rope ends outward at bottom for full lockout.",
      "Return slowly until forearms are slightly above parallel."
    ],
    commonMistakes: [
      "Letting elbows sway forward and back.",
      "Using shoulder momentum to press downward."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "12 - 15",
    defaultRest: 60,
    tips: "Spread the rope aggressively at the bottom lockout to hit the lateral tricep head."
  },
  {
    id: "skull-crushers",
    name: "Lying Tricep Extension (Skull Crushers)",
    category: "Triceps",
    primaryMuscles: ["Triceps Long Head"],
    secondaryMuscles: ["Triceps Medial Head"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie on flat bench holding EZ bar or barbell straight above forehead.",
      "Angle upper arms slightly backwards (toward head) to maintain continuous tension.",
      "Bend elbows to lower bar just past your forehead or crown.",
      "Extend elbows to push bar back up to start position."
    ],
    commonMistakes: [
      "Flaring elbows wide to sides (keep elbows shoulder-width).",
      "Letting bar hit forehead—control the weight smoothly."
    ],
    suggestedSets: "3",
    suggestedReps: "10 - 12",
    defaultRest: 75,
    tips: "Using an EZ-curl bar is much gentler on the wrists."
  },

  // --- LEGS ---
  {
    id: "barbell-back-squat",
    name: "Barbell Back Squat",
    category: "Legs",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Rest barbell across upper traps (high bar) or rear delts (low bar).",
      "Stand with feet shoulder-width apart, toes turned out 15-30 degrees.",
      "Brace core, push hips back and bend knees, tracking knees over toes.",
      "Squat down until hip crease is at or below parallel to knees.",
      "Drive through whole foot to stand back up powerfully."
    ],
    commonMistakes: [
      "Knees caving inward on the way up (valgus collapse).",
      "Rounding lower back (butt wink) under heavy load.",
      "Relying only on toes rather than mid-foot tripod."
    ],
    suggestedSets: "3 - 5",
    suggestedReps: "6 - 10",
    defaultRest: 120,
    tips: "Take a deep belly breath and brace your core 360 degrees before descending."
  },
  {
    id: "leg-press-machine",
    name: "Leg Press Machine",
    category: "Legs",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Adductors"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit securely in machine with lower back and hips firmly pressed into backrest.",
      "Place feet shoulder-width apart on the sled platform.",
      "Disengage safety levers and bend knees slowly to 90 degrees.",
      "Press the sled away through your heels without locking your knees out at top."
    ],
    commonMistakes: [
      "Locking knees violently at the top (can cause severe hyperextension).",
      "Letting lower back curl off the seat at bottom depth."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "10 - 15",
    defaultRest: 90,
    tips: "Placing feet higher targets glutes and hamstrings; placing feet lower emphasizes quads."
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift (RDL)",
    category: "Legs",
    primaryMuscles: ["Hamstrings", "Gluteus Maximus"],
    secondaryMuscles: ["Lower Back", "Forearms"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand holding bar with overhand grip at hip height, soft knee bend.",
      "Push hips straight back like trying to touch a wall behind you with your glutes.",
      "Lower bar sliding along shins until you feel a deep hamstring stretch.",
      "Drive hips forward and squeeze glutes hard to return to standing."
    ],
    commonMistakes: [
      "Bending knees too much like a regular squat.",
      "Letting bar drift away from shins."
    ],
    suggestedSets: "3 - 4",
    suggestedReps: "8 - 12",
    defaultRest: 90,
    tips: "Think of this as a pure hip hinge; your knees should remain softly unlocked."
  },
  {
    id: "leg-extension-machine",
    name: "Leg Extension Machine",
    category: "Legs",
    primaryMuscles: ["Quadriceps (Rectus Femoris, Vastus Lateralis/Medialis)"],
    secondaryMuscles: [],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust back pad so knees line up with the machine's pivot axis.",
      "Pad should rest comfortably across lower shins just above ankles.",
      "Extend legs upward until legs are straight, squeezing quads hard at the top.",
      "Lower slowly back to starting angle under control."
    ],
    commonMistakes: [
      "Kicking up with jerking momentum.",
      "Lifting hips off the seat."
    ],
    suggestedSets: "3",
    suggestedReps: "12 - 15",
    defaultRest: 60,
    tips: "Hold the top peak contraction for 1 second for insane quad pump."
  },

  // --- ABS / CORE ---
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: "Abs",
    primaryMuscles: ["Lower Rectus Abdominis", "Hip Flexors"],
    secondaryMuscles: ["Obliques", "Forearms"],
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    instructions: [
      "Hang from pull-up bar with arms straight and shoulders packed.",
      "Without swinging, raise legs up until parallel to floor (or to chest for advanced).",
      "Curl pelvis upward at top to fully contract the lower abs.",
      "Lower legs slowly back down without arching back."
    ],
    commonMistakes: [
      "Swinging legs like a pendulum.",
      "Only using hip flexors without curling the pelvis."
    ],
    suggestedSets: "3",
    suggestedReps: "10 - 15",
    defaultRest: 60,
    tips: "Bend knees slightly if straight leg raises are too challenging initially."
  },
  {
    id: "cable-woodchoppers",
    name: "Cable Woodchoppers",
    category: "Abs",
    primaryMuscles: ["Internal & External Obliques"],
    secondaryMuscles: ["Rectus Abdominis", "Shoulders"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Set cable to high pulley with single handle.",
      "Stand sideways to machine, grip handle with both hands, arms extended.",
      "Rotate torso diagonally downward across body toward opposite knee.",
      "Control the weight back to starting height."
    ],
    commonMistakes: [
      "Bending arms and pulling with biceps.",
      "Twisting only with arms instead of rotating through core."
    ],
    suggestedSets: "3",
    suggestedReps: "12 - 15 per side",
    defaultRest: 60,
    tips: "Pivot on back foot to protect knee and maximize abdominal torque."
  },
  {
    id: "plank-hold",
    name: "Core Plank Hold",
    category: "Abs",
    primaryMuscles: ["Transverse Abdominis", "Rectus Abdominis"],
    secondaryMuscles: ["Glutes", "Deltoids"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Place forearms on the floor, elbows directly under shoulders.",
      "Extend legs behind you with toes planted on floor.",
      "Maintain a straight line from heels through head, squeezing glutes and abs.",
      "Breathe steadily while holding position."
    ],
    commonMistakes: [
      "Sagging hips down toward floor.",
      "Piking hips high in the air."
    ],
    suggestedSets: "3",
    suggestedReps: "45 - 60 sec",
    defaultRest: 45,
    tips: "Imagine pulling your elbows towards your toes to intensely recruit deeper core fibers."
  },

  // --- CARDIO ---
  {
    id: "incline-treadmill-walk",
    name: "Incline Treadmill Walk",
    category: "Cardio",
    primaryMuscles: ["Cardiovascular System", "Glutes", "Calves"],
    secondaryMuscles: ["Hamstrings"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Set treadmill incline between 8% to 12% and speed to 4.5 - 5.5 km/h.",
      "Walk with an upright posture without holding onto handrails.",
      "Maintain a steady pace and breathe rhythmically."
    ],
    commonMistakes: [
      "Holding onto side rails and leaning backward (cancels the incline benefit).",
      "Taking overly long strides."
    ],
    suggestedSets: "1",
    suggestedReps: "20 - 30 min",
    defaultRest: 0,
    tips: "Low impact on joints while burning high amounts of body fat."
  },
  {
    id: "stationary-bike",
    name: "Stationary Bike Sprint / Steady",
    category: "Cardio",
    primaryMuscles: ["Quadriceps", "Heart & Lungs"],
    secondaryMuscles: ["Calves", "Hamstrings"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust seat height so knee has a slight 5-10 degree bend at bottom pedal stroke.",
      "Warm up for 3 minutes at moderate resistance.",
      "Cycle at cadence of 80-100 RPM or alternate intervals (30s sprint / 60s cruise)."
    ],
    commonMistakes: [
      "Seat adjusted too low causing anterior knee stress.",
      "Rounding shoulders over handlebars."
    ],
    suggestedSets: "1",
    suggestedReps: "15 - 25 min",
    defaultRest: 0,
    tips: "Great non-impact cardio that promotes leg recovery."
  }
];

// Helper functions for exercise library
const ExerciseData = {
  getAll: () => FITMATE_EXERCISES,
  getById: (id) => FITMATE_EXERCISES.find(e => e.id === id),
  getByCategory: (category) => {
    if (!category || category === "All") return FITMATE_EXERCISES;
    return FITMATE_EXERCISES.filter(e => e.category.toLowerCase() === category.toLowerCase());
  },
  search: (query) => {
    if (!query) return FITMATE_EXERCISES;
    const q = query.toLowerCase().trim();
    return FITMATE_EXERCISES.filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.equipment.toLowerCase().includes(q) ||
      e.primaryMuscles.some(m => m.toLowerCase().includes(q))
    );
  },
  getCategories: () => ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Abs", "Cardio"]
};

// Export to window
if (typeof window !== "undefined") {
  window.FITMATE_EXERCISES = FITMATE_EXERCISES;
  window.ExerciseData = ExerciseData;
}

/**
 * FitMate Food & Nutrition Database
 * Includes standard fitness foods & authentic Bangladeshi staples.
 * Values are standardized per serving size listed.
 */

const FITMATE_FOODS = [
  // --- BANGLADESHI STAPLES ---
  {
    id: "steamed-rice",
    name: "Steamed White Rice (Shada Bhat)",
    banglaName: "সাদা ভাত",
    category: "Bangladeshi Staples",
    servingSize: "1 cup cooked (150g)",
    servingGrams: 150,
    calories: 195,
    protein: 4.1,
    carbs: 43.5,
    fat: 0.5,
    fiber: 0.6,
    icon: "🍚"
  },
  {
    id: "whole-wheat-ruti",
    name: "Whole Wheat Ruti (Attar Ruti)",
    banglaName: "আটার রুটি",
    category: "Bangladeshi Staples",
    servingSize: "1 medium piece (40g)",
    servingGrams: 40,
    calories: 110,
    protein: 3.8,
    carbs: 22.5,
    fat: 0.8,
    fiber: 3.2,
    icon: "🫓"
  },
  {
    id: "chicken-curry",
    name: "Chicken Curry (Murgir Jhol)",
    banglaName: "মুরগির ঝোল",
    category: "Poultry & Meat",
    servingSize: "1 bowl with gravy (180g)",
    servingGrams: 180,
    calories: 275,
    protein: 28.5,
    carbs: 5.2,
    fat: 15.0,
    fiber: 1.0,
    icon: "🍗"
  },
  {
    id: "rui-fish-curry",
    name: "Rui Fish Curry (Rui Macher Jhol)",
    banglaName: "রুই মাছের ঝোল",
    category: "Fish & Seafood",
    servingSize: "1 large piece + gravy (150g)",
    servingGrams: 150,
    calories: 195,
    protein: 24.0,
    carbs: 3.5,
    fat: 9.0,
    fiber: 0.8,
    icon: "🐟"
  },
  {
    id: "ilish-fish-curry",
    name: "Ilish Fish Curry (Ilish Macher Jhol)",
    banglaName: "ইলিশ মাছের ঝোল",
    category: "Fish & Seafood",
    servingSize: "1 piece (130g)",
    servingGrams: 130,
    calories: 270,
    protein: 21.0,
    carbs: 2.5,
    fat: 19.5,
    fiber: 0.5,
    icon: "🐟"
  },
  {
    id: "tilapia-curry",
    name: "Tilapia Fish Curry",
    banglaName: "তেলাপিয়া মাছের তরকারি",
    category: "Fish & Seafood",
    servingSize: "1 piece (140g)",
    servingGrams: 140,
    calories: 175,
    protein: 25.0,
    carbs: 3.0,
    fat: 6.8,
    fiber: 0.6,
    icon: "🐟"
  },
  {
    id: "mosur-dal",
    name: "Red Lentil Soup (Mosur Dal)",
    banglaName: "মসুর ডাল",
    category: "Lentils & Legumes",
    servingSize: "1 medium bowl (160g)",
    servingGrams: 160,
    calories: 145,
    protein: 9.2,
    carbs: 21.0,
    fat: 2.8,
    fiber: 4.5,
    icon: "🥣"
  },
  {
    id: "egg-boiled",
    name: "Whole Egg (Hard Boiled)",
    banglaName: "সিদ্ধ ডিম",
    category: "Eggs & Dairy",
    servingSize: "1 large egg (50g)",
    servingGrams: 50,
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    fiber: 0.0,
    icon: "🥚"
  },
  {
    id: "egg-dim-bhaji",
    name: "Egg Omelette (Dim Bhaji)",
    banglaName: "ডিম ভাজি",
    category: "Eggs & Dairy",
    servingSize: "1 egg with onion & chili",
    servingGrams: 65,
    calories: 135,
    protein: 6.8,
    carbs: 2.1,
    fat: 11.2,
    fiber: 0.4,
    icon: "🍳"
  },
  {
    id: "egg-white",
    name: "Boiled Egg White",
    banglaName: "ডিমের সাদা অংশ",
    category: "Eggs & Dairy",
    servingSize: "1 egg white (33g)",
    servingGrams: 33,
    calories: 17,
    protein: 3.6,
    carbs: 0.2,
    fat: 0.1,
    fiber: 0.0,
    icon: "🥚"
  },
  {
    id: "mixed-vegetables",
    name: "Mixed Vegetable Sabji (Sobji)",
    banglaName: "সবজি ভাজি / তরকারি",
    category: "Vegetables",
    servingSize: "1 bowl (150g)",
    servingGrams: 150,
    calories: 95,
    protein: 2.8,
    carbs: 13.0,
    fat: 3.8,
    fiber: 4.2,
    icon: "🥦"
  },
  {
    id: "cow-milk",
    name: "Fresh Cow Milk (Khaati Dudh)",
    banglaName: "গরুর খাঁটি দুধ",
    category: "Eggs & Dairy",
    servingSize: "1 glass (240ml)",
    servingGrams: 240,
    calories: 150,
    protein: 8.0,
    carbs: 12.0,
    fat: 8.0,
    fiber: 0.0,
    icon: "🥛"
  },
  {
    id: "tok-doi",
    name: "Plain Sour Yogurt (Tok Doi)",
    banglaName: "টক দই",
    category: "Eggs & Dairy",
    servingSize: "1 cup (150g)",
    servingGrams: 150,
    calories: 98,
    protein: 8.5,
    carbs: 8.0,
    fat: 3.5,
    fiber: 0.0,
    icon: "🍶"
  },
  {
    id: "banana-shobri",
    name: "Banana (Shobri Kola)",
    banglaName: "সবরি কলা",
    category: "Fruits",
    servingSize: "1 medium banana (118g)",
    servingGrams: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fat: 0.3,
    fiber: 3.1,
    icon: "🍌"
  },
  {
    id: "fresh-apple",
    name: "Fresh Red Apple",
    banglaName: "আপেল",
    category: "Fruits",
    servingSize: "1 medium apple (180g)",
    servingGrams: 180,
    calories: 95,
    protein: 0.5,
    carbs: 25.0,
    fat: 0.3,
    fiber: 4.4,
    icon: "🍎"
  },
  {
    id: "mango-fazli",
    name: "Ripe Mango (Aam)",
    banglaName: "পাকা আম",
    category: "Fruits",
    servingSize: "1 cup sliced (165g)",
    servingGrams: 165,
    calories: 107,
    protein: 1.4,
    carbs: 28.0,
    fat: 0.6,
    fiber: 3.0,
    icon: "🥭"
  },
  {
    id: "beef-curry",
    name: "Beef Curry (Gorur Mangsho)",
    banglaName: "গরুর মাংসের ভুনা",
    category: "Poultry & Meat",
    servingSize: "1 bowl (180g)",
    servingGrams: 180,
    calories: 360,
    protein: 32.0,
    carbs: 5.0,
    fat: 23.5,
    fiber: 0.8,
    icon: "🥩"
  },
  {
    id: "khichuri-bhuna",
    name: "Bhuna Khichuri",
    banglaName: "ভুনা খিচুড়ি",
    category: "Bangladeshi Staples",
    servingSize: "1 plate (200g)",
    servingGrams: 200,
    calories: 320,
    protein: 9.8,
    carbs: 48.0,
    fat: 9.5,
    fiber: 4.8,
    icon: "🍲"
  },
  {
    id: "chana-boot",
    name: "Boiled Chickpeas (Chana Boot)",
    banglaName: "সিদ্ধ বুট / ছোলা",
    category: "Lentils & Legumes",
    servingSize: "1 cup boiled (150g)",
    servingGrams: 150,
    calories: 245,
    protein: 13.5,
    carbs: 40.0,
    fat: 3.8,
    fiber: 10.5,
    icon: "🧆"
  },

  // --- GENERAL FITNESS NUTRITION ---
  {
    id: "whey-protein",
    name: "Whey Protein Isolate/Concentrate",
    banglaName: "হুই প্রোটিন",
    category: "Supplements",
    servingSize: "1 scoop (30g)",
    servingGrams: 30,
    calories: 120,
    protein: 24.5,
    carbs: 2.5,
    fat: 1.2,
    fiber: 0.0,
    icon: "🥤"
  },
  {
    id: "rolled-oats",
    name: "Rolled Oatmeal (Cooked)",
    banglaName: "ওটস",
    category: "Fitness Staples",
    servingSize: "1 cup prepared (180g)",
    servingGrams: 180,
    calories: 165,
    protein: 6.0,
    carbs: 28.0,
    fat: 3.2,
    fiber: 4.0,
    icon: "🥣"
  },
  {
    id: "peanut-butter",
    name: "Natural Peanut Butter",
    banglaName: "পিনাট বাটার",
    category: "Fitness Staples",
    servingSize: "1 tablespoon (16g)",
    servingGrams: 16,
    calories: 95,
    protein: 4.0,
    carbs: 3.5,
    fat: 8.0,
    fiber: 1.0,
    icon: "🥜"
  },
  {
    id: "grilled-chicken-breast",
    name: "Grilled Chicken Breast (Skinless)",
    banglaName: "গ্রিলড চিকেন ব্রেস্ট",
    category: "Poultry & Meat",
    servingSize: "100g cooked",
    servingGrams: 100,
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    fiber: 0.0,
    icon: "🍗"
  },
  {
    id: "sweet-potato",
    name: "Boiled Sweet Potato (Misti Alu)",
    banglaName: "মিষ্টি আলু",
    category: "Vegetables",
    servingSize: "1 medium (130g)",
    servingGrams: 130,
    calories: 112,
    protein: 2.0,
    carbs: 26.0,
    fat: 0.1,
    fiber: 3.9,
    icon: "🍠"
  },
  {
    id: "almonds",
    name: "Raw Almonds (Kathbadam)",
    banglaName: "কাঠবাদাম",
    category: "Nuts & Seeds",
    servingSize: "1 ounce (28g / ~23 nuts)",
    servingGrams: 28,
    calories: 164,
    protein: 6.0,
    carbs: 6.1,
    fat: 14.2,
    fiber: 3.5,
    icon: "🌰"
  },
  {
    id: "canned-tuna",
    name: "Canned Tuna in Water (Drained)",
    banglaName: "টুনা মাছ",
    category: "Fish & Seafood",
    servingSize: "1 can drained (120g)",
    servingGrams: 120,
    calories: 132,
    protein: 29.0,
    carbs: 0.0,
    fat: 1.0,
    fiber: 0.0,
    icon: "🐟"
  },
  {
    id: "paneer-cottage-cheese",
    name: "Fresh Paneer / Cottage Cheese",
    banglaName: "পনির",
    category: "Eggs & Dairy",
    servingSize: "100g",
    servingGrams: 100,
    calories: 265,
    protein: 18.0,
    carbs: 3.5,
    fat: 20.0,
    fiber: 0.0,
    icon: "🧀"
  }
];

const FoodData = {
  getAll: () => FITMATE_FOODS,
  getById: (id) => FITMATE_FOODS.find(f => f.id === id),
  getByCategory: (category) => {
    if (!category || category === "All") return FITMATE_FOODS;
    return FITMATE_FOODS.filter(f => f.category.toLowerCase() === category.toLowerCase());
  },
  search: (query) => {
    if (!query) return FITMATE_FOODS;
    const q = query.toLowerCase().trim();
    return FITMATE_FOODS.filter(f => 
      f.name.toLowerCase().includes(q) ||
      (f.banglaName && f.banglaName.includes(q)) ||
      f.category.toLowerCase().includes(q)
    );
  },
  getCategories: () => [
    "All",
    "Bangladeshi Staples",
    "Poultry & Meat",
    "Fish & Seafood",
    "Lentils & Legumes",
    "Eggs & Dairy",
    "Vegetables",
    "Fruits",
    "Fitness Staples"
  ]
};

if (typeof window !== "undefined") {
  window.FITMATE_FOODS = FITMATE_FOODS;
  window.FoodData = FoodData;
}

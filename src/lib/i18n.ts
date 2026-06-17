// Elderly-side translations. The caregiver dashboard intentionally stays
// in English (Wei Ming, the working adult child in KL, is the user there).

export type Lang = "en" | "bm" | "zh";

export const LANGS: { id: Lang; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "bm", label: "BM", native: "Bahasa Malaysia" },
  { id: "zh", label: "华语", native: "中文" },
];

type ZoneKey =
  | "head"
  | "neck"
  | "chest"
  | "stomach"
  | "left-arm"
  | "right-arm"
  | "upper-back"
  | "lower-back"
  | "left-leg"
  | "right-leg"
  | "hands"
  | "feet";

type Strings = {
  // hero / shell
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  todayLine: string;
  feelingPrompt: string;

  // body map card
  whereDoesItHurt: string;
  tapAnyArea: string;
  preferButtons: string;
  showBodyMap: string;
  front: string;
  back: string;

  // body buttons grid
  zone: Record<ZoneKey, string>;

  // symptom entry sheet
  whatKindOfPain: string;
  howBadIsIt: string;
  painPressing: string;
  painSharp: string;
  painBurning: string;
  painAching: string;
  sevMild: string;
  sevModerate: string;
  sevSevere: string;
  thankYou: string;
  thankYouSub: string;

  // follow-up Q's by zone+type, with default
  followUp: Record<string, { q: string; opts: [string, string, string] }>;

  // medication card
  medTitle: string;
  medSubtitle: string;
  medYes: string;
  medNot: string;
  medToastTitle: string;
  medToastDesc: string;
  medLaterToast: string;
  medLaterDesc: string;

  // toasts
  symptomRecordedTitle: string;
  symptomRecordedDesc: string;

  // emergency screen
  emergencyTitle: string;
  emergencyMessage: string;
  emergencyCall999: string;
  emergencyAlertSent: string; // {caregiver}
  emergencyDismiss: string;

  // demo bar
  voiceHint: string;

  // calendar day-detail
  dayDetailTitle: string; // "Day {n}"
  dayDetailSubtitle: string; // "Reports on this day"
  noReports: string;
  good: string;
  moderate: string;
  needsAttention: string;
  noData: string;

  // caregiver-only (English-only callers but kept here for the elderly heatmap dialog)
  newBadge: string;
  resetDemo: string;

  // daily readings card
  dailyReadingsTitle: string;
  dailyReadingsSubtitle: string;
  bloodSugar: string;
  bloodPressure: string;
  bloodSugarSheetTitle: string;
  bloodPressureSheetTitle: string;
  beforeMeal: string;
  afterMeal: string;
  saveReading: string;
  cancel: string;
  bpToastTitle: string;
  sugarToastTitle: string;
  lastBpLabel: string;
  lastSugarLabel: string;
  noReadingYet: string;
};

const en: Strings = {
  greetingMorning: "Good morning,",
  greetingAfternoon: "Good afternoon,",
  greetingEvening: "Good evening,",
  todayLine: "Today, Sun 24 May",
  feelingPrompt: "How are you feeling?",
  whereDoesItHurt: "Where does it hurt?",
  tapAnyArea: "Tap any area on your body",
  preferButtons: "Prefer buttons? Tap here",
  showBodyMap: "Show body map",
  front: "Front",
  back: "Back",
  zone: {
    head: "Head",
    neck: "Neck",
    chest: "Chest",
    stomach: "Stomach",
    "left-arm": "Left Arm",
    "right-arm": "Right Arm",
    "upper-back": "Upper Back",
    "lower-back": "Lower Back",
    "left-leg": "Left Knee",
    "right-leg": "Right Knee",
    hands: "Hands",
    feet: "Feet",
  },
  whatKindOfPain: "What kind of pain?",
  howBadIsIt: "How bad is it?",
  painPressing: "Pressing / Tight",
  painSharp: "Sharp / Stabbing",
  painBurning: "Burning",
  painAching: "Aching / Dull",
  sevMild: "Mild",
  sevModerate: "Moderate",
  sevSevere: "Severe",
  thankYou: "Thank you, Ah Kong.",
  thankYouSub: "Your caregiver has been notified.",
  followUp: {
    "chest-pressing": {
      q: "Does this pressing feeling come at rest, during activity, or is it constant?",
      opts: ["At rest", "During activity", "Constant"],
    },
    "chest-sharp": {
      q: "Did this sharp pain start suddenly, or has it been building up?",
      opts: ["Suddenly", "Building up", "Comes and goes"],
    },
    "chest-burning": {
      q: "Is the burning related to eating, breathing, or neither?",
      opts: ["After eating", "When breathing", "Neither"],
    },
    "chest-aching": {
      q: "Is this ache constant, or does it come and go?",
      opts: ["Constant", "Comes and goes", "Only at night"],
    },
    "head-aching": {
      q: "Is the headache worse in the morning, evening, or all day?",
      opts: ["Morning", "Evening", "All day"],
    },
    "head-pressing": {
      q: "Do you feel pressure at the front, sides, or back of your head?",
      opts: ["Front", "Sides", "Back"],
    },
    "head-sharp": {
      q: "Did this sharp headache start suddenly?",
      opts: ["Yes, suddenly", "Gradually", "After activity"],
    },
    "stomach-aching": {
      q: "Is the stomach pain related to eating?",
      opts: ["Before eating", "After eating", "Not related"],
    },
    "stomach-burning": {
      q: "Where do you feel the burning?",
      opts: ["Upper stomach", "Lower stomach", "All over"],
    },
    "left-leg-aching": {
      q: "Does the knee pain happen when walking, on stairs, or at rest?",
      opts: ["Walking", "Stairs", "At rest"],
    },
    "right-leg-aching": {
      q: "Does the knee pain happen when walking, on stairs, or at rest?",
      opts: ["Walking", "Stairs", "At rest"],
    },
    "lower-back-aching": {
      q: "Is the back pain worse when sitting, standing, or lying down?",
      opts: ["Sitting", "Standing", "Lying down"],
    },
    "upper-back-pressing": {
      q: "Is the back tightness worse in the morning or after activity?",
      opts: ["Morning", "After activity", "All day"],
    },
    default: {
      q: "Is this feeling constant, or does it come and go?",
      opts: ["Constant", "Comes and goes", "Just started"],
    },
  },
  medTitle: "Time for your medicine",
  medSubtitle: "Have you taken your afternoon dose?",
  medYes: "YES",
  medNot: "NOT YET",
  medToastTitle: "Great job, Ah Kong! ✅",
  medToastDesc: "Medication marked as taken.",
  medLaterToast: "Reminder set for 30 minutes.",
  medLaterDesc: "We'll ask again soon.",
  symptomRecordedTitle: "Symptom recorded",
  symptomRecordedDesc: "Your caregiver has been notified.",
  emergencyTitle: "EMERGENCY WARNING",
  emergencyMessage:
    "Severe chest pain reported. Call 999 immediately if you have breathlessness or sweating.",
  emergencyCall999: "📞 Call 999",
  emergencyAlertSent: "✅ Alert sent to Wei Ming",
  emergencyDismiss: "I understand",
  voiceHint: "🔊 Hokkien & Cantonese voice — now available",
  dayDetailTitle: "Day {n}",
  dayDetailSubtitle: "Reports on this day",
  noReports: "No reports on this day.",
  good: "Good day",
  moderate: "Moderate symptoms",
  needsAttention: "Needs attention",
  noData: "No data",
  newBadge: "NEW",
  resetDemo: "Reset demo data",
  dailyReadingsTitle: "Daily Readings",
  dailyReadingsSubtitle: "Tap to log today's numbers",
  bloodSugar: "Blood Sugar",
  bloodPressure: "Blood Pressure",
  bloodSugarSheetTitle: "Log Blood Sugar",
  bloodPressureSheetTitle: "Log Blood Pressure",
  beforeMeal: "Before meal",
  afterMeal: "After meal",
  saveReading: "Save reading",
  cancel: "Cancel",
  bpToastTitle: "Blood pressure recorded ✅",
  sugarToastTitle: "Blood sugar recorded ✅",
  lastBpLabel: "Last BP",
  lastSugarLabel: "Last Sugar",
  noReadingYet: "No readings yet",
};

const bm: Strings = {
  greetingMorning: "Selamat pagi,",
  greetingAfternoon: "Selamat petang,",
  greetingEvening: "Selamat malam,",
  todayLine: "Hari ini, Ahad 24 Mei",
  feelingPrompt: "Apa khabar hari ini?",
  whereDoesItHurt: "Tekan tempat yang sakit",
  tapAnyArea: "Tekan mana-mana bahagian badan",
  preferButtons: "Lebih suka butang? Tekan di sini",
  showBodyMap: "Tunjuk peta badan",
  front: "Depan",
  back: "Belakang",
  zone: {
    head: "Kepala",
    neck: "Leher",
    chest: "Dada",
    stomach: "Perut",
    "left-arm": "Lengan Kiri",
    "right-arm": "Lengan Kanan",
    "upper-back": "Belakang Atas",
    "lower-back": "Belakang Bawah",
    "left-leg": "Lutut Kiri",
    "right-leg": "Lutut Kanan",
    hands: "Tangan",
    feet: "Kaki",
  },
  whatKindOfPain: "Macam mana sakit ni?",
  howBadIsIt: "Sakit macam mana?",
  painPressing: "Tekan / Sesak",
  painSharp: "Tajam / Cucuk",
  painBurning: "Panas / Terbakar",
  painAching: "Lenguh / Sakit",
  sevMild: "Sikit",
  sevModerate: "Sederhana",
  sevSevere: "Teruk",
  thankYou: "Terima kasih, Ah Kong.",
  thankYouSub: "Penjaga anda sudah dimaklumkan.",
  followUp: {
    "chest-pressing": {
      q: "Rasa sesak ni datang masa rehat, masa buat kerja, atau sentiasa?",
      opts: ["Masa rehat", "Masa buat kerja", "Sentiasa ada"],
    },
    "chest-sharp": {
      q: "Sakit tajam ni datang tiba-tiba atau perlahan-lahan?",
      opts: ["Tiba-tiba", "Perlahan-lahan", "Datang dan pergi"],
    },
    "chest-burning": {
      q: "Rasa terbakar ni berkaitan dengan makan, bernafas, atau tidak?",
      opts: ["Lepas makan", "Masa bernafas", "Tidak berkaitan"],
    },
    "chest-aching": {
      q: "Sakit lenguh ni sentiasa, atau datang dan pergi?",
      opts: ["Sentiasa", "Datang dan pergi", "Hanya waktu malam"],
    },
    "head-aching": {
      q: "Sakit kepala ni teruk masa pagi, petang, atau sepanjang hari?",
      opts: ["Pagi", "Petang", "Sepanjang hari"],
    },
    "head-pressing": {
      q: "Rasa tekanan di bahagian hadapan, sisi, atau belakang kepala?",
      opts: ["Hadapan", "Sisi", "Belakang"],
    },
    "head-sharp": {
      q: "Sakit kepala tajam ni datang tiba-tiba?",
      opts: ["Ya, tiba-tiba", "Perlahan-lahan", "Selepas aktiviti"],
    },
    "stomach-aching": {
      q: "Sakit perut ni berkaitan dengan makan?",
      opts: ["Sebelum makan", "Lepas makan", "Tidak berkaitan"],
    },
    "stomach-burning": {
      q: "Rasa panas di perut atas atau bawah?",
      opts: ["Perut atas", "Perut bawah", "Seluruh perut"],
    },
    "left-leg-aching": {
      q: "Sakit lutut bila berjalan, naik tangga, atau masa rehat?",
      opts: ["Berjalan", "Naik tangga", "Masa rehat"],
    },
    "right-leg-aching": {
      q: "Sakit lutut bila berjalan, naik tangga, atau masa rehat?",
      opts: ["Berjalan", "Naik tangga", "Masa rehat"],
    },
    "lower-back-aching": {
      q: "Sakit belakang teruk masa duduk, berdiri, atau baring?",
      opts: ["Duduk", "Berdiri", "Baring"],
    },
    "upper-back-pressing": {
      q: "Belakang sesak ni teruk pagi atau lepas aktiviti?",
      opts: ["Pagi", "Lepas aktiviti", "Sepanjang hari"],
    },
    default: {
      q: "Rasa ni sentiasa, atau datang dan pergi?",
      opts: ["Sentiasa", "Datang dan pergi", "Baru mula"],
    },
  },
  medTitle: "Masa untuk ubat",
  medSubtitle: "Sudah ambil ubat petang?",
  medYes: "SUDAH",
  medNot: "BELUM",
  medToastTitle: "Bagus, Ah Kong! ✅",
  medToastDesc: "Ubat sudah dicatat.",
  medLaterToast: "Peringatan dalam 30 minit.",
  medLaterDesc: "Kami akan tanya semula.",
  symptomRecordedTitle: "Simptom direkod",
  symptomRecordedDesc: "Penjaga anda sudah dimaklumkan.",
  emergencyTitle: "AMARAN KECEMASAN",
  emergencyMessage:
    "Sakit dada teruk dilaporkan. Hubungi 999 segera jika sesak nafas atau berpeluh.",
  emergencyCall999: "📞 Hubungi 999",
  emergencyAlertSent: "✅ Amaran dihantar kepada Wei Ming",
  emergencyDismiss: "Saya faham",
  voiceHint: "🔊 Suara Hokkien & Kantonis — kini sedia",
  dayDetailTitle: "Hari {n}",
  dayDetailSubtitle: "Laporan pada hari ini",
  noReports: "Tiada laporan pada hari ini.",
  good: "Hari baik",
  moderate: "Simptom sederhana",
  needsAttention: "Perlu perhatian",
  noData: "Tiada data",
  newBadge: "BARU",
  resetDemo: "Set semula data demo",
  dailyReadingsTitle: "Bacaan Harian",
  dailyReadingsSubtitle: "Tekan untuk catat bacaan hari ini",
  bloodSugar: "Gula Darah",
  bloodPressure: "Tekanan Darah",
  bloodSugarSheetTitle: "Catat Gula Darah",
  bloodPressureSheetTitle: "Catat Tekanan Darah",
  beforeMeal: "Sebelum makan",
  afterMeal: "Selepas makan",
  saveReading: "Simpan bacaan",
  cancel: "Batal",
  bpToastTitle: "Tekanan darah direkod ✅",
  sugarToastTitle: "Gula darah direkod ✅",
  lastBpLabel: "Terakhir TD",
  lastSugarLabel: "Terakhir Gula",
  noReadingYet: "Belum ada bacaan",
};

const zh: Strings = {
  greetingMorning: "早安，",
  greetingAfternoon: "午安，",
  greetingEvening: "晚安，",
  todayLine: "今天，5月24日 星期日",
  feelingPrompt: "今天感觉怎么样？",
  whereDoesItHurt: "请按一按疼痛的地方",
  tapAnyArea: "请点身体任何不舒服的部位",
  preferButtons: "想用按钮？点这里",
  showBodyMap: "显示身体图",
  front: "前面",
  back: "后面",
  zone: {
    head: "头",
    neck: "颈",
    chest: "胸",
    stomach: "肚子",
    "left-arm": "左手",
    "right-arm": "右手",
    "upper-back": "上背",
    "lower-back": "下背",
    "left-leg": "左膝",
    "right-leg": "右膝",
    hands: "手",
    feet: "脚",
  },
  whatKindOfPain: "什么样的不舒服？",
  howBadIsIt: "有多严重？",
  painPressing: "胀 / 紧",
  painSharp: "刺痛",
  painBurning: "灼热",
  painAching: "酸 / 闷痛",
  sevMild: "轻微",
  sevModerate: "中等",
  sevSevere: "严重",
  thankYou: "多谢你，Ah Kong。",
  thankYouSub: "已通知你的家人。",
  followUp: {
    "chest-pressing": {
      q: "这胸闷是休息时、活动时，还是一直都有？",
      opts: ["休息时", "活动时", "一直都有"],
    },
    "chest-sharp": {
      q: "刺痛是突然发生，还是慢慢加重？",
      opts: ["突然", "慢慢加重", "时有时无"],
    },
    "chest-burning": {
      q: "灼热感跟吃饭或呼吸有关吗？",
      opts: ["饭后", "呼吸时", "都没关系"],
    },
    "chest-aching": {
      q: "这酸痛是一直有，还是时有时无？",
      opts: ["一直有", "时有时无", "只在晚上"],
    },
    "head-aching": {
      q: "头痛是早上、晚上还是一整天？",
      opts: ["早上", "晚上", "一整天"],
    },
    "head-pressing": {
      q: "压迫感在头的前面、两侧还是后面？",
      opts: ["前面", "两侧", "后面"],
    },
    "head-sharp": {
      q: "这刺痛是突然来的吗？",
      opts: ["对，突然", "慢慢的", "活动后"],
    },
    "stomach-aching": {
      q: "肚子痛跟吃饭有关吗？",
      opts: ["饭前", "饭后", "都没关系"],
    },
    "stomach-burning": {
      q: "灼热感在肚子的上面还是下面？",
      opts: ["上面", "下面", "都有"],
    },
    "left-leg-aching": {
      q: "膝盖痛是走路、爬楼梯，还是休息时？",
      opts: ["走路", "爬楼梯", "休息时"],
    },
    "right-leg-aching": {
      q: "膝盖痛是走路、爬楼梯，还是休息时？",
      opts: ["走路", "爬楼梯", "休息时"],
    },
    "lower-back-aching": {
      q: "腰痛在坐着、站着，还是躺下时比较厉害？",
      opts: ["坐着", "站着", "躺下时"],
    },
    "upper-back-pressing": {
      q: "上背紧绷在早上比较严重还是活动后？",
      opts: ["早上", "活动后", "一整天"],
    },
    default: {
      q: "这感觉是一直有，还是时有时无？",
      opts: ["一直有", "时有时无", "刚开始"],
    },
  },
  medTitle: "吃药时间到了",
  medSubtitle: "下午的药吃了吗？",
  medYes: "吃了",
  medNot: "还没",
  medToastTitle: "做得好，Ah Kong！✅",
  medToastDesc: "已记录吃药。",
  medLaterToast: "30 分钟后再提醒。",
  medLaterDesc: "我们等下再问。",
  symptomRecordedTitle: "症状已记录",
  symptomRecordedDesc: "已通知你的家人。",
  emergencyTitle: "紧急警报",
  emergencyMessage: "胸痛严重。如有呼吸困难或冒汗，请立即拨打 999。",
  emergencyCall999: "📞 拨 999",
  emergencyAlertSent: "✅ 已通知 Wei Ming",
  emergencyDismiss: "我明白",
  voiceHint: "🔊 福建话 / 广东话语音 — 现已支持",
  dayDetailTitle: "{n} 日",
  dayDetailSubtitle: "当天的报告",
  noReports: "当天没有记录。",
  good: "状况良好",
  moderate: "中等症状",
  needsAttention: "需要关注",
  noData: "无数据",
  newBadge: "新",
  resetDemo: "重置示范数据",
  dailyReadingsTitle: "每日数值",
  dailyReadingsSubtitle: "请按一按记录今天的数值",
  bloodSugar: "血糖",
  bloodPressure: "血压",
  bloodSugarSheetTitle: "记录血糖",
  bloodPressureSheetTitle: "记录血压",
  beforeMeal: "饭前",
  afterMeal: "饭后",
  saveReading: "保存",
  cancel: "取消",
  bpToastTitle: "血压已记录 ✅",
  sugarToastTitle: "血糖已记录 ✅",
  lastBpLabel: "最近血压",
  lastSugarLabel: "最近血糖",
  noReadingYet: "暂无记录",
};

export const STRINGS: Record<Lang, Strings> = { en, bm, zh };

export function t(lang: Lang): Strings {
  return STRINGS[lang];
}

export function timeOfDayKey(
  now = new Date(),
): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const h = now.getHours();
  if (h < 12) return "greetingMorning";
  if (h < 18) return "greetingAfternoon";
  return "greetingEvening";
}

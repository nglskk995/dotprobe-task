// ============================================================
// STIMULUS CONFIGURATION
// 图片路径假设全部放在 images/ 文件夹下，和这个文件同一目录
// 如果你的文件夹结构不同，修改下面 IMG_PATH
// ============================================================

const IMG_PATH = "oasis/";

// ---- 威胁图片：社会性威胁 (Angry face) ----
const SOCIAL_THREAT_IMAGES = [
  "threat_angryface_1.jpg",
  "threat_angryface_2.jpg",
  "threat_angryface_3.jpg",
  "threat_angryface_4.jpg",
  "threat_angryface_5.jpg",
];

// ---- 威胁图片：物理性威胁 (Gun, Knife, Snake, Shot, Shooting, Weapon) ----
const PHYSICAL_THREAT_IMAGES = [
  "threat_gun_1.jpg",
  "threat_gun_2.jpg",
  "threat_gun_3.jpg",
  "threat_gun_4.jpg",
  "threat_gun_5.jpg",
  "threat_gun_6.jpg",
  "threat_gun_7.jpg",
  "threat_gun_8.jpg",
  "threat_knife_1.jpg",
  "threat_knife_2.jpg",
  "threat_snake_1.jpg",
  "threat_snake_2.jpg",
  "threat_snake_3.jpg",
  "threat_snake_4.jpg",
  "threat_shot_1.jpg",
  "threat_shot_2.jpg",
  "threat_shooting_1.jpg",
  "threat_weapon_1.jpg",
];

// ---- 中性图片：人脸 (用来配对 social threat) ----
const NEUTRAL_FACE_IMAGES = [
  "neutral_face_1.jpg",
  "neutral_face_2.jpg",
  "neutral_face_3.jpg",
  "neutral_face_4.jpg",
];

// ---- 中性图片：物品/场景 (用来配对 physical threat 和 baseline) ----
const NEUTRAL_OBJECT_IMAGES = [
  "neutral_keyboard_1.jpg",
  "neutral_keyboard_2.jpg",
  "neutral_keyboard_3.jpg",
  "neutral_keys_1.jpg",
  "neutral_pinecone_1.jpg",
  "neutral_pinecone_2.jpg",
  "neutral_pinecone_3.jpg",
  "neutral_rocks_1.jpg",
  "neutral_rocks_2.jpg",
  "neutral_rocks_3.jpg",
  "neutral_rocks_4.jpg",
  "neutral_bark_1.jpg",
  "neutral_bark_2.jpg",
  "neutral_bark_3.jpg",
  "neutral_sidewalk_1.jpg",
  "neutral_sidewalk_2.jpg",
  "neutral_sidewalk_3.jpg",
  "neutral_timber_1.jpg",
  "neutral_timber_2.jpg",
  "neutral_timber_3.jpg",
];

// ---- 练习用图片 (不进正式分析，随便挑几张威胁+中性图片即可) ----
const PRACTICE_THREAT_IMAGES = [
  "threat_gun_1.jpg",
  "threat_angryface_1.jpg",
];
const PRACTICE_NEUTRAL_IMAGES = [
  "neutral_rocks_1.jpg",
  "neutral_face_1.jpg",
];

// ---- Trial 数量设置 ----
const N_SOCIAL_CONGRUENT = 20;
const N_SOCIAL_INCONGRUENT = 20;
const N_PHYSICAL_CONGRUENT = 20;
const N_PHYSICAL_INCONGRUENT = 20;
const N_NEUTRAL_BASELINE = 16;
const N_PRACTICE = 5;

// ---- 计时参数 (单位: 毫秒) ----
const FIXATION_DURATION = 500;
const STIMULUS_DURATION = 500;
const ITI_MIN = 500;
const ITI_MAX = 1000;
const RESPONSE_TIMEOUT = 2000; // 超过这个时间没反应就记为timeout

// ---- Google Sheets 数据接收端点 ----
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1cOk9QztK90p_tKmtX_lpnKsKybQQs3WeJPvwbasAlF3jXa1ybGL6gWxcbqwL2jdd5g/exec";

// ---- 跳转回 Qualtrics 的设置 ----
// 完成后会跳转到这个网址，并把 session code 当作 URL 参数带回去
// 你需要把这个换成你 Qualtrics 问卷里"continue from external task"那一页的网址
const QUALTRICS_RETURN_URL = "https://your-institution.qualtrics.com/jfe/form/YOUR_SURVEY_ID";

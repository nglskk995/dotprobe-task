// ============================================================
// EXPERIMENT LOGIC
// ============================================================

const jsPsych = initJsPsych({
  on_finish: function () {
    // 实验结束后，把数据存到 jsPsych 内部，并跳转回 Qualtrics
    finishAndRedirect();
  },
});

// 生成一个唯一的 session code，用来连接 Qualtrics 数据和这边的反应时数据
// 这个 code 不含任何可识别身份的信息，纯随机字符串
function generateSessionCode() {
  return (
    "S" +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  ).toUpperCase();
}
const SESSION_CODE = generateSessionCode();

// 工具函数：从数组里随机不重复抽取 n 个元素（如果 n 大于数组长度，允许重复抽取并打乱）
function sampleWithRepeat(array, n) {
  const result = [];
  let pool = jsPsych.randomization.shuffle([...array]);
  while (result.length < n) {
    if (pool.length === 0) {
      pool = jsPsych.randomization.shuffle([...array]);
    }
    result.push(pool.pop());
  }
  return result;
}

// ============================================================
// 生成 trial 列表
// 每个 trial 对象包含: threatImg, neutralImg, threatSide ('left'/'right'),
//                      probeSide ('left'/'right' -> congruent 表示 probe 出现在 threat 那一侧)
//                      condition ('social'/'physical'/'baseline')
//                      congruency ('congruent'/'incongruent'/NA for baseline)
// ============================================================

function buildTrialList() {
  let trials = [];

  // ---- Social threat trials ----
  const socialThreatPool = sampleWithRepeat(
    SOCIAL_THREAT_IMAGES,
    N_SOCIAL_CONGRUENT + N_SOCIAL_INCONGRUENT
  );
  const socialNeutralPool = sampleWithRepeat(
    NEUTRAL_FACE_IMAGES,
    N_SOCIAL_CONGRUENT + N_SOCIAL_INCONGRUENT
  );
  for (let i = 0; i < N_SOCIAL_CONGRUENT; i++) {
    trials.push(
      makeTrial(socialThreatPool.pop(), socialNeutralPool.pop(), "social", "congruent")
    );
  }
  for (let i = 0; i < N_SOCIAL_INCONGRUENT; i++) {
    trials.push(
      makeTrial(socialThreatPool.pop(), socialNeutralPool.pop(), "social", "incongruent")
    );
  }

  // ---- Physical threat trials ----
  const physThreatPool = sampleWithRepeat(
    PHYSICAL_THREAT_IMAGES,
    N_PHYSICAL_CONGRUENT + N_PHYSICAL_INCONGRUENT
  );
  const physNeutralPool = sampleWithRepeat(
    NEUTRAL_OBJECT_IMAGES,
    N_PHYSICAL_CONGRUENT + N_PHYSICAL_INCONGRUENT
  );
  for (let i = 0; i < N_PHYSICAL_CONGRUENT; i++) {
    trials.push(
      makeTrial(physThreatPool.pop(), physNeutralPool.pop(), "physical", "congruent")
    );
  }
  for (let i = 0; i < N_PHYSICAL_INCONGRUENT; i++) {
    trials.push(
      makeTrial(physThreatPool.pop(), physNeutralPool.pop(), "physical", "incongruent")
    );
  }

  // ---- Neutral-neutral baseline trials ----
  // 两边都用 neutral object 图片，互不重复配对，congruency 不适用，probe 位置完全随机
  const baselinePool = sampleWithRepeat(NEUTRAL_OBJECT_IMAGES, N_NEUTRAL_BASELINE * 2);
  for (let i = 0; i < N_NEUTRAL_BASELINE; i++) {
    const imgA = baselinePool.pop();
    const imgB = baselinePool.pop();
    const threatSide = Math.random() < 0.5 ? "left" : "right";
    const probeSide = Math.random() < 0.5 ? "left" : "right";
    trials.push({
      leftImg: threatSide === "left" ? imgA : imgB,
      rightImg: threatSide === "left" ? imgB : imgA,
      probeSide: probeSide,
      condition: "baseline",
      congruency: "NA",
    });
  }

  return jsPsych.randomization.shuffle(trials);
}

// 构建单个 threat-neutral trial，自动 counterbalance 左右位置和 congruency
function makeTrial(threatImg, neutralImg, condition, congruency) {
  const threatSide = Math.random() < 0.5 ? "left" : "right";
  const probeSide =
    congruency === "congruent"
      ? threatSide
      : threatSide === "left"
      ? "right"
      : "left";

  return {
    leftImg: threatSide === "left" ? threatImg : neutralImg,
    rightImg: threatSide === "left" ? neutralImg : threatImg,
    threatSide: threatSide,
    probeSide: probeSide,
    condition: condition,
    congruency: congruency,
  };
}

// ============================================================
// jsPsych trial 构建：把一个 trial 数据对象变成实际呈现的画面
// ============================================================

function buildJsPsychTrial(trialData, isPractice) {
  const timeline = [];

  // 注视点
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div class="stim-container"><div class="fixation" style="text-align:center; margin-top:150px;">+</div></div>',
    choices: "NO_KEYS",
    trial_duration: FIXATION_DURATION,
  });

  // 图片对呈现
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      return `
        <div class="stim-container">
          <div class="stim-left">
            <img class="stim-img" src="${IMG_PATH + trialData.leftImg}">
          </div>
          <div class="stim-right">
            <img class="stim-img" src="${IMG_PATH + trialData.rightImg}">
          </div>
        </div>`;
    },
    choices: "NO_KEYS",
    trial_duration: STIMULUS_DURATION,
  });

  // 探测点 + 反应收集
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      const probeHtml = '<div class="probe">*</div>';
      return `
        <div class="stim-container">
          <div class="stim-left" style="text-align:center;">${
            trialData.probeSide === "left" ? probeHtml : ""
          }</div>
          <div class="stim-right" style="text-align:center;">${
            trialData.probeSide === "right" ? probeHtml : ""
          }</div>
        </div>`;
    },
    choices: ["e", "i"], // E = 左边探测点, I = 右边探测点
    trial_duration: RESPONSE_TIMEOUT,
    data: {
      task: isPractice ? "practice" : "dotprobe",
      condition: trialData.condition,
      congruency: trialData.congruency,
      threat_side: trialData.threatSide || "NA",
      probe_side: trialData.probeSide,
      left_img: trialData.leftImg,
      right_img: trialData.rightImg,
    },
    on_finish: function (data) {
      const correctKey = trialData.probeSide === "left" ? "e" : "i";
      data.correct = data.response === correctKey;
      data.session_code = SESSION_CODE;
    },
  });

  // Trial 间隔 (ITI)，随机时长，避免被试预判节奏
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    choices: "NO_KEYS",
    trial_duration: function () {
      return Math.floor(Math.random() * (ITI_MAX - ITI_MIN + 1)) + ITI_MIN;
    },
  });

  return timeline;
}

// ============================================================
// 组装完整时间线
// ============================================================

let full_timeline = [];

// ---- 预加载所有图片，避免实验中途卡顿 ----
const ALL_IMAGES = [
  ...SOCIAL_THREAT_IMAGES,
  ...PHYSICAL_THREAT_IMAGES,
  ...NEUTRAL_FACE_IMAGES,
  ...NEUTRAL_OBJECT_IMAGES,
].map((f) => IMG_PATH + f);

full_timeline.push({
  type: jsPsychPreload,
  images: ALL_IMAGES,
});

// ---- 欢迎页 + 指导语 ----
full_timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="max-width:700px; margin:0 auto; text-align:left;">
      <h2>Visual Task Instructions</h2>
      <p>In this task, you will see two images appear briefly on the screen, one on the left and one on the right.</p>
      <p>After the images disappear, a small asterisk (*) will appear where one of the images was.</p>
      <p>Your job is to indicate <b>which side</b> the asterisk appeared on, as quickly and accurately as possible:</p>
      <p style="font-size:24px; text-align:center;"><b>Press "E"</b> if the asterisk is on the <b>LEFT</b><br>
      <b>Press "I"</b> if the asterisk is on the <b>RIGHT</b></p>
      <p>Please keep your fingers resting on the E and I keys throughout the task.</p>
      <p>We will start with a few practice trials so you can get used to the task.</p>
      <p style="text-align:center;">Press any key to begin practice.</p>
    </div>`,
  choices: "ALL_KEYS",
});

// ---- 练习 trial ----
const practiceTrials = [];
for (let i = 0; i < N_PRACTICE; i++) {
  const tImg = PRACTICE_THREAT_IMAGES[i % PRACTICE_THREAT_IMAGES.length];
  const nImg = PRACTICE_NEUTRAL_IMAGES[i % PRACTICE_NEUTRAL_IMAGES.length];
  const congr = i % 2 === 0 ? "congruent" : "incongruent";
  practiceTrials.push(makeTrial(tImg, nImg, "practice", congr));
}
practiceTrials.forEach((t) => {
  full_timeline = full_timeline.concat(buildJsPsychTrial(t, true));
});

// ---- 练习结束提示 ----
full_timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="max-width:600px; margin:0 auto;">
      <h3>Practice complete!</h3>
      <p>The real task will now begin. Remember:</p>
      <p><b>E</b> = asterisk on the LEFT &nbsp;&nbsp;&nbsp; <b>I</b> = asterisk on the RIGHT</p>
      <p>Please respond as quickly and accurately as you can.</p>
      <p style="text-align:center;">Press any key to start.</p>
    </div>`,
  choices: "ALL_KEYS",
});

// ---- 正式实验 trial，中途插入一次休息 ----
const mainTrials = buildTrialList();
const halfPoint = Math.floor(mainTrials.length / 2);

mainTrials.forEach((t, idx) => {
  full_timeline = full_timeline.concat(buildJsPsychTrial(t, false));

  if (idx === halfPoint - 1) {
    full_timeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <div style="max-width:600px; margin:0 auto; text-align:center;">
          <h3>You may take a short break.</h3>
          <p>Press any key when you are ready to continue.</p>
        </div>`,
      choices: "ALL_KEYS",
    });
  }
});

// ---- 结束页 ----
full_timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="max-width:600px; margin:0 auto; text-align:center;">
      <h3>Task complete!</h3>
      <p>Thank you. You will now be redirected back to the survey.</p>
      <p>If you are not redirected automatically within a few seconds, please click the link below.</p>
      <p><a id="manual-link" href="#">Click here to continue</a></p>
    </div>`,
  choices: "NO_KEYS",
  trial_duration: 2000,
});

// ============================================================
// 结束后：把数据存好并跳转回 Qualtrics，带上 session code
// ============================================================

function finishAndRedirect() {
  // 把数据转成 CSV 字符串，存到 jsPsych 自带的下载功能里（备份用，万一跳转失败）
  // 正式部署时，这里也可以加一个 fetch() 把数据传到你自己的服务器或 Firebase
  // 目前先做最简单版本：数据保留在 jsPsych 内部，并跳转回 Qualtrics

  const returnUrl =
    QUALTRICS_RETURN_URL +
    (QUALTRICS_RETURN_URL.includes("?") ? "&" : "?") +
    "session_code=" +
    SESSION_CODE;

  setTimeout(function () {
    window.location.href = returnUrl;
  }, 1500);
}

// ---- 启动实验 ----
jsPsych.run(full_timeline);

# Dot-Probe Task 使用说明

## 文件结构

```
dotprobe/
├── index.html       <- 主页面，不需要改
├── config.js         <- 配置文件：图片清单、trial数量、计时参数、Qualtrics跳转网址
├── experiment.js      <- 实验逻辑代码，一般不需要改
└── images/           <- 把你重命名好的47张图片全部放进这个文件夹
```

## 你需要做的事

### 1. 把图片放进 images 文件夹
把所有按照 filename_mapping.csv 重命名好的图片（threat_gun_1.jpg 等）放进 `images/` 文件夹。

### 2. 检查 config.js 里的图片清单
config.js 里已经按照我们的47张图清单填好了文件名。如果你后来调整了某几张图，记得同步改这里。

### 3. 填写 Qualtrics 跳转网址
打开 config.js，找到这一行：

```js
const QUALTRICS_RETURN_URL = "https://your-institution.qualtrics.com/jfe/form/YOUR_SURVEY_ID";
```

把它换成你 Qualtrics 问卷里"被试做完任务后应该跳回的那一页"的网址。

这里有个重要的技术点：Qualtrics 那边需要先用一个"Embedded Data"字段接住从这边传回去的 `session_code` 参数（网址会自动带上 `?session_code=XXXXX`），这样你才能把 Qualtrics 里的问卷数据和这边收集的反应时数据用 session_code 对上。这部分 Qualtrics 设置我可以单独帮你写步骤。

### 4. 上传到 GitHub Pages

1. 在 GitHub 新建一个 repository（比如叫 `dotprobe-task`）
2. 把这四个文件/文件夹（index.html, config.js, experiment.js, images/）全部上传上去
3. 进入 repository 的 Settings → Pages，把 Source 设置为 main branch
4. 几分钟后，会生成一个类似这样的网址：
   `https://你的用户名.github.io/dotprobe-task/`
5. 这个网址就是你要嵌进 Qualtrics 里的任务链接

### 5. 测试

部署好之后，自己先用这个网址跑一遍，检查：
- 图片是否都能正常加载（如果某张图加载不出来，多半是文件名拼写或大小写不一致）
- 按键反应是否正常记录
- 任务结束后是否能正确跳转回 Qualtrics，并带上 session_code

## 当前任务参数（在 config.js 里可调）

- Social threat congruent: 20 trials
- Social threat incongruent: 20 trials
- Physical threat congruent: 20 trials
- Physical threat incongruent: 20 trials
- Neutral baseline: 16 trials
- 练习 trial: 5 个（不进正式分析）
- 总计正式 trial: 96 个
- 图片呈现时长: 500ms
- 反应超时: 2000ms
- 中途有一次休息点（做完一半后）

## 数据去哪了

**重要：目前这版代码里，反应时数据只是临时存在浏览器里，跳转回 Qualtrics 后不会自动永久保存。**

这是下一步需要解决的问题，有几个选项：
1. 把数据通过 fetch() 发送到 Google Sheets / Firebase（免费、配置简单，我可以帮你写）
2. 用 jsPsych 自带的功能让被试自动下载 CSV（不适合大规模线上招募，太依赖被试手动操作）
3. 搭一个简单的后端接收数据（更可靠，但需要额外设置）

建议你先把任务流程和 Qualtrics 跳转跑通，确认整体逻辑没问题，下一步我们再一起处理数据保存的部分。

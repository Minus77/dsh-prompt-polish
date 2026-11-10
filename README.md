# dsh-prompt-polish

[简体中文](README.md) · [English](README_en.md)

[![GitHub stars](https://img.shields.io/github/stars/Minus77/dsh-prompt-polish?style=social)](https://github.com/Minus77/dsh-prompt-polish)
[![license](https://img.shields.io/github/license/Minus77/dsh-prompt-polish)](LICENSE)

**输入框旁的提示词优化器 —— 给 [DeepSeek Harness](https://www.deepseek.com/harness/) 用的插件。**

输入框里的草稿常常是一句「帮我写个周报」，模型只能靠猜。这个插件在你按下发送之前，把它改写成一份边界清楚、可以直接复用的提示词——入口就贴在输入框右下角，和原生 `选择模型` 是同一种药丸。

![面板](docs/screenshots/02-panel.png)

## 目录

- [简介](#简介)
- [功能](#功能)
- [安装](#安装)
- [使用](#使用)
  - [打开即优化](#打开即优化)
  - [替换前先看 diff](#替换前先看-diff)
  - [替换后 9 秒内可撤销](#替换后-9-秒内可撤销)
  - [迭代优化](#迭代优化)
  - [模板](#模板)
  - [变量提取](#变量提取)
  - [历史与版本对比](#历史与版本对比)
  - [深色模式](#深色模式)
- [设计约束](#设计约束)
- [兼容性与限制](#兼容性与限制)
- [开发与测试](#开发与测试)
- [许可证](#许可证)
- [仓库结构](#仓库结构)

## 简介

`dsh-prompt-polish` 不是一个「提示词生成网站」，而是输入框的一部分。它把三件事做完，然后停在原地等你自己决定：

1. **先看后写** —— 替换草稿前先给逐行 diff，确认之后才写入；写入后 9 秒内可以从入口药丸撤销。
2. **不偷偷花钱** —— 打开面板自动跑一次；换模式才自动重跑；换模板只换选择，由你决定什么时候「用新模板重跑」。
3. **像原生控件** —— 颜色全部来自 DSH 主题 token，深浅色自动适配；浮层 portal 到 `document.body`，不会被输入框裁切。

优化引擎移植自 [linshenkx/prompt-optimizer](https://github.com/linshenkx/prompt-optimizer) 的优化模式轴、mustache 模板引擎与变量提取，模板体系在 0.4.0 之后按「可验证的提示词构造方法」重建（见 [docs/TEMPLATES.md](docs/TEMPLATES.md)）。

## 功能

| 能力 | 行为 |
| --- | --- |
| 入口 | composer 右下角一枚纯文字药丸（`提示词优化`），与原生 `选择模型` 同款样式，不发光、不渐变 |
| 打开即优化 | 打开面板立刻用当前模式默认模板跑一次；输入框为空则不调用 |
| 换模式 | 中止上一条流，按新模式的默认模板自动重跑；220ms 内的连续切换合并成一次 |
| 换模板 | 只改选择，不发请求；底部出现「用新模板重跑」，按了才花一次调用 |
| 同一草稿 | 关掉再打开直接复用屏幕上的结果，不重复调用 |
| 替换 | 先显示逐行 diff（删除红底、新增绿底、未改动行折叠），确认后写入 |
| 撤销 | 替换后 9 秒内，入口药丸提供「撤销」，一键恢复原文 |
| 迭代 | 拿着上一版结果和一句改进意见做最小差分改写，自动成链 |
| 模板 | 7 套在册模板，面板暴露 5 套（4 套提示词 + 1 套迭代），按「基础 / 结构 / 示范 / 推理 / 迭代」分组 |
| 变量提取 | 把结果里可变的片段抽成 `{{变量}}`，写回即成为可复用模板 |
| 本机历史 | 授权后每次生成存为版本（localStorage，上限 50），可逐条删、整链删、全清 |
| 版本对比 | 原稿｜结果 两列，同一链可切换版本，附本机结构分析（行数增删、目标/背景/约束/格式覆盖），不再调用模型 |
| 模型 | 默认跟随输入框当前模型，也可以固定成某个 provider/model |
| 用量 | 每次显示模型、耗时、字数、token；模型未上报时显示「未提供」，不显示假的 0 |
| 语言 | 跟随 Harness 的 `<html lang>`，中文 / 英文，运行中切换语言也能跟着变 |
| 主题 | 只使用 `--dsw-alias-*` token，深色模式自动适配 |

## 安装

前提：DeepSeek Harness `>= 0.1.7`（在 `0.2.2-rc.1` 桌面版上验证），Node.js `>= 18`。插件没有构建步骤，`lib/*.js` 就是运行时代码。

### 1. 取包

```sh
git clone https://github.com/Minus77/dsh-prompt-polish.git
cd dsh-prompt-polish
npm pack
```

会得到 `benrong-dsh-prompt-polish-0.7.1.tgz`（文件名随版本走）。

### 2. 装进 profile

```sh
dsh plugin --profile web add ./benrong-dsh-prompt-polish-0.7.1.tgz
```

桌面版用 `--profile desktop`：

```sh
dsh plugin --profile desktop add ./benrong-dsh-prompt-polish-0.7.1.tgz
```

`dsh plugin` 把参数原样转发给 profile 目录里的 pnpm，所以本地 tgz、目录、npm 包名都接受。

### 3. 让它生效

宿主侧代码（路由、模板目录）在进程启动时加载，装完请重启一次 DeepSeek Harness；之后客户端 bundle 会随窗口重载刷新。

> 这个包目前**没有发布到 npm**，`dsh plugin add @benrong/dsh-prompt-polish` 会去公共 registry 找同名包并失败——请用本地 tgz 路径。

## 使用

### 打开即优化

在输入框里写一句草稿，点右下角的 `提示词优化`。面板贴在输入框上方打开，同时已经按默认模板（`任务简报`）跑了一次，不需要再点任何按钮。

![入口与结果](docs/screenshots/01-entry.png)

结果卡顶部显示模型、耗时、字数与 token 用量；底部只剩 `跟随当前`、`发送`、`替换草稿` 三个动作——没有「润色」按钮，因为打开就已经润过了。

### 替换前先看 diff

点 `替换草稿` 不会立刻写入，而是先给你一张逐行对比：删除的行红底、新增的行绿底、连续未改动的行折叠成一行提示。

![逐行 diff](docs/screenshots/03-diff.png)

确认后才会写进输入框；点 `取消` 或按 `Esc` 回到结果。

### 替换后 9 秒内可撤销

写入之后，入口药丸变成 `✓ 已替换` 并附带 `撤销`。9 秒内点了就恢复原文；草稿又被你改动过之后，撤销按钮自动消失，避免覆盖新内容。

![撤销](docs/screenshots/04-undo.png)

### 迭代优化

切到 `迭代优化`，写一句「这版还想怎么改」，点 `开始迭代`。模型拿上一版结果和这句话做最小差分改写；结果成为版本链上的下一版，可以逐版对比。

![迭代优化](docs/screenshots/07-iterate.png)

### 模板

模板 picker 按分类分组，每一项带一句「这模板干什么」和「适用 / 优点」。换模板不会触发请求——底部出现 `用新模板重跑`，你按了才花钱。

![模板菜单](docs/screenshots/08-templates.png)

| 模板 | 分类 | 适用 |
| --- | --- | --- |
| `任务简报` `user-task` | 基础 | 需求零散、缺背景、没说交付形式 |
| `结构化规格` `user-spec` | 结构 | 素材多，需要分清「要求」与「数据」 |
| `示范驱动` `user-fewshot` | 示范 | 输出格式严格、描述容易走样 |
| `推理脚手架` `user-reason` | 推理 | 比较、判断、多步任务 |
| `最小差分` `iter-diff` | 迭代 | 拿着上一版提改进意见 |

`sys-role`（角色契约）与 `sys-soul`（Agent 人格文件）仍在注册表里，旧 ID 与别名继续解析，但从 0.5.0 起不再出现在面板中——面板是围绕「输入框草稿」设计的，系统提示词不是它的场景。

### 变量提取

结果卡右上角的 `{ }` 会把结果里可变的片段抽成变量（这一步会调用一次模型），生成一份 `{{变量}}` 模板并写回模板列表；之后填变量就能复用这套写法。

### 历史与版本对比

授权保存后，头部时钟图标进入历史：按时间倒序列出版本，展开可看原稿 / 结果、复制、写回、对比版本、删除。

![历史](docs/screenshots/05-history.png)

同一链上的版本可以在对比视图里切换，附一段本机结构分析（行数增删、目标/背景/约束/格式覆盖）——只读本地数据，不调用模型。

![版本对比](docs/screenshots/06-compare.png)

### 深色模式

所有颜色来自主题 token，深色下自动反过来，不需要单独配置。

![深色模式](docs/screenshots/09-dark.png)

## 设计约束

这个插件的 UI 是照着 Harness 自己的 composer 做的，几条硬约束写进代码里：

- **只在输入框上「长出来」** —— 面板从 `conversation.input.right` 槽挂载，用 `createPortal` 到 `document.body` 定位，避免被裁切。
- **只用主题 token** —— `--dsw-alias-bg-layer-1`、`border-l2`、`label-secondary`、`button-primary-fill` 等，不写死颜色；层次用 `color-mix(in srgb, var(--dsw-alias-label-primary) N%, transparent)`。
- **原生尺寸** —— 控件 26–28px 高、面板 520px 宽、圆角 14px；没有渐变、没有发光、没有呼吸动画。
- **状态是文字** —— 「生成中」「已替换」「草稿已更新」都用文字表达，不靠颜色独扛语义。

## 兼容性与限制

- **opencode-go / 需要会话头的路由** —— 插件会把当前 `sessionId` 透传给 `llm.stream`，宿主据此注入 `x-opencode-session`；没有会话时使用一个进程内稳定的兜底 id。
- **流式** —— 优化请求走 NDJSON 流，界面按增量渲染；关闭面板会 abort 当前流。
- **历史只在本机** —— 存在 `localStorage`（`dsh.prompt-polish/history`），默认不保存，第一次生成后询问；上限 50 条，清空即删。
- **diff 是行级** —— 按行做 LCS，超长文本（行数乘积 > 400000）退化为「全删全增」，不会卡住界面。
- **模板变量** —— 兼容原有 `{{变量}}` 占位符；变量提取的输出会逐字保留双花括号。
- **双语** —— 跟随 `<html lang>`；中文 / 英文文案都在包里，切换语言不需要重装。

## 开发与测试

```sh
node templates.test.mjs        # 模板注册表、变量、别名、默认值（11 项）
node compat.mjs --asar "/path/to/DeepSeek Harness.app/Contents/Resources/app.asar"
```

`compat.mjs` 会对着本机安装的 Harness 逐项审计插件契约（模块加载器、插槽、清单、portal 规则、注入包版本），当前 16/16 通过。

## 许可证

[MIT](LICENSE)

## 仓库结构

```text
dsh-prompt-polish/
├── LICENSE                  MIT
├── README.md                本文件（中文）
├── README_en.md             英文说明
├── package.json             插件清单：exports / dsh.client.inject / bundle.patch
├── cordis.patch.yml         bundle 安装时插入的插件行
├── compat.mjs               对着本机 asar 的契约审计（16 项）
├── templates.test.mjs       模板注册表测试（11 项）
├── lib/
│   ├── index.js             宿主：/models、/optimize（NDJSON 流）、/extract-variables
│   ├── client.js            客户端：入口药丸、面板、diff、撤销、历史、对比、i18n
│   ├── prompts.js           模板注册表 + 别名 + 双语元数据
│   ├── processor.js         优化请求的组装与流式解析
│   ├── mustache.js          mustache 渲染（JSON helper / Set Delimiter）
│   └── extraction.js        变量提取与模板回填
└── docs/
    ├── TEMPLATES.md         模板体系：方法、骨架、变量规范、迁移映射
    ├── TEMPLATES.en.md      Template system (English)
    ├── menu-templates.png   模板菜单（旧版截图，保留作对照）
    └── screenshots/         本文用图（中文 / en 各一套）
```

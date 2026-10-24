export type Lang = "zh" | "en";

export const i18nContent = {
  zh: {
    nav: {
      product: "产品",
      docs: "文档",
      download: "下载",
    },
    hero: {
      cta_download: "下载 macOS / Windows / Linux",
      cta_version: "macOS · Windows · Linux · MIT",
      vision:
        "开源、本地优先、属于你的语音输入。\n按下热键，说话，在光标处获得一段打磨干净的提示词。",
    },
    works: { label: "兼容任意有光标的输入框" },
    why: {
      eyebrow: "为什么开源",
      title: "和订阅制工具相同的体验，\n但代码、数据、凭证都属于你。",
      sub: "Typeless、Wispr Flow、Lazy、Superwhisper 都是闭源订阅。OpenLess 想做同样的事，但所有东西在你机器上。",
      cards: [
        { k: "本地优先", t: "数据不出本机", d: "音频、转写、词典、历史全部存在本地。Keychain 存凭证，~/.openless 存配置，仅此而已。" },
        { k: "BYO 凭证", t: "自带云服务", d: "火山引擎流式 ASR + Ark / DeepSeek 兼容的 chat-completions。换一个供应商也行，不被任何家锁定。" },
        { k: "完全透明", t: "代码全部开放", d: "MIT 协议。从热键监听、AVAudioEngine、AX 注入到 prompt 模板，没有黑盒。" },
        { k: "只做一件事", t: "不会替你回答", d: "模型只负责整理你的话。你说『还差什么功能』，它输出的是这个干净的问题，不会替 AI 回答。" },
      ],
    },
    scenarios: {
      eyebrow: "使用场景",
      title: "需要写字、又懒得打字的时刻。",
      hint: "继续向下滚动 · 切换场景",
      placeholder: (app: string) => `${app} 截图占位 · 待替换`,
      items: [
        { tag: "写 Prompt", t: "ChatGPT / Claude / Cursor / Gemini", d: "口述一个需求，OpenLess 输出带上下文、约束、要求的结构化 Prompt。" },
        { tag: "邮件 / 长消息", t: "邮件、规格、Slack / 微信", d: "去掉口头禅、补齐标点、重组段落。语气可选 Light Polish 或 Formal。" },
        { tag: "代码协作", t: "Commit / PR / 注释", d: "脑子里在想什么直接说出来，OpenLess 帮你写到光标里。" },
        { tag: "随手记录", t: "Notion / 飞书 / 备忘录", d: "Raw 模式做纯转写，Light 模式做轻度整理。词典记住你的专有名词。" },
      ],
    },
    roadmap: {
      eyebrow: "Roadmap",
      title: "让所有人能够通过自然语言进行聊天。",
    },
    download: {
      eyebrow: "下载与安装",
      title: "三步上手。",
      sub: "OpenLess 提供 macOS、Windows 和 Linux 安装包。macOS 当前为 ad-hoc 签名，首次启动需解除 quarantine。",
      hint: "↓ 继续下滑切换步骤",
      finalTitle: "开始使用",
      finalDesc: "选择你的系统，前往 GitHub Releases 下载最新稳定版。",
      platforms: ["下载 macOS", "下载 Windows", "下载 Linux"],
      steps: [
        { n: "01", t: "选择平台安装包", d: "macOS 选 Apple Silicon 或 Intel DMG；Windows 选 x64-setup.exe；Linux 选 AppImage、deb 或 rpm。", code: ".dmg · .exe · .AppImage · .deb · .rpm" },
        { n: "02", t: "完成安装", d: "macOS 打开 DMG 并拖入应用程序；Windows 运行安装程序；Linux 运行 AppImage 或用系统包管理器安装。", code: "macOS · Windows · Linux" },
        { n: "03", t: "授予必要权限", d: "首次启动后授予麦克风与输入权限。macOS 用户还需授予辅助功能，并在授权后重启 OpenLess。", code: "Microphone · Accessibility · Input" },
      ],
    },
    cta: {
      title: "你的下一段 Prompt，\n用嘴写。",
      sub: "MIT 协议，免费下载，代码全开。",
      btn1: "下载 macOS / Windows / Linux",
      btn2: "Star on GitHub",
    },
    footer: {
      tag: "面向 macOS、Windows 与 Linux 的开源语音输入。",
      product: "产品",
      resource: "资源",
      community: "社区",
      links: {
        product: ["下载", "文档", "Roadmap", "Changelog"],
        resource: ["GitHub", "USAGE.md", "技术架构", "对比"],
        community: ["Issues", "Discussions", "Releases", "MIT 协议"],
      },
      rights: "© 2026 OpenLess · 由社区维护 · MIT License",
    },
  },
  en: {
    nav: {
      product: "Product",
      docs: "Docs",
      download: "Download",
    },
    hero: {
      cta_download: "Download for macOS / Windows / Linux",
      cta_version: "macOS · Windows · Linux · MIT",
      vision:
        "Open-source, local-first voice input that belongs to you.\nPress a hotkey, talk, get a polished prompt at your cursor.",
    },
    works: { label: "Works in any text field" },
    why: {
      eyebrow: "Why open source",
      title: "The same UX as the subscription tools.\nThe code, data and keys stay yours.",
      sub: "Typeless, Wispr Flow, Lazy and Superwhisper are closed-source SaaS. OpenLess delivers the same end-user experience — but everything runs on your machine.",
      cards: [
        { k: "Local-first", t: "Nothing leaves your Mac", d: "Audio, transcripts, dictionary and history live locally. Credentials in Keychain, config in ~/.openless. That's it." },
        { k: "BYO credentials", t: "Bring your own cloud", d: "Volcengine streaming ASR + Ark / DeepSeek-compatible chat completions. Swap providers freely. No vendor lock-in." },
        { k: "Transparent", t: "Every byte is open", d: "MIT licensed. From hotkey tap and AVAudioEngine to AX insertion and prompt templates — no black boxes." },
        { k: "One thing well", t: "Won't answer for you", d: "The model only cleans your text. Ask 'what features does this app need' and you get that question back, not a list." },
      ],
    },
    scenarios: {
      eyebrow: "Use cases",
      title: "Anywhere you'd rather speak than type.",
      hint: "Keep scrolling · cycle scenes",
      placeholder: (app: string) => `${app} screenshot · placeholder`,
      items: [
        { tag: "Prompts", t: "ChatGPT / Claude / Cursor / Gemini", d: "Dictate a request and get back a structured prompt with context, constraints and asks." },
        { tag: "Email / long messages", t: "Email, specs, Slack, WeChat", d: "Drop fillers, fix punctuation, reorganize paragraphs. Pick Light or Formal tone." },
        { tag: "Coding", t: "Commits / PRs / comments", d: "Say what's in your head — OpenLess writes it at the cursor." },
        { tag: "Capture", t: "Notion / Lark / Notes", d: "Raw for verbatim, Light for tidy. The dictionary keeps your proper nouns." },
      ],
    },
    roadmap: {
      eyebrow: "Roadmap",
      title: "Let everyone chat in natural language.",
    },
    download: {
      eyebrow: "Download & install",
      title: "Three steps.",
      sub: "OpenLess provides installers for macOS, Windows, and Linux. The macOS build is currently ad-hoc signed and must be un-quarantined once.",
      hint: "↓ keep scrolling to advance",
      finalTitle: "Get going",
      finalDesc: "Choose your system and download the latest stable build from GitHub Releases.",
      platforms: ["Download macOS", "Download Windows", "Download Linux"],
      steps: [
        { n: "01", t: "Choose your platform package", d: "Pick the Apple Silicon or Intel DMG for macOS, x64-setup.exe for Windows, or AppImage, deb, or rpm for Linux.", code: ".dmg · .exe · .AppImage · .deb · .rpm" },
        { n: "02", t: "Install OpenLess", d: "Open the DMG and drag the app in on macOS, run the installer on Windows, or launch the AppImage/install the package on Linux.", code: "macOS · Windows · Linux" },
        { n: "03", t: "Grant required permissions", d: "Allow microphone and input access on first launch. On macOS, also grant Accessibility and restart OpenLess after approval.", code: "Microphone · Accessibility · Input" },
      ],
    },
    cta: {
      title: "Write your next prompt\nwith your mouth.",
      sub: "MIT licensed. Free to download. Code all open.",
      btn1: "Download for macOS / Windows / Linux",
      btn2: "Star on GitHub",
    },
    footer: {
      tag: "Open-source voice input for macOS, Windows, and Linux.",
      product: "Product",
      resource: "Resources",
      community: "Community",
      links: {
        product: ["Download", "Docs", "Roadmap", "Changelog"],
        resource: ["GitHub", "USAGE.md", "Architecture", "Compare"],
        community: ["Issues", "Discussions", "Releases", "MIT License"],
      },
      rights: "© 2026 OpenLess · Maintained by the community · MIT License",
    },
  },
} as const;

export type I18n = (typeof i18nContent)["zh"];

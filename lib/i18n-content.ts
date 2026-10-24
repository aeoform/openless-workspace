export type Lang = "zh" | "en";

export const i18nContent = {
  zh: {
    nav: {
      product: "产品",
      docs: "文档",
      download: "下载",
      language: "切换语言",
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
      sub: "Typeless、Wispr Flow、Lazy、Superwhisper 都是闭源订阅。OpenLess 想做同样的事，但所有东西都在你自己的设备上。",
      cards: [
        {
          k: "本地优先",
          t: "配置与历史留在本机",
          d: "设置、词典、转写历史都存在本地；凭证交给系统凭证库（macOS Keychain、Windows Credential Manager、Linux Secret Service）。",
        },
        {
          k: "BYO 凭证",
          t: "自带云服务",
          d: "火山引擎流式 ASR 搭配 Ark / DeepSeek 兼容的 chat-completions，也可以换成别的供应商或本地模型，不被任何一家锁定。",
        },
        {
          k: "完全透明",
          t: "代码全部开放",
          d: "MIT 协议。从热键监听、音频采集、光标注入到 prompt 模板，没有黑盒。",
        },
        {
          k: "只做一件事",
          t: "不会替你回答",
          d: "模型只负责整理你的话。你说「还差什么功能」，它输出的是这个干净的问题，不会替 AI 回答。",
        },
      ],
    },
    scenarios: {
      eyebrow: "使用场景",
      title: "需要写字、又懒得打字的时刻。",
      hint: "继续向下滚动 · 切换场景",
      draftLabel: "口述原文",
      resultLabel: "写入光标",
      modeLabel: "输出模式",
      items: [
        {
          tag: "写 Prompt",
          t: "把碎念变成结构化需求",
          d: "口述一个需求，输出带上下文、约束和要求的结构化 Prompt。",
          app: "Cursor",
          mode: "AI 提示词",
          draft: "呃 帮我写个登录页 要能记住我 然后密码错了得提示一下",
          result:
            "在 src/app/login 实现登录页：\n1. 邮箱 + 密码表单，含格式校验与行内错误提示\n2. 「记住我」写入 30 天持久 cookie\n3. 提交时禁用按钮并显示 loading 状态\n4. 复用现有 Button / Input 组件，不新增依赖",
        },
        {
          tag: "邮件 / 长消息",
          t: "去掉口头禅，补齐语气",
          d: "删掉填充词、补标点、重组段落，语气可选轻度润色或正式。",
          app: "Mail",
          mode: "Formal",
          draft: "就是那个 下周的评审 我可能来不了 要不我们改到周四吧",
          result:
            "主题：关于下周评审时间的调整\n\n你好，\n\n下周的评审我可能无法按时参加，想申请改到周四同一时间。若周四不便，我也可以提前提交书面意见。\n\n谢谢！",
        },
        {
          tag: "代码协作",
          t: "想什么说什么，落到提交里",
          d: "Commit、PR 描述、代码注释，直接说出来的话会被整理成工程语言。",
          app: "VS Code",
          mode: "Light Polish",
          draft: "修一下那个上传大文件会超时的问题 顺手把重试也加上",
          result:
            "fix(upload): raise timeout for large files and add retry\n\n- 分片上传超时改为按分片大小计算\n- 失败分片最多重试 3 次，带指数退避\n- 补充 200 MB 文件的回归用例",
        },
        {
          tag: "随手记录",
          t: "Raw 模式，一个字不改",
          d: "纯转写不加修饰；词典会记住你反复出现的专有名词。",
          app: "Notion",
          mode: "Raw",
          draft: "记一下 下周三之前 把发票整理好 发给财务 张老师",
          result: "待办：下周三前整理好发票，发送给财务（张老师）。",
        },
      ],
    },
    roadmap: {
      eyebrow: "Roadmap",
      title: "让所有人能够通过自然语言进行聊天。",
      sub: "以下是已规划、尚未发布的能力，状态与上游仓库保持一致。",
      planned: "规划中",
      active: "进行中",
      items: [
        {
          t: "跨会话风格记忆",
          d: "润色随时间学习用户的语气，而不是每次都从默认风格开始。",
          status: "active",
          href: "https://github.com/Open-Less/openless/issues/46",
        },
        {
          t: "历史增强",
          d: "历史记录的复制按钮、搜索、重新润色与重新插入。",
          status: "planned",
          href: "https://github.com/Open-Less/openless#roadmap",
        },
        {
          t: "片段 Snippets",
          d: "把常用说法存成片段，按快捷键整段插入。目前尚无 UI 或触发逻辑。",
          status: "planned",
          href: "https://github.com/Open-Less/openless#roadmap",
        },
        {
          t: "「粘贴上次结果」快捷键",
          d: "不重新录音，直接把上一次的输出再插到当前光标。",
          status: "planned",
          href: "https://github.com/Open-Less/openless#roadmap",
        },
      ],
    },
    download: {
      eyebrow: "下载与安装",
      title: "三步上手。",
      sub: "OpenLess 提供 macOS、Windows 与 Linux 安装包。macOS 当前为 ad-hoc 签名、未经公证，首次启动需解除 quarantine。",
      hint: "↓ 继续下滑切换步骤",
      finalTitle: "开始使用",
      finalDesc: "选择你的系统，前往 GitHub Releases 下载最新稳定版，并用 SHA256SUMS 校验文件。",
      platforms: ["下载 macOS", "下载 Windows", "下载 Linux"],
      prefix: "下载",
      recommended: "推荐",
      latest: "最新版",
      published: "发布于",
      allReleases: "所有版本",
      checksums: "SHA256 校验",
      detectedHint: "已按当前系统选择安装包。",
      steps: [
        {
          n: "01",
          t: "选择平台安装包",
          d: "macOS 按芯片选 Apple Silicon 或 Intel DMG；Windows 选 x64 安装程序；Linux 选 deb 或 rpm，需 glibc ≥ 2.39（Ubuntu 24.04 或同等级发行版）。",
          code: "OpenLess_<version>_aarch64.dmg · _x64.dmg · _x64-setup.exe · .deb / .rpm",
        },
        {
          n: "02",
          t: "完成安装",
          d: "macOS 拖入「应用程序」后执行一次 xattr，绕过 Gatekeeper 的「已损坏」提示；Windows 直接运行安装程序；Linux 用发行版的包管理器安装。",
          code: "xattr -cr /Applications/OpenLess.app",
        },
        {
          n: "03",
          t: "授予必要权限",
          d: "首次启动后授予麦克风与输入权限。macOS 用户还需授予辅助功能，并在授权后重启 OpenLess。",
          code: "Microphone · Accessibility · Input",
        },
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
    notFound: {
      title: "这里没有内容。",
      desc: "链接可能已经失效，或者页面还没写出来。",
      home: "返回首页",
      download: "去下载",
    },
  },
  en: {
    nav: {
      product: "Product",
      docs: "Docs",
      download: "Download",
      language: "Switch language",
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
      sub: "Typeless, Wispr Flow, Lazy and Superwhisper are closed-source SaaS. OpenLess delivers the same end-user experience — but everything runs on your own machine.",
      cards: [
        {
          k: "Local-first",
          t: "Config and history stay local",
          d: "Preferences, dictionary and transcript history live on your device. Credentials go to the system vault: Keychain, Credential Manager or Secret Service.",
        },
        {
          k: "BYO credentials",
          t: "Bring your own cloud",
          d: "Volcengine streaming ASR plus Ark / DeepSeek-compatible chat completions — or another provider, or a local model. No vendor lock-in.",
        },
        {
          k: "Transparent",
          t: "Every byte is open",
          d: "MIT licensed. From hotkey taps and audio capture to cursor insertion and prompt templates — no black boxes.",
        },
        {
          k: "One thing well",
          t: "Won't answer for you",
          d: "The model only cleans your text. Ask 'what features does this app need' and you get that question back, not a list.",
        },
      ],
    },
    scenarios: {
      eyebrow: "Use cases",
      title: "Anywhere you'd rather speak than type.",
      hint: "Keep scrolling · cycle scenes",
      draftLabel: "You said",
      resultLabel: "At the cursor",
      modeLabel: "Output mode",
      items: [
        {
          tag: "Prompts",
          t: "Rambling into a real spec",
          d: "Dictate a request and get back a structured prompt with context, constraints and asks.",
          app: "Cursor",
          mode: "AI prompt",
          draft: "uh build me a login page, remember me, and tell me when the password is wrong",
          result:
            "Implement the login page in src/app/login:\n1. Email + password form with format validation and inline errors\n2. \"Remember me\" writes a 30-day persistent cookie\n3. Disable the submit button and show a loading state\n4. Reuse the existing Button / Input components, no new deps",
        },
        {
          tag: "Email / long messages",
          t: "Fillers out, tone in",
          d: "Drop fillers, fix punctuation, reorganize paragraphs. Pick Light or Formal tone.",
          app: "Mail",
          mode: "Formal",
          draft: "so about next week's review, I might not make it, could we move it to Thursday",
          result:
            "Subject: Moving next week's review\n\nHi,\n\nI may not be able to attend next week's review and would like to move it to the same time on Thursday. If Thursday doesn't work, I'm happy to send written comments in advance.\n\nThanks!",
        },
        {
          tag: "Coding",
          t: "Say it, commit it",
          d: "Commits, PR descriptions and code comments — spoken words land as engineering prose.",
          app: "VS Code",
          mode: "Light Polish",
          draft: "fix the thing where big uploads time out and add retry while you're in there",
          result:
            "fix(upload): raise timeout for large files and add retry\n\n- Derive the chunk timeout from chunk size\n- Retry failed chunks up to 3 times with exponential backoff\n- Add a regression test with a 200 MB file",
        },
        {
          tag: "Capture",
          t: "Raw mode, nothing changed",
          d: "Verbatim transcription with no rewriting. The dictionary keeps your proper nouns.",
          app: "Notion",
          mode: "Raw",
          draft: "note this, before next Wednesday, sort out the invoices and send them to finance, Zhang",
          result: "Todo: sort out the invoices and send them to finance (Zhang) before next Wednesday.",
        },
      ],
    },
    roadmap: {
      eyebrow: "Roadmap",
      title: "Let everyone chat in natural language.",
      sub: "Planned but not yet shipped. Status mirrors the upstream repository.",
      planned: "Planned",
      active: "In progress",
      items: [
        {
          t: "Cross-session style memory",
          d: "Polish learns your tone over time instead of starting from the default style every time.",
          status: "active",
          href: "https://github.com/Open-Less/openless/issues/46",
        },
        {
          t: "History improvements",
          d: "Copy button, search, re-polish and re-insert for past transcripts.",
          status: "planned",
          href: "https://github.com/Open-Less/openless#roadmap",
        },
        {
          t: "Snippets",
          d: "Save frequent phrasing as snippets and insert a whole block with a hotkey. No UI or trigger yet.",
          status: "planned",
          href: "https://github.com/Open-Less/openless#roadmap",
        },
        {
          t: "\"Paste last result\" hotkey",
          d: "Insert the previous output again without recording anything new.",
          status: "planned",
          href: "https://github.com/Open-Less/openless#roadmap",
        },
      ],
    },
    download: {
      eyebrow: "Download & install",
      title: "Three steps.",
      sub: "OpenLess ships installers for macOS, Windows and Linux. The macOS build is ad-hoc signed and not notarized, so the first launch needs the quarantine flag removed.",
      hint: "↓ keep scrolling to advance",
      finalTitle: "Get going",
      finalDesc: "Pick your system and grab the latest stable build from GitHub Releases, then verify it against SHA256SUMS.",
      platforms: ["Download macOS", "Download Windows", "Download Linux"],
      prefix: "Download for",
      recommended: "Recommended",
      latest: "Latest",
      published: "Published",
      allReleases: "All releases",
      checksums: "SHA256 checksums",
      detectedHint: "Installer selected for the system you are using.",
      steps: [
        {
          n: "01",
          t: "Choose your package",
          d: "Apple Silicon or Intel DMG on macOS, the x64 setup.exe on Windows, deb or rpm on Linux — glibc ≥ 2.39 (Ubuntu 24.04 or equivalent).",
          code: "OpenLess_<version>_aarch64.dmg · _x64.dmg · _x64-setup.exe · .deb / .rpm",
        },
        {
          n: "02",
          t: "Install",
          d: "Drag the app into Applications and run xattr once to clear Gatekeeper's \"damaged\" prompt; run the installer on Windows; use your package manager on Linux.",
          code: "xattr -cr /Applications/OpenLess.app",
        },
        {
          n: "03",
          t: "Grant permissions",
          d: "Allow microphone and input access on first launch. On macOS also grant Accessibility, then restart OpenLess.",
          code: "Microphone · Accessibility · Input",
        },
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
    notFound: {
      title: "Nothing here.",
      desc: "The link may be stale, or the page hasn't been written yet.",
      home: "Back home",
      download: "Download",
    },
  },
} as const;

export type I18n = (typeof i18nContent)["zh"];
export type Scenario = I18n["scenarios"]["items"][number];

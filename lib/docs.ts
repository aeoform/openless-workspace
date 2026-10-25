import type { Lang } from "@/lib/i18n-content";

export type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; text: string; caption?: string }
  | { type: "table"; head: [string, string]; rows: [string, string][] }
  | { type: "note"; text: string };

export type DocSection = { id: string; title: string; blocks: Block[] };

export type DocContent = {
  eyebrow: string;
  title: string;
  intro: string;
  toc: string;
  sections: DocSection[];
  next: { title: string; text: string; cta: string };
};

const zh: DocContent = {
  eyebrow: "文档",
  title: "装好之后，只用记住一件事：按下热键，说话。",
  intro:
    "这页覆盖安装、权限、输出模式、服务渠道、风格包与云同步。所有内容都对应已发布的产品行为；更细的协议和实现说明在仓库里。",
  toc: "本页目录",
  sections: [
    {
      id: "install",
      title: "安装",
      blocks: [
        {
          type: "p",
          text: "下载页提供 macOS、Windows、Linux、Android 的安装包，全部来自同一个 GitHub Release。选择与你系统匹配的那个即可。",
        },
        {
          type: "table",
          head: ["平台", "安装包与要求"],
          rows: [
            ["macOS 12+", "OpenLess_<version>_aarch64.dmg（Apple Silicon）或 _x64.dmg（Intel）"],
            ["Windows 10+", "OpenLess_<version>_x64-setup.exe，或同版本 MSI"],
            ["Linux", "deb / rpm，要求 glibc ≥ 2.39（Ubuntu 24.04 或同等级）；不提供 AppImage"],
            ["Android", "APK，按 ABI 选择：arm64-v8a、armeabi-v7a、x86_64、x86"],
          ],
        },
        {
          type: "p",
          text: "macOS 版本是 ad-hoc 签名、未经 Apple 公证。第一次打开若提示「已损坏」，把应用拖入「应用程序」后执行一次：",
        },
        { type: "code", text: "xattr -cr /Applications/OpenLess.app" },
        {
          type: "note",
          text: "同一 Release 附带 SHA256SUMS，可用 shasum -a 256 -c 校验后再安装。Linux 包不提供应用内更新，升级时需要重新下载。",
        },
      ],
    },
    {
      id: "setup",
      title: "首次启动",
      blocks: [
        {
          type: "p",
          text: "OpenLess 是一个常驻菜单栏 / 托盘的应用，没有主工作窗口。首次启动只需要三步：",
        },
        {
          type: "ul",
          items: [
            "授予麦克风权限。",
            "授予输入/辅助功能权限：macOS 需要「辅助功能」才能把文字写进光标位置；授权后需要重启应用。",
            "配置一个语音识别（ASR）渠道和一个润色（LLM）渠道，填入你自己的 API Key。",
          ],
        },
        {
          type: "p",
          text: "凭据写入系统凭证库（macOS Keychain、Windows Credential Manager、Linux Secret Service），不会以明文落盘，也不会随配置一起同步。",
        },
      ],
    },
    {
      id: "usage",
      title: "快捷键与输出模式",
      blocks: [
        {
          type: "p",
          text: "按住热键说话，松开后开始转写与润色，结果显示在浮动胶囊里，确认后写入当前光标位置。写不进去时回退到剪贴板。",
        },
        {
          type: "table",
          head: ["模式", "输出"],
          rows: [
            ["原文 Raw", "纯转写，不改措辞，适合记录与引用。"],
            ["轻度润色 Light", "补标点、去口头禅、顺句子，保留你的语气。"],
            ["结构化 Prompt", "把口述整理成带上下文、约束和要求的提示词。"],
            ["正式 Formal", "邮件、公告、对外沟通的语气。"],
          ],
        },
        {
          type: "p",
          text: "另有翻译快捷键：说中文、按目标语言输出。选区问答面板可以针对任意应用里高亮的文本语音提问。",
        },
        { type: "note", text: "所有快捷键都能在设置里改。与系统或其他应用的冲突需要你自己换一个组合。" },
      ],
    },
    {
      id: "providers",
      title: "服务渠道（自带凭据）",
      blocks: [
        {
          type: "p",
          text: "OpenLess 不自带额度、也不转售模型。你需要自己准备两类渠道：",
        },
        {
          type: "ul",
          items: [
            "ASR：火山引擎流式语音识别、腾讯云实时语音识别、讯飞、以及 Whisper 兼容端点。",
            "润色：Ark（火山方舟）、DeepSeek、OpenAI、Gemini、硅基流动、OpenRouter 等，或任意 OpenAI 兼容端点。",
          ],
        },
        {
          type: "p",
          text: "词典里的词会作为热词注入支持该能力的 ASR（例如 Volcengine 的 hotwords、Whisper 兼容的 prompt），同时在润色时作为语义提示。",
        },
        {
          type: "note",
          text: "使用云端 ASR / 润色时，音频与文本会发送给你配置的那家服务商。这是产品行为的一部分，不是「数据不出本机」能覆盖的范围。",
        },
      ],
    },
    {
      id: "styles",
      title: "风格包与市场",
      blocks: [
        {
          type: "p",
          text: "一个风格包就是一段系统提示词，例如「简洁的工程 commit message」「温暖的客服回复」。你可以自己写，用快捷键在风格之间切换。",
        },
        {
          type: "p",
          text: "应用内的市场可以浏览、安装、点赞社区分享的风格包，也可以发布自己的。上传内容公开前会经过审核，市场由 OpenLess 自有的后端提供服务。",
        },
      ],
    },
    {
      id: "sync",
      title: "云同步",
      blocks: [
        {
          type: "p",
          text: "云同步默认关闭。开启后，配置、服务 API Key、词典、风格包和历史文本会先在这台设备上用你的加密密码加密，再上传。",
        },
        {
          type: "ul",
          items: [
            "加密算法固定为 Argon2id 派生 + XChaCha20-Poly1305，参数不接受服务端降级。",
            "服务器只保存密文和必要元数据，用 GitHub 账号的 numeric ID 归属数据。",
            "密码遗失且没有已解锁设备时，云端内容无法恢复 —— 没有后门，也没有找回流程。",
          ],
        },
        {
          type: "note",
          text: "删除云端备份后在线接口立即不可读，灾备副本按公开的保留期清除。关闭同步不会删除云端数据。",
        },
      ],
    },
    {
      id: "privacy",
      title: "隐私与数据边界",
      blocks: [
        {
          type: "table",
          head: ["数据", "去向"],
          rows: [
            ["设置、词典、历史、风格包", "本地存储；开启云同步后以密文上传。"],
            ["API Key 等凭据", "本地系统凭证库；开启云同步后随加密快照上传。"],
            ["录音", "仅在你配置的 ASR 服务商处理；不使用云同步保存原始音频。"],
            ["光标上下文", "默认关闭，开启后只用于本次润色判断，不写入历史。"],
          ],
        },
        {
          type: "p",
          text: "密码输入框、macOS Secure Input、Windows 密码控件和已知密码管理器会被排除在光标上下文之外。",
        },
      ],
    },
    {
      id: "architecture",
      title: "架构",
      blocks: [
        {
          type: "p",
          text: "一套共享的 Rust 后端（openless-core）加各平台宿主，界面层不直接接触系统 API：",
        },
        {
          type: "code",
          text: "热键 → Recorder.start + ASR.openSession → 音频帧 → 热键松开\n     → ASR 结束 → 润色 → 写入光标 → 保存历史",
        },
        {
          type: "ul",
          items: [
            "macOS / Windows / Android：Tauri 2 宿主 + React 前端。",
            "Linux：原生 egui 宿主，不编译 Tauri 或 WebKitGTK。",
            "权限、热键、音频、输入注入都在平台适配层，Core 只提供接口。",
          ],
        },
      ],
    },
    {
      id: "faq",
      title: "常见问题",
      blocks: [
        {
          type: "table",
          head: ["现象", "排查"],
          rows: [
            ["按了热键没反应", "确认麦克风与辅助功能权限已授权，macOS 授权后需重启应用。"],
            ["文字没写进输入框", "该输入框可能拒绝程序化输入；此时结果会留在剪贴板。"],
            ["识别很慢", "流式 ASR 才快；换用支持流式的渠道，并检查网络到服务商的延迟。"],
            ["听不清专有名词", "把词加进词典；支持热词的 ASR 渠道会显著改善。"],
            ["Linux 没有安装包", "Linux 包在真机验收后随 Release 提供；不提供 AppImage。"],
          ],
        },
      ],
    },
  ],
  next: {
    title: "还需要更多细节？",
    text: "协议、发布流程和平台交接文档都在仓库里；代码同样以 AGPL-3.0-only 开源。",
    cta: "去下载",
  },
};

const en: DocContent = {
  eyebrow: "Docs",
  title: "After setup there is one thing to remember: press the hotkey and talk.",
  intro:
    "Install, permissions, output modes, providers, style packs and cloud sync. Everything here describes shipped behaviour; the deeper protocol notes live in the repository.",
  toc: "On this page",
  sections: [
    {
      id: "install",
      title: "Install",
      blocks: [
        {
          type: "p",
          text: "The download page lists macOS, Windows, Linux and Android packages, all from the same GitHub release. Pick the one that matches your machine.",
        },
        {
          type: "table",
          head: ["Platform", "Package and requirements"],
          rows: [
            ["macOS 12+", "OpenLess_<version>_aarch64.dmg (Apple Silicon) or _x64.dmg (Intel)"],
            ["Windows 10+", "OpenLess_<version>_x64-setup.exe, or the MSI of the same version"],
            ["Linux", "deb / rpm, glibc ≥ 2.39 (Ubuntu 24.04 or equivalent); no AppImage"],
            ["Android", "APK per ABI: arm64-v8a, armeabi-v7a, x86_64, x86"],
          ],
        },
        {
          type: "p",
          text: "The macOS build is ad-hoc signed and not notarized. If the first launch says the app is damaged, drag it into Applications and run once:",
        },
        { type: "code", text: "xattr -cr /Applications/OpenLess.app" },
        {
          type: "note",
          text: "Every release ships SHA256SUMS — verify with shasum -a 256 -c before installing. Linux packages have no in-app updater; reinstall to upgrade.",
        },
      ],
    },
    {
      id: "setup",
      title: "First launch",
      blocks: [
        { type: "p", text: "OpenLess lives in the menu bar / tray; there is no main window. Setup is three steps:" },
        {
          type: "ul",
          items: [
            "Grant microphone access.",
            "Grant input / accessibility access — macOS needs Accessibility to type at the cursor, and the app must be restarted after you allow it.",
            "Add one speech-to-text (ASR) provider and one polish (LLM) provider with your own API key.",
          ],
        },
        {
          type: "p",
          text: "Credentials go into the OS vault (Keychain, Credential Manager, Secret Service). They are never written to config files in plain text and never sync as plain text.",
        },
      ],
    },
    {
      id: "usage",
      title: "Hotkeys and output modes",
      blocks: [
        {
          type: "p",
          text: "Hold the hotkey, speak, release. Transcription and polish run, the result appears in a floating capsule, and confirming inserts it at the cursor. If insertion fails it falls back to the clipboard.",
        },
        {
          type: "table",
          head: ["Mode", "Output"],
          rows: [
            ["Raw", "Verbatim transcript, no rewriting. Good for notes and quotes."],
            ["Light", "Punctuation and filler cleanup that keeps your voice."],
            ["Structured prompt", "Turns the request into context, constraints and asks."],
            ["Formal", "Email, announcement and external-communication tone."],
          ],
        },
        {
          type: "p",
          text: "A separate translation hotkey speaks one language and outputs another. The selection panel answers questions about highlighted text in any app.",
        },
        { type: "note", text: "Every hotkey is configurable. If it clashes with the system or another app, pick a different combination." },
      ],
    },
    {
      id: "providers",
      title: "Providers (bring your own keys)",
      blocks: [
        { type: "p", text: "OpenLess does not bundle quota or resell models. You bring two kinds of provider:" },
        {
          type: "ul",
          items: [
            "ASR: Volcengine streaming, Tencent real-time, iFlytek, and Whisper-compatible endpoints.",
            "Polish: Ark, DeepSeek, OpenAI, Gemini, SiliconFlow, OpenRouter and any OpenAI-compatible endpoint.",
          ],
        },
        {
          type: "p",
          text: "Dictionary entries are injected as hotwords where the ASR supports them (Volcengine hotwords, Whisper-compatible prompt) and act as semantic hints during polish.",
        },
        {
          type: "note",
          text: "With cloud ASR or polish, audio and text go to the provider you configured. That is part of the design, and it is outside what \"local-first\" covers.",
        },
      ],
    },
    {
      id: "styles",
      title: "Style packs and the marketplace",
      blocks: [
        {
          type: "p",
          text: "A style pack is a system prompt — \"terse engineering commit message\", \"warm support reply\". Write your own and switch between them with a hotkey.",
        },
        {
          type: "p",
          text: "The in-app marketplace lets you browse, install and like community packs, and publish your own. Uploads are moderated before they become public, and the catalogue is served by OpenLess' own backend.",
        },
      ],
    },
    {
      id: "sync",
      title: "Cloud sync",
      blocks: [
        {
          type: "p",
          text: "Cloud sync is off by default. When enabled, settings, service API keys, dictionary, style packs and history are encrypted on this device with your sync password before upload.",
        },
        {
          type: "ul",
          items: [
            "Fixed crypto profile: Argon2id derivation with XChaCha20-Poly1305; the server cannot downgrade the parameters.",
            "The server stores ciphertext plus minimal metadata, keyed by GitHub numeric ID.",
            "If the password is lost and no device is unlocked, the cloud copy is unrecoverable — there is no backdoor or reset.",
          ],
        },
        {
          type: "note",
          text: "Deleting the cloud backup makes it unreadable immediately; disaster copies expire within the published retention window. Turning sync off does not delete cloud data.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy and data boundaries",
      blocks: [
        {
          type: "table",
          head: ["Data", "Where it goes"],
          rows: [
            ["Settings, dictionary, history, style packs", "Local by default; ciphertext only if cloud sync is on."],
            ["API keys and other credentials", "OS vault; included in the encrypted snapshot when sync is on."],
            ["Audio", "Processed by the ASR provider you configured; raw audio is not stored in cloud sync."],
            ["Cursor context", "Off by default; used only to judge the current polish and never written to history."],
          ],
        },
        {
          type: "p",
          text: "Password fields, macOS Secure Input, Windows password controls and known password managers are excluded from cursor context.",
        },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      blocks: [
        { type: "p", text: "One shared Rust backend (openless-core) with a platform host per OS; the UI never touches system APIs directly:" },
        {
          type: "code",
          text: "hotkey → Recorder.start + ASR.openSession → audio frames → hotkey release\n       → ASR finish → polish → insert at cursor → save history",
        },
        {
          type: "ul",
          items: [
            "macOS / Windows / Android: Tauri 2 host with a React frontend.",
            "Linux: native egui host, without Tauri or WebKitGTK.",
            "Permissions, hotkeys, audio and text insertion live in the platform layer; Core only defines the interface.",
          ],
        },
      ],
    },
    {
      id: "faq",
      title: "Troubleshooting",
      blocks: [
        {
          type: "table",
          head: ["Symptom", "What to check"],
          rows: [
            ["Hotkey does nothing", "Microphone and Accessibility must both be granted; restart after allowing on macOS."],
            ["Text does not appear", "The field may reject synthetic input; the result stays on the clipboard."],
            ["Transcription feels slow", "Only streaming ASR feels instant — use a streaming provider and check latency to it."],
            ["Proper nouns are wrong", "Add them to the dictionary; providers with hotword support improve a lot."],
            ["No Linux package", "Linux builds ship after real-hardware acceptance; there is no AppImage."],
          ],
        },
      ],
    },
  ],
  next: {
    title: "Need more detail?",
    text: "Protocols, release rules and platform handoff documents live in the repository, which is AGPL-3.0-only.",
    cta: "Download",
  },
};

export const docsContent: Record<Lang, DocContent> = { zh, en };

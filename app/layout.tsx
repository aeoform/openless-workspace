import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { ShaderBg } from "@/components/shader-bg";
import { MouseFlickerOverlay } from "@/components/mouse-flicker-overlay";

export const metadata: Metadata = {
  title: "OpenLess · 开源跨平台语音输入,把你的话变成可用的 AI Prompt",
  description:
    "OpenLess — Open-source voice input for macOS, Windows, and Linux. Press a hotkey, speak, get polished text at your cursor. MIT licensed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body>
        <I18nProvider>
          <ShaderBg />
          <MouseFlickerOverlay />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

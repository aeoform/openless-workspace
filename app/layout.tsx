import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { ShaderBg } from "@/components/shader-bg";
import { MouseFlickerOverlay } from "@/components/mouse-flicker-overlay";
import { REPO_URL } from "@/lib/site";

const SITE_URL = "https://openless.top";
const TITLE = "OpenLess · 开源跨平台语音输入，把你的话变成可用的 AI Prompt";
const DESCRIPTION =
  "OpenLess — open-source voice input for macOS, Windows and Linux. Press a hotkey, speak, get polished text at your cursor. AGPL-3.0-only licensed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · OpenLess",
  },
  description: DESCRIPTION,
  applicationName: "OpenLess",
  keywords: [
    "OpenLess",
    "语音输入",
    "语音转文字",
    "AI prompt",
    "dictation",
    "speech to text",
    "macOS",
    "Windows",
    "Linux",
    "open source",
    "AGPL-3.0",
    "open source",
  ],
  authors: [{ name: "OpenLess contributors", url: REPO_URL }],
  creator: "OpenLess contributors",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "OpenLess",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/dashboard.png", width: 2704, height: 1824, alt: "OpenLess desktop dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/dashboard.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico", apple: "/logo-512.png" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OpenLess",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "macOS, Windows, Linux, Android",
  url: SITE_URL,
  codeRepository: REPO_URL,
  license: "https://www.gnu.org/licenses/agpl-3.0.html",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body>
        <I18nProvider>
          <ShaderBg />
          <MouseFlickerOverlay />
          {children}
        </I18nProvider>
        <script
          type="application/ld+json"
          // Static structured data, no user input involved.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}

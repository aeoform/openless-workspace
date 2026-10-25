import type { Metadata } from "next";
import { DownloadView } from "@/components/download-view";

export const metadata: Metadata = {
  title: "下载",
  description:
    "下载 OpenLess：macOS（Apple Silicon / Intel）、Windows、Linux（deb/rpm）、Android APK。全部来自同一个 Release，附 SHA256SUMS 校验。",
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  return <DownloadView />;
}

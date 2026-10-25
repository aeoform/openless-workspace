import type { Metadata } from "next";
import { DocsView } from "@/components/docs-view";

export const metadata: Metadata = {
  title: "文档",
  description:
    "OpenLess 安装、权限、输出模式、服务渠道、风格包、云同步与常见问题。macOS、Windows、Linux、Android 的完整上手说明。",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return <DocsView />;
}

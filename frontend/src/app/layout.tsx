import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenSurvey - 설문조사 시스템",
  description: "전자정부 프레임워크 기반 설문조사 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}

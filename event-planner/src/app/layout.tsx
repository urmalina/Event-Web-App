import type { Metadata } from "next";
import { Inter } from "next/font/google"; // ✅ заменили Geist на Inter
import "./globals.css";
import LayoutShell from "./LayoutShell"; // клиентская обертка

const inter = Inter({
  subsets: ["latin", "cyrillic"], // ✅ добавлен кириллический алфавит
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Planner",
  description: "Платформа для организации мероприятий",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-black">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

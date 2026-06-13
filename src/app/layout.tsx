import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SomaSmart - Exam Prep for Tanzanian Students",
  description: "Practice MCQs, track your weak areas, and prepare for NECTA exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

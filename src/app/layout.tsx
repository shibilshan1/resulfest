import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kizil Elma – AKMM College Level Talents Meet 2K26 | Live Scoreboard",
  description:
    "Official Live Scoreboard, Team Standings, Event Results & Individual Leaderboard for Kizil Elma – AKMM College Level Talents Meet 2K26. Heading for the Ultimate Goal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

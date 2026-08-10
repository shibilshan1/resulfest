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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

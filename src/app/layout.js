import "./globals.css";
import PwaRegister from "../components/PwaRegister";

export const metadata = {
  title: "AGMon - AI Agent Office & Activity Visualizer",
  description: "Realtime activity and token flow visualizer for Antigravity, Claude Code & AI CLIs",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AGMon",
  },
};

export const viewport = {
  themeColor: "#070b12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased bg-[#070b12] text-slate-100 select-none">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

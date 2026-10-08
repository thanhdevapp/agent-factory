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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var raw=localStorage.getItem("agmon_theme_settings");var t="dark-plus";var fz="13";var uf="";var cf="";if(raw){var s=JSON.parse(raw);if(s.theme)t=s.theme;if(s.fontSize)fz=s.fontSize;if(s.uiFont)uf=s.uiFont;if(s.codeFont)cf=s.codeFont;}document.documentElement.setAttribute("data-theme",t);if(t==="light-plus"){document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");}else{document.documentElement.classList.remove("light");document.documentElement.classList.add("dark");}document.documentElement.style.setProperty("--font-size-ui",fz+"px");document.documentElement.style.setProperty("--font-size-base",fz+"px");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased bg-[var(--bg-workbench)] text-[var(--text-main)] select-none">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

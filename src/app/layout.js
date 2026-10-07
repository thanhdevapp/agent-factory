import "./globals.css";

export const metadata = {
  title: "Agent Factory - AI Agent Office & Activity Visualizer",
  description: "Realtime activity and token flow visualizer for Antigravity, Claude Code & AI CLIs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0b0f17] text-slate-100 select-none">
        {children}
      </body>
    </html>
  );
}

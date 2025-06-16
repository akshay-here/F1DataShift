import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "F1DataShift",
  description: "Formula 1 stats, telemetry, and analysis platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
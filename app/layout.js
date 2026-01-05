import { Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-newsreader',
});

export const metadata = {
  title: "Fulcrum - Master Your Productivity",
  description: "The ultimate productivity OS for high performers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${newsreader.className} bg-white text-black antialiased`} suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}

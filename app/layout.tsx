
import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
//import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CarePulse",
  description:
    "A customer management system designed to streamline client registration, appointment scheduling, and records management for service providers.",
  icons: {
    icon: "/assets/icons/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{colorScheme:'dark'}}>
      <body
     style={{ backgroundImage: `url('/assets/images/footer-bg.png')` }}
        className={cn(
          "min-h-screen bg-[#141414] font-sans antialiased ",
          fontSans.variable
        )}
      >
        <Toaster />
          {children}
        
      </body>
    </html>
  );
}
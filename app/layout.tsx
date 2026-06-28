import type { Metadata, Viewport } from "next";
import { AR_One_Sans } from "next/font/google";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";
import WaveBackground from "@/components/shared/WaveBackground";

const oneSans = AR_One_Sans({
  variable: "--font-one-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Engineering growth, tracked.`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oneSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
        <WaveBackground />
        {children}
      </body>
    </html>
  );
}
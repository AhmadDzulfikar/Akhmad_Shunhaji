import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.akhmadshunhaji.com"),
  title: {
    default: "Akhmad Shunhaji",
    template: "%s | Akhmad Shunhaji",
  },
  description:
    "Mengenal Akhmad Shunhaji, Ketua Program Studi Magister Manajemen Pendidikan Islam Universitas PTIQ Jakarta.",
  icons: {
    icon: [
      {
        url: "/AkhmadShunhajiLogo.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/AkhmadShunhajiLogo.png",
    apple: "/AkhmadShunhajiLogo.png",
  },
  openGraph: {
    title: "Akhmad Shunhaji",
    description:
      "Mengenal Akhmad Shunhaji, Ketua Program Studi Magister Manajemen Pendidikan Islam Universitas PTIQ Jakarta.",
    url: "https://www.akhmadshunhaji.com",
    siteName: "Akhmad Shunhaji",
    images: [
      {
        url: "/AkhmadShunhajiLogo.png",
        width: 512,
        height: 512,
        alt: "Akhmad Shunhaji",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HL63ZNTKP8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HL63ZNTKP8');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

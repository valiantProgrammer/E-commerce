import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NotificationProvider from '@/app/components/notificationProvider';
import { CartProvider } from '@/app/lib/cartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'BelleMart - Premium E-commerce Store',
  description: 'Discover amazing products at BelleMart. Quality, style, and innovation in every purchase.',
  icons: '/favicon.ico',
  keywords: "e-commerce, online shopping, premium products, fashion, electronics, home goods",
  authors: [{ name: "Pinnacle Labs" }],
  viewport: "width=device-width, initial-scale=1",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
      >
        <NotificationProvider>
          <CartProvider>
            {children}
          </CartProvider>
          <Script
            src={`https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPMYINDIA_MAP_KEY}/map_sdk?v=3.0&layer=vector`}
            strategy="beforeInteractive"
          />
        </NotificationProvider>
      </body>
    </html>
  );
}

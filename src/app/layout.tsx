import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { getBaseUrl } from "@/lib/url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Brown Girl Club | Membership for daily ritual",
  description: "Daily coffee, real connection, and small luxuries that make big days softer.",
  icons: {
    icon: [{ url: "/icon.svg" }],
    shortcut: [{ url: "/icon.svg" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    title: "Brown Girl Club | Membership for daily ritual",
    description: "Daily coffee, real connection, and small luxuries that make big days softer.",
    url: "/",
    siteName: "Brown Girl Club",
    images: [
      { url: "/logo/logo.png", width: 1200, height: 630, alt: "Brown Girl Club" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brown Girl Club | Membership for daily ritual",
    description: "Daily coffee, real connection, and small luxuries that make big days softer.",
    images: ["/logo/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0A0A09] text-white rounded-t-[40px] lg:rounded-t-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Top Section: Story + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Story */}
          <div>
            <h2 className="text-serif text-4xl lg:text-5xl leading-tight mb-0">
              Where students find rhythm, community, and a daily ritual worth keeping.
            </h2>
          </div>
          
          {/* Newsletter */}
          {/* <div className="flex flex-col justify-end">
            <h3 className="text-serif text-3xl mb-4">Perk up your inbox.</h3>
            <p className="text-base text-white/70 mb-6 leading-relaxed">
              Become a member and enjoy exclusive perks, plus access to the best coffee while it's still fresh.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email address."
                className="w-full bg-transparent border border-white/30 rounded-full px-6 py-4 text-base text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#0A0A09] flex items-center justify-center hover:bg-white/90 transition-colors"
                aria-label="Subscribe"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div> */}
        </div>

        {/* Divider */}
        <hr className="border-white/10 mb-12" />

        {/* Bottom Section: Links + Payment Methods */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Membership.</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/join" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Join
                </Link>
              </li>
              <li>
                <Link href="/join#plans" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Plans
                </Link>
              </li>
              {/* <li>
                <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Perks
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Locations.</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  True Blue
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  L'anse aux Epines
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          {/* <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">About us.</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/brand-guide" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Values
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Careers
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Enquiries */}
          {/* <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Enquiries.</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                  Support
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Payment Methods */}
          {/* <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Payment Methods.</h4>
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">
                MC
              </div>
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">
                VISA
              </div>
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">
                AMEX
              </div>
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">
                PP
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

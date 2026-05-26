import { NotificationBell } from "@/components/NotificationBell";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, MapPin } from "lucide-react";
import { SessionProvider } from "./SessionProvider";
import { LogoutButton } from "./LogoutButton";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foreclosure Lead Scrub + CRM",
  description: "Automated real estate foreclosure workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r shadow-sm">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Foreclosure CRM</h1>
            </div>
            <nav className="p-4 space-y-2">
              <Link href="/" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link href="/leads" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 mr-3" />
                Leads
              </Link>
              <Link href="/map" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <MapPin className="w-5 h-5 mr-3" />
                Map View
              </Link>
              <Link href="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <LogoutButton />
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-0">
            <header className="h-16 bg-white border-b flex items-center justify-end px-8 flex-shrink-0 z-10 relative">
              <NotificationBell />
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              {children}
              <Analytics />
            </div>
          </main>
        </div>
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, Settings } from "lucide-react";

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
              <Link href="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

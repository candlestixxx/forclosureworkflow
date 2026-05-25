"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
    >
      <LogOut className="w-5 h-5 mr-3" />
      Sign Out
    </button>
  );
}

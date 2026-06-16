"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";

  const [inputValue, setInputValue] = useState(currentQuery);

  // Sync local state if URL changes externally
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct new URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (inputValue.trim()) {
      params.set("query", inputValue.trim());
    } else {
      params.delete("query");
    }

    // Reset to page 1 on new search
    params.delete("page");

    router.push(`/leads?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <Search className="w-4 h-4" />
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search names or addresses..."
        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
      />
    </form>
  );
}

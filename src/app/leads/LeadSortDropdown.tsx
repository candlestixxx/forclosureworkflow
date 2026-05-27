"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function LeadSortDropdown({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (newSort) {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }

    // Reset to page 1 on new sort
    params.delete("page");

    router.push(`/leads?${params.toString()}`);
  };

  return (
    <select
      value={currentSort || ""}
      onChange={handleSortChange}
      className="p-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="">Sort: Newest First</option>
      <option value="equity_desc">Sort: Highest Equity</option>
      <option value="score_desc">Sort: Highest Score</option>
      <option value="date_asc">Sort: Soonest Sale Date</option>
    </select>
  );
}

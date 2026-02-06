import { Calendar, X } from "lucide-react";
import { Button } from "../button";

export type DateFilterOption =
  | "tomorrow"
  | "3days"
  | "week"
  | "15days"
  | "30days"
  | "all";

interface DateFilter {
  label: string;
  value: DateFilterOption;
  description: string;
}

const filterOptions: DateFilter[] = [
  { label: "Tomorrow", value: "tomorrow", description: "Next day" },
  { label: "3 Days", value: "3days", description: "Next 3 days" },
  { label: "1 Week", value: "week", description: "Next 7 days" },
  { label: "15 Days", value: "15days", description: "Next 15 days" },
  { label: "30 Days", value: "30days", description: "Next 30 days" },
  { label: "All", value: "all", description: "All visits" },
];

export const VisitDateFilter = ({
  selectedFilter,
  onFilterChange,
}: {
  selectedFilter: DateFilterOption;
  onFilterChange: (filter: DateFilterOption) => void;
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-teal-600" />
        <h3 className="font-semibold text-gray-700 text-sm">
          Filter by Date Range
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            title={filter.description}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedFilter === filter.value
                ? "bg-teal-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const getDateRangeFromFilter = (
  filter: DateFilterOption,
): { start: Date; end: Date } | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (filter) {
    case "tomorrow": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      return { start: tomorrow, end: endOfTomorrow };
    }
    case "3days": {
      const start = new Date(today);
      start.setDate(start.getDate() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 2);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "week": {
      const start = new Date(today);
      start.setDate(start.getDate() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "15days": {
      const start = new Date(today);
      start.setDate(start.getDate() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 14);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "30days": {
      const start = new Date(today);
      start.setDate(start.getDate() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 29);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "all":
    default:
      return null;
  }
};

export const filterVisitsByDateRange = (
  visits: any[],
  filter: DateFilterOption,
): any[] => {
  const range = getDateRangeFromFilter(filter);

  if (!range) {
    return visits;
  }

  return visits.filter((visit) => {
    const visitDate = new Date(visit.scheduled_at);
    return visitDate >= range.start && visitDate <= range.end;
  });
};

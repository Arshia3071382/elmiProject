"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  totalCoursesCount: number;
}

export default function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCoursesCount,
}: CategoryFiltersProps) {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap gap-2 justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectCategory("")}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
            !selectedCategory
              ? "text-white shadow-md"
              : "bg-white hover:shadow-md border"
          }`}
          style={{
            backgroundColor: !selectedCategory ? "#2563EB" : "#FFFFFF",
            color: !selectedCategory ? "#FFFFFF" : "#475569",
            borderColor: "#E5E7EB",
            fontFamily: "iranSans-r",
          }}
        >
          <LayoutGrid className="w-4 h-4" />
          همه دوره‌ها
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              backgroundColor: !selectedCategory
                ? "rgba(255,255,255,0.2)"
                : "#F1F5F9",
              color: !selectedCategory ? "#FFFFFF" : "#475569",
            }}
          >
            {totalCoursesCount}
          </span>
        </motion.button>

        {categories.map((cat) => (
          <motion.button
            key={cat._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(cat._id)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedCategory === cat._id
                ? "text-white shadow-md"
                : "bg-white hover:shadow-md border"
            }`}
            style={{
              backgroundColor:
                selectedCategory === cat._id ? "#2563EB" : "#FFFFFF",
              color: selectedCategory === cat._id ? "#FFFFFF" : "#475569",
              borderColor: "#E5E7EB",
              fontFamily: "iranSans-r",
            }}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
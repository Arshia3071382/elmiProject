"use client";

import { useEffect, useState } from "react";
import Container from "@/component/Container";
import LoadingState from "./LoadingState";
import NoticeHeader from "./NoticeHeader";
import NoticeFilters from "./NoticeFilters";
import NoticeCard from "./NoticeCard";
import NoticeEmpty from "./NoticeEmpty";
import { Notice } from "./constants";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Fetch notices
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/notices");
      if (response.ok) {
        const data = await response.json();
        setNotices(data.notices);
        setFilteredNotices(data.notices);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (noticeId: string) => {
    try {
      const response = await fetch(`/api/notices?id=${noticeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      if (response.ok) {
        setNotices((prev) =>
          prev.map((n) => (n._id === noticeId ? { ...n, isRead: true } : n))
        );
        setFilteredNotices((prev) =>
          prev.map((n) => (n._id === noticeId ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notice as read:", error);
    }
  };

  // Filter notices
  useEffect(() => {
    let filtered = [...notices];

    if (selectedType !== "all") {
      filtered = filtered.filter((n) => n.type === selectedType);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (dateFilter === "today") {
        filtered = filtered.filter((n) => new Date(n.createdAt) >= today);
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter((n) => new Date(n.createdAt) >= weekAgo);
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter((n) => new Date(n.createdAt) >= monthAgo);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
      );
    }

    setFilteredNotices(filtered);
  }, [searchQuery, selectedType, dateFilter, notices]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setDateFilter("all");
  };

  const unreadCount = notices.filter((n) => !n.isRead).length;
  const hasFilters = !!searchQuery || selectedType !== "all" || dateFilter !== "all";

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div dir="rtl" className="min-h-screen mt-10 sm:mt-24 bg-[var(--color-bg)] py-6 md:py-12">
      <Container>
        <NoticeHeader total={notices.length} unread={unreadCount} />

        <NoticeFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          dateFilter={dateFilter}
          onSearchChange={setSearchQuery}
          onTypeChange={setSelectedType}
          onDateChange={setDateFilter}
          onClear={clearFilters}
        />

        <div className="flex items-center justify-between mb-4 px-1">
          <p
            className="text-xs text-[var(--color-text-secondary)]"
            style={{ fontFamily: "iranSans-r" }}
          >
            نمایش {filteredNotices.length} اطلاعیه
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {filteredNotices.length === 0 ? (
            <NoticeEmpty hasFilters={hasFilters} />
          ) : (
            filteredNotices.map((notice, index) => (
              <NoticeCard
                key={notice._id}
                notice={notice}
                index={index}
                onMarkAsRead={markAsRead}
              />
            ))
          )}
        </div>
      </Container>
    </div>
  );
}
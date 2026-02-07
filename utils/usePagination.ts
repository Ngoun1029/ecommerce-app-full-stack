"use client";

import { PaginatedResponse } from "@/app/types/PaginationResponse";
import { useCallback, useState } from "react";

export function usePagination<T>(endpoint: string, limit = 10) {
  const [items, setItems] = useState<T[]>([]);
  const [offset, setOffset] = useState(0); // ✅ start from 0
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${endpoint}?limit=${limit}&offset=${offset}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data: PaginatedResponse<T> = await res.json();

      setItems((prev) => [...prev, ...data.items]);

      // ✅ safer offset update
      setOffset((prev) => prev + data.items.length);

      setHasMore(data.hasNextPage);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, offset, limit, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setOffset(0);
    setHasMore(true);
  }, []);

  return { items, loading, error, hasMore, fetchMore, reset };
}

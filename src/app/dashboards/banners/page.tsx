"use client"

import { useState } from "react";
import { useBannersData } from "../../../../hooks/banners-hook";

export default function BannersPage() {
  const [page, setPage] = useState(1);
  const { data: banners, isLoading, isError, error } = useBannersData(page);
  console.log(banners);
  return <div>banner Page</div>;
}

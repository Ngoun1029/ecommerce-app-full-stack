"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  FaHome,
  FaBoxOpen,
  FaTags,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FaBars, FaImage } from "react-icons/fa6";

export const navSections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/apps/dashboards",
        icon: <FaHome />,
      },
      {
        label: "Banners",
        href: "/dashboards/banners",
        icon: <FaImage/>
      },
      {
        label: "Products",
        href: "/dashboards/products",
        icon: <FaBoxOpen />,
      },
      {
        label: "Category",
        href: "/dashboards/categories",
        icon: <FaTags />,
      },
      {
        label: "Users",
        href: "/dashboards/users",
        icon: <FaUsers />,
      },
      {
        label: "Role",
        href: "/dashboards/roles",
        icon: <FaUserShield />,
      },
      {
        label: "Shipping Address",
        href: "/dashboards/shippings",
        
      }
    ],
  },
];



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [me, setMe] = useState<any>(null);

  /* ================= FETCH USER ================= */

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await fetch("/api/auth/logouts", { method: "POST" });
    router.push("/logins");
  };

  /* ================= FILTER MENU ================= */

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300
        ${open ? "w-64" : "w-16"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {open && (
            <div className="flex items-center gap-2 font-bold text-blue-600">
              <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center">
                MH
              </div>
              MH Electronic
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <FaBars />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-6">
          {navSections.map((section) => {
            return (
              <div key={section.title}>
                {open && (
                  <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
                    {section.title}
                  </p>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                          
                          ${
                            active
                              ? "bg-blue-600 text-white shadow"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          }
                        `}
                      >
                        <span className="text-lg">{item.icon}</span>

                        {open && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ================= TOP BAR ================= */}
        <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>

          {me && (
            <div className="flex items-center gap-4">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold">{me.name}</p>
                <p className="text-xs text-gray-500">{me.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-medium text-white
                bg-blue-600 hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 p-6 bg-slate-100 overflow-auto">
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </main>
      </div>
    </div>
  );
}

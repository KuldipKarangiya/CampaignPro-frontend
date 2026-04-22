"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Send, Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/contacts", label: "Contacts", icon: Users },
    { href: "/campaigns", label: "Campaigns", icon: Send },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="border-b border-[var(--color-card-border)] bg-[var(--color-card)]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex w-full justify-between sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                CampaignPro
              </span>
            </div>
            
            {/* Desktop Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`${
                      isActive
                        ? "border-indigo-500 text-white"
                        : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-200"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white p-2 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-[var(--color-card-border)] bg-[var(--color-card)]/90 backdrop-blur-lg animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  } flex items-center px-3 py-3 text-base font-medium transition-all rounded-r-md`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

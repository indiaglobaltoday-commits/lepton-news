"use client";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import SocialLinks from "./SocialLinks";

const categories = ["Politics", "World", "Finance", "Sports", "Tech", "Entertainment", "Viral", "Videos"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-black text-primary tracking-tighter">
              Lepton News
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'Videos' ? '/videos' : `/category/${cat.toLowerCase()}`}
                className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <SocialLinks />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
            <Link href="/search" className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/search" className="p-2 text-gray-700 dark:text-gray-300">
              <Search className="w-5 h-5" />
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'Videos' ? '/videos' : `/category/${cat.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {cat}
              </Link>
            ))}
            <div className="px-3 py-4 flex justify-center border-t border-gray-200 dark:border-gray-800 mt-2">
              <SocialLinks />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

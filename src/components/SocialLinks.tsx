import { Twitter, Youtube, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export default function SocialLinks() {
  return (
    <div className="flex items-center space-x-4">
      <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
      <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></Link>
      <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
      <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></Link>
    </div>
  );
}

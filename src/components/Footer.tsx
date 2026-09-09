import Link from "next/link";
import SocialLinks from "./SocialLinks";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-3xl font-black text-primary tracking-tighter mb-4 inline-block">
              Lepton News
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Delivering breaking news and in-depth analysis from around the world. Your trusted source for politics, sports, tech, and entertainment.
            </p>
            <SocialLinks />
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-gray-900 dark:text-white">Categories</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/category/politics" className="hover:text-primary transition-colors">Politics</Link></li>
              <li><Link href="/category/world" className="hover:text-primary transition-colors">World News</Link></li>
              <li><Link href="/category/tech" className="hover:text-primary transition-colors">Technology</Link></li>
              <li><Link href="/category/sports" className="hover:text-primary transition-colors">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-bold mb-4 uppercase text-gray-900 dark:text-white">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Subscribe to get the latest news delivered right to your inbox.
            </p>
            <Newsletter />
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lepton News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DigitalMart</h3>
            <p className="text-gray-300 mb-4">
              The marketplace for digital creators and buyers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Buyers</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/browse">
                  <a className="hover:text-white transition-colors">Browse Products</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">How to Buy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/seller">
                  <a className="hover:text-white transition-colors">Start Selling</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Seller Guide</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Fees & Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Seller Resources</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 DigitalMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

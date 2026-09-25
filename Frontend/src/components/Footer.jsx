import React from "react";
import { footer } from '../assets/assets';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-24">
      {/* Top Value Banner */}
      <div className="border-b border-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Free & Fast 30-Min Delivery</p>
              <p className="text-xs text-slate-400">On all fresh pantry orders over $25</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Organic & Non-GMO</p>
              <p className="text-xs text-slate-400">Sourced directly from certified family farms</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Instant Freshness Guarantee</p>
              <p className="text-xs text-slate-400">100% money back if quality isn't crisp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block group">
              <img
                src="/images/logo.svg"
                alt="GreenCart"
                className="h-9 w-auto brightness-0 invert opacity-90 transition group-hover:opacity-100"
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              GreenCart is your neighborhood digital farmers market. We connect sustainable growers directly to homes to deliver unmatched freshness, nutritional richness, and honest prices.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Delivery Hubs Operational & Chilled</span>
            </div>
          </div>

          {/* Dynamic Link Groups */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footer.map((item, index) => {
              return (
                <div key={index} className="space-y-3">
                  <h3 className="font-bold text-sm text-white tracking-wider uppercase">
                    {item.head}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {item.links.map((link, linkIndex) => {
                      return (
                        <li key={linkIndex}>
                          <Link
                            to={link.url}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-slate-400 hover:text-emerald-400 transition-colors duration-150 inline-block"
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} GreenCart Organic Inc. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>for healthy living.</span>
          </p>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

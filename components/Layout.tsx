import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Target, Award, Printer } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full py-3 text-sm font-medium transition-colors ${
          isActive
            ? 'text-oman-red border-t-2 border-oman-red bg-red-50'
            : 'text-gray-500 hover:text-oman-green hover:bg-gray-50'
        }`
      }
    >
      <Icon size={24} className="mb-1" />
      <span>{label}</span>
    </NavLink>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-oman-text flex flex-col">
      {/* Sticky Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 no-print border-b-4 border-oman-green">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-oman-red rounded-full flex items-center justify-center text-white font-bold text-xl">
              ت
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-tight">توثيق</h1>
              <p className="text-xs text-oman-green font-semibold">نظام إجادة - سلطنة عُمان</p>
            </div>
          </div>
          <div className="hidden md:flex text-xs text-gray-400 gap-4">
             <span>رؤية عُمان 2040</span>
             <span>وزارة التربية والتعليم</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 mb-20 max-w-5xl">
        {children}
      </main>

      {/* Bottom Navigation (Mobile First App Feel) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 no-print">
        <div className="flex justify-around items-center max-w-5xl mx-auto">
          <NavItem to="/" icon={Home} label="الرئيسية" />
          <NavItem to="/profile" icon={FileText} label="البيانات" />
          <NavItem to="/objectives" icon={Target} label="الأهداف" />
          <NavItem to="/report" icon={Printer} label="التقرير" />
        </div>
      </nav>
    </div>
  );
};
import { Activity, LogOut, Menu, X } from "lucide-react";
import { Button } from "../button";
import { Link } from "react-router-dom";

export const Navbar = ({
  currentUser,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-1.5 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            MediTrack
          </span>
          <span className="hidden sm:inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 capitalize ml-2">
            {currentUser.role} Portal
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm text-gray-600 mr-2">
            Welcome,{" "}
            <span className="font-semibold text-gray-900">
              {currentUser.name}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
    {mobileMenuOpen && (
      <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-2 shadow-lg">
        <div className="pb-3 border-b border-gray-100 mb-3">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="font-semibold text-gray-900">{currentUser.name}</p>
        </div>
        <Link
          to={currentUser.role === "admin" ? "/admin" : `/${currentUser.role}`}
          onClick={() => setMobileMenuOpen(false)}
          className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Dashboard
        </Link>
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    )}
  </nav>
);

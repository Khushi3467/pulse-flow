import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Home } from 'lucide-react';
import { BRAND } from '../config/brand';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
        <Zap className="w-7 h-7 text-cyan-400" />
      </div>

      <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
        404 • Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
        Page Not Located in Hierarchy
      </h1>

      <p className="text-sm text-slate-400 max-w-md mt-2">
        The route you requested does not exist or has been relocated to another work period.
      </p>

      <div className="flex gap-3 mt-8">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Landing Page</span>
        </Link>
        <Link
          to="/app"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

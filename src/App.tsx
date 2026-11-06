import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-red-100 selection:text-red-900">
      <Navbar />

      <main className="flex-1">
        <HomePage />
      </main>

      <Footer />
    </div>
  );
}

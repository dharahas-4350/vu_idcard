import React from 'react';
import { ArrowLeft, ShieldCheck, Award, Server, Database, Code2, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Left Corner Back Option */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to Home</span>
        </button>
      </div>
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Institutional Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          CampusID: Digital College Identity
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          "Your Identity. Your Campus. Your Future."
          Transforming traditional college identity cards into tamper-proof, instantly verifiable digital credentials.
        </p>
      </div>

      {/* MERN Architecture Specs */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Full-Stack MERN Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered as a genuine full-stack platform with clean separation of concerns, secure REST APIs, and database persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              M
            </div>
            <h3 className="text-sm font-bold text-slate-900">MongoDB & Mongoose</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Document store schemas for Students, Users, and ID Cards with validation and data persistence.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              E
            </div>
            <h3 className="text-sm font-bold text-slate-900">Express.js REST APIs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modular controllers for Auth, Student CRUD, ID Card issuance, QR lookup, and Multer file uploads.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              R
            </div>
            <h3 className="text-sm font-bold text-slate-900">React & Modern Hooks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive controlled forms, 3D flip card animations, and live two-way synchronization without reloads.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              N
            </div>
            <h3 className="text-sm font-bold text-slate-900">Node.js Runtime</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Secure password hashing with bcrypt, JSON Web Token (JWT) sessions, and high-performance server.
            </p>
          </div>
        </div>
      </div>

      {/* ISO/IEC 7810 Card Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span>Hardware Standards</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Standard CR80 & Badge Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every card exported by CampusID adheres to international CR80 dimensions (85.60 mm × 53.98 mm), the worldwide standard for university IDs, library cards, and access badges.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>300 DPI high-resolution vector and bitmap export</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Compatible with standard dye-sublimation PVC card printers</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cryptographic QR code verification payload prevents forgery</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Verification Security Protocol
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Traditional plastic cards suffer from counterfeiting and outdated information. CampusID links every physical or digital card to a cloud-registered verification authority.
          </p>

          <div className="space-y-2 font-mono text-[11px] bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-blue-400">// Sample Verification Payload</p>
            <p className="text-emerald-400">{`"issuer": "CampusID Authority"`}</p>
            <p className="text-emerald-400">{`"status": "Verified / Valid"`}</p>
            <p className="text-amber-400">{`"encryption": "AES-256 JWT Signed"`}</p>
            <p className="text-slate-500">{`"tamper_proof": true`}</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center bg-blue-700 text-white rounded-3xl p-10 space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to generate your college identity card?
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto">
          Start now, personalize your design, and download your verified credential in under 60 seconds.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('create')}
            className="px-6 py-3 bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            Launch ID Card Generator
          </button>
        </div>
      </div>
    </div>
  );
};

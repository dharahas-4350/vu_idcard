import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { VerificationResult } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Building,
  GraduationCap,
  Calendar,
  Lock,
  QrCode,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface VerifyPageProps {
  initialCode?: string;
  onNavigate: (tab: string) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ initialCode = '', onNavigate }) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async (targetCode: string) => {
    const clean = targetCode.trim();
    if (!clean) return;

    setIsVerifying(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const data = await api.verifyCode(clean);
      setResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'No official identity record matches this verification code.');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      handleVerify(initialCode);
    }
  }, [initialCode]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Institutional Registry</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Credential Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Scan the QR code printed on any CampusID card or enter the unique verification identifier below.
        </p>
      </div>

      {/* Code Input Box */}
      <div className="max-w-lg mx-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(code);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. CID-2026-8942A"
              className="w-full pl-9 pr-3 py-2 text-sm font-mono uppercase tracking-wider border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={isVerifying || !code.trim()}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Verify</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span>Format: CID-YYYY-XXXXX</span>
          <button
            type="button"
            onClick={() => {
              setCode('CID-2026-8942A');
              handleVerify('CID-2026-8942A');
            }}
            className="text-blue-700 hover:underline cursor-pointer"
          >
            Try sample code: CID-2026-8942A
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isVerifying && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">
            Contacting CampusID Registry Authority...
          </p>
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-red-900">Verification Failed</h3>
          <p className="text-xs text-red-700">{errorMessage}</p>
          <p className="text-[11px] text-red-500">
            Please inspect the card or re-enter the verification code printed beneath the QR code.
          </p>
        </div>
      )}

      {/* Verified Result Card */}
      {result && result.verified && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
          {/* Status Ribbon */}
          <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Verified Academic Credential</h3>
                <p className="text-[11px] text-emerald-100 font-mono">
                  Registry Status: Active & Authentic
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded">
              {result.verificationCode}
            </span>
          </div>

          {/* Student Public Info Body */}
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={result.photograph || '/src/assets/images/student_portrait_avatar_1793772629050.jpg'}
                alt={result.studentName}
                className="w-20 h-24 rounded-xl object-cover border-2 border-slate-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {result.studentName}
                </h2>
                <p className="text-sm font-mono font-bold text-blue-700">
                  Student ID: {result.rollNumber}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{result.collegeName}</span>
                </div>
              </div>
            </div>

            {/* Approved Details Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-semibold text-slate-800">{result.department}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Degree Program</span>
                <span className="font-semibold text-slate-800">{result.course}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Current Semester</span>
                <span className="font-semibold text-slate-800">{result.semester}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Academic Year</span>
                <span className="font-semibold text-slate-800 font-mono">{result.academicYear}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Card Validity</span>
                <span className="font-bold text-emerald-700 font-mono">{result.validity}</span>
              </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <span className="font-semibold">Privacy Protected:</span> In accordance with institutional safety standards, personal home addresses, phone numbers, and emergency contacts are masked from public verification.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

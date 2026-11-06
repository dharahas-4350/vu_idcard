import React, { useState, useEffect } from 'react';
import { IDCardRecord } from '../types';
import { api } from '../services/api';
import { IDCardPreview } from '../components/idcard/IDCardPreview';
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Edit3,
  Download,
  Eye,
  ShieldCheck,
  RotateCw,
  X,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onEditCard: (card: IDCardRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onEditCard }) => {
  const [cards, setCards] = useState<IDCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewModalCard, setPreviewModalCard] = useState<IDCardRecord | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const data = await api.getIDCards(searchQuery);
      setCards(data);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCards();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the ID card for ${name}?`)) return;

    setIsDeletingId(id);
    try {
      await api.deleteIDCard(id);
      setCards((prev) => prev.filter((c) => c._id !== id));
      if (previewModalCard?._id === id) {
        setPreviewModalCard(null);
      }
    } catch (err) {
      alert('Failed to delete card. Please try again.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My ID Cards Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage, re-export, and verify all generated college identity credentials.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create')}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New ID Card</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or college..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-mono font-bold text-slate-800">{cards.length}</span> cards in vault
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading saved identity cards...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">No ID Cards Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? `No identity credentials matched "${searchQuery}". Try another search.`
                : "You haven't generated any ID cards yet. Create your first verified digital ID card in seconds."}
            </p>
          </div>
          <button
            onClick={() => onNavigate('create')}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Create Your First ID Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const student = card.studentData || {};
            const photo = student.photograph || '/src/assets/images/student_portrait_avatar_1793772629050.jpg';

            return (
              <div
                key={card._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Header Strip */}
                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={photo}
                      alt={student.name || 'Student'}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {student.name || 'Unnamed Student'}
                      </h3>
                      <p className="text-xs font-mono font-semibold text-blue-700 mt-0.5">
                        {student.rollNumber || 'No ID'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      card.status === 'Saved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {card.status || 'Saved'}
                  </span>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 space-y-2 text-xs flex-1">
                  <div>
                    <span className="text-slate-400 font-medium">Institution: </span>
                    <span className="font-semibold text-slate-700 truncate">
                      {student.collegeName || 'Unknown College'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Department: </span>
                    <span className="font-medium text-slate-700 truncate">
                      {student.department || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Template: {card.template}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {card.cardLayout === 'horizontal' ? 'Badge' : 'CR80'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewModalCard(card)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-700" />
                    <span>3D View</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditCard(card)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors cursor-pointer"
                      title="Edit ID Card"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate(`verify:${card.verificationCode}`)}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
                      title="Verify QR"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(card._id, student.name || 'this student')}
                      disabled={isDeletingId === card._id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete ID Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3D Preview Modal */}
      {previewModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {previewModalCard.studentData?.name} — ID Card Preview
                </h3>
                <p className="text-xs text-slate-500 font-mono">{previewModalCard.verificationCode}</p>
              </div>
              <button
                onClick={() => setPreviewModalCard(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 flex items-center justify-center">
              <IDCardPreview
                student={previewModalCard.studentData as any}
                template={previewModalCard.template}
                orientation={previewModalCard.cardLayout}
                fontStyle={previewModalCard.fontStyle}
                collegeLogo={previewModalCard.collegeLogo}
                verificationCode={previewModalCard.verificationCode}
                status={previewModalCard.status}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onEditCard(previewModalCard);
                  setPreviewModalCard(null);
                }}
                className="px-4 py-2 border border-blue-600 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Open in ID Studio
              </button>
              <button
                onClick={() => {
                  onNavigate(`verify:${previewModalCard.verificationCode}`);
                  setPreviewModalCard(null);
                }}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Inspect Public Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

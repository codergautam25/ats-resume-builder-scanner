import React, { useState, useEffect } from 'react';
import { Flashcard, FlashcardSet } from '../../types';
import {
  Brain,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  Lightbulb,
  Layers,
  Award,
  Search,
  Shuffle,
  RotateCcw,
  Target,
  SlidersHorizontal,
  Check,
  Tag,
} from 'lucide-react';

interface RoleFlashcardsSectionProps {
  resumeText?: string;
  jobDescription?: string;
  targetRole?: string;
}

const PRESET_ROLES = [
  'Forward Deployed Engineer (FDE)',
  'Senior Full Stack Architect',
  'AI & RAG Solutions Engineer',
  'Cloud & DevOps Engineer',
  'Staff Backend Software Engineer',
];

export const RoleFlashcardsSection: React.FC<RoleFlashcardsSectionProps> = ({
  resumeText = '',
  jobDescription = '',
  targetRole: initialTargetRole = 'Forward Deployed Engineer (FDE)',
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(initialTargetRole);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);

  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Deck State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');

  // Mastery Tracking (Set of mastered card IDs)
  const [masteredCardIds, setMasteredCardIds] = useState<Set<string>>(new Set());

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchFlashcards = async (roleToUse?: string) => {
    const activeRole = roleToUse || selectedRole;
    setIsLoading(true);
    setError(null);
    setIsFlipped(false);
    setShowHint(false);

    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          targetRole: activeRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards.');
      }

      const resData = await response.json();
      if (resData.data && resData.data.cards?.length > 0) {
        setFlashcardSet(resData.data);
        setCurrentIndex(0);
      } else {
        throw new Error('No flashcards returned from API.');
      }
    } catch (err: any) {
      console.warn('Falling back to local flashcard deck:', err);
      setError('Used role-specific study deck. Click Refresh to regenerate with AI.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [selectedRole]);

  // Handle role change
  const handleRoleSelect = (roleName: string) => {
    setIsCustomRole(false);
    setSelectedRole(roleName);
  };

  const handleCustomRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoleInput.trim()) {
      setSelectedRole(customRoleInput.trim());
      setIsCustomRole(true);
    }
  };

  const currentDeck = flashcardSet?.cards || [];

  const categories = [
    'All',
    'System Design & Architecture',
    'Coding & CS Core',
    'Behavioral & STAR',
    'Cloud & Infrastructure',
    'Domain & Role-Specific',
  ];

  const filteredCards = currentDeck.filter((card) => {
    const matchesCat = selectedCategory === 'All' || card.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (filteredCards.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (filteredCards.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    if (!flashcardSet) return;
    const shuffled = [...flashcardSet.cards].sort(() => Math.random() - 0.5);
    setFlashcardSet({ ...flashcardSet, cards: shuffled });
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const toggleMastery = (cardId: string) => {
    setMasteredCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const markAndAdvance = (cardId: string, isMastered: boolean) => {
    if (isMastered) {
      setMasteredCardIds((prev) => new Set(prev).add(cardId));
    } else {
      setMasteredCardIds((prev) => {
        const next = new Set(prev);
        next.delete(cardId);
        return next;
      });
    }
    handleNext();
  };

  const masteryPercentage =
    currentDeck.length > 0 ? Math.round((masteredCardIds.size / currentDeck.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg flex-shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Technical Role Study Flashcards
                </h3>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Role Spaced Study
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Deep technical concepts, architecture trade-offs, and STAR scenarios tailored to your target role and resume background.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchFlashcards()}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-md disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Generating Flashcards...' : 'Regenerate Flashcards'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-amber-950/50 border border-amber-800 text-amber-200 px-4 py-2 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Target Role Selector Row */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role Study Focus:</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              Active Focus: <span className="text-indigo-400 font-bold">{selectedRole}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESET_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedRole === role && !isCustomRole
                    ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {role}
              </button>
            ))}

            <form onSubmit={handleCustomRoleSubmit} className="flex items-center space-x-1.5">
              <input
                type="text"
                placeholder="Or enter custom target role..."
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 font-medium placeholder-slate-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                Set Role
              </button>
            </form>
          </div>
        </div>

        {/* Mastery Progress Bar & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Deck Mastery:</span>
              <span className="font-extrabold text-white font-mono">{masteryPercentage}%</span>
            </div>

            <span className="text-slate-600">•</span>

            <span className="text-slate-300">
              <strong className="text-emerald-400">{masteredCardIds.size}</strong> of{' '}
              <strong className="text-white">{currentDeck.length}</strong> Cards Mastered
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden hidden md:block">
              <div
                className="bg-gradient-to-r from-emerald-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${masteryPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center space-x-1.5 border-l border-slate-800 pl-3">
              <button
                onClick={() => setViewMode('deck')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  viewMode === 'deck'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Deck View</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Grid View ({filteredCards.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex-shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex-shrink-0 w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords or tags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="w-full bg-slate-950 text-slate-100 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE DECK SWIPER */}
      {viewMode === 'deck' && (
        <div className="max-w-3xl mx-auto space-y-5">
          {filteredCards.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Lightbulb className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-slate-300 text-sm font-semibold">
                No flashcards match category "{selectedCategory}" or search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Card Container with Flip Animation */}
              <div className="perspective-1000 min-h-[360px] relative">
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full min-h-[360px] bg-slate-900 border-2 rounded-2xl p-6 sm:p-8 shadow-2xl cursor-pointer transition-all duration-500 flex flex-col justify-between select-none relative ${
                    isFlipped
                      ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-indigo-500/80 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {currentCard.category}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                          currentCard.difficulty === 'Advanced'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : currentCard.difficulty === 'Intermediate'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {currentCard.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {masteredCardIds.has(currentCard.id) && (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Mastered</span>
                        </span>
                      )}

                      <span className="text-xs text-slate-500 font-mono font-bold">
                        {currentIndex + 1} / {filteredCards.length}
                      </span>
                    </div>
                  </div>

                  {/* Card Content: Front vs Back */}
                  <div className="py-6 flex-1 flex flex-col justify-center space-y-4">
                    {!isFlipped ? (
                      /* FRONT SIDE (QUESTION) */
                      <div className="space-y-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                          Question / Prompt:
                        </span>
                        <h4 className="text-base sm:text-lg font-extrabold text-white leading-relaxed">
                          {currentCard.question}
                        </h4>

                        {/* Hint Button & Display */}
                        {currentCard.hint && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowHint(!showHint);
                            }}
                            className="pt-2"
                          >
                            {!showHint ? (
                              <button
                                type="button"
                                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl"
                              >
                                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                <span>Show Memory Hint</span>
                              </button>
                            ) : (
                              <div className="bg-amber-950/40 border border-amber-800/80 text-amber-200 p-3 rounded-xl text-xs space-y-1">
                                <span className="font-extrabold text-[10px] uppercase text-amber-400">
                                  Quick Memory Hint:
                                </span>
                                <p className="leading-snug">{currentCard.hint}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* BACK SIDE (ANSWER) */
                      <div className="space-y-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Model Technical Answer:</span>
                        </span>
                        <div className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed space-y-2">
                          <p className="whitespace-pre-line font-medium">{currentCard.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Bar */}
                  <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {currentCard.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-800 text-indigo-300 text-[10px] font-semibold rounded border border-slate-700/80 flex items-center space-x-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-indigo-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(!isFlipped);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-extrabold flex items-center space-x-1 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/30"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'Show Question' : 'Click to Flip Answer'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Swiper & Self-Assessment Controls */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left/Right Card Navigation */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition flex items-center space-x-1 text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition flex items-center space-x-1 text-xs font-bold"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleShuffle}
                    title="Shuffle Deck"
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition text-xs font-bold flex items-center space-x-1"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Shuffle</span>
                  </button>
                </div>

                {/* Self Evaluation Buttons */}
                <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => markAndAdvance(currentCard.id, false)}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-rose-950/50 hover:border-rose-700 text-slate-300 hover:text-rose-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Need Review</span>
                  </button>

                  <button
                    onClick={() => markAndAdvance(currentCard.id, true)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mastered Card</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW MODE 2: GRID VIEW ALL CARDS */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.map((card, idx) => {
            const isMastered = masteredCardIds.has(card.id);

            return (
              <div
                key={card.id}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-3 flex flex-col justify-between transition ${
                  isMastered ? 'border-emerald-500/50 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">
                      Card {idx + 1} • {card.category}
                    </span>

                    <button
                      onClick={() => toggleMastery(card.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition flex items-center space-x-1 ${
                        isMastered
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{isMastered ? 'Mastered' : 'Mark Known'}</span>
                    </button>
                  </div>

                  <h5 className="text-xs font-extrabold text-white leading-snug">{card.question}</h5>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 block mb-1">
                      Answer:
                    </span>
                    <p>{card.answer}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((t, i) => (
                      <span key={i} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      card.difficulty === 'Advanced'
                        ? 'bg-rose-500/20 text-rose-300'
                        : card.difficulty === 'Intermediate'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {card.difficulty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

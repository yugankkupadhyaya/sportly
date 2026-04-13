'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Trophy,
  Calendar,
  Search,
  LayoutDashboard,
  Filter,
  User,
  Shield,
  CircleDot,
  TrendingUp,
  Zap,
  Star,
  MoreHorizontal,
  Bell,
  Sun,
  Moon,
  MessageSquare,
  X,
  ChevronRight,
} from 'lucide-react';

/** * UI COMPONENTS
 */
const Button = ({ className, variant, size, theme, ...props }: any) => {
  const isDark = theme === 'dark';
  const base =
    'inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95';

  const variants = {
    ghost: isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-neutral-900',
    outline: isDark
      ? 'border border-white/5 bg-[#1A1A1A] hover:bg-neutral-800 text-neutral-300'
      : 'border border-black/5 bg-white hover:bg-neutral-50 text-neutral-600',
    default: 'bg-[#FF3B5C] text-white shadow-lg shadow-rose-500/20 hover:bg-[#FF4D6D]',
    primary: 'bg-[#FF3B5C] text-white hover:bg-[#FF4D6D]',
  };

  const sizes = {
    icon: 'h-10 w-10 md:h-12 md:w-12 rounded-2xl',
    default: 'h-12 px-6 rounded-2xl text-[13px]',
    sm: 'h-9 px-4 text-[11px] rounded-xl',
  };

  return (
    <button
      className={`${base} ${variants[variant as keyof typeof variants] || variants.default} ${sizes[size as keyof typeof sizes] || sizes.default} ${className}`}
      {...props}
    />
  );
};

const Badge = ({ children, variant = 'default', theme }: any) => {
  const isDark = theme === 'dark';
  if (variant === 'live') {
    return (
      <div className="flex items-center gap-1.5 bg-rose-500 px-2.5 py-1 rounded-full shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-[10px] font-bold text-white font-mono">{children}</span>
      </div>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'border-white/10 bg-neutral-800/50 text-neutral-400' : 'border-black/5 bg-neutral-100 text-neutral-500'}`}
    >
      {children}
    </span>
  );
};

interface Match {
  id: string | number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'scheduled' | 'finished';
  currentMinute?: number;
  sport: string;
  league: string;
}

const MatchCard = ({
  match,
  theme,
  onFollow,
  isFollowed,
}: {
  match: Match;
  theme: string;
  onFollow: (m: Match) => void;
  isFollowed: boolean;
}) => {
  const isDark = theme === 'dark';
  const isLive = match.status === 'live';

  return (
    <motion.div
      layoutId={`match-${match.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden group border rounded-[2rem] p-6 transition-all duration-300 ${isDark ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-rose-500/80' : 'text-rose-500'}`}
          >
            {match.sport}
          </span>
          <p
            className={`text-[11px] font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}
          >
            {match.league}
          </p>
        </div>
        {isLive ? (
          <Badge variant="live" theme={theme}>
            {match.currentMinute}'
          </Badge>
        ) : (
          <Badge theme={theme}>{match.status === 'finished' ? 'FT' : 'Upcoming'}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}
          >
            <Shield className="w-6 h-6 text-rose-500" />
          </div>
          <span
            className={`text-xs font-bold text-center ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
          >
            {match.homeTeam}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {match.status === 'scheduled' ? 'VS' : `${match.homeScore} - ${match.awayScore}`}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}
          >
            <CircleDot className="w-6 h-6 text-amber-500" />
          </div>
          <span
            className={`text-xs font-bold text-center ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
          >
            {match.awayTeam}
          </span>
        </div>
      </div>

      <Button
        onClick={() => onFollow(match)}
        theme={theme}
        variant={isFollowed ? 'outline' : 'default'}
        className="w-full rounded-2xl h-11"
        disabled={isFollowed}
      >
        {isFollowed ? 'Following' : 'Follow Match'}
      </Button>
    </motion.div>
  );
};

const FollowedSidebar = ({
  match,
  theme,
  onClose,
}: {
  match: Match;
  theme: string;
  onClose: () => void;
}) => {
  const isDark = theme === 'dark';
  const [commentary, setCommentary] = useState<any[]>([]);
  useEffect(() => {
    const fetchCommentary = async () => {
      try {
        const res = await fetch(`http://localhost:3001/commentary/${match.id}?limit=20`);

        const json = await res.json();

        setCommentary(json.data);
      } catch (err) {
        console.error('COMMENTARY ERROR:', err);
      }
    };

    fetchCommentary();
  }, [match.id]);
  return (
    <motion.aside
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed right-0 top-0 h-full w-full md:w-[400px] z-[60] border-l flex flex-col ${isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}
    >
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="font-bold text-sm tracking-tight">Live Tracking</h3>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div
          className={`p-6 rounded-[2rem] border mb-8 ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-neutral-50 border-black/5'}`}
        >
          <div className="flex justify-between items-center mb-6">
            <Badge variant="live" theme={theme}>
              {match.currentMinute}'
            </Badge>
            <span className="text-[10px] font-bold text-neutral-500 uppercase">{match.sport}</span>
          </div>
          <div className="flex items-center justify-between text-center gap-4">
            <div className="flex-1">
              <div className="text-xl font-black mb-1">{match.homeScore}</div>
              <div className="text-[10px] font-bold uppercase text-neutral-500 truncate">
                {match.homeTeam}
              </div>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="flex-1">
              <div className="text-xl font-black mb-1">{match.awayScore}</div>
              <div className="text-[10px] font-bold uppercase text-neutral-500 truncate">
                {match.awayTeam}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-4 1-4 text-rose-500" />
git             <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Live Commentary
            </h4>
          </div>

          <div className="space-y-6">
            {commentary.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-[10px] font-mono font-bold">{item.minute}'</div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-6 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <Button theme={theme} className="w-full">
          Open Match Center
        </Button>
      </div>
    </motion.aside>
  );
};

export default function DashboardPage() {
  const [theme, setTheme] = useState('dark');
  const [matches, setMatches] = useState<Match[]>([]);
  const [followedMatch, setFollowedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';
  const handleFollow = async (match: Match) => {
    setFollowedMatch(match);
  };
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('http://localhost:3001/matches');

        const json = await res.json();

        // IMPORTANT: your backend returns { success, data }
        const data = json.data;

        const formatted = data.map((m: any) => ({
          id: m.id,
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          status: m.status,
          currentMinute: m.currentMinute,
          sport: m.sport || 'Football',
          league: m.league || 'League',
        }));

        setMatches(formatted);
      } catch (err) {
        console.error('MATCH FETCH ERROR:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700&display=swap');
    :root { --font-display: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace; }
    .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    body { margin: 0; overflow-x: hidden; }
  `;

  return (
    <div
      className={`min-h-screen font-display transition-colors duration-500 ${isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#F8F9FA] text-neutral-900'}`}
    >
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* SIDE NAV */}
      <aside
        className={`fixed left-0 top-0 h-full w-20 hidden xl:flex flex-col items-center py-8 border-r z-50 ${isDark ? 'border-white/5 bg-[#1A1A1A]' : 'border-black/5 bg-white'}`}
      >
        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center mb-12">
          <Zap className="w-6 h-6 text-white fill-current" />
        </div>
        <nav className="flex flex-col gap-8">
          <Button theme={theme} variant="ghost" size="icon" className="text-rose-500">
            <LayoutDashboard className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon">
            <TrendingUp className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon">
            <Trophy className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon">
            <Calendar className="w-5 h-5" />
          </Button>
        </nav>
      </aside>

      <main
        className={`transition-all duration-500 px-6 md:px-12 pt-8 max-w-[1400px] ${followedMatch ? 'xl:ml-20 xl:mr-[400px]' : 'xl:mx-auto'}`}
      >
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">
              Sportly<span className="text-rose-500">.</span>
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-500">
              Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                type="text"
                placeholder="Teams, sports..."
                className={`border rounded-2xl pl-12 pr-6 py-3 text-xs w-64 outline-none ${isDark ? 'bg-neutral-900 border-white/5' : 'bg-white border-black/5'}`}
              />
            </div>
            <Button theme={theme} variant="outline" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-4">
            <div className="w-10 h-10 border-t-2 border-rose-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-16">
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Live Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches
                  .filter((m) => m.status === 'live')
                  .map((match) => (
                    <MatchCard
                      key={match.id}
                      theme={theme}
                      match={match}
                      onFollow={handleFollow}
                      isFollowed={followedMatch?.id === match.id}
                    />
                  ))}
              </div>
            </section>

            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-8">
                Discover More
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches
                  .filter((m) => m.status !== 'live')
                  .map((match) => (
                    <MatchCard
                      key={match.id}
                      theme={theme}
                      match={match}
                      onFollow={setFollowedMatch}
                      isFollowed={followedMatch?.id === match.id}
                    />
                  ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <AnimatePresence>
        {followedMatch && (
          <FollowedSidebar
            match={followedMatch}
            theme={theme}
            onClose={() => setFollowedMatch(null)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE HUD */}
      {!followedMatch && (
        <div
          className={`lg:hidden fixed bottom-6 left-6 right-6 h-16 rounded-3xl border flex items-center justify-around px-6 z-50 ${isDark ? 'bg-neutral-900 border-white/5' : 'bg-white border-black/5 shadow-xl'}`}
        >
          <Zap className="w-5 h-5 text-rose-500" />
          <Trophy className="w-5 h-5 text-neutral-500" />
          <User className="w-5 h-5 text-neutral-500" />
        </div>
      )}
    </div>
  );
}
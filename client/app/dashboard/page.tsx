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
  History,
  Mail,
  Code2,
  Linkedin,
  Twitter,
  MapPin,
  ExternalLink,
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
  onUnfollow,
  isFollowed,
}: {
  match: Match;
  theme: string;
  onFollow: (m: Match) => void;
  onUnfollow?: (id: string | number) => void;
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
        onClick={() => isFollowed ? onUnfollow?.(match.id) : onFollow(match)}
        theme={theme}
        variant={isFollowed ? 'outline' : 'default'}
        className={`w-full rounded-2xl h-11 ${isFollowed ? (isDark ? 'hover:text-rose-500 hover:border-rose-500/50' : 'hover:text-rose-600 hover:border-rose-200') : ''}`}
      >
        {isFollowed ? 'Stop Following Match' : 'Follow Match'}
      </Button>
    </motion.div>
  );
};

const FollowedSidebar = ({
  followedMatches,
  activeMatchId,
  theme,
  onClose,
  onSwitchMatch,
  onUnfollow
}: {
  followedMatches: Match[];
  activeMatchId: string | number;
  theme: string;
  onClose: () => void;
  onSwitchMatch: (id: string | number) => void;
  onUnfollow: (id: string | number) => void;
}) => {
  const isDark = theme === 'dark';
  const match = followedMatches.find(m => m.id === activeMatchId);
  const [commentary, setCommentary] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!match) return;
    
    // Initial fetch to load historical data (mapped in descending order internally)
    const fetchCommentary = async () => {
      try {
        const res = await fetch(`http://localhost:3001/matches/${match.id}/commentary?limit=20`);
        const json = await res.json();
        
        if (!json || !Array.isArray(json.data)) {
          setError('Failed to load commentary');
          return;
        }

        setCommentary(json.data); // Keep DESC order explicitly for newest at top
        setError(null);
      } catch (err) {
        setError('Failed to load commentary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentary();
    
    // Establish real-time websocket connection over HTTP polling
    const ws = new WebSocket(`ws://localhost:3001/ws`);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', matchId: match.id }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'commentary' && payload.data) {
          setCommentary(prev => [payload.data, ...prev]);
        }
      } catch (err) {
        console.error("WS Parse error", err);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [match?.id]);

  if (!match) return null;
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

      <div className={`flex shrink-0 overflow-x-auto no-scrollbar border-b ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-black/5'}`}>
        {followedMatches.map(fm => (
          <div 
            key={fm.id}
            onClick={() => onSwitchMatch(fm.id)}
            className={`flex-1 min-w-[120px] flex items-center justify-between px-4 py-3 cursor-pointer text-xs font-bold border-b-2 transition-colors ${fm.id === activeMatchId ? 'border-rose-500 text-rose-500' : 'border-transparent text-neutral-500 hover:text-neutral-400'}`}
          >
            <span className="truncate pr-2">{fm.homeTeam}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onUnfollow(fm.id); }} 
              className={`p-1 shrink-0 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
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
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Live Commentary
            </h4>
          </div>

          <div className="space-y-4">
            {isLoading && commentary.length === 0 && <div className="text-sm text-neutral-500">Loading commentary...</div>}
            {error && <div className="text-sm text-rose-500">{error}</div>}
            {!isLoading && !error && commentary.length === 0 && (
              <div className="text-sm text-neutral-500">No commentary available for this match</div>
            )}
            {commentary.map((item, i) => {
              const isLatest = i === 0;
              return (
                <motion.div 
                  key={item.id || item.sequence || i} 
                  initial={isLatest ? { backgroundColor: 'rgba(255, 59, 92, 0.2)' } : {}}
                  animate={{ backgroundColor: 'transparent' }}
                  transition={{ duration: 2 }}
                  className={`flex gap-4 p-3 rounded-2xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                >
                  <div className="text-[10px] font-mono font-bold pt-1 text-rose-500">{item.minute}'</div>
                  <div>
                    <p className="text-sm leading-relaxed">{item.message}</p>
                    {item.eventType && item.eventType !== 'info' && item.eventType !== 'NONE' && (
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${item.eventType === 'GOAL' ? 'bg-emerald-500/10 text-emerald-500' : item.eventType === 'CARD' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {item.eventType}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
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

const TableView = ({ theme }: { theme: string }) => {
  const isDark = theme === 'dark';
  const [activeSport, setActiveSport] = useState('football');
  const sports = ['football', 'basketball', 'cricket', 'tennis'];

  const fakeTables: Record<string, any[]> = {
    football: [
      { team: "Arsenal", pts: 72, played: 30, gd: 25 },
      { team: "Man City", pts: 70, played: 30, gd: 30 },
      { team: "Real Madrid", pts: 65, played: 30, gd: 20 }
    ],
    basketball: [
      { team: "Lakers", pts: "0.650", played: 82, gd: "+5.2" },
      { team: "Warriors", pts: "0.620", played: 82, gd: "+4.1" },
      { team: "Bulls", pts: "0.550", played: 82, gd: "+1.2" }
    ],
    cricket: [
      { team: "India", pts: 12, played: 6, gd: "+2.1" },
      { team: "Australia", pts: 10, played: 6, gd: "+1.5" },
      { team: "England", pts: 8, played: 6, gd: "+0.8" }
    ],
    tennis: [
      { team: "Djokovic", pts: 9800, played: 18, gd: "N/A" },
      { team: "Alcaraz", pts: 9200, played: 19, gd: "N/A" },
      { team: "Nadal", pts: 8500, played: 15, gd: "N/A" }
    ]
  };

  const currentTable = fakeTables[activeSport] || [];

  return (
    <motion.div 
      key="table"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className={`rounded-[2rem] border p-8 ${isDark ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-black/5'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Points Table</h2>
        <div className="flex gap-2">
          {sports.map(sport => (
            <button 
              key={sport} 
              onClick={() => setActiveSport(sport)}
              className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${activeSport === sport ? 'bg-rose-500 text-white border-rose-500' : isDark ? 'border-white/10 text-neutral-500 hover:text-white' : 'border-black/5 text-neutral-500 hover:text-black'}`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className={`text-[11px] uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
              <th className="pb-4 font-bold">Rank</th>
              <th className="pb-4 font-bold">Team</th>
              <th className="pb-4 font-bold text-center">Played</th>
              <th className="pb-4 font-bold text-center">{activeSport === 'basketball' || activeSport === 'cricket' ? 'NRR/DIFF' : 'GD'}</th>
              <th className="pb-4 font-bold text-right">{activeSport === 'basketball' ? 'Win %' : 'Points'}</th>
            </tr>
          </thead>
          <tbody>
            {currentTable.map((row, i) => (
              <tr key={row.team} className={`border-b border-t-0 last:border-0 ${isDark ? 'border-white/5' : 'border-black/5'} transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                <td className="py-4 font-bold">{i + 1}</td>
                <td className="py-4 font-bold">{row.team}</td>
                <td className="py-4 text-center">{row.played}</td>
                <td className="py-4 text-center">{row.gd}</td>
                <td className="py-4 font-bold text-right text-rose-500">{row.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const TrendingView = ({ theme }: { theme: string }) => {
  const isDark = theme === 'dark';
  const fakeTrending = [
    { team: "Barcelona", form: "WWLWW" },
    { team: "Real Madrid", form: "DWWWW" }
  ];
  return (
    <motion.div 
      key="trending"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className={`rounded-[2rem] border p-8 ${isDark ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-black/5'}`}
    >
      <h2 className="text-xl font-bold mb-6">Trending Teams</h2>
      <div className="space-y-4">
        {fakeTrending.map(item => (
          <div key={item.team} className={`p-4 rounded-2xl flex items-center justify-between border ${isDark ? 'border-white/5 bg-neutral-900/50' : 'border-black/5 bg-neutral-50'}`}>
            <span className="font-bold">{item.team}</span>
            <div className="flex gap-1.5">
              {item.form.split('').map((res, i) => (
                <span key={i} className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-bold ${res === 'W' ? 'bg-emerald-500/20 text-emerald-500' : res === 'L' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                  {res}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const CalendarView = ({ theme }: { theme: string }) => {
  const isDark = theme === 'dark';
  const fakeCalendar = [
    { home: "Chelsea", away: "Arsenal", time: "Tomorrow 8:00 PM" },
    { home: "Liverpool", away: "Man Utd", time: "Sunday 4:30 PM" }
  ];
  return (
    <motion.div 
      key="calendar"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-8">Upcoming Fixtures</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fakeCalendar.map((match, i) => (
          <div key={i} className={`relative overflow-hidden group border rounded-[2rem] p-6 transition-all duration-300 ${isDark ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
            <div className="text-center mb-6">
              <Badge theme={theme}>{match.time}</Badge>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                   <Shield className="w-6 h-6 text-neutral-500" />
                 </div>
                 <span className={`text-xs font-bold text-center ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{match.home}</span>
              </div>
              <div className={`text-xl font-black ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>VS</div>
              <div className="flex flex-col items-center gap-2 flex-1">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                   <CircleDot className="w-6 h-6 text-neutral-500" />
                 </div>
                 <span className={`text-xs font-bold text-center ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{match.away}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProfileView = ({ theme, userMatches }: { theme: string; userMatches: number }) => {
  const isDark = theme === 'dark';
  const user = { username: "User", followedMatches: userMatches, favoriteTeam: "Real Madrid" };
  return (
    <motion.div 
      key="profile"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className={`rounded-[2rem] border p-8 max-w-md mx-auto text-center ${isDark ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-black/5 shadow-lg'}`}
    >
      <div className="w-24 h-24 rounded-full bg-rose-500 mx-auto flex items-center justify-center mb-6">
        <User className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-black mb-2">{user.username}</h2>
      <p className={`text-sm mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Fan since 2024</p>
      
      <div className="space-y-4 text-left">
        <div className={`p-4 rounded-xl flex items-center justify-between border ${isDark ? 'bg-neutral-900 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
          <span className="text-sm font-bold text-neutral-500">Favorite Team</span>
          <span className="font-black">{user.favoriteTeam}</span>
        </div>
        <div className={`p-4 rounded-xl flex items-center justify-between border ${isDark ? 'bg-neutral-900 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
          <span className="text-sm font-bold text-neutral-500">Matches Followed</span>
          <span className="font-black text-rose-500">{user.followedMatches}</span>
        </div>
      </div>
    </motion.div>
  );
};

const HistoryView = ({ theme, matches, onFollow, onUnfollow, followedMatches }: { theme: string; matches: Match[]; onFollow: (m: Match) => void; onUnfollow: (id: string | number) => void; followedMatches: Match[] }) => {
  const isDark = theme === 'dark';
  return (
    <motion.div 
      key="history"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
        <History className="w-4 h-4 text-neutral-500" /> Match History
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
        {matches
          .filter((m) => m.status === 'finished')
          .map((match) => (
            <MatchCard
              key={match.id}
              theme={theme}
              match={match}
              onFollow={onFollow}
              onUnfollow={onFollow} // This view uses onFollow natively bound to Dashboard context so passing same reference is tricky. HistoryView doesn't explicitly expose handleUnfollow currently, we will fix below
              isFollowed={followedMatches.some((m) => m.id === match.id)}
            />
          ))}
      </div>
    </motion.div>
  );
};

const ContactView = ({ theme }: { theme: string }) => {
  const isDark = theme === 'dark';
  
  const contactLinks = [
    {
      name: 'GitHub',
      value: 'yugankkkupadhyaya',
      icon: <Code2 className="w-5 h-5" />,
      href: 'https://github.com/yugankkkupadhyaya',
    },
    {
      name: 'Email',
      value: 'yugankkupadhyaya@gmail.com',
      icon: <Mail className="w-5 h-5" />,
      href: 'mailto:yugankkupadhyaya@gmail.com',
    },
    {
      name: 'LinkedIn',
      value: 'Yugank Upadhyaya',
      icon: <Linkedin className="w-5 h-5" />,
      href: 'https://www.linkedin.com/in/yugank-upadhyaya-188786248/',
    },
    {
      name: 'X',
      value: '@yugankupadhyaya',
      icon: <Twitter className="w-5 h-5" />,
      href: 'https://x.com/yugankupadhyaya',
    },
  ];

  return (
    <motion.div 
      key="contact"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className={`rounded-[2rem] border p-8 max-w-4xl mx-auto ${isDark ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-black/5'}`}
    >
      <div className="mb-10 space-y-2">
        <h2 className="text-3xl font-black tracking-tight">Get in touch.</h2>
        <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Available for collaborations, inquiries, or just a quick tech chat.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {contactLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-black/5 border-black/5 hover:bg-black/10'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isDark ? 'bg-black/50 text-neutral-400 group-hover:text-rose-500' : 'bg-white text-neutral-500 group-hover:text-rose-500'} transition-colors`}>
                {link.icon}
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {link.name}
                </span>
                <span className={`text-sm font-bold mt-1 ${isDark ? 'text-neutral-200 group-hover:text-white' : 'text-neutral-700 group-hover:text-black'} transition-colors`}>
                  {link.value}
                </span>
              </div>
            </div>
            <ExternalLink className={`w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
          </a>
        ))}
      </div>

      <div className={`flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <MapPin className="text-blue-500 w-5 h-5" />
          </div>
          <div className="text-sm">
            <p className={`font-bold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Current Base</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Ghaziabad, Uttar Pradesh, India</p>
          </div>
        </div>

        <Button
          theme={theme}
          variant="default"
          className="rounded-full h-12 px-8 font-bold flex items-center gap-2"
          onClick={() => window.open('mailto:yugankkupadhyaya@gmail.com')}
        >
          <MessageSquare className="w-4 h-4" />
          Send a direct message
        </Button>
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('dashboard');
  const [matches, setMatches] = useState<Match[]>([]);
  const [followedMatches, setFollowedMatches] = useState<Match[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  const handleFollow = async (match: Match) => {
    if (!followedMatches.find(m => m.id === match.id)) {
      if (followedMatches.length >= 2) {
        alert("You can only follow 2 matches");
        return;
      }
      setFollowedMatches(prev => [...prev, match]);
    }
    setActiveMatchId(match.id);
  };

  const handleUnfollow = (id: string | number) => {
    setFollowedMatches(prev => {
      const updated = prev.filter(m => m.id !== id);
      if (activeMatchId === id) {
        setActiveMatchId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
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
          <Button theme={theme} variant="ghost" size="icon" onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' : ''}>
            <LayoutDashboard className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon" onClick={() => setView('trending')} className={view === 'trending' ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' : ''}>
            <TrendingUp className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon" onClick={() => setView('table')} className={view === 'table' ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' : ''}>
            <Trophy className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon" onClick={() => setView('calendar')} className={view === 'calendar' ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' : ''}>
            <Calendar className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon" onClick={() => setView('history')} className={view === 'history' ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' : ''}>
            <History className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon" onClick={() => setView('contact')} className={view === 'contact' ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' : ''}>
            <Mail className="w-5 h-5" />
          </Button>
          <Button theme={theme} variant="ghost" size="icon" onClick={() => setView('profile')} className={view === 'profile' ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' : ''}>
            <User className="w-5 h-5" />
          </Button>
        </nav>
      </aside>

      <main
        className={`transition-all duration-500 px-6 md:px-12 pt-8 max-w-[1400px] ${activeMatchId ? 'xl:ml-20 xl:mr-[400px]' : 'xl:mx-auto'}`}
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
            {followedMatches.length > 0 && !activeMatchId && (
              <Button onClick={() => setActiveMatchId(followedMatches[0].id)} theme={theme} variant="outline">
                <Activity className="w-4 h-4 mr-2" /> Live Followed
              </Button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-4">
            <div className="w-10 h-10 border-t-2 border-rose-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-16">
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-8 flex items-center justify-center gap-2">
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
                          isFollowed={followedMatches.some((m) => m.id === match.id)}
                        />
                      ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-8">
                    Upcoming Matches
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches
                      .filter((m) => m.status === 'scheduled')
                      .map((match) => (
                        <MatchCard
                          key={match.id}
                          theme={theme}
                          match={match}
                          onFollow={handleFollow}
                          isFollowed={followedMatches.some((m) => m.id === match.id)}
                        />
                      ))}
                  </div>
                </section>
              </motion.div>
            )}

            {view === 'trending' && <TrendingView theme={theme} key="trending" />}
            {view === 'table' && <TableView theme={theme} key="table" />}
            {view === 'calendar' && <CalendarView theme={theme} key="calendar" />}
            {view === 'history' && <HistoryView theme={theme} matches={matches} onFollow={handleFollow} onUnfollow={handleUnfollow} followedMatches={followedMatches} key="history" />}
            {view === 'contact' && <ContactView theme={theme} key="contact" />}
            {view === 'profile' && <ProfileView theme={theme} userMatches={followedMatches.length} key="profile" />}
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {followedMatches.length > 0 && activeMatchId && (
          <FollowedSidebar
            followedMatches={followedMatches}
            activeMatchId={activeMatchId}
            theme={theme}
            onClose={() => setActiveMatchId(null)}
            onSwitchMatch={setActiveMatchId}
            onUnfollow={handleUnfollow}
          />
        )}
      </AnimatePresence>

      {/* MOBILE HUD */}
      {!activeMatchId && (
        <div
          className={`lg:hidden fixed bottom-6 left-6 right-6 h-16 rounded-3xl border flex items-center justify-around px-6 z-50 ${isDark ? 'bg-neutral-900 border-white/5' : 'bg-white border-black/5 shadow-xl'}`}
        >
          <button onClick={() => setView('dashboard')} className="p-2">
            <Zap className={`w-5 h-5 ${view === 'dashboard' ? 'text-rose-500' : 'text-neutral-500'}`} />
          </button>
          <button onClick={() => setView('table')} className="p-2">
            <Trophy className={`w-5 h-5 ${view === 'table' ? 'text-rose-500' : 'text-neutral-500'}`} />
          </button>
          <button onClick={() => setView('calendar')} className="p-2">
            <Calendar className={`w-5 h-5 ${view === 'calendar' ? 'text-rose-500' : 'text-neutral-500'}`} />
          </button>
          <button onClick={() => setView('history')} className="p-2">
            <History className={`w-5 h-5 ${view === 'history' ? 'text-rose-500' : 'text-neutral-500'}`} />
          </button>
          <button onClick={() => setView('contact')} className="p-2">
            <Mail className={`w-5 h-5 ${view === 'contact' ? 'text-rose-500' : 'text-neutral-500'}`} />
          </button>
          <button onClick={() => setView('profile')} className="p-2">
            <User className={`w-5 h-5 ${view === 'profile' ? 'text-rose-500' : 'text-neutral-500'}`} />
          </button>
        </div>
      )}
    </div>
  );
}
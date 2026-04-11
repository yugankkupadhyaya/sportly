'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  MessageSquare,
  Trophy,
  Globe,
  ChevronRight,
  Play,
  Activity,
  CheckCircle2,
  Star,
  Shield,
  CircleDot,
  Menu,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Home,
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

/**
 * MOCK DATA WITH BETTER ASSETS
 */
const PREVIEW_MATCHES = [
  {
    id: 1,
    league: 'Premier League',
    home: { name: 'Man City', color: 'text-sky-400', icon: Shield, score: 2 },
    away: { name: 'Liverpool', color: 'text-rose-600', icon: CircleDot, score: 1 },
    time: "64'",
  },
  {
    id: 2,
    league: 'Champions League',
    home: { name: 'Real Madrid', color: 'text-amber-200', icon: Shield, score: 0 },
    away: { name: 'Bayern', color: 'text-red-500', icon: Shield, score: 0 },
    time: "12'",
  },
];

const FEATURES = [
  {
    title: 'Instant Live Scores',
    desc: 'Experience sub-second latency on score updates. Never miss a goal.',
    icon: Zap,
    color: 'text-rose-500',
  },
  {
    title: 'Expert Commentary',
    desc: 'Deep-dive into every play with our automated and expert-led feed.',
    icon: MessageSquare,
    color: 'text-blue-500',
  },
  {
    title: 'Multi-Sport Hub',
    desc: 'From Football to Formula 1. One app to track every competition.',
    icon: Trophy,
    color: 'text-amber-500',
  },
  {
    title: 'Global Coverage',
    desc: 'Tracking over 1,000+ leagues worldwide with detailed stats.',
    icon: Globe,
    color: 'text-emerald-500',
  },
];

/**
 * COMPONENT: Custom Logo
 * A bespoke abstract SVG representing data flow and sports movement
 */
const SportlyLogo = () => (
  <div className="flex items-center gap-2.5 group cursor-pointer">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-rose-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-rose-600/30" />
      <div className="absolute inset-0 bg-black border border-white/20 rounded-xl flex items-center justify-center group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-6 h-6 text-white"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    </div>
    <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
      Sportly<span className="text-rose-600">.</span>
    </span>
  </div>
);

/**
 * COMPONENT: Navbar
 */
const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-2xl">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <SportlyLogo />

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
          <Link href={'/dashboard'}>
            <span>Home</span>
          </Link>
          <a href="#features" className="hover:text-white transition-colors">
            Sports
          </a>
          <a href="#preview" className="hover:text-white transition-colors">
            Live Feed
          </a>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center mr-4 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-600 rounded-full border border-black" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-white/10 hidden sm:block mx-2" />

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] hidden sm:inline-flex"
          >
            Sign In
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-2xl bg-white text-black hover:bg-gray-200 px-5 h-10 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-white/5">
                Join Free
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-neutral-900 border-white/10 text-white rounded-2xl p-2 mt-2">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 py-2">
                Account Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="rounded-xl focus:bg-white/5 focus:text-white cursor-pointer py-3 px-3">
                <User className="mr-3 h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-tight">Create Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl focus:bg-white/5 focus:text-white cursor-pointer py-3 px-3">
                <Trophy className="mr-3 h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-tight">VIP Pass</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl focus:bg-white/5 focus:text-white cursor-pointer py-3 px-3">
                <Settings className="mr-3 h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-tight">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="rounded-xl focus:bg-rose-600/10 focus:text-rose-500 cursor-pointer py-3 px-3">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-tight">Sign In</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden text-white">
          <Menu className="w-6 h-6" />
        </Button>
      </div>
    </div>
  </nav>
);

const LiveMatchPreview = ({ match }: { match: (typeof PREVIEW_MATCHES)[0] }) => (
  <Card className="bg-neutral-900/50 border-white/5 shadow-2xl overflow-hidden group hover:bg-neutral-900 transition-colors duration-500">
    <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
      <CardDescription className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <Globe className="w-3 h-3" /> {match.league}
      </CardDescription>
      <Badge
        variant="secondary"
        className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border-rose-500/20 gap-1.5 px-2 py-0.5"
      >
        <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
        {match.time}
      </Badge>
    </CardHeader>
    <CardContent className="pb-8 pt-4">
      <div className="flex justify-between items-center gap-4 relative">
        <div className="flex flex-col items-center gap-3 flex-1">
          <div
            className={`w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}
          >
            <match.home.icon className={`w-8 h-8 ${match.home.color} fill-current/20`} />
          </div>
          <span className="text-xs font-black text-gray-200 text-center uppercase tracking-wider">
            {match.home.name}
          </span>
        </div>

        <div className="flex flex-col items-center px-4">
          <div className="text-5xl font-black tracking-tighter text-white tabular-nums flex items-center gap-3">
            {match.home.score}
            <span className="text-neutral-700 text-2xl font-medium">:</span>
            {match.away.score}
          </div>
          <div className="mt-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
              Match Detail
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 flex-1">
          <div
            className={`w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}
          >
            <match.away.icon className={`w-8 h-8 ${match.away.color} fill-current/20`} />
          </div>
          <span className="text-xs font-black text-gray-200 text-center uppercase tracking-wider">
            {match.away.name}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 font-sans antialiased">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative px-6 pt-48 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="mb-8 border-white/10 bg-white/5 text-gray-400 font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase text-[9px]"
              >
                ⚡ Ultra Low Latency Live Data
              </Badge>

              <h1 className="text-6xl md:text-[110px] font-black tracking-tighter leading-[0.8] mb-10 text-white uppercase italic">
                FAST. REAL.
                <br />
                <span className="text-neutral-800 outline-text">NON-STOP.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                The world's most advanced live sports tracker. Zero lag updates, pro commentary, and
                elite analytics for the modern fan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="h-16 px-10 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[11px] rounded-[20px] shadow-2xl shadow-rose-600/30 group">
                  Enter Dashboard{' '}
                  <Play className="ml-2 w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  className="h-16 px-10 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/5"
                >
                  Watch Walkthrough
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PREVIEW SECTION */}
        <section id="preview" className="px-6 py-12 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PREVIEW_MATCHES.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <LiveMatchPreview match={match} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="px-6 py-40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-rose-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">
                Capabilities
              </span>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-6 italic">
                Built for the 1%
              </h2>
              <div className="w-24 h-1.5 bg-rose-600 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map((feature, i) => (
                <Card
                  key={i}
                  className="bg-neutral-900/30 border-white/5 rounded-[48px] hover:border-white/10 transition-all group p-6 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-colors" />
                  <CardHeader>
                    <div
                      className={`w-16 h-16 rounded-[24px] bg-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 ${feature.color}`}
                    >
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-black text-white tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-gray-500 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 py-24 px-6 bg-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <Activity className="text-rose-600 w-8 h-8" />
                <span className="text-3xl font-black tracking-tighter uppercase italic">
                  Sportly
                </span>
              </div>
              <p className="text-gray-500 font-medium max-w-sm text-lg">
                The next generation of sports data. Tracking the world of competition with
                unparalled speed.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                Product
              </span>
              <a
                href="#"
                className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors"
              >
                Scores
              </a>
              <a
                href="#"
                className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors"
              >
                Predictions
              </a>
              <a
                href="#"
                className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors"
              >
                API
              </a>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                Connect
              </span>
              <a
                href="#"
                className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors"
              >
                Twitter / X
              </a>
              <a
                href="#"
                className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-32 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-neutral-800 uppercase tracking-[0.5em]"></div>
        </footer>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          background-color: black;
          color: white;
        }

        .outline-text {
          -webkit-text-stroke: 1px #262626;
          color: transparent;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: black;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 20px;
          border: 2px solid black;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #262626;
        }
      `}</style>
    </div>
  );
}

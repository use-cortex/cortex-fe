"use client";

import { useUser } from '@/hooks/use-user';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  Cpu,
  Plus,
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { user, loading } = useUser();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      {/* Background patterns */}
      <div className="fixed inset-0 -z-10 dot-pattern opacity-60" />
      <div className="fixed inset-0 -z-10 hero-gradient" />

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 flex items-center gap-8 glass-nav rounded-full shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-black fill-black" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">CORTEX</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-neutral-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        <div className="flex items-center gap-4">
          {!loading && !user ? (
            <>
              <Link href="/login" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">Sign in</Link>
              <Link href="/signup" className="bg-white text-black py-1.5 px-3.5 rounded-full text-[13px] font-medium hover:bg-neutral-200 transition-colors">
                Get started
              </Link>
            </>
          ) : user ? (
            <Link href="/dashboard" className="bg-white text-black py-1.5 px-5 rounded-full text-[13px] font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2">
              Dashboard
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <div className="w-20 h-8 rounded-full bg-white/5 animate-pulse" />
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        <div className="container-center grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-white" />
              Engineers thinking lab
              <ChevronRight className="w-3 h-3 text-neutral-500" />
            </div>

            <h1 className="text-5xl md:text-7xl mb-8 font-serif-title leading-[1.05] text-white">
              Master <br />
              Architectural <br />
              <span className="italic">Reasoning</span>.
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 max-w-md mb-10 leading-relaxed font-normal">
              A premium training ground for systems engineers to sharpen decision-making through high-fidelity architectural scenarios.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href={user ? "/dashboard" : "/signup"} className="w-full sm:w-auto bg-white text-black py-3.5 px-8 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2">
                {user ? "Resume Session" : "Start Training"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px] font-bold">JD</div>
                  ))}
                </div>
                <span className="ml-2">Trusted by 2.5k architects</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative z-10 p-2 bg-neutral-900 rounded-3xl shadow-2xl border border-white/5 rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
              <div className="rounded-2xl overflow-hidden bg-black border border-white/5 aspect-[4/3] flex flex-col">
                <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-neutral-900 text-[11px] font-medium text-neutral-500">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  </div>
                  <span>cortex.app/analysis/distributed-consensus</span>
                  <Plus className="w-4 h-4" />
                </div>
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Scenario Analysis</p>
                      <h3 className="text-2xl font-serif text-white">Raft Protocol vs Multi-Paxos</h3>
                    </div>
                    <div className="px-4 py-1.5 bg-white text-black rounded-full text-[11px] font-bold tracking-tight">SOLVING</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-neutral-900 border border-white/5 shadow-sm">
                      <p className="text-[10px] text-neutral-500 font-bold mb-3 uppercase">Complexity Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif text-white">8.4</span>
                        <span className="text-xs text-neutral-600">/ 10</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-900 border border-white/5 shadow-sm">
                      <p className="text-[10px] text-neutral-500 font-bold mb-3 uppercase">Time Pressure</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif text-white">12</span>
                        <span className="text-xs text-neutral-600">m remaining</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '70' + '%' }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-white"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-500 font-medium">
                      <span>Logical Consistency</span>
                      <span className="text-white">Optimizing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 px-6 bg-black border-t border-white/5">
        <div className="container-center">
          <div className="mb-20">
            <h2 className="text-4xl font-serif mb-4 text-white">Precision Engineering.</h2>
            <p className="text-neutral-400 max-w-lg font-medium">Tools built for the highest levels of architectural rigor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Large Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 p-8 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col justify-between min-h-[400px] group overflow-hidden relative"
            >
              <div className="relative z-10">
                <BrainCircuit className="w-10 h-10 mb-6 text-white" />
                <h3 className="text-3xl font-serif mb-4 text-white">Advanced Scenario Engine</h3>
                <p className="text-neutral-400 max-w-sm font-medium leading-relaxed">
                  Interactive simulations that model real-world system failures, from cascading timeouts to database deadlocks.
                </p>
              </div>
              <div className="mt-8 relative z-10">
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:gap-4 transition-all text-white">
                  Explore scenarios <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {/* Abstract graphic */}
              <div className="absolute bottom-0 right-0 w-2/3 h-1/2 p-4 translate-y-4 translate-x-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="w-full h-full border-2 border-white rounded-tl-[100px]" />
              </div>
            </motion.div>

            {/* Small Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 p-8 rounded-3xl bg-white text-black flex flex-col justify-between"
            >
              <Cpu className="w-8 h-8 mb-6" />
              <div>
                <h3 className="text-2xl font-serif mb-3">AI Reasoning</h3>
                <p className="text-neutral-600 text-sm font-medium">
                  Instant, deep-dive feedback on your proposed architectures using our custom-tuned LLM.
                </p>
              </div>
            </motion.div>

            {/* Small Feature 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 p-8 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col justify-between"
            >
              <Target className="w-8 h-8 mb-6 text-neutral-600" />
              <div>
                <h3 className="text-2xl font-serif mb-3 text-white">Goal Oriented</h3>
                <p className="text-neutral-500 text-sm font-medium">
                  Define your career path and target specific engineering levels (L4 to L7+).
                </p>
              </div>
            </motion.div>

            {/* Medium Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 p-8 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="flex-1">
                <Trophy className="w-10 h-10 mb-6 text-white" />
                <h3 className="text-3xl font-serif mb-4 text-white">Quantifiable Progress</h3>
                <p className="text-neutral-400 font-medium max-w-xs">
                  Every decision you make contributes to your Architectural Index (AIX™).
                </p>
              </div>
              <div className="flex-1 w-full bg-black p-6 rounded-2xl shadow-2xl border border-white/5">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Weekly score</p>
                    <p className="text-2xl font-serif text-white">842 <span className="text-sm font-sans text-green-500 font-bold">+12%</span></p>
                  </div>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex gap-1 items-end h-16">
                  {[30, 45, 25, 60, 80, 50, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-neutral-800 rounded-t-sm" style={{ height: h + '%' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 px-6">
        <div className="container-center text-center">
          <p className="text-4xl md:text-5xl font-serif leading-tight max-w-4xl mx-auto mb-12 text-white">
            "The closest thing to having a staff engineer sitting next to you, questioning every decision."
          </p>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-neutral-800 mb-4" />
            <p className="font-bold text-sm tracking-tight uppercase text-white">Sarah Chen</p>
            <p className="text-neutral-500 text-xs font-medium">Principal Engineer at Linear</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="container-center">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-black fill-black" />
                </div>
                <span className="font-bold text-sm tracking-tight text-white">CORTEX</span>
              </div>
              <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
                The thinking lab for modern engineers. Practice high-stakes decision making without the high-stakes consequences.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[12px] uppercase tracking-widest mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-white">Scenarios</a></li>
                <li><a href="#" className="hover:text-white">Methodology</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[12px] uppercase tracking-widest mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
            <div className="col-span-2">
              <h4 className="font-bold text-[12px] uppercase tracking-widest mb-6 text-white">Newsletter</h4>
              <div className="flex gap-2">
                <input type="text" placeholder="Your email" className="flex-1 bg-neutral-900 border border-white/5 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-white/20 text-white" />
                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
            <p className="text-[12px] font-medium text-neutral-500">© 2024 Cortex Labs Inc. All rights reserved.</p>
            <div className="flex gap-8 text-[12px] font-medium text-neutral-500">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

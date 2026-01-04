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
      <section className="relative pt-44 pb-40 px-6 overflow-hidden bg-gradient-to-b from-black via-black to-neutral-950">
        <div className="container-center grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Platform for Engineering Excellence
            </div>

            <h1 className="text-5xl md:text-7xl mb-8 font-serif-title leading-[1.05] text-white">
              Think Like a <br />
              <span className="italic">Staff Engineer</span>.
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 max-w-md mb-10 leading-relaxed font-normal">
              Practice high-stakes architectural decisions in a risk-free environment. Build the judgment that defines senior engineering roles.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href={user ? "/dashboard" : "/signup"} className="w-full sm:w-auto bg-white text-black py-3.5 px-8 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2">
                {user ? "Resume Session" : "Start Training"}
                <ArrowRight className="w-4 h-4" />
              </Link>
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
      <section id="features" className="py-32 px-6 bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="container-center">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Built for Real Engineering Challenges.</h2>
            <p className="text-neutral-400 text-lg font-medium leading-relaxed">Every feature is designed to mirror the complexity and pressure of production systems. No toy problems, no shortcuts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Large Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 p-8 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col justify-between min-h-[400px] group overflow-hidden relative"
            >
              <div className="relative z-10">
                <BrainCircuit className="w-10 h-10 mb-6 text-white" />
                <h3 className="text-3xl font-serif mb-4 text-white">Real-World Scenarios</h3>
                <p className="text-neutral-400 max-w-sm font-medium leading-relaxed">
                  Practice with scenarios based on actual production incidents. From cascading failures to consensus algorithms, experience the decisions that define senior engineers.
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
                <h3 className="text-2xl font-serif mb-3">AI-Powered Feedback</h3>
                <p className="text-neutral-600 text-sm font-medium">
                  Get instant, detailed analysis of your architectural decisions. Learn from mistakes in real-time, not in production.
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

      {/* Stats Section */}
      <section className="py-20 px-6 bg-black">
        <div className="container-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Scenarios', value: '150+', desc: 'Real-world challenges' },
              { label: 'Complexity', value: 'L4-L7', desc: 'Engineering levels' },
              { label: 'Feedback', value: 'AI-Powered', desc: 'Instant analysis' },
              { label: 'Progress', value: 'Tracked', desc: 'Quantifiable growth' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-serif mb-2 text-white">{stat.value}</p>
                <p className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">{stat.label}</p>
                <p className="text-xs text-neutral-600">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="container-center">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">How It Works.</h2>
            <p className="text-neutral-400 text-lg font-medium leading-relaxed">
              A structured approach to building architectural expertise, one decision at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Choose Your Challenge',
                desc: 'Select from scenarios across different domains and complexity levels. Each scenario is based on real production systems and challenges.'
              },
              {
                step: '02',
                title: 'Design Your Solution',
                desc: 'Work through the architectural decisions. Consider trade-offs, constraints, and failure modes. Document your reasoning.'
              },
              {
                step: '03',
                title: 'Get Expert Feedback',
                desc: 'Receive detailed AI-powered analysis of your approach. Understand what worked, what didn\'t, and why. Track your progress over time.'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-8xl font-serif text-white/5 absolute -top-8 -left-4 -z-10">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-serif mb-4 text-white">{item.title}</h3>
                  <p className="text-neutral-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Solutions Section */}
      <section id="solutions" className="py-32 px-6 bg-black">
        <div className="container-center">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-serif mb-4 text-white">Beyond Code. Master Architecture.</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Code executes ideas.
              <b> Architecture</b> defines outcomes.
              <i> Cortex </i>develops the thinking behind resilient, scalable systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'System Design Thinking',
                desc: 'Learn to break down complex problems, identify constraints, and design scalable solutions. Practice the thought process that separates senior engineers from junior developers.',
                icon: BrainCircuit
              },
              {
                title: 'Trade-off Analysis',
                desc: 'Master the art of making informed decisions. Understand when to choose consistency over availability, when to denormalize, and how to balance competing priorities.',
                icon: Target
              },
              {
                title: 'Failure Anticipation',
                desc: 'Develop the mindset to predict system failures before they happen. Learn to think through edge cases, cascading failures, and recovery strategies.',
                icon: Cpu
              },
              {
                title: 'Architectural Reasoning',
                desc: 'Build the mental models used by staff+ engineers. Learn to justify your decisions, communicate trade-offs, and defend your architectural choices.',
                icon: Trophy
              },
            ].map((solution, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-white/10 transition-all"
              >
                <solution.icon className="w-10 h-10 mb-6 text-white" />
                <h3 className="text-2xl font-serif mb-3 text-white">{solution.title}</h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed">{solution.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-neutral-500 text-sm font-medium mb-6">
              Practice scenarios across all engineering domains
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Backend', 'Frontend', 'Systems', 'Data', 'DevOps', 'Security'].map((role) => (
                <span key={role} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-neutral-400">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="container-center">
          {/* Testimonial Quote */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-emerald-500 text-2xl md:text-3xl font-medium italic leading-relaxed">
              "The closest thing to having a staff engineer sitting next to you, questioning every decision."
            </h2>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Start Your Journey.</h2>
            <p className="text-neutral-400 text-lg font-medium leading-relaxed">
              Begin with free access to foundational scenarios. Upgrade as you grow to unlock advanced challenges and personalized AI feedback.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="p-10 rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-2">Free Forever</h3>
                    <p className="text-neutral-400 text-sm">Start learning immediately, no credit card required</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-serif text-white">$0</p>
                    <p className="text-neutral-500 text-sm">forever</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {[
                    'Access to core scenarios',
                    'Progress tracking dashboard',
                    'Community discussions',
                    'Weekly challenges',
                    'Skill assessments',
                    'Learning resources'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-neutral-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="flex-1 text-center bg-white text-black py-4 px-8 rounded-full text-sm font-bold hover:bg-neutral-200 transition-all"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 text-center bg-white/5 text-white py-4 px-8 rounded-full text-sm font-bold hover:bg-white/10 transition-all border border-white/10"
                  >
                    Sign In
                  </Link>
                </div>

                <p className="text-center text-xs text-neutral-600 mt-6">
                  Pro features with AI-powered feedback and unlimited scenarios coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-black">
        <div className="container-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-black fill-black" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">CORTEX</span>
            </div>

            <p className="text-sm text-neutral-500 font-medium">
              The thinking lab for modern engineers.
            </p>

            <p className="text-xs text-neutral-600">
              © {new Date().getFullYear()} Cortex. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

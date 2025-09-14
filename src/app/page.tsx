'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'How it works', href: '#how' },
  { label: 'For clinicians', href: '#clinicians' },
];

const features = [
  {
    title: 'Evidence-based guidance',
    desc: 'Rule engine mapped to NICE & WHO recommendations — auditable and versioned.',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Clinician dashboards',
    desc: 'Patient lists, risk trends, and prioritized alerts — all in one place.',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3H21V21H3V3Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 10H17"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 14H13"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Patient-centred',
    desc: 'Clear results, history, and tailored advice for each patient — mobile friendly.',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/60 via-white/30 to-transparent relative">
      <Header />

      {/* Hero */}
      <section className="relative py-10">
        <div className="absolute inset-0 -z-10 opacity-40">
          <Image
            src="/hero-bg.webp"
            alt="Pregnancy care background"
            fill
            className="object-cover filter blur-sm brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Clinical Decision Support for{' '}
                <span className="text-indigo-600">Gestational Diabetes</span>
              </h1>
              <p className="mt-6 text-slate-700 max-w-xl">
                Fast, auditable, and guideline-aligned risk assessments for
                clinicians and patients. Increase early detection and streamline
                referral decisions with an evidence-first workflow.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
                >
                  Get Started
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-slate-200 text-slate-700 bg-white shadow-sm hover:shadow"
                >
                  How it works
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <MetricCard label="Assessments / mo" value="1.2k" />
                <MetricCard label="Clinics onboard" value="38" />
                <MetricCard label="Avg. time (s)" value="4s" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
            >
              <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md">
                {/* assessment input card */}
                <div className="p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-800">
                    Quick risk preview
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Enter a few values and see a guideline-mapped risk preview.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <input
                      className="border px-3 py-2 rounded-md"
                      placeholder="Age"
                    />
                    <input
                      className="border px-3 py-2 rounded-md"
                      placeholder="Weeks"
                    />
                    <input
                      className="border px-3 py-2 rounded-md"
                      placeholder="BMI"
                    />
                    <select className="border px-3 py-2 rounded-md">
                      <option>Diabetic</option>
                      <option>Yes</option>
                    </select>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button className="flex-1 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium">
                      Predict Risk
                    </button>
                    <div className="w-28 h-12 rounded-md bg-white flex items-center justify-center border">
                      <span className="text-sm font-semibold text-emerald-600">
                        Green
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          className="text-2xl font-bold text-slate-900 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Designed to fit clinical workflows
        </motion.h2>

        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {features.map(f => (
            <FeatureCard
              key={f.title}
              title={f.title}
              desc={f.desc}
              icon={f.icon}
            />
          ))}
        </motion.div>
      </section>

      {/* Trust + Dashboard preview */}
      <section id="clinicians" className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold">Clinician Dashboard</h3>
            <p className="mt-3 text-slate-700">
              Prioritise high-risk patients, view trends, and export audit logs
              for governance.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <MiniStat label="High risk" value="24" color="red" />
              <MiniStat label="Moderate" value="112" color="amber" />
              <MiniStat label="Low" value="1240" color="green" />
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard/clinician"
                className="px-4 py-2 rounded-md bg-slate-900 text-white"
              >
                Open demo dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl overflow-hidden border shadow-md">
              {/* svg chart */}
              <div className="p-6 bg-white">
                <svg viewBox="0 0 600 200" className="w-full h-44">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="100%" stopColor="#bfdbfe" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#g1)"
                  />
                  <polyline
                    fill="none"
                    stroke="#1e3a8a"
                    strokeWidth="3"
                    points="0,160 80,110 160,120 240,80 320,95 400,55 480,74 560,40 600,30"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-50 to-white/60 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold">Ready to improve outcomes?</h4>
            <p className="text-slate-700 mt-1">
              Start a trial, run sample assessments and invite your clinic in
              minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/register"
              className="px-5 py-3 rounded-md bg-indigo-600 text-white font-semibold"
            >
              Start free trial
            </Link>
            <Link href="/docs" className="px-5 py-3 rounded-md border">
              Read docs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Header() {

  const router = useRouter()
  return (
    <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold">
          G
        </div>
        <div className="hidden sm:block">
          <div className="font-semibold">GDM CDSS</div>
          <div className="text-xs text-slate-500">
            Evidence-driven maternal care
          </div>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-4">
        {navItems.map(n => (
          <Link
            key={n.href}
            href={n.href}
            className="text-slate-700 hover:text-slate-900"
          >
            {n.label}
          </Link>
        ))}
        <Button variant={"default"} onClick={() => router.push("/login")} className="text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
          Sign in
        </Button>
      </nav>

      <div className="md:hidden">
        <Button variant={"link"} onClick={() => router.push("/login")} className="text-slate-700">
          Sign in
        </Button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/60 border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold">GDM CDSS</div>
          <div className="text-sm text-slate-600 mt-2">
            Built with evidence-first design. Audit logs and RBAC included.
          </div>
        </div>

        <div>
          <div className="font-medium">Resources</div>
          <ul className="mt-2 text-sm text-slate-600 space-y-1">
            <li>
              <Link href="/docs">Documentation</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-medium">Contact</div>
          <div className="text-sm text-slate-600 mt-2">
            support@gdm-cdss.org
          </div>
          <div className="mt-4 flex items-center gap-2 text-slate-600">
            <span className="text-sm">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/80 border border-slate-200 p-3 rounded-md shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-white/80 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-slate-600 mt-1">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'red' | 'green' | 'amber';
}) {
  const colorMap: Record<string, string> = {
    red: 'text-red-600',
    amber: 'text-amber-600',
    green: 'text-emerald-600',
  };
  return (
    <div className="bg-white/80 p-3 rounded-md border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="text-sm text-slate-600">{label}</div>
      <div className={`font-semibold ${colorMap[color]}`}>{value}</div>
    </div>
  );
}

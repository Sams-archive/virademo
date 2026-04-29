import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import {
  TrendingUp, Clock, Scissors, Download,
  Play, MoreHorizontal, Plus, ArrowRight,
  Zap, Star, Loader2
} from 'lucide-react'

function StatusBadge({ status }) {
  const styles = {
    ready: 'bg-accent2/10 text-teal-400 border border-accent2/20',
    processing: 'bg-accent/12 text-violet-300 border border-accent/20',
    failed: 'bg-accent3/10 text-rose-400 border border-accent3/20',
    pending: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  }

  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${styles[status] || styles.pending}`}>
      {status}
    </span>
  )
}

const quickActions = [
  { icon: Plus, label: 'Generate Video', href: '/generate', color: 'bg-accent/15 border-accent/25 text-accent' },
  { icon: ArrowRight, label: 'Import Video', href: '/import', color: 'bg-accent2/10 border-accent2/25 text-accent2' },
  { icon: Scissors, label: 'AI Clips', href: '/clips', color: 'bg-accent3/10 border-accent3/25 text-accent3' },
]

const demoClips = [
  {
    id: 1,
    title: 'Welcome to VIRA Demo Clip',
    project: 'Demo Project',
    duration: 42,
    viral_score: 92,
    status: 'ready',
  },
  {
    id: 2,
    title: 'AI Generated Highlight',
    project: 'Sample Project',
    duration: 30,
    viral_score: 88,
    status: 'processing',
  },
]

export default function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const stats = {
    clips: 2,
    projects: 1,
    exports: 3,
  }

  const clips = demoClips

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getFirstName = () => 'Creator'

  const statCards = [
    { label: 'Clips Created', value: stats.clips, icon: Scissors, change: 'demo' },
    { label: 'Projects', value: stats.projects, icon: Star, change: 'demo' },
    { label: 'Total Exports', value: stats.exports, icon: Download, change: 'demo' },
    { label: 'Hours Saved', value: Math.round(stats.clips * 0.5), icon: Clock, change: 'estimated' },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={24} className="text-accent animate-spin" />
            <p className="text-white/40 text-sm">Loading dashboard…</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl mb-1">
            {getGreeting()}, {getFirstName()} 👋
          </h1>
          <p className="text-white/40 text-sm">
            This is a demo dashboard with sample data.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-8">
          {quickActions.map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              to={href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium no-underline transition-all hover:-translate-y-px ${color}`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, change }) => (
            <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-white/35 uppercase tracking-widest font-medium">
                  {label}
                </p>
                <Icon size={13} className="text-white/20" />
              </div>
              <p className="font-display font-bold text-2xl mb-1">{value}</p>
              <p className="text-[10px] text-white/35">{change}</p>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        <div className="bg-card border border-white/[0.07] rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-sm font-medium">Demo Plan Active</span>
          </div>

          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: '40%' }} />
          </div>

          <p className="text-[10px] text-white/35 mt-1.5">
            Demo usage simulation
          </p>
        </div>

        {/* Clips */}
        <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">

          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="font-display font-bold text-sm">Recent Clips (Demo)</h2>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {clips.map((clip) => (
              <div key={clip.id} className="flex items-center gap-4 px-5 py-3.5">

                <div className="w-10 h-10 rounded-lg bg-off-black border border-white/[0.06] flex items-center justify-center">
                  🎬
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{clip.title}</p>
                  <p className="text-xs text-white/35">
                    {clip.project} · {clip.duration}s
                  </p>
                </div>

                {clip.viral_score && (
                  <div className="flex items-center gap-1 text-accent2 text-xs">
                    <TrendingUp size={11} />
                    {clip.viral_score}%
                  </div>
                )}

                <StatusBadge status={clip.status} />

                <div className="flex items-center gap-2 ml-2">
                  {clip.status === 'ready' && (
                    <button className="text-white/50 hover:text-white">
                      <Play size={12} />
                    </button>
                  )}
                  <button className="text-white/50 hover:text-white">
                    <MoreHorizontal size={12} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
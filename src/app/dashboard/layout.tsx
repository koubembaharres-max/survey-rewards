'use client'

import { LayoutDashboard, FileText, MessageSquare, Users, PieChart, Settings, LogOut, Rocket, Zap } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-[#F7F9FC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#003D35] text-white flex flex-col justify-between hidden md:flex">
        <div>
          {/* LOGO */}
          <div className="p-6 flex items-center gap-3">
            <div className="flex items-end gap-1 h-6">
              <div className="w-2 h-3 bg-[#009B68] rounded-sm"></div>
              <div className="w-2 h-5 bg-[#009B68] rounded-sm"></div>
              <div className="w-2 h-4 bg-[#009B68] rounded-sm"></div>
            </div>
            <span className="text-xl font-bold">Pulse<span className="text-[#009B68]">Survey</span></span>
          </div>

          {/* NAVIGATION */}
          <nav className="mt-6 flex flex-col gap-2 px-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#009B68] rounded-lg font-medium transition">
              <LayoutDashboard size={20} /> Tableau de bord
            </Link>
            <Link href="/mission" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
              <Zap size={20} /> Mission
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
              <MessageSquare size={20} /> Réponses
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
              <Users size={20} /> Audience
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
              <PieChart size={20} /> Analyses
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
              <Users size={20} /> Équipe
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
              <Settings size={20} /> Paramètres
            </Link>
          </nav>
        </div>

        {/* PROFIL BAS DE PAGE */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DDF7EC] flex items-center justify-center text-[#003D35] font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-medium">Jean Dupont</p>
              <p className="text-xs text-gray-400">Administrateur</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
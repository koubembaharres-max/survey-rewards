'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Search, Bell, Plus, Users, CheckCircle, Rocket, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const dataChart = [
  { name: 'Lun', reponses: 1200 },
  { name: 'Mar', reponses: 1900 },
  { name: 'Mer', reponses: 1500 },
  { name: 'Jeu', reponses: 2400 },
  { name: 'Ven', reponses: 2100 },
  { name: 'Sam', reponses: 3200 },
  { name: 'Dim', reponses: 2800 },
]

const dataPie = [
  { name: 'Web', value: 64, color: '#009B68' },
  { name: 'Mobile', value: 28, color: '#DDF7EC' },
  { name: 'Email', value: 8, color: '#64748B' },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data: wallet } = await supabase.from('wallet_balances').select('available_cents').eq('user_id', session.user.id).single()
      if (wallet) setBalance(wallet.available_cents)

      const { data: convs } = await supabase.from('conversions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
      if (convs) setHistory(convs)
      
      setLoading(false)
    }
    loadData()
  }, [router])

  if (loading) return <div className="p-10 text-center text-[#64748B]">Chargement de vos données...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Rechercher une enquête..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B68]" />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#003D35] text-white flex items-center justify-center font-bold text-sm">JD</div>
        </div>
      </header>

      {/* TITRE ET BOUTON */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#172033]">Vue d'ensemble</h1>
          <p className="text-[#64748B] mt-1">Vos insights, en un seul endroit.</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 outline-none">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
          </select>
          <button className="bg-[#009B68] text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#008a5d] transition">
            <Plus size={18} /> Nouvelle enquête
          </button>
        </div>
      </div>

      {/* CARTES STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Réponses', val: '8 492', evo: '+12,8%', icon: Users, color: 'text-green-600' },
          { title: 'Taux de complétion', val: '84,2%', evo: '+4,1%', icon: CheckCircle, color: 'text-green-600' },
          { title: 'Enquêtes actives', val: '18', evo: '+2', icon: Rocket, color: 'text-purple-600' },
          { title: 'Solde disponible', val: `${(balance / 100).toFixed(2)} $`, evo: 'Retrait > 5$', icon: Clock, color: 'text-blue-600' } // J'ai remplacé le temps moyen par ton solde réel !
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-gray-50 ${card.color}`}><card.icon size={20} /></div>
              <span className="text-xs font-semibold text-[#009B68] bg-[#DDF7EC] px-2 py-1 rounded">{card.evo}</span>
            </div>
            <div>
              <p className="text-[#64748B] text-sm mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-[#172033]">{card.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique Linéaire */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-[#172033] mb-6">Participation au fil du temps</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataChart}>
                <defs>
                  <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009B68" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#009B68" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{stroke: '#009B68', strokeWidth: 1, strokeDasharray: '3 3'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="reponses" stroke="#009B68" strokeWidth={3} fillOpacity={1} fill="url(#colorRep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique Donut */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-[#172033] mb-6">Canal de réponse</h3>
          <div className="flex-1 relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dataPie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {dataPie.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-[#172033]">8 492</span>
              <span className="text-xs text-[#64748B]">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs font-medium">
            {dataPie.map((d, i) => (
              <div key={i} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>{d.name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* HISTORIQUE DES MISSIONS (Ton argent réel) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-[#172033]">Vos dernières enquêtes</h3>
          <a href="#" className="text-sm font-medium text-[#009B68] hover:underline">Voir toutes</a>
        </div>
        
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Vous n'avez pas encore complété d'enquête.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#64748B] text-sm">
                <th className="p-4 font-medium">Enquête (Réseau)</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Gain</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-[#172033] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#DDF7EC] flex items-center justify-center text-[#009B68] font-bold text-xs uppercase">
                      {item.network.substring(0, 2)}
                    </div>
                    {item.network.toUpperCase()}
                  </td>
                  <td className="p-4 text-[#64748B] text-sm">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'credited' ? 'bg-[#DDF7EC] text-[#009B68]' : 'bg-red-100 text-red-700'}`}>
                      {item.status === 'credited' ? 'Active' : 'Terminée'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-[#009B68]">
                    + {(item.user_cents / 100).toFixed(2)} $
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

// 👇 REMPLACE PAR TON VRAI APP ID TIMEWALL
const TIMEWALL_APP_ID = 'TON_APP_ID_ICI' 

export default function MissionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeMission, setActiveMission] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      setLoading(false)
    }
    checkUser()
  }, [router])

  if (loading) return <div className="p-10 text-center">Chargement...</div>

  // On construit l'URL magique de Timewall avec TON App ID et L'ID de l'utilisateur
  const iframeUrl = `https://timewall.io/users/v1/login?app_id=${c7332e7c5c02283a}&user_id=${user?.id}`

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#172033]">Missions disponibles</h1>
            <p className="text-[#64748B] mt-1">Complétez des enquêtes et gagnez de l'argent réel.</p>
          </div>
        </div>

        {/* Si on a cliqué sur Commencer, on affiche l'iframe Timewall */}
        {activeMission ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 h-[800px] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-medium text-gray-700">Mur d'enquêtes Timewall</p>
              </div>
              <button 
                onClick={() => setActiveMission(false)} 
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Fermer
              </button>
            </div>
            {/* L'IFRAME REEL DE TIMEWALL */}
            <iframe 
              src={iframeUrl} 
              className="w-full flex-1 rounded-b-xl border-none"
              title="Timewall Surveys"
            />
          </div>
        ) : (
          /* Sinon, on affiche la carte pour entrer */
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto mt-10">
            <div className="w-20 h-20 bg-[#DDF7EC] text-[#009B68] rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#172033] mb-2">Prêt à gagner de l'argent ?</h2>
            <p className="text-[#64748B] mb-8">
              Cliquez ci-dessous pour ouvrir le mur d'enquêtes sécurisé de notre partenaire Timewall.
            </p>
            <button 
              onClick={() => setActiveMission(true)}
              className="bg-[#009B68] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto hover:bg-[#008a5d] transition shadow-lg shadow-green-200"
            >
              <Play size={20} /> Accéder aux enquêtes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
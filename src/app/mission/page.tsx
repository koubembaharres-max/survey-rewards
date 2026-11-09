'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Star, Zap } from 'lucide-react'

export default function MissionsPage() {
  // Cet état nous permet d'afficher ou non le faux iframe
  const [activeMission, setActiveMission] = useState<string | null>(null)

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

        {/* Si une mission est active, on affiche l'iframe */}
        {activeMission ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 h-[750px] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-medium text-gray-700">Enquête en cours...</p>
              </div>
              <button 
                onClick={() => setActiveMission(null)} 
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Annuler la mission
              </button>
            </div>
            
            {/* C'est ICI que le vrai iframe du partenaire ira plus tard */}
            <div className="flex-1 bg-gray-50 rounded-xl m-2 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
              <Zap size={48} className="mb-4 text-gray-300" />
              <p className="text-center text-lg font-medium text-gray-500">
                Espace réservé pour l'enquête
              </p>
              <p className="text-sm mt-2 max-w-sm text-center">
                (Dans la version finale, l'interface de BitLabs ou Timewall s'affichera ici. Le postback nous préviendra une fois l'enquête terminée).
              </p>
            </div>
          </div>
        ) : (
          /* Sinon, on affiche la grille des missions */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Mission 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#009B68] bg-[#DDF7EC] px-2 py-1 rounded flex items-center gap-1">
                    <Star size={12} /> Recommandée
                  </span>
                  <span className="text-sm font-bold text-[#64748B]">5 min</span>
                </div>
                <h3 className="text-lg font-bold text-[#172033] mt-4">Sondage sur les habitudes d'achat</h3>
                <p className="text-sm text-gray-500 mt-2">Donnez votre avis sur les marques de grande consommation.</p>
              </div>
              <div className="flex justify-between items-center mt-6 border-t border-gray-100 pt-4">
                <span className="text-2xl font-bold text-[#009B68]">1.50 $</span>
                <button 
                  onClick={() => setActiveMission('achat')}
                  className="bg-[#003D35] text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#009B68] transition"
                >
                  <Play size={16} /> Commencer
                </button>
              </div>
            </div>

            {/* Mission 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Nouveau</span>
                  <span className="text-sm font-bold text-[#64748B]">10 min</span>
                </div>
                <h3 className="text-lg font-bold text-[#172033] mt-4">Étude sur les jeux mobiles</h3>
                <p className="text-sm text-gray-500 mt-2">Testez un nouveau jeu et répondez à un questionnaire UX.</p>
              </div>
              <div className="flex justify-between items-center mt-6 border-t border-gray-100 pt-4">
                <span className="text-2xl font-bold text-[#009B68]">2.20 $</span>
                <button 
                  onClick={() => setActiveMission('jeux')}
                  className="bg-[#003D35] text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#009B68] transition"
                >
                  <Play size={16} /> Commencer
                </button>
              </div>
            </div>

            {/* Mission 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">Rapide</span>
                  <span className="text-sm font-bold text-[#64748B]">2 min</span>
                </div>
                <h3 className="text-lg font-bold text-[#172033] mt-4">Avis sur les services bancaires</h3>
                <p className="text-sm text-gray-500 mt-2">Une courte enquête sur votre banque actuelle.</p>
              </div>
              <div className="flex justify-between items-center mt-6 border-t border-gray-100 pt-4">
                <span className="text-2xl font-bold text-[#009B68]">0.80 $</span>
                <button 
                  onClick={() => setActiveMission('banque')}
                  className="bg-[#003D35] text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#009B68] transition"
                >
                  <Play size={16} /> Commencer
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
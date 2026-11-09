import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-24 text-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">Survey Rewards</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        Répondez à des enquêtes, partagez votre opinion et gagnez de l'argent réel.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Se connecter / S'inscrire
        </Link>
      </div>
    </main>
  )
}
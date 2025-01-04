import Game from '../components/Game'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl mb-4">Ping Pong Game</h1>
        <Game />
      </div>
    </main>
  )
}

import TodoBoard from '@/components/TodoBoard'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div 
          className="text-center mb-8 bg-cover bg-center bg-no-repeat rounded-xl py-16 px-8 relative"
          style={{
            backgroundImage: 'url(/header.jpg)',
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/header.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Family Action Board</h1>
            <p className="text-white text-lg drop-shadow-md">Hawthorne&apos;s shared workspace</p>
          </div>
        </div>
        <TodoBoard />
      </div>
    </div>
  )
}

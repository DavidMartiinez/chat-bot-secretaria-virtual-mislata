import ChatMislata from './components/ChatMislata'

function App() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      {}
      <h1 className="text-4xl font-bold text-gray-800">Web del CIPFP Mislata</h1>
      <p className="text-gray-600 mt-4 text-center max-w-md">
        Bienvenido al portal del centro. El chatbot de secretaría está abajo a la derecha listo para ayudarte.
      </p>
      
      {}
      <ChatMislata />
    </div>
  )
}

export default App
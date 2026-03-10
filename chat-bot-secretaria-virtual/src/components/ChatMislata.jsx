import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X } from 'lucide-react';

const ChatMislata = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy la secretaria virtual del CIPFP Mislata. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    
    const currentText = input; 
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://a678lvtjr1.execute-api.us-east-1.amazonaws.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: currentText,      
          sessionId: "test1"      
        }), 
      });

      if (!response.ok) throw new Error('Error en el servidor');
      const data = await response.json();
      
      let botReply = "Lo siento, no he podido procesar esa consulta.";
      if (data.reply) {
        botReply = data.reply;
      } else if (data.text) {
        botReply = data.text;
      } else if (data.body) {
        const bodyContent = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
        botReply = bodyContent.reply || bodyContent.text || botReply;
      }

      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Vaya, hay un problema de conexión. Inténtalo de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans flex flex-col items-end">
      {/* Ventana del Chat */}
      {isOpen && (
        <div className="bg-white 
          w-[calc(100vw-2rem)] sm:w-[380px] 
          h-[75vh] sm:h-[550px] 
          max-h-[600px]
          mb-4 rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Cabecera */}
          <div className="bg-red-700 p-4 text-white flex justify-between items-center shadow-lg shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-red-700 font-black shadow-inner">
                M
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">CIPFP Mislata</h3>
                <p className="text-[10px] text-red-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Secretaría Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-red-600 p-2 rounded-full transition-colors focus:outline-none"
            >
              <X size={20}/>
            </button>
          </div>

          {/* Área del Chat */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm shadow-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-red-600 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl text-xs text-gray-400 flex gap-1 items-center shadow-sm">
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Pie / Input */}
          <div className="p-4 bg-white border-t shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-red-500/50 focus-within:bg-white transition-all shadow-inner">
              <input 
                className="bg-transparent flex-1 outline-none text-base sm:text-sm text-gray-700 placeholder:text-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu consulta..."
              />
              <button 
                onClick={sendMessage} 
                className="text-red-700 hover:scale-125 transition-transform disabled:opacity-30"
                disabled={!input.trim()}
              >
                <Send size={18} fill="currentColor" />
              </button>
            </div>
            <p className="text-[9px] font-bold text-center mt-3 opacity-30 uppercase tracking-tighter">IABD Proyecto</p>
          </div>
        </div>
      )}

      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-700 hover:bg-red-800 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && <span className="hidden sm:inline font-semibold ml-2 pr-1 text-sm">Secretaría Virtual</span>}
      </button>
    </div>
  );
};

export default ChatMislata;
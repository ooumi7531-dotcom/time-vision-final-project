import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const predefinedResponses: Record<string, string> = {
  'horaires': "Nous sommes ouverts du lundi au vendredi de 9h à 18h. Notre service client est toujours prêt à vous aider !",
  'livraison': "La livraison est gratuite pour toute commande supérieure à 500 MAD. Livraison standard 3-5 jours ouvrés, express 1-2 jours.",
  'retour': "Vous avez 30 jours pour retourner vos articles non utilisés dans leur emballage d'origine. Les retours sont gratuits !",
  'paiement': "Nous acceptons les cartes bancaires principales, PayPal et Apple Pay. Toutes les transactions sont sécurisées.",
  'garantie': "Tous nos produits sont garantis par le fabricant. Les montres ont une garantie de 1 an et les lunettes de soleil de 6 mois.",
  'taille': "Consultez le guide des tailles sur chaque page produit. Si vous hésitez, notre assistant peut vous aider à choisir !",
  'suivi': "Vous pouvez suivre votre commande avec le numéro de suivi envoyé par email. Besoin d'aide ? Contactez notre support.",
  'promo': "Inscrivez-vous à notre newsletter pour obtenir 10% de réduction sur votre première commande !",
  'produits': "Nous proposons des montres et des lunettes de soleil de marques prestigieuses, parfaites pour tous les styles !",
  'qualité': "Tous nos articles sont de haute qualité et testés pour garantir durabilité et style.",
};

function getBotResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (message.includes(key)) return response;
  }

  if (message.includes('bonjour') || message.includes('salut') || message.includes('coucou')) {
    return "Bonjour ! Bienvenue chez DALY. Je suis votre assistant. Comment puis-je vous aider ?";
  }

  if (message.includes('aide')) {
    return "Je peux vous renseigner sur les produits, la livraison, les retours, les promotions, et plus encore. Que souhaitez-vous savoir ?";
  }

  if (message.includes('merci')) {
    return "Avec plaisir ! Puis-je vous aider pour autre chose ?";
  }

  return "Je suis là pour répondre à vos questions sur nos montres et lunettes de soleil, livraison, retours, paiement, garantie et promotions. Que voulez-vous savoir ?";
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Bonjour ! Je suis l'assistant DALY. Posez-moi vos questions sur nos montres et lunettes de soleil.", sender: 'bot', timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: getBotResponse(inputText), sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => setIsListening(!isListening);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-2xl flex flex-col h-96 border border-slate-700 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col justify-end">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {message.sender === 'bot' ? (
                  <div className="flex gap-2 items-end">
                    <div className="flex gap-1 items-end h-6">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-full animate-pulse"
                          style={{ height: `${12 + i * 8}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <div className="bg-slate-700 text-white rounded-2xl px-4 py-2 max-w-xs text-sm leading-relaxed">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-600 text-white rounded-2xl px-4 py-2 max-w-xs text-sm leading-relaxed">
                    {message.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-700 p-4 bg-slate-800">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition ${isListening ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:bg-slate-700 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['horaires', 'livraison', 'retour', 'paiement', 'garantie', 'taille', 'suivi', 'promo', 'produits'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInputText(topic)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-full transition"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X />
          </button>
        </div>
      </div>
    </>
  );
}




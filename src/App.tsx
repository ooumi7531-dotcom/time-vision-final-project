import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LoginButton from './components/LoginButton';
import LoginSuccessAnimation from './components/LoginSuccessAnimation';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import VideoSection from './components/VideoSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import PrivacyModal from './components/PrivacyModal';
import Chatbot from './components/Chatbot';
import ThemeToggle from './components/ThemeToggle';

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: 'montre' | 'lunette';
  rating: number;
  isNew?: boolean;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacyModalType, setPrivacyModalType] = useState<'privacy' | 'terms'>('privacy');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('daly-theme');
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        const newUser = session?.user ?? null;
        if (newUser && !user) {
          setShowAnimation(true);
          setAnimationComplete(false);
        }
        setUser(newUser);
        setLoading(false);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('daly-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('daly-theme', 'light');
    }
  }, [theme]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
      }
    });
  };

  const updateCartItem = (id: number, quantity: number) => {
    if (quantity === 0) removeFromCart(id);
    else setCartItems(prevItems => prevItems.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id: number) => setCartItems(prevItems => prevItems.filter(item => item.id !== id));

  const handleCheckout = () => setIsPaymentModalOpen(true);

  const handlePaymentComplete = () => {
    setCartItems([]);
    setIsPaymentModalOpen(false);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const cleanPrice = item.price.replace(/\s*DH\s*/g, '').replace(/,/g, '');
    return sum + parseFloat(cleanPrice) * item.quantity;
  }, 0);

  const openPrivacyModal = (type: 'privacy' | 'terms') => {
    setPrivacyModalType(type);
    setIsPrivacyModalOpen(true);
  };

  useEffect(() => {
    const handleFooterClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.textContent === 'Politique de Confidentialité') {
        e.preventDefault();
        openPrivacyModal('privacy');
      } else if (target.textContent === 'Conditions d\'Utilisation') {
        e.preventDefault();
        openPrivacyModal('terms');
      }
    };
    document.addEventListener('click', handleFooterClick);
    return () => document.removeEventListener('click', handleFooterClick);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-obsidian">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginButton />;
  }

  if (showAnimation && !animationComplete) {
    return (
      <LoginSuccessAnimation
        onComplete={() => {
          setShowAnimation(false);
          setAnimationComplete(true);
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen relative bg-white dark:bg-luxury-obsidian text-black dark:text-white`}
    >
      <Navbar user={user} />

      <Header
        cartItems={cartItems}
        updateCartItem={updateCartItem}
        removeFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />

      <main>
        <Hero />
        <ProductShowcase onAddToCart={addToCart} />
        <VideoSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        type={privacyModalType}
      />

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 via-accent-500 to-secondary-500 shadow-lg shadow-primary-500/50 flex items-center justify-center animate-float-glow z-50 hover:scale-110 active:scale-95 transition-transform duration-300"
      >
        <span className="text-white font-bold text-xl">💬</span>
      </button>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </motion.div>
  );
}

export default App;


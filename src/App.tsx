import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacyModalType, setPrivacyModalType] = useState<'privacy' | 'terms'>('privacy');
  const [isChatOpen, setIsChatOpen] = useState(false); // <-- Added for chatbot toggle

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
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }];
      }
    });
  };

  const updateCartItem = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    setCartItems([]);
    setIsPaymentModalOpen(false);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const cleanPrice = item.price
      .replace(/\s*DH\s*/g, '') 
      .replace(/,/g, '');         
    const price = parseFloat(cleanPrice);
    return sum + (price * item.quantity);
  }, 0);

  const openPrivacyModal = (type: 'privacy' | 'terms') => {
    setPrivacyModalType(type);
    setIsPrivacyModalOpen(true);
  };

  React.useEffect(() => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-luxury-obsidian relative"
    >
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

      {/* ---- Normal Floating Chatbot Button ---- */}
<button
  onClick={() => setIsChatOpen(true)}
  className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 via-accent-500 to-secondary-500 shadow-lg shadow-primary-500/50 flex items-center justify-center animate-float-glow z-50 hover:scale-110 active:scale-95 transition-transform duration-300"
>
  <span className="text-white font-bold text-xl">💬</span>
</button>


      {/* Chatbot Component */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.div>
  );
}

export default App;

import './globals.css';
import { CartProvider } from '../lib/cart';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import Footer from '../components/Footer';

export const metadata = {
  title: 'VividPress — Print. Press. Impress.',
  description: 'Order apparel and get it branded — polos, tees, caps and trousers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800;900&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&family=Bebas+Neue&family=Pacifico&family=Roboto+Slab:wght@700&family=Oswald:wght@600&family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {children}
          <FloatingWhatsApp />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

import './globals.css';
import { CartProvider } from '../lib/cart';

export const metadata = {
  title: 'VividPress — Branded Apparel & Print',
  description: 'Order apparel and get it branded — polos, tees, caps and trousers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

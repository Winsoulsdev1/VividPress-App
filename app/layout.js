import './globals.css';
import { CartProvider } from '../lib/cart';

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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

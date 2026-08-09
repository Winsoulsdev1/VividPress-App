'use client';

export default function FloatingWhatsApp() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  const message = encodeURIComponent('Hi VividPress, I have a question.');

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 100,
        width: 58, height: 58, borderRadius: '50%', background: '#25D366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 24px rgba(37,211,102,0.45)', textDecoration: 'none',
      }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.702 4.609 1.916 6.475L4 29l7.719-1.876A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3zm6.929 17.07c-.297.836-1.474 1.53-2.415 1.73-.642.137-1.48.246-4.302-.923-3.61-1.494-5.93-5.16-6.111-5.4-.18-.24-1.47-1.955-1.47-3.73 0-1.774.93-2.646 1.259-3.008.33-.362.72-.452.96-.452.24 0 .48.002.69.013.221.011.518-.084.81.618.297.72 1.01 2.494 1.1 2.674.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.378.469-.54.63-.18.18-.368.375-.158.735.21.36.933 1.539 2.003 2.494 1.376 1.228 2.535 1.608 2.895 1.79.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.867-.207 1.703z" />
      </svg>
    </a>
  );
}

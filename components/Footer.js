import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-8 px-6 text-sm text-gray-500">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-gray-800 underline">
            About
          </Link>
          <Link href="/terms" className="hover:text-gray-800 underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-gray-800 underline">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-gray-800 underline">
            Refund Policy
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} VividPress. All rights reserved.</p>
      </div>
    </footer>
  );
}

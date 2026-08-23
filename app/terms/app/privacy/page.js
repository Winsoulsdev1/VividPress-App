export const metadata = {
  title: "Privacy Policy | VividPress",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>

      <p className="mb-6">
        This Privacy Policy explains how VividPress ("we", "us", "our")
        collects, uses, and protects your information when you use
        shopvividpress.vercel.app (the "Site") and place an order with us.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
      <p className="mb-6">
        When you place an order, browse products, submit a review, or contact
        us, we may collect: your name, email address, phone number, delivery
        address, order and branding details (including any images, fonts, or
        colors you upload for customization), and payment confirmation details
        from Paystack. We do not store your card or bank details ourselves —
        payments are handled directly and securely by Paystack.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
      <p className="mb-6">
        We use your information to process and fulfill your order, provide
        order tracking updates, respond to inquiries, display approved
        customer reviews, and improve our products and service. We do not
        sell your personal information to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Who We Share Information With</h2>
      <p className="mb-6">
        We may share necessary order details (such as your branding files,
        sizing, and delivery information) with our printing and production
        partners solely to fulfill your order. Payment information is
        processed by Paystack, and order and account data is securely stored
        with Supabase, our database provider. We only share what's needed for
        these services to work.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Data Storage & Security</h2>
      <p className="mb-6">
        Your data is stored securely with industry-standard protections. Order
        prices are verified server-side, uploaded images pass through a
        validated secure upload process, and our admin access is protected by
        signed session tokens. While we take reasonable steps to protect your
        information, no online system can be guaranteed 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Cookies & Tracking</h2>
      <p className="mb-6">
        We do not currently use analytics or advertising tracking tools on
        this Site. Basic technical cookies may be used to keep your cart and
        checkout session working properly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Your Rights</h2>
      <p className="mb-6">
        You may request access to, correction of, or deletion of your personal
        information by contacting us using the details below. We will respond
        to reasonable requests within a reasonable timeframe.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Changes to This Policy</h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time. Continued use of
        the Site after changes are posted means you accept the updated
        Policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">8. Contact Us</h2>
      <p className="mb-6">
        Questions about this Privacy Policy? Reach us at{" "}
        <a
          href="mailto:VividPress.ng@gmail.com"
          className="text-blue-600 underline"
        >
          VividPress.ng@gmail.com
        </a>
        .
      </p>
    </main>
  );
          }

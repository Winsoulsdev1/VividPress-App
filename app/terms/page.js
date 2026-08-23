export const metadata = {
  title: "Terms of Service | VividPress",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>

      <p className="mb-6">
        Welcome to VividPress. These Terms of Service ("Terms") govern your use
        of shopvividpress.vercel.app (the "Site") and any orders placed with
        VividPress ("we", "us", "our"). By placing an order or using the Site,
        you agree to these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Orders & Customization</h2>
      <p className="mb-6">
        VividPress produces branded apparel (polos, tees, caps, trousers, and
        similar items) with custom printing or embroidery based on details you
        provide at checkout, including uploaded images, fonts, ink colors, and
        notes. It is your responsibility to ensure that any logo, image, or
        text you submit is accurate, is yours to use, and does not infringe on
        anyone else's rights. We reserve the right to refuse an order if
        submitted content is unlawful, infringing, or inappropriate.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Payment</h2>
      <p className="mb-6">
        Payments are processed securely through Paystack. Prices shown at
        checkout are verified and confirmed by our systems before your order
        is accepted. All prices are listed in Nigerian Naira (₦) unless
        otherwise stated.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Refunds & Exchanges</h2>
      <p className="mb-6">
        Because every item is custom-made to your specifications, we do not
        offer refunds or exchanges for change of mind, incorrect sizing
        selected at checkout, or design preferences after production has
        started. Refunds or replacements will be provided if: (a) we made an
        error in fulfilling your order that does not match what you
        submitted, or (b) the item arrives damaged or defective. Please
        contact us within 48 hours of delivery with photos of the issue so we
        can resolve it quickly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Order Tracking & Delivery</h2>
      <p className="mb-6">
        Once your order is placed, you'll receive a tracking code to follow
        its status on our Site. Delivery times may vary depending on order
        volume and customization complexity. We'll notify you by email as your
        order status updates.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Reviews</h2>
      <p className="mb-6">
        Customers may submit reviews on our Site. Submitted reviews are
        subject to approval before being published and may be removed at our
        discretion if they contain false, abusive, or inappropriate content.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Limitation of Liability</h2>
      <p className="mb-6">
        VividPress is not liable for indirect, incidental, or consequential
        damages arising from the use of our products or Site, to the fullest
        extent permitted by law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Changes to These Terms</h2>
      <p className="mb-6">
        We may update these Terms from time to time. Continued use of the Site
        after changes are posted means you accept the updated Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">8. Contact Us</h2>
      <p className="mb-6">
        Questions about these Terms or an order? Reach us at{" "}
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

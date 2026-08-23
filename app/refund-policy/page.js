export const metadata = {
  title: "Refund Policy | VividPress",
};

export default function RefundPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>

      <p className="mb-6">
        This Refund Policy explains when refunds, replacements, or exchanges
        are available for orders placed with VividPress ("we", "us", "our")
        through shopvividpress.vercel.app.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Custom-Made Items</h2>
      <p className="mb-6">
        Every item we produce is custom-made to your specifications — your
        chosen design, font, ink color, and sizing. Because of this, we are
        unable to offer refunds or exchanges for change of mind, incorrect
        sizing selected at checkout, or design preferences realized after
        production has started.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. When You Qualify for a Refund or Replacement</h2>
      <p className="mb-6">
        We will provide a replacement or refund if:
      </p>
      <p className="mb-6">
        (a) We made an error in producing your order that does not match the
        specifications you submitted at checkout (wrong design, font, color,
        or item); or
      </p>
      <p className="mb-6">
        (b) Your item arrives damaged or defective.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. How to Request a Refund</h2>
      <p className="mb-6">
        Contact us within 48 hours of delivery at{" "}
        <a
          href="mailto:VividPress.ng@gmail.com"
          className="text-blue-600 underline"
        >
          VividPress.ng@gmail.com
        </a>{" "}
        with your order tracking code and clear photos showing the issue.
        We'll review your request and respond with next steps.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Refund Processing</h2>
      <p className="mb-6">
        Approved refunds are processed back to your original payment method
        through Paystack. Processing times may vary depending on your bank or
        payment provider, typically within 5–10 business days after approval.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Order Cancellations</h2>
      <p className="mb-6">
        If you need to cancel an order, contact us as soon as possible. If
        production has not yet started, we will cancel and refund your order
        in full. Once production has begun, the order can no longer be
        cancelled or refunded except as described in Section 2.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Contact Us</h2>
      <p className="mb-6">
        Questions about this Refund Policy or an existing order? Reach us at{" "}
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

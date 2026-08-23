export const metadata = {
  title: "About Us | VividPress",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">About VividPress</h1>

      <p className="mb-6">
        VividPress is a custom branded apparel and printing business. We help
        individuals, teams, schools, churches, and organizations turn their
        ideas into high-quality printed and embroidered apparel — polos,
        t-shirts, caps, trousers, and more.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">What We Do</h2>
      <p className="mb-6">
        We work with trusted printing and production partners to deliver
        custom branding on apparel, based on the exact specifications you
        provide — your logo or image, your choice of font, your ink color,
        and any special instructions. Every order is made to your
        specifications, so you get a result tailored to you.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">How It Works</h2>
      <p className="mb-6">
        Browse our catalog, choose your item, and customize it at checkout by
        uploading your design, picking a font and ink color, and adding any
        notes. Once your order is placed and payment is confirmed, we get to
        work producing it. You'll receive a tracking code so you can follow
        your order's progress from start to delivery.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Why VividPress</h2>
      <p className="mb-6">
        We focus on making custom branding simple, transparent, and reliable —
        clear pricing, secure checkout, real order tracking, and responsive
        support if you have questions along the way.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Get in Touch</h2>
      <p className="mb-6">
        Have a question before ordering, or need a custom quote for a bulk or
        team order? Reach us at{" "}
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

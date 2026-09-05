import { getPrisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

const staticFaqs = [
  {
    q: "What payment methods do you accept?",
    a: "We accept all major cards, UPI, netbanking, and wallets through Razorpay's secure checkout.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders are delivered within 3-7 business days, depending on your location.",
  },
  {
    q: "Can I return a product?",
    a: "Yes — see our Shipping & Returns page for the full return window and process.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track Order page with your order number and the email or phone you used at checkout.",
  },
  {
    q: "Is my payment information safe?",
    a: "Yes. Payments are processed entirely by Razorpay — we never see or store your card details.",
  },
];

export default async function FaqPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
  const threshold = settings?.freeShippingThreshold;

  const faqs = threshold
    ? [
        {
          q: "Do you offer free shipping?",
          a: `Yes — orders over ${formatPrice(threshold)} ship free.`,
        },
        ...staticFaqs,
      ]
    : staticFaqs;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Frequently Asked Questions
      </h1>
      <div className="mt-8 flex flex-col gap-2">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <summary className="cursor-pointer font-medium text-foreground">
              {faq.q}
            </summary>
            <p className="mt-2 text-sm text-muted">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

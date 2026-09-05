import { getPrisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import PolicyLayout from "@/components/PolicyLayout";

export default async function ShippingReturnsPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "KMT Digital";
  const threshold = settings?.freeShippingThreshold;
  const fee = settings?.standardShippingFee ?? 0;

  return (
    <PolicyLayout
      title="Shipping & Returns"
      updatedNote="This is a standard starting policy — review and customize it with your actual courier partner and return window before relying on it."
    >
      <h2>Shipping</h2>
      <p>
        We ship across India. Orders are typically delivered within 3-7
        business days, depending on your location.
      </p>
      <p>
        {threshold
          ? `Orders over ${formatPrice(threshold)} ship free. Orders below that are charged a flat shipping fee of ${formatPrice(fee)}.`
          : fee > 0
            ? `A flat shipping fee of ${formatPrice(fee)} applies to all orders.`
            : "Shipping is currently free on all orders."}
      </p>

      <h2>Returns</h2>
      <p>
        If you&apos;re not satisfied with your purchase, you may request a
        return within 7 days of delivery. To be eligible, the item must be
        unused, in its original packaging, and accompanied by proof of
        purchase (your order number).
      </p>
      <p>
        To start a return, contact us via the{" "}
        <a href="/contact" className="text-accent hover:underline">
          Contact page
        </a>{" "}
        with your order number and the reason for the return.
      </p>

      <h2>Refunds</h2>
      <p>
        Once we receive and inspect the returned item, we&apos;ll process
        your refund to the original payment method within 5-7 business days.
        You&apos;ll receive an email confirmation once the refund is issued
        (via Razorpay).
      </p>

      <h2>Non-Returnable Items</h2>
      <p>
        For hygiene and safety reasons, certain items (such as earbuds and
        in-ear audio products) may not be eligible for return once opened,
        unless defective.
      </p>

      <h2>Damaged or Incorrect Items</h2>
      <p>
        If you receive a damaged or incorrect item, contact {siteName} within
        48 hours of delivery and we&apos;ll arrange a replacement or refund
        at no extra cost to you.
      </p>
    </PolicyLayout>
  );
}

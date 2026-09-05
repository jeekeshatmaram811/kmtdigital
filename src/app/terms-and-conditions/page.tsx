import { getPrisma } from "@/lib/db";
import PolicyLayout from "@/components/PolicyLayout";

export default async function TermsPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "KMT Digital";

  return (
    <PolicyLayout
      title="Terms & Conditions"
      updatedNote="This is a standard starting policy — review and customize it with your actual business details before relying on it."
    >
      <p>
        By using {siteName} and placing an order, you agree to the following
        terms.
      </p>

      <h2>Products &amp; Pricing</h2>
      <p>
        All prices are listed in Indian Rupees (INR) and are subject to
        change without notice. We make reasonable efforts to ensure product
        descriptions and images are accurate, but we do not warrant that they
        are error-free.
      </p>

      <h2>Order Acceptance</h2>
      <p>
        Placing an order is an offer to purchase. We reserve the right to
        refuse or cancel any order — for example, if a product is out of
        stock or priced incorrectly — in which case any payment already made
        will be refunded.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed securely through Razorpay. By completing a
        purchase, you agree to Razorpay&apos;s applicable terms for payment
        processing.
      </p>

      <h2>Shipping &amp; Returns</h2>
      <p>
        See our{" "}
        <a href="/shipping-returns" className="text-accent hover:underline">
          Shipping &amp; Returns
        </a>{" "}
        page for delivery timelines and our return policy.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {siteName} is not liable for
        any indirect, incidental, or consequential damages arising from your
        use of this website or its products.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of India, and any disputes will
        be subject to the jurisdiction of Indian courts.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of this
        site after changes constitutes acceptance of the updated terms.
      </p>
    </PolicyLayout>
  );
}

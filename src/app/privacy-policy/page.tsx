import { getPrisma } from "@/lib/db";
import PolicyLayout from "@/components/PolicyLayout";

export default async function PrivacyPolicyPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "KMT Digital";

  return (
    <PolicyLayout
      title="Privacy Policy"
      updatedNote="This is a standard starting policy — review and customize it with your actual business practices before relying on it."
    >
      <p>
        This Privacy Policy explains how {siteName} (&quot;we&quot;,
        &quot;us&quot;) collects, uses, and protects your information when you
        use this website.
      </p>

      <h2>Information We Collect</h2>
      <p>When you place an order, we collect:</p>
      <ul>
        <li>Your name, email address, and phone number</li>
        <li>Your shipping address</li>
        <li>Order details (items purchased, quantities, amounts)</li>
      </ul>
      <p>
        We do not collect or store your payment card details — payments are
        processed entirely by Razorpay, our payment gateway provider.
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your orders</li>
        <li>To communicate with you about your order status</li>
        <li>To respond to your support requests</li>
      </ul>
      <p>We do not sell or rent your personal information to third parties.</p>

      <h2>Cookies &amp; Local Storage</h2>
      <p>
        Your shopping cart is stored in your browser&apos;s local storage so
        it persists between visits. If analytics tools (such as Google
        Analytics or Meta Pixel) are enabled on this site, they may set
        cookies to help us understand site usage.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain order information for as long as necessary to fulfill
        orders, handle returns, and comply with legal obligations.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may contact us at any time to request access to, correction of,
        or deletion of your personal information, subject to our legitimate
        business and legal record-keeping needs.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about this policy? Reach us via the{" "}
        <a href="/contact" className="text-accent hover:underline">
          Contact page
        </a>
        .
      </p>
    </PolicyLayout>
  );
}

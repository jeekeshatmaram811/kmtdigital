import { getPrisma } from "@/lib/db";
import PolicyLayout from "@/components/PolicyLayout";

export default async function AboutPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "KMT Digital";

  return (
    <PolicyLayout title={`About ${siteName}`}>
      <p>
        {siteName} is an online electronics store built around a simple idea:
        good gear shouldn&apos;t be complicated to buy. We curate headphones,
        smartwatches, everyday accessories, and more — picked for quality and
        priced fairly, with fast shipping across India.
      </p>
      <p>
        Every product listed here is chosen with care, not just added to pad
        out a catalog. We&apos;d rather sell fewer things well than everything
        badly.
      </p>
      <h2>What we care about</h2>
      <ul>
        <li>Straightforward pricing in Indian Rupees, no surprises at checkout</li>
        <li>Secure payments processed through Razorpay</li>
        <li>Real customer support if something goes wrong</li>
      </ul>
      <p>
        Have a question before you buy? Visit our{" "}
        <a href="/contact" className="text-accent hover:underline">
          Contact page
        </a>
        .
      </p>
    </PolicyLayout>
  );
}

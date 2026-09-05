import { getPrisma } from "@/lib/db";
import PolicyLayout from "@/components/PolicyLayout";

export default async function ContactPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "KMT Digital";

  return (
    <PolicyLayout title="Contact Us">
      <p>
        Have a question about an order, a product, or anything else? Reach{" "}
        {siteName} through any of the details below.
      </p>
      <div className="rounded-lg border border-border bg-surface p-5 text-foreground">
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {settings?.contactEmail ?? "Not yet configured — add it in Settings"}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Phone:</span>{" "}
          {settings?.contactPhone ?? "Not yet configured — add it in Settings"}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Address:</span>{" "}
          {settings?.address ?? "Not yet configured — add it in Settings"}
        </p>
      </div>
      <p>
        Looking for an existing order instead? Use{" "}
        <a href="/track-order" className="text-accent hover:underline">
          Track Order
        </a>{" "}
        to check its status directly.
      </p>
    </PolicyLayout>
  );
}

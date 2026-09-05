import { getPrisma } from "@/lib/db";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });

  return (
    <CheckoutForm
      freeShippingThreshold={settings?.freeShippingThreshold ?? null}
      standardShippingFee={settings?.standardShippingFee ?? 0}
    />
  );
}

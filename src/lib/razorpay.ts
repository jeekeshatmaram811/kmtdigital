import Razorpay from "razorpay";
import { getPrisma } from "@/lib/db";

async function getRazorpayCredentials(): Promise<{ keyId: string; keySecret: string }> {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
  const keyId = settings?.razorpayKeyId || process.env.RAZORPAY_KEY_ID;
  const keySecret = settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay key ID and secret must be set");
  }

  return { keyId, keySecret };
}

export async function getRazorpay(): Promise<Razorpay> {
  const { keyId, keySecret } = await getRazorpayCredentials();
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function getRazorpayKeyId(): Promise<string> {
  return (await getRazorpayCredentials()).keyId;
}

export async function getRazorpayKeySecret(): Promise<string> {
  return (await getRazorpayCredentials()).keySecret;
}

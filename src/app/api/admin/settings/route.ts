import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db";

type SettingsInput = {
  siteName?: string;
  logoUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  socialFacebook?: string | null;
  socialInstagram?: string | null;
  socialTwitter?: string | null;
  socialYoutube?: string | null;
  gtmId?: string | null;
  ga4Id?: string | null;
  metaPixelId?: string | null;
  smartlookId?: string | null;
  customHeadScript?: string | null;
  customBodyScript?: string | null;
  freeShippingThreshold?: number | null;
  standardShippingFee?: number;
};

export async function PATCH(request: Request) {
  let body: SettingsInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const settings = await getPrisma().siteSettings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, siteName: body.siteName ?? "KMT Digital", ...body },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Could not save settings" }, { status: 400 });
  }
}

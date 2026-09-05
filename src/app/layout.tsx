import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { getPrisma } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_SETTINGS = {
  siteName: "KMT Digital",
  logoUrl: null as string | null,
  freeShippingThreshold: null as number | null,
  gtmId: null as string | null,
  ga4Id: null as string | null,
  metaPixelId: null as string | null,
  smartlookId: null as string | null,
  customHeadScript: null as string | null,
  customBodyScript: null as string | null,
};

async function getLayoutData() {
  try {
    const prisma = getPrisma();
    const [categories, settings] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: { name: true, slug: true },
      }),
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
    ]);
    return { categories, settings: settings ?? DEFAULT_SETTINGS };
  } catch {
    return { categories: [], settings: DEFAULT_SETTINGS };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getLayoutData();
  const title = `${settings.siteName} — Electronics Store`;
  const description = `Shop headphones, smartwatches, sunglasses, and more at ${settings.siteName}.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: settings.siteName,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { categories, settings } = await getLayoutData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Analytics settings={settings} />
        <CartProvider>
          <Header
            siteName={settings.siteName}
            logoUrl={settings.logoUrl}
            categories={categories}
          />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}

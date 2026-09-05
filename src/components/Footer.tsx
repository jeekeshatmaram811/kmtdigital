import Link from "next/link";
import { formatPrice } from "@/lib/format";

type Settings = {
  siteName: string;
  freeShippingThreshold: number | null;
};

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-foreground">
              {settings.siteName}
            </span>
            <p className="mt-2 text-sm text-muted">
              Electronics that keep up with you.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-accent">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/track-order" className="hover:text-accent">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-accent">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Why {settings.siteName}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                Free shipping over{" "}
                {formatPrice(settings.freeShippingThreshold ?? 999)}
              </li>
              <li>1-year warranty</li>
              <li>Secure payments</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings.siteName}. All rights
            reserved.
          </span>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-accent">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

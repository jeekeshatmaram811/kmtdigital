export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-foreground">KMT Digital</span>
            <p className="mt-2 text-sm text-muted">
              Electronics that keep up with you.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>All Electronics</li>
              <li>Best Sellers</li>
              <li>New Arrivals</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Track Order</li>
              <li>Returns</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Why KMT Digital</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Free shipping over ₹999</li>
              <li>1-year warranty</li>
              <li>Secure payments</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} KMT Digital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

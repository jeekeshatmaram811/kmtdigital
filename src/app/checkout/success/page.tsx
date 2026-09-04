import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-3xl">
        🎉
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Order placed!</h1>
      <p className="mt-2 text-muted">
        Thanks for shopping with KMT Digital. A confirmation email is on its way.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

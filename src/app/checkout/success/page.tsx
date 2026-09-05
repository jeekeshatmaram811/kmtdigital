import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-3xl">
        🎉
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Order placed!</h1>
      {order && (
        <p className="mt-2 text-lg font-semibold text-foreground">
          Order number: {order}
        </p>
      )}
      <p className="mt-2 text-muted">
        Thanks for shopping with KMT Digital. You can check your order status
        anytime on the{" "}
        <Link href="/track-order" className="text-accent hover:underline">
          Track Order
        </Link>{" "}
        page.
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

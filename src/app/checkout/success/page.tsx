import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Order placed! 🎉</h1>
      <p className="mt-2 text-neutral-500">
        Thanks for your purchase. A confirmation email is on its way.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-black px-6 py-3 font-medium text-white dark:bg-white dark:text-black"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

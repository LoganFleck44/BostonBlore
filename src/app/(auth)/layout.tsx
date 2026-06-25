import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <div className="px-5 py-5">
        <Link href="/" className="font-display text-xl font-bold uppercase">
          Boston<span className="fire-text">Blore</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        {children}
      </div>
    </div>
  );
}

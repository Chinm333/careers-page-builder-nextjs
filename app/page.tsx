import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center px-4 py-12">
        <h1 className="text-3xl font-bold">Careers Page Builder</h1>
        <p className="mt-3 text-sm text-gray-600">
          Recruiters can build branded Careers pages; candidates can explore open roles.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Recruiter Login
          </Link>
          <Link
            href="/acme/careers"
            className="rounded border px-4 py-2 text-sm"
          >
            View Sample Careers Page
          </Link>
        </div>
      </main>
    </div>
  );
}
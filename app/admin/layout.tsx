import { Suspense } from "react";
import { requireUser } from "@/lib/auth";

async function AuthCheck({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <>{children}</>;
}

export default function AdminLayout({children,}: {children: React.ReactNode;}) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthCheck>{children}</AuthCheck>
    </Suspense>
  );
}

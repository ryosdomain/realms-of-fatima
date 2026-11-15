import Link from "next/link";

export default function AuthLink({ loggedIn }: { loggedIn: boolean }) {
  return (
    <>
    <Link className="hidden rounded-full border border-[#18382f]/15 px-5 py-2.5 text-xs font-semibold transition hover:bg-[#18382f] hover:text-white sm:block" href={loggedIn ? "/admin" : "/login"} >
      {loggedIn ? "Dashboard" : "Login"}
    </Link>

    {/* mobile version  */}

    <Link className="block sm:hidden w-full rounded-lg px-3 py-3 text-left text-sm font-semibold hover:bg-white/60" href={loggedIn ? "/admin" : "/login"} >
      {loggedIn ? "Dashboard" : "Login"}
    </Link>

    </>
  );
}
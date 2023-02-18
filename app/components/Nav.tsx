import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav className="container mx-auto flex h-16 items-center">
      <div className="text-2xl font-light tracking-widest text-primary">
        typed
      </div>
      <div className="flex-1"></div>
      <div>
        <Link
          to="/signin"
          className="rounded-full font-medium text-primary underline-offset-8 transition-all hover:underline"
        >
          sign in
        </Link>
      </div>
    </nav>
  );
}

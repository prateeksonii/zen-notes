import { LoaderArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Balancer from "react-wrap-balancer";
import Nav from "~/components/Nav";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (session.data && session.data.userId) {
    return redirect("/dashboard");
  }

  return {};
}

export default function Home() {
  return (
    <main>
      <header>
        <Nav />
        <section className="container mx-auto grid grid-cols-2">
          <div className="flex min-h-[400px] flex-col justify-center">
            <h1 className="text-6xl font-light leading-tight tracking-wide">
              <Balancer>
                transform your thoughts into words with{" "}
                <strong className="text-primary">typed</strong>
              </Balancer>
            </h1>

            <Link
              to="/signup"
              className="mt-8 w-max rounded-full bg-primary py-4 px-8 text-xl font-bold text-black"
            >
              get started
            </Link>
          </div>
        </section>
      </header>
    </main>
  );
}

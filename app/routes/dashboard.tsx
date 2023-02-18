import { LoaderArgs, redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (!session.data || !session.data.userId) {
    return redirect("/");
  }

  return {};
}

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-[5%_30%_65%] h-screen">
      <div className="h-full bg-black"></div>
      <div></div>
      <div></div>
    </div>
  );
}

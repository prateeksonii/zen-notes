import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import Balancer from "react-wrap-balancer";
import Nav from "~/components/Nav";
import Toast from "~/components/Toast";
import { signIn } from "~/server/auth/index.server";
import { commitSession, sessionStorage } from "~/services/session.server";

export async function action({ request }: ActionArgs) {
  const body = await request.formData();

  const email = body.get("email") as string;
  const password = body.get("password") as string;

  const res = await signIn({ email, password });

  if (!res.success) {
    return json(res, {
      status: res.code,
    });
  }

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  session.set("userId", res.data);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }: LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (session.data && session.data.userId) {
    return redirect("/dashboard");
  }

  return {};
}

export default function SignInPage() {
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  return (
    <>
      <Nav />
      <main className="container mx-auto grid h-[calc(100vh-4rem)] grid-cols-[2fr_1fr] place-items-center justify-items-start gap-16">
        <h1 className="text-5xl leading-tight">
          <Balancer>
            transform your notes with typed -{" "}
            <span className="text-primary">welcome back!</span>
          </Balancer>
        </h1>

        <Form
          method="post"
          className="w-full flex flex-col gap-2 p-12 bg-zinc-800 rounded"
        >
          <label htmlFor="email" className="flex w-full flex-col">
            Email
            <input
              type="email"
              name="email"
              defaultValue={actionData?.values.email}
              className="w-full bg-zinc-700 rounded p-2"
            />
            {actionData?.formErrors?.email && (
              <div className="text-sm text-red-400">
                {actionData.formErrors.email._errors[0]}
              </div>
            )}
          </label>
          <label htmlFor="password" className="flex w-full flex-col">
            Password
            <input
              type="password"
              name="password"
              defaultValue={actionData?.values.password}
              className="w-full bg-zinc-700 rounded p-2"
            />
            {actionData?.formErrors?.password && (
              <div className="text-sm text-red-400">
                {actionData.formErrors.password._errors[0]}
              </div>
            )}
          </label>
          <button
            type="submit"
            className="bg-primary disabled:bg-orange-200 p-2 rounded mt-4 font-bold text-black"
            disabled={transition.state === "submitting"}
          >
            {transition.state === "submitting" ? (
              <span>Signing In...</span>
            ) : (
              "Sign In"
            )}
          </button>
          {actionData?.code === 409 && (
            <Toast message={actionData.error?.toString() || ""} />
          )}
        </Form>
      </main>
    </>
  );
}

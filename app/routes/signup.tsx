import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useTransition } from "@remix-run/react";
import Balancer from "react-wrap-balancer";
import Nav from "~/components/Nav";
import Toast from "~/components/Toast";
import { signUp } from "~/server/auth/index.server";

export async function action({ request }: ActionArgs) {
  const body = await request.formData();

  const name = body.get("name") as string;
  const email = body.get("email") as string;
  const password = body.get("password") as string;

  const res = await signUp({ name, email, password });

  if (!res.success) {
    return json(res, {
      status: res.code,
    });
  }

  return redirect("/signin");
}

export default function SignupPage() {
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  return (
    <>
      <Nav />
      <main className="container mx-auto grid h-[calc(100vh-4rem)] grid-cols-[2fr_1fr] place-items-center justify-items-start gap-16">
        <h1 className="text-5xl leading-tight">
          <Balancer>
            transform your notes with typed -{" "}
            <span className="text-primary">create an account</span>
          </Balancer>
        </h1>

        <Form
          method="post"
          className="w-full flex flex-col gap-2 p-12 bg-zinc-800 rounded"
        >
          <label htmlFor="name" className="flex w-full flex-col">
            Name
            <input
              type="text"
              name="name"
              defaultValue={actionData?.values.name}
              className="w-full bg-zinc-700 rounded p-2"
            />
            {actionData?.formErrors?.name && (
              <div className="text-sm text-red-400">
                {actionData.formErrors.name._errors[0]}
              </div>
            )}
          </label>
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
              <span>Creating...</span>
            ) : (
              "Create account"
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

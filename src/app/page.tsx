"use client";

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "@/../convex/_generated/api";
import { SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import type { UserResource } from "@clerk/types";

export default function Home() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || user === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Answero
        <UserButton />
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center"></h1>
        <Authenticated>
          <Content user={user} />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}

function SignInForm() {
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to see the numbers</p>
      <SignInButton mode="modal">
        <button className="bg-foreground text-background px-4 py-2 rounded-md">
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="bg-foreground text-background px-4 py-2 rounded-md">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}

function Content(props: { user: UserResource }) {
  const questions = useQuery(api.questions.listQuestions);
  const createQuestion = useMutation(api.questions.createQuestion);

  if (questions === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <p>Welcome {props.user.firstName ?? "Anonymous"}!</p>
      <button
        onClick={() =>
          createQuestion({ title: "Who are we?", body: "Who are you?" })
        }
      >
        Create Question
      </button>
      <ul>
        {questions.map(({ _id, title }) => (
          <li key={_id}>{title}</li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { trpc } from "@/trpc/client";

const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "ivan" });

  return <div>{data.greeting}</div>;
};

export default PageClient;

import serverless from "serverless-http";
import { createApp } from "../server/createApp";
import { serveStatic } from "../server/static";

let handlerPromise: Promise<ReturnType<typeof serverless>> | null = null;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      const { app } = await createApp();
      serveStatic(app);
      return serverless(app);
    })();
  }
  return handlerPromise;
}

export default async function handler(req: unknown, res: unknown) {
  const handlerFn = await getHandler();
  await (handlerFn as (req: unknown, res: unknown) => unknown)(req, res);
}

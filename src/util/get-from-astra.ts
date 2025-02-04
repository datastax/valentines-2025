import { client } from "./astra-client";

export const getFromAstra = async ({ username }: { username: string }) => {
  return await client.findOne({ username });
};

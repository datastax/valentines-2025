import { client } from "./astra-client";

type Props = {
  username: string;
  poem: string;
};

export const saveToAstra = async ({ poem, username }: Props) => {
  return await client.insertOne({ poem, username });
};

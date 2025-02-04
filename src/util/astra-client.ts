import { DataAPIClient } from "@datastax/astra-db-ts";

const dsClient = new DataAPIClient(import.meta.env.ASTRA_DB_APPLICATION_TOKEN);
const db = dsClient.db(import.meta.env.ASTRA_DB_ENDPOINT_URL);
export const client = db.collection("poems");

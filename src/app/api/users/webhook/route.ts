import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { UserJSON } from "@clerk/backend";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const data = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${data.id} and event type of ${eventType}`,
    );
    console.log("Webhook payload:", evt.data.id);

    if (eventType === "user.created") {
      const userData = data as UserJSON;

      await db
        .insert(usersTable)
        .values({
          clerkId: userData.id,
          name: `${userData.first_name} ${userData.last_name}`,
          imageURL: userData.image_url,
        })
        .then((res) => {
          console.log(`Inserted ${res.rowCount} rows`);
        });
    }

    if (eventType === "user.deleted") {
      const userData = data as UserJSON;
      console.log("User deleted");

      await db
        .delete(usersTable)
        .where(eq(usersTable.clerkId, userData.id))
        .then((res) => {
          console.log(`Deleted ${res.rowCount} rows`);
        });
    }

    if (eventType === "user.updated") {
      const userData = data as UserJSON;
      console.log("User updated");

      await db
        .update(usersTable)
        .set({
          name: `${userData.first_name} ${userData.last_name}`,
          imageURL: userData.image_url,
        })
        .where(eq(usersTable.clerkId, userData.id))
        .then((res) => {
          console.log(`Updated ${res.rowCount} rows`);
        });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

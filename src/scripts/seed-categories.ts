import { db } from "@/db";
import { categoriesTable } from "@/db/schema";

const categoriesName = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function seedCategories() {
  console.log("Seeding categories...");

  try {
    const values = categoriesName.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));

    await db.insert(categoriesTable).values(values);

    console.log("Categories seeded successfully.");
  } catch (e) {
    console.error("Error seeding categories:", e);
    process.exit(1);
  }
}

seedCategories();

export interface AnimalCategory {
  slug: string;
  name: string;
  title: string;
  description: string;
  color: string;
}

// Function to read all categories from JSON files
export function getAllCategories(): AnimalCategory[] {
  const categories: AnimalCategory[] = [];

  try {
    // Use Vite's glob import to dynamically load all category JSON files
    const categoryModules = import.meta.glob<{ default: AnimalCategory }>(
      "/src/data/categories/*.json",
      { eager: true }
    );

    for (const path in categoryModules) {
      const slug =
        path
          .split("/")
          .pop()
          ?.replace(/\.json$/, "") || "";
      const module = categoryModules[path];
      categories.push({ ...module.default, slug });
    }

    return categories;
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

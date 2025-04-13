"use client";

import { trpc } from "@/trpc/client";
import { withErrorBoundaryAndSuspense } from "@/utils/withErrorBoundaryAndSuspense";
import {
  FilterCarousel,
  FilterCarouselSkeleton,
} from "@/components/filter-carousel";
import { useQueryState } from "nuqs";

interface CategorySectionProps {
  categoryId?: string;
}

// Component that uses suspense query
const CategoriesSectionContent = ({ categoryId }: CategorySectionProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const [category, setCategory] = useQueryState("categoryId", {
    defaultValue: categoryId ?? "",
  });

  const data = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <div>
      <FilterCarousel
        data={data}
        onSelect={(v) => setCategory(v)}
        value={category}
      />
    </div>
  );
};

// Wrap the component with ErrorBoundary and Suspense using our HOC
const CategoriesSection = withErrorBoundaryAndSuspense(
  CategoriesSectionContent,
  {
    loadingFallback: <FilterCarouselSkeleton />,
  },
);

export default CategoriesSection;

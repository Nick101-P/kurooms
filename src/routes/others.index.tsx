import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { OtherItemCard } from "@/components/listings/OtherItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OTHER_CATEGORIES } from "@/data/listings";
import { useListingsStore } from "@/data/listingsStore";

type OthersSearch = {
  q?: string | undefined;
  category?: string | undefined;
  sort?: "price-asc" | "price-desc" | undefined;
};

export const Route = createFileRoute("/others/")({
  validateSearch: (search: Record<string, unknown>): OthersSearch => ({
    q: typeof search["q"] === "string" && search["q"].trim() ? search["q"].trim() : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    sort:
      search["sort"] === "price-asc" || search["sort"] === "price-desc"
        ? (search["sort"] as "price-asc" | "price-desc")
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Other student items on sale in Dhulikhel — BasaiKU" },
      {
        name: "description",
        content:
          "Buy second-hand electronics, calculators, textbooks, bicycles, kitchenware, and sports gear from KU students.",
      },
      { property: "og:title", content: "Student items & essentials marketplace in Dhulikhel" },
      {
        property: "og:description",
        content: "Second-hand gadgets, books, cycles, and daily essentials from KU students.",
      },
    ],
  }),
  component: OthersPage,
});

function OthersPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/others/" });
  const { otherItems } = useListingsStore();
  const set = (patch: Partial<OthersSearch>) =>
    navigate({ search: (prev: OthersSearch) => ({ ...prev, ...patch }), replace: true });

  const results = useMemo(() => {
    const q = search.q?.toLowerCase().trim();
    let list = otherItems.filter((item) => {
      if (q && !(item.title + item.description + item.location).toLowerCase().includes(q))
        return false;
      if (search.category && item.category !== search.category) return false;
      return true;
    });
    if (search.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (search.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [search, otherItems]);

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl">Other student items on sale</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Electronics, textbooks, bicycles, appliances, and sports gear from students around KU.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search.q ?? ""}
            onChange={(e) => set({ q: e.target.value || undefined })}
            placeholder="Search items, e.g. calculator, bicycle, kettle..."
            className="h-11 pl-9"
            aria-label="Search items"
          />
        </div>
        <Select
          value={search.sort ?? "recent"}
          onValueChange={(v) =>
            set({ sort: v === "recent" ? undefined : (v as "price-asc" | "price-desc") })
          }
        >
          <SelectTrigger className="h-11 sm:w-52" aria-label="Sort items">
            <SelectValue>
              {
                {
                  "price-asc": "Price: low to high",
                  "price-desc": "Price: high to low",
                  recent: "Most recent",
                }[search.sort ?? "recent"]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <CategoryChip
          label="All"
          active={!search.category}
          onClick={() => set({ category: undefined })}
        />
        {OTHER_CATEGORIES.map((c) => (
          <CategoryChip
            key={c}
            label={c}
            active={search.category === c}
            onClick={() => set({ category: search.category === c ? undefined : c })}
          />
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "item" : "items"}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
          <h2 className="text-lg">Nothing here yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another category or clear your search.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => navigate({ search: {} as OthersSearch, replace: true })}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {results.map((item) => (
            <OtherItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-4 py-2 text-sm transition-colors " +
        (active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:border-accent")
      }
    >
      {label}
    </button>
  );
}

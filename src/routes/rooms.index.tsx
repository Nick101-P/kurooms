import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useMemo } from "react";
import { RoomCard } from "@/components/listings/RoomCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { AMENITIES, LOCATIONS, ROOMS, formatNpr } from "@/data/listings";

type RoomSearch = {
  q?: string | undefined;
  location?: string | undefined;
  type?: string | undefined;
  maxRent?: number | undefined;
  maxDistance?: number | undefined;
  furnished?: boolean | undefined;
  amenities?: string[] | undefined;
  sort?: "recommended" | "rent-asc" | "rent-desc" | "distance" | undefined;
};

export const Route = createFileRoute("/rooms/")({
  validateSearch: (search: Record<string, unknown>): RoomSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    location: typeof search["location"] === "string" ? search["location"] : undefined,
    type: typeof search["type"] === "string" ? search["type"] : undefined,
    maxRent: typeof search["maxRent"] === "number" ? search["maxRent"] : undefined,
    maxDistance: typeof search["maxDistance"] === "number" ? search["maxDistance"] : undefined,
    furnished: search["furnished"] === true || search["furnished"] === "true" ? true : undefined,
    amenities: Array.isArray(search["amenities"]) ? (search["amenities"] as string[]) : undefined,
    sort: (["rent-asc", "rent-desc", "distance"] as const).includes(search["sort"] as never)
      ? (search["sort"] as RoomSearch["sort"])
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Rooms near Kathmandu University — BasaiKU" },
      {
        name: "description",
        content:
          "Search student rooms in Dhulikhel and Banepa. Filter by rent, distance from KU, room type, furnishing and amenities.",
      },
      { property: "og:title", content: "Rooms near Kathmandu University" },
      {
        property: "og:description",
        content: "Filter student rooms by rent, distance from KU and furnishing.",
      },
    ],
  }),
  component: RoomSearchPage,
});

const ROOM_TYPES = ["Single", "Shared", "Flat", "Hostel"];
const MAX_RENT = 15000;

function RoomSearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/rooms/" });

  const set = (patch: Partial<RoomSearch>) =>
    navigate({ search: (prev: RoomSearch) => ({ ...prev, ...patch }), replace: true });

  const results = useMemo(() => {
    const q = search.q?.toLowerCase().trim();
    let list = ROOMS.filter((room) => {
      if (q && !(room.title + room.location + room.description).toLowerCase().includes(q))
        return false;
      if (search.location && room.location !== search.location) return false;
      if (search.type && room.type !== search.type) return false;
      if (search.maxRent && room.rent > search.maxRent) return false;
      if (search.maxDistance && room.distanceKm > search.maxDistance) return false;
      if (search.furnished && !room.furnished) return false;
      if (search.amenities?.length && !search.amenities.every((a) => room.amenities.includes(a)))
        return false;
      return true;
    });
    if (search.sort === "rent-asc") list = [...list].sort((a, b) => a.rent - b.rent);
    if (search.sort === "rent-desc") list = [...list].sort((a, b) => b.rent - a.rent);
    if (search.sort === "distance") list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    return list;
  }, [search]);

  const activeChips = [
    search.location && { label: search.location, clear: { location: undefined } },
    search.type && { label: search.type, clear: { type: undefined } },
    search.maxRent && {
      label: `Under ${formatNpr(search.maxRent)}`,
      clear: { maxRent: undefined },
    },
    search.maxDistance && {
      label: `Within ${search.maxDistance} km`,
      clear: { maxDistance: undefined },
    },
    search.furnished && { label: "Furnished", clear: { furnished: undefined } },
    ...(search.amenities ?? []).map((a) => ({
      label: a,
      clear: { amenities: search.amenities!.filter((x) => x !== a) },
    })),
  ].filter(Boolean) as { label: string; clear: Partial<RoomSearch> }[];

  const filters = <RoomFilters search={search} set={set} />;

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl">Rooms around Kathmandu University</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sample listings in Dhulikhel, Banepa and along the Panauti road.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search.q ?? ""}
            onChange={(e) => set({ q: e.target.value || undefined })}
            placeholder="Search by area, title or keyword"
            className="h-11 pl-9"
            aria-label="Search rooms"
          />
        </div>
        <Select
          value={search.sort ?? "recommended"}
          onValueChange={(v) => set({ sort: v === "recommended" ? undefined : (v as never) })}
        >
          <SelectTrigger className="h-11 sm:w-56" aria-label="Sort results">
            <SelectValue>
              {
                {
                  "rent-asc": "Rent: low to high",
                  "rent-desc": "Rent: high to low",
                  distance: "Closest to KU",
                  recommended: "Recommended",
                }[search.sort ?? "recommended"]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="rent-asc">Rent: low to high</SelectItem>
            <SelectItem value="rent-desc">Rent: high to low</SelectItem>
            <SelectItem value="distance">Closest to KU</SelectItem>
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-11 lg:hidden">
              <SlidersHorizontal className="size-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-8">{filters}</div>
          </SheetContent>
        </Sheet>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => set(chip.clear)}
              className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:bg-muted"
            >
              {chip.label} <X className="size-3.5" />
            </button>
          ))}
          <button
            onClick={() =>
              navigate({ search: {} as RoomSearch, replace: true })
            }
            className="text-sm text-accent hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
            {filters}
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "room" : "rooms"} found
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <h2 className="text-lg">No rooms match these filters</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your rent range or the distance from campus.
              </p>
              <Button
                className="mt-5"
                variant="outline"
                onClick={() => navigate({ search: {} as RoomSearch, replace: true })}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function RoomFilters({
  search,
  set,
}: {
  search: RoomSearch;
  set: (patch: Partial<RoomSearch>) => void;
}) {
  const amenities = search.amenities ?? [];

  return (
    <div className="space-y-7 pt-4 lg:pt-0">
      <div>
        <Label className="text-sm font-semibold">Monthly rent</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Up to {formatNpr(search.maxRent ?? MAX_RENT)}
        </p>
        <Slider
          className="mt-4"
          min={2000}
          max={MAX_RENT}
          step={500}
          value={[search.maxRent ?? MAX_RENT]}
          onValueChange={([v]) => set({ maxRent: !v || v >= MAX_RENT ? undefined : v })}
        />
      </div>

      <div>
        <Label className="text-sm font-semibold">Distance from KU</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 5, 10].map((km) => (
            <button
              key={km}
              onClick={() => set({ maxDistance: search.maxDistance === km ? undefined : km })}
              className={
                "rounded-full border px-3 py-1.5 text-sm transition-colors " +
                (search.maxDistance === km
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent")
              }
            >
              ≤ {km} km
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold">Location</Label>
        <Select
          value={search.location ?? "all"}
          onValueChange={(v) => set({ location: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="mt-3 w-full">
            <SelectValue>{search.location ?? "All locations"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {LOCATIONS.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold">Room type</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROOM_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => set({ type: search.type === t ? undefined : t })}
              className={
                "rounded-full border px-3 py-1.5 text-sm transition-colors " +
                (search.type === t
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="furnished"
          checked={!!search.furnished}
          onCheckedChange={(c) => set({ furnished: c === true ? true : undefined })}
        />
        <Label htmlFor="furnished" className="text-sm">
          Furnished only
        </Label>
      </div>

      <div>
        <Label className="text-sm font-semibold">Amenities</Label>
        <div className="mt-3 space-y-2">
          {AMENITIES.map((a) => (
            <div key={a} className="flex items-center gap-3">
              <Checkbox
                id={`am-${a}`}
                checked={amenities.includes(a)}
                onCheckedChange={(c) => {
                  const next = c === true ? [...amenities, a] : amenities.filter((x) => x !== a);
                  set({ amenities: next.length ? next : undefined });
                }}
              />
              <Label htmlFor={`am-${a}`} className="text-sm font-normal">
                {a}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Badge variant="secondary" className="w-full justify-center py-2">
        Showing sample data
      </Badge>
    </div>
  );
}

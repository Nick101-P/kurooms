import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Navigation, Search, ShieldCheck, Sofa } from "lucide-react";
import { useState } from "react";
import heroRoom from "@/assets/hero-room.jpg";
import { FurnitureCard } from "@/components/listings/FurnitureCard";
import { OtherItemCard } from "@/components/listings/OtherItemCard";
import { RoomCard } from "@/components/listings/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FURNITURE, LOCATIONS, OTHER_ITEMS, ROOMS } from "@/data/listings";
import { useListingsStore } from "@/data/listingsStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BasaiKU — Student rooms & furniture near Kathmandu University" },
      {
        name: "description",
        content:
          "Find rooms, furnished accommodation and second-hand furniture around Kathmandu University in Dhulikhel. Filter by rent, distance from KU and room type.",
      },
      { property: "og:title", content: "BasaiKU — Student rooms near Kathmandu University" },
      {
        property: "og:description",
        content: "Rooms, furnished stays and student furniture around Dhulikhel, Nepal.",
      },
    ],
  }),
  component: HomePage,
});

const QUICK_FILTERS = [
  { label: "Under Rs 5,000", search: { maxRent: 5000 } },
  { label: "Furnished only", search: { furnished: true } },
  { label: "Within 1 km of KU", search: { maxDistance: 1 } },
  { label: "Shared rooms", search: { type: "Shared" } },
] as const;

function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { rooms, furniture, otherItems } = useListingsStore();
  const featured = rooms.slice(0, 3);
  const furnished = rooms.filter((r) => r.furnished).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/rooms", search: { q: query.trim() || undefined } });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface via-surface/60 to-background pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs">
              <Navigation className="size-3.5 text-accent animate-pulse" /> Built exclusively for
              Kathmandu University, Dhulikhel
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              A room near campus, without the hunt.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse student verified rooms, furnished flats, and hostel seats around Dhulikhel.
              Trade furniture and study essentials directly with fellow students.
            </p>

            <form
              className="flex flex-col gap-2.5 rounded-2xl border border-border/80 bg-card p-2 shadow-card sm:flex-row sm:items-center"
              onSubmit={handleSearch}
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search area, e.g. Dhulikhel Bazaar, 28 Kilo..."
                  className="h-12 border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
                  aria-label="Search rooms by area"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-xl px-7 text-sm font-semibold shadow-sm"
              >
                Search rooms
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-muted-foreground">Quick filters:</span>
              {QUICK_FILTERS.map((f) => (
                <Link
                  key={f.label}
                  to="/rooms"
                  search={f.search}
                  className="rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-card hover:text-foreground"
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-lift">
              <img
                src={heroRoom}
                alt="Student room in Dhulikhel with a desk by the window and hills outside"
                width={1600}
                height={1104}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl badge-glass p-3.5 shadow-lift">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Average student rent</p>
                  <p className="font-display text-lg font-bold text-foreground">
                    Rs 3,500 – 10,000
                    <span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <div className="rounded-xl bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  100% Student Stays
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          title="Featured rooms"
          subtitle="Recently listed around Dhulikhel"
          to="/rooms"
          linkLabel="See all rooms"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section className="bg-surface/60 py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Popular student neighborhoods</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Most students look in these areas first for walking distance and transport.
              </p>
            </div>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Explore all locations <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((loc) => {
              const count = rooms.filter((r) => r.location === loc).length;
              return (
                <Link
                  key={loc}
                  to="/rooms"
                  search={{ location: loc }}
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4.5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Navigation className="size-4" />
                    </span>
                    <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                      {loc}
                    </span>
                  </div>
                  <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {count} {count === 1 ? "room" : "rooms"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          title="Move-in ready, furnished"
          subtitle="Bed, study desk, and storage already setup"
          to="/rooms"
          linkLabel="All furnished rooms"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {furnished.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <SectionHeading
          title="Student furniture marketplace"
          subtitle="Second-hand desks, mattresses, and appliances from graduating seniors"
          to="/furniture"
          linkLabel="Browse furniture"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {furniture.slice(0, 4).map((item) => (
            <FurnitureCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <SectionHeading
          title="Other student items on sale"
          subtitle="Calculators, electronics, cycles, textbooks, and daily student gear"
          to="/others"
          linkLabel="Browse all items"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {otherItems.slice(0, 4).map((item) => (
            <OtherItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-5 sm:grid-cols-3">
          <TrustCard
            icon={<BadgeCheck className="size-5 text-success" />}
            title="Verified listings"
            text="Rooms marked verified have had their availability, owner identity, and rent amount confirmed."
          />
          <TrustCard
            icon={<ShieldCheck className="size-5 text-success" />}
            title="No brokers, zero fees"
            text="You connect directly with student sellers or room owners without middleman commissions."
          />
          <TrustCard
            icon={<Sofa className="size-5 text-success" />}
            title="Transparent student stays"
            text="Every listing details distance to KU campus, included amenities, water supply, and bills."
          />
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/95 to-primary px-8 py-12 text-primary-foreground shadow-lift sm:px-12 md:flex md:items-center md:justify-between">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              For House Owners & Seniors
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Have a room or items to pass on?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
              List your space or items in under 2 minutes. Reach thousands of KU students searching
              actively in Dhulikhel and Banepa.
            </p>
          </div>
          <div className="relative z-10 mt-6 shrink-0 md:mt-0">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 rounded-xl px-6 font-semibold shadow-md"
            >
              <Link to="/list" className="gap-2">
                List for Free <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  to,
  linkLabel,
}: {
  title: string;
  subtitle: string;
  to: "/rooms" | "/furniture" | "/others";
  linkLabel: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        to={to}
        className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        {linkLabel} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function TrustCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">{icon}</div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

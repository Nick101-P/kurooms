import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Navigation, Search, ShieldCheck, Sofa } from "lucide-react";
import { useState } from "react";
import heroRoom from "@/assets/hero-room.jpg";
import { FurnitureCard } from "@/components/listings/FurnitureCard";
import { RoomCard } from "@/components/listings/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FURNITURE, LOCATIONS, ROOMS } from "@/data/listings";

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
  const featured = ROOMS.slice(0, 3);
  const furnished = ROOMS.filter((r) => r.furnished).slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden bg-surface">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Navigation className="size-3.5 text-accent" /> Built for Kathmandu University,
              Dhulikhel
            </span>
            <h1 className="mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              A room near campus, without the group-chat hunt.
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              Browse rooms, furnished stays and hostel seats around Dhulikhel — then pick up a desk
              or mattress from a student who's moving out.
            </p>

            <form
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search area, e.g. Dhulikhel Bazaar"
                  className="h-12 rounded-xl bg-background pl-9"
                  aria-label="Search rooms by area"
                />
              </div>
              <Button asChild size="lg" className="h-12 rounded-xl">
                <Link to="/rooms" search={{ q: query || undefined }}>
                  Search rooms
                </Link>
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {QUICK_FILTERS.map((f) => (
                <Link
                  key={f.label}
                  to="/rooms"
                  search={f.search}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={heroRoom}
              alt="Student room in Dhulikhel with a desk by the window and hills outside"
              width={1600}
              height={1104}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
              <p className="text-xs text-muted-foreground">Average student rent near KU</p>
              <p className="font-display text-xl font-semibold">Rs 3,200 – 11,000</p>
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

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="text-2xl">Popular locations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Most students search these areas first.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((loc) => {
              const count = ROOMS.filter((r) => r.location === loc).length;
              return (
                <Link
                  key={loc}
                  to="/rooms"
                  search={{ location: loc }}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-card transition-colors hover:border-accent"
                >
                  <span className="font-medium">{loc}</span>
                  <span className="text-sm text-muted-foreground">
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
          subtitle="Bed, desk and wardrobe already inside"
          to="/rooms"
          linkLabel="All furnished rooms"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {furnished.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <SectionHeading
          title="Student furniture marketplace"
          subtitle="Cheap desks, mattresses and appliances from seniors moving out"
          to="/furniture"
          linkLabel="Browse furniture"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FURNITURE.slice(0, 4).map((item) => (
            <FurnitureCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <TrustCard
            icon={<BadgeCheck className="size-5 text-success" />}
            title="Verified listings"
            text="Rooms marked verified have been visited and the rent confirmed with the owner."
          />
          <TrustCard
            icon={<ShieldCheck className="size-5 text-success" />}
            title="No brokers, no fees"
            text="You contact the owner directly. Nobody asks you for a finder's commission."
          />
          <TrustCard
            icon={<Sofa className="size-5 text-success" />}
            title="Furniture included, clearly"
            text="Every room lists exactly what comes with it, so there are no surprises on move-in day."
          />
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl text-primary-foreground">Have a room to rent out?</h2>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
              List it and reach KU students looking right now. Listing is free while we're getting
              started in Dhulikhel.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="rounded-xl">
            <Link to="/list">
              List your room <ArrowRight className="size-4" />
            </Link>
          </Button>
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
  to: "/rooms" | "/furniture";
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

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">{icon}</div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

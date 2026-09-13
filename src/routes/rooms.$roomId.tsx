import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Flag,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Sofa,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROOMS, formatNpr } from "@/data/listings";
import { listingsStore, useListingsStore } from "@/data/listingsStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rooms/$roomId")({
  loader: ({ params }) => {
    const room =
      listingsStore.getSnapshot().rooms.find((r) => r.id === params.roomId) ??
      ROOMS.find((r) => r.id === params.roomId);
    if (!room) throw notFound();
    return { room };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Room unavailable — BasaiKU" }, { name: "robots", content: "noindex" }],
      };
    }
    const { room } = loaderData;
    const title = `${room.title} — ${formatNpr(room.rent)}/month in ${room.location}`;
    const description = `${room.type} room ${room.distanceKm} km from Kathmandu University. ${room.furnished ? "Furnished" : "Unfurnished"}, ${room.available.toLowerCase()}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: room.images[0] as string },
        { name: "twitter:image", content: room.images[0] as string },
      ],
    };
  },
  component: RoomDetailPage,
});

function RoomDetailPage() {
  const { room: initialRoom } = Route.useLoaderData();
  const { rooms } = useListingsStore();
  const room = rooms.find((r) => r.id === initialRoom.id) ?? initialRoom;
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);

  return (
    <div className="container-page pb-28 pt-6 lg:pb-16">
      <Link
        to="/rooms"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to rooms
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="overflow-hidden rounded-3xl bg-muted">
            <img
              src={room.images[active]}
              alt={room.title}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
            />
          </div>
          {room.images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {room.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={cn(
                    "size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                    i === active ? "border-accent" : "border-transparent opacity-70",
                  )}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{room.type}</Badge>
              {room.furnished && (
                <Badge className="bg-accent text-accent-foreground">Furnished</Badge>
              )}
              {room.verified && (
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <BadgeCheck className="size-4" /> Verified listing
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl">{room.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" /> {room.location}
              </span>
              <span className="flex items-center gap-1">
                <Navigation className="size-4" /> {room.distanceKm} km from KU
              </span>
              <span className="flex items-center gap-1">
                <CalendarCheck className="size-4" /> {room.available}
              </span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-foreground/90">{room.description}</p>

            <Separator className="my-8" />

            <h2 className="text-xl">Included furniture</h2>
            {room.includedFurniture.length ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {room.includedFurniture.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <Sofa className="size-4 text-accent" /> {f}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                This room is unfurnished.{" "}
                <Link to="/furniture" className="text-accent hover:underline">
                  Browse student furniture
                </Link>{" "}
                to kit it out cheaply.
              </p>
            )}

            <Separator className="my-8" />

            <h2 className="text-xl">Amenities</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {room.amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
                >
                  {a}
                </li>
              ))}
            </ul>

            <button className="mt-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
              <Flag className="size-4" /> Report this listing
            </button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="hidden rounded-2xl border border-border bg-card p-6 shadow-card lg:block">
            <p className="font-display text-3xl font-semibold">
              {formatNpr(room.rent)}
              <span className="text-base font-normal text-muted-foreground"> /month</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{room.available}</p>

            <Button className="mt-5 w-full" size="lg">
              <Phone className="size-4" /> Contact owner
            </Button>
            <Button
              variant="outline"
              className="mt-3 w-full"
              size="lg"
              onClick={() => setSaved((s) => !s)}
            >
              <Heart className={cn("size-4", saved && "fill-accent text-accent")} />
              {saved ? "Saved" : "Save listing"}
            </Button>

            <Separator className="my-6" />

            <p className="text-sm font-semibold">{room.owner.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">Listing since {room.owner.since}</p>
            <p className="mt-1 text-sm text-muted-foreground">{room.owner.phone}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Sample listing — contact details are hidden in this demo.
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="flex-1">
          <p className="font-display text-lg font-semibold">{formatNpr(room.rent)}</p>
          <p className="text-xs text-muted-foreground">per month</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Save listing"
          onClick={() => setSaved((s) => !s)}
        >
          <Heart className={cn("size-4", saved && "fill-accent text-accent")} />
        </Button>
        <Button className="flex-1">
          <Phone className="size-4" /> Contact owner
        </Button>
      </div>
    </div>
  );
}

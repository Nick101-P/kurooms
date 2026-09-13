import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, MapPin, Navigation, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Room } from "@/data/listings";
import { formatNpr } from "@/data/listings";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RoomCard({ room }: { room: Room }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={room.images[0]}
          alt={room.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Top Badges */}
        <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full badge-glass px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            {room.type}
          </span>
          {room.furnished && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
              <Sparkles className="size-3" /> Furnished
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save listing"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          className="absolute right-3.5 top-3.5 z-10 flex size-9 items-center justify-center rounded-full badge-glass text-foreground shadow-sm transition-transform active:scale-90 hover:scale-105"
        >
          <Heart className={cn("size-4 transition-colors", saved && "fill-accent text-accent")} />
        </button>

        {/* Verified Badge pill over image */}
        {room.verified && (
          <div className="absolute bottom-3 left-3.5 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold text-success backdrop-blur-md shadow-sm">
            <BadgeCheck className="size-3.5" /> Verified
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            <Link
              to="/rooms/$roomId"
              params={{ roomId: room.id }}
              className="after:absolute after:inset-0"
            >
              {room.title}
            </Link>
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-accent" /> {room.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Navigation className="size-3.5 text-primary" /> {room.distanceKm} km from KU
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-3.5">
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              {formatNpr(room.rent)}
            </span>
            <span className="text-xs font-medium text-muted-foreground"> /month</span>
          </div>
          <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {room.available}
          </span>
        </div>
      </div>
    </article>
  );
}

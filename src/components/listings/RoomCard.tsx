import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import type { Room } from "@/data/listings";
import { formatNpr } from "@/data/listings";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RoomCard({ room }: { room: Room }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={room.images[0]}
          alt={room.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-background/90 text-foreground shadow-sm">{room.type}</Badge>
          {room.furnished && (
            <Badge className="bg-accent text-accent-foreground">Furnished</Badge>
          )}
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save listing"}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
        >
          <Heart className={cn("size-4", saved && "fill-accent text-accent")} />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug">
            <Link to="/rooms/$roomId" params={{ roomId: room.id }} className="after:absolute after:inset-0">
              {room.title}
            </Link>
          </h3>
          {room.verified && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-success">
              <BadgeCheck className="size-4" /> Verified
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-4" /> {room.location}
          </span>
          <span className="flex items-center gap-1">
            <Navigation className="size-4" /> {room.distanceKm} km from KU
          </span>
        </div>

        <div className="flex items-end justify-between pt-1">
          <p className="font-display text-xl font-semibold">
            {formatNpr(room.rent)}
            <span className="text-sm font-normal text-muted-foreground"> /month</span>
          </p>
          <span className="text-xs text-muted-foreground">{room.available}</span>
        </div>
      </div>
    </article>
  );
}

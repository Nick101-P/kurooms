import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { FurnitureItem } from "@/data/listings";
import { formatNpr } from "@/data/listings";
import { Badge } from "@/components/ui/badge";

export function FurnitureCard({ item }: { item: FurnitureItem }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-lift">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={item.images[0]}
          alt={item.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{item.category}</Badge>
          <span className="text-xs text-muted-foreground">{item.condition}</span>
        </div>
        <h3 className="text-sm font-semibold leading-snug">
          <Link
            to="/furniture/$itemId"
            params={{ itemId: item.id }}
            className="after:absolute after:inset-0"
          >
            {item.title}
          </Link>
        </h3>
        <p className="font-display text-lg font-semibold">{formatNpr(item.price)}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {item.location}
        </p>
      </div>
    </article>
  );
}

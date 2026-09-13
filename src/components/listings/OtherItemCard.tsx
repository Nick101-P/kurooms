import { Link } from "@tanstack/react-router";
import { MapPin, Tag } from "lucide-react";
import type { OtherItem } from "@/data/listings";
import { formatNpr } from "@/data/listings";
import { Badge } from "@/components/ui/badge";

export function OtherItemCard({ item }: { item: OtherItem }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={item.images[0]}
          alt={item.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full badge-glass px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            <Tag className="size-3 text-accent" /> {item.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-background/85 px-2 py-0.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          {item.condition}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-display text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            <Link
              to="/others/$itemId"
              params={{ itemId: item.id }}
              className="after:absolute after:inset-0"
            >
              {item.title}
            </Link>
          </h3>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-2.5">
          <p className="font-display text-base font-bold text-foreground">
            {formatNpr(item.price)}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 text-accent" /> {item.location}
          </p>
        </div>
      </div>
    </article>
  );
}

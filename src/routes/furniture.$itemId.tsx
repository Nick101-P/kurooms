import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FURNITURE, formatNpr } from "@/data/listings";
import { listingsStore, useListingsStore } from "@/data/listingsStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/furniture/$itemId")({
  loader: ({ params }) => {
    const item =
      listingsStore.getSnapshot().furniture.find((f) => f.id === params.itemId) ??
      FURNITURE.find((f) => f.id === params.itemId);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Item unavailable — BasaiKU" }, { name: "robots", content: "noindex" }],
      };
    }
    const { item } = loaderData;
    const title = `${item.title} — ${formatNpr(item.price)} in ${item.location}`;
    const description = `${item.condition} ${item.category.toLowerCase()} for sale near Kathmandu University. ${item.description}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: item.images[0] as string },
        { name: "twitter:image", content: item.images[0] as string },
      ],
    };
  },
  component: FurnitureDetailPage,
});

function FurnitureDetailPage() {
  const { item: initialItem } = Route.useLoaderData();
  const { furniture } = useListingsStore();
  const item = furniture.find((f) => f.id === initialItem.id) ?? initialItem;
  const [saved, setSaved] = useState(false);

  return (
    <div className="container-page py-6">
      <Link
        to="/furniture"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to furniture
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img
            src={item.images[0]}
            alt={item.title}
            className="aspect-square w-full object-cover sm:aspect-[4/3]"
          />
        </div>

        <div>
          <Badge variant="secondary">{item.category}</Badge>
          <h1 className="mt-3 text-3xl">{item.title}</h1>
          <p className="mt-3 font-display text-3xl font-semibold">{formatNpr(item.price)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span>Condition: {item.condition}</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {item.location}
            </span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-foreground/90">{item.description}</p>

          <Button className="mt-6 w-full" size="lg" asChild>
            <a href={`tel:${item.seller.phone}`}>
              <Phone className="size-4" /> Contact seller
            </a>
          </Button>
          <Button
            variant="outline"
            className="mt-3 w-full"
            size="lg"
            onClick={() => setSaved((s) => !s)}
          >
            <Heart className={cn("size-4", saved && "fill-accent text-accent")} />
            {saved ? "Saved" : "Save item"}
          </Button>

          <Separator className="my-6" />

          <p className="text-sm font-semibold">{item.seller.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.seller.phone}</p>
        </div>
      </div>
    </div>
  );
}

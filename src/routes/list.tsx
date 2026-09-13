import { createFileRoute } from "@tanstack/react-router";
import { ListingFlow } from "@/components/listing-flow/ListingFlow";

export const Route = createFileRoute("/list")({
  head: () => ({
    meta: [
      { title: "Create a listing — BasaiKU" },
      {
        name: "description",
        content: "List a room, furniture, item, or student service near Kathmandu University.",
      },
      { property: "og:title", content: "Create a listing — BasaiKU" },
      {
        property: "og:description",
        content: "Offer rooms, furniture, useful items, and services to KU students around Dhulikhel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListingPage,
});

function ListingPage() {
  return <ListingFlow />;
}
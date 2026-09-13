import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarIcon,
  Camera,
  Check,
  ChevronRight,
  GripVertical,
  House,
  ImagePlus,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  Sofa,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LOCATIONS } from "@/data/listings";
import { listingsStore } from "@/data/listingsStore";
import { cn } from "@/lib/utils";

type ListingKind = "room" | "furniture" | "item" | "service";
type Errors = {
  title?: string | undefined;
  price?: string | undefined;
  category?: string | undefined;
  location?: string | undefined;
  furnishing?: string | undefined;
  availableFrom?: string | undefined;
  description?: string | undefined;
  condition?: string | undefined;
  photos?: string | undefined;
};
type Photo = { id: string; name: string; url: string };

type ListingData = {
  title: string;
  price: string;
  deposit: string;
  category: string;
  condition: string;
  location: string;
  landmark: string;
  furnishing: string;
  furniture: string[];
  amenities: string[];
  availableFrom?: Date;
  description: string;
  photos: Photo[];
};

const initialData: ListingData = {
  title: "",
  price: "",
  deposit: "",
  category: "",
  condition: "",
  location: "",
  landmark: "",
  furnishing: "",
  furniture: [],
  amenities: [],
  description: "",
  photos: [],
};

const OPTIONS = {
  room: {
    icon: House,
    title: "List a Room",
    description: "Rent out a room, flat, hostel space, or student accommodation.",
  },
  furniture: {
    icon: Sofa,
    title: "Sell Furniture",
    description: "Sell beds, tables, chairs, mattresses, wardrobes, shelves, and more.",
  },
  item: {
    icon: Package,
    title: "List an Item",
    description: "Sell electronics, books, appliances, bicycles, kitchen items, and other things.",
  },
  service: {
    icon: Wrench,
    title: "Offer a Service",
    description: "Offer moving, cleaning, repairs, tutoring, or other student services.",
  },
} as const;

const ROOM_STEPS = ["Basics", "Location", "Details", "Photos", "Preview"];
const SHORT_STEPS = ["Details", "Photos", "Preview"];
const ROOM_TYPES = ["Single", "Shared", "Flat", "Hostel"];
const FURNISHING = ["Fully furnished", "Partially furnished", "Unfurnished"];
const FURNITURE = ["Bed", "Mattress", "Study table", "Chair", "Wardrobe", "Shelf", "Other"];
const AMENITIES = [
  "Wi-Fi",
  "Hot water",
  "Attached bathroom",
  "Shared bathroom",
  "Kitchen",
  "Parking",
  "Balcony",
  "Washing machine",
  "Electricity included",
  "Water included",
];
const CATEGORIES: Record<Exclude<ListingKind, "room">, string[]> = {
  furniture: [
    "Bed",
    "Mattress",
    "Study table",
    "Chair",
    "Wardrobe",
    "Shelf",
    "Sofa",
    "Appliance",
    "Other",
  ],
  item: [
    "Electronics",
    "Books",
    "Bicycle",
    "Kitchen",
    "Appliances",
    "Clothing",
    "Moving supplies",
    "Other",
  ],
  service: [
    "Moving",
    "Cleaning",
    "Repairs",
    "Tutoring",
    "Internet setup",
    "Photography",
    "Delivery",
    "Other",
  ],
};
const CONDITIONS = ["New", "Like New", "Good", "Used"];
const LOCATION_DISTANCE: Record<string, string> = {
  "Dhulikhel Bazaar": "1.2 km",
  "Kavre, near KU gate": "0.4 km",
  Shreekhandapur: "2.6 km",
  "Dhulikhel, Hospital road": "1.5 km",
  "Panauti road": "3.8 km",
  Banepa: "6.2 km",
};

const requiredText = z.string().trim().min(1, "This field is required");
const positivePrice = z
  .string()
  .refine((value) => Number(value) > 0, "Enter a valid positive amount");
const descriptionSchema = z
  .string()
  .trim()
  .min(30, "Add at least 30 characters so students have enough detail");

export function ListingFlow() {
  const [kind, setKind] = useState<ListingKind | null>(null);
  const [selectedKind, setSelectedKind] = useState<ListingKind | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ListingData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData), [data]);
  const steps = kind === "room" ? ROOM_STEPS : SHORT_STEPS;

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || published) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty, published]);

  const update = <K extends keyof ListingData>(key: K, value: ListingData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const chooseKind = (nextKind: ListingKind) => {
    setSelectedKind(nextKind);
    window.setTimeout(() => {
      setKind(nextKind);
      setStep(0);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 140);
  };

  const validateStep = () => {
    if (!kind) return false;
    const next: Errors = {};
    const validate = (field: keyof Errors, schema: z.ZodTypeAny, value: unknown) => {
      const result = schema.safeParse(value);
      if (!result.success) next[field] = result.error.issues[0]?.message ?? "Check this field";
    };

    if (kind === "room") {
      if (step === 0) {
        validate("title", requiredText, data.title);
        validate("price", positivePrice, data.price);
        validate("category", requiredText, data.category);
      }
      if (step === 1) validate("location", requiredText, data.location);
      if (step === 2) {
        validate("furnishing", requiredText, data.furnishing);
        validate(
          "availableFrom",
          z.date({ required_error: "Choose an availability date" }),
          data.availableFrom,
        );
        validate("description", descriptionSchema, data.description);
      }
      if (step === 3 && data.photos.length === 0)
        next.photos = "Add at least one photo before continuing";
    } else if (step === 0) {
      validate("category", requiredText, data.category);
      validate("title", requiredText, data.title);
      validate("price", positivePrice, data.price);
      validate("location", requiredText, data.location);
      validate("description", descriptionSchema, data.description);
      if (kind !== "service") validate("condition", requiredText, data.condition);
    } else if (step === 1 && data.photos.length === 0) {
      next.photos = "Add at least one photo before continuing";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (step > 0) {
      setStep((current) => current - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (isDirty) setLeaveOpen(true);
    else setKind(null);
  };

  const leave = () => {
    data.photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setData(initialData);
    setKind(null);
    setStep(0);
    setLeaveOpen(false);
    setErrors({});
  };

  const publish = () => {
    setPublishing(true);
    const id = `user-${Date.now()}`;
    const fallbackImage =
      kind === "room"
        ? "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=70"
        : "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=70";
    const images = data.photos.length > 0 ? data.photos.map((p) => p.url) : [fallbackImage];

    if (kind === "room") {
      listingsStore.addRoom({
        id,
        title: data.title || "Sunny room near KU",
        location: data.location || "Dhulikhel Bazaar",
        distanceKm: parseFloat(LOCATION_DISTANCE[data.location]?.replace(" km", "") || "1.2"),
        rent: Number(data.price) || 5000,
        type: (data.category as "Single" | "Shared" | "Flat" | "Hostel") || "Single",
        furnished: data.furnishing.toLowerCase().includes("furnished"),
        verified: false,
        available: data.availableFrom
          ? `Available from ${format(data.availableFrom, "MMMM d")}`
          : "Available now",
        amenities: data.amenities.length > 0 ? data.amenities : ["Wi-Fi", "Water tank"],
        includedFurniture: data.furniture,
        description: data.description || "Student-friendly room listed by owner.",
        images,
        owner: { name: "You (KU Student)", phone: "+977 98•• ••0000", since: "2026" },
      });
    } else if (kind === "furniture") {
      listingsStore.addFurniture({
        id,
        title: data.title || "Student furniture",
        category: (data.category as never) || "Table",
        price: Number(data.price) || 2000,
        condition: (data.condition as "New" | "Like new" | "Good" | "Used") || "Good",
        location: data.location || "Dhulikhel Bazaar",
        description: data.description || "In good condition, moving out sale.",
        images,
        seller: { name: "You (KU Student)", phone: "+977 98•• ••0000" },
      });
    } else {
      listingsStore.addOtherItem({
        id,
        title: data.title || "Student item",
        category: (data.category as never) || "Other",
        price: Number(data.price) || 1500,
        condition: (data.condition as "New" | "Like new" | "Good" | "Used") || "Good",
        location: data.location || "Dhulikhel Bazaar",
        description: data.description || "Student item on sale near KU.",
        images,
        seller: { name: "You (KU Student)", phone: "+977 98•• ••0000" },
      });
    }

    window.setTimeout(() => {
      setPublishing(false);
      setPublished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  if (published && kind) {
    return (
      <PublishedState
        kind={kind}
        title={data.title}
        onAnother={() => {
          setPublished(false);
          leave();
        }}
      />
    );
  }

  if (!kind) return <TypeSelection selected={selectedKind} onSelect={chooseKind} />;

  const finalStep = step === steps.length - 1;
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface/60 pb-24 md:pb-12">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-10">
        <button
          type="button"
          onClick={back}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <StepHeader kind={kind} step={step} steps={steps} />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
            {kind === "room" ? (
              <RoomStep step={step} data={data} errors={errors} update={update} />
            ) : (
              <ShortStep kind={kind} step={step} data={data} errors={errors} update={update} />
            )}
            <div className="mt-8 hidden items-center justify-between border-t border-border pt-6 md:flex">
              <Button type="button" variant="outline" onClick={back}>
                <ArrowLeft className="size-4" /> {finalStep ? "Edit" : "Back"}
              </Button>
              <Button type="button" onClick={finalStep ? publish : nextStep} disabled={publishing}>
                {publishing ? <Loader2 className="size-4 animate-spin" /> : null}
                {finalStep ? "Publish listing" : "Continue"}
                {!finalStep && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </section>
          <ListingTips kind={kind} step={step} data={data} />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Button type="button" variant="outline" className="min-w-28" onClick={back}>
            <ArrowLeft className="size-4" /> {finalStep ? "Edit" : "Back"}
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={finalStep ? publish : nextStep}
            disabled={publishing}
          >
            {publishing && <Loader2 className="size-4 animate-spin" />}
            {finalStep ? "Publish listing" : "Continue"}
            {!finalStep && <ArrowRight className="size-4" />}
          </Button>
        </div>
      </div>
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost if you leave this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel className="mt-0">Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={leave}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TypeSelection({
  selected,
  onSelect,
}: {
  selected: ListingKind | null;
  onSelect: (kind: ListingKind) => void;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface/60">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Sparkles className="size-6" />
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl">What would you like to list?</h1>
          <p className="mt-3 text-muted-foreground">
            Choose what you want to offer to KU students.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {(Object.entries(OPTIONS) as [ListingKind, (typeof OPTIONS)[ListingKind]][]).map(
            ([key, option]) => {
              const Icon = option.icon;
              const active = selected === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => onSelect(key)}
                  aria-pressed={active}
                  className={cn(
                    "group flex min-h-44 w-full flex-col items-start rounded-2xl border bg-card p-6 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-secondary/60 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active && "border-primary bg-secondary ring-2 ring-primary/15",
                  )}
                >
                  <div className="flex w-full items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Icon className="size-6" />
                    </span>
                    <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h2 className="mt-5 text-xl">{option.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            },
          )}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <ShieldCheck className="mr-1 inline size-4 text-success" /> You can review everything
          before publishing.
        </p>
      </div>
    </div>
  );
}

function StepHeader({ kind, step, steps }: { kind: ListingKind; step: number; steps: string[] }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">{OPTIONS[kind].title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </p>
        </div>
        <span className="text-sm font-semibold">{steps[step]}</span>
      </div>
      <Progress value={((step + 1) / steps.length) * 100} className="mt-4 h-1.5" />
      <div className="mt-3 hidden grid-cols-5 gap-2 text-xs text-muted-foreground sm:grid">
        {steps.map((label, index) => (
          <span key={label} className={cn(index <= step && "font-semibold text-primary")}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

type StepProps = {
  data: ListingData;
  errors: Errors;
  update: <K extends keyof ListingData>(key: K, value: ListingData[K]) => void;
};

function RoomStep({ step, data, errors, update }: StepProps & { step: number }) {
  if (step === 0) return <RoomBasics data={data} errors={errors} update={update} />;
  if (step === 1) return <RoomLocation data={data} errors={errors} update={update} />;
  if (step === 2) return <RoomDetails data={data} errors={errors} update={update} />;
  if (step === 3) return <PhotoStep data={data} errors={errors} update={update} room />;
  return <ListingPreview kind="room" data={data} />;
}

function RoomBasics({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepTitle
        title="Tell us about the room"
        subtitle="Start with the details students compare first."
      />
      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <Field label="Listing title" error={errors.title} className="sm:col-span-2">
          <Input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            maxLength={80}
            placeholder="e.g. Sunny single room near KU"
            className="h-11"
          />
        </Field>
        <MoneyField
          label="Monthly rent"
          value={data.price}
          onChange={(value) => update("price", value)}
          error={errors.price}
          required
        />
        <MoneyField
          label="Security deposit"
          value={data.deposit}
          onChange={(value) => update("deposit", value)}
          hint="Optional"
        />
        <Field label="Room type" error={errors.category} className="sm:col-span-2">
          <ChoiceCards
            options={ROOM_TYPES}
            value={data.category}
            onChange={(value) => update("category", value)}
            columns="grid-cols-2 sm:grid-cols-4"
          />
        </Field>
      </div>
    </div>
  );
}

function RoomLocation({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepTitle
        title="Where is the room located?"
        subtitle="Help students understand the commute without exposing your exact address."
      />
      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <Field label="Area" error={errors.location}>
          <Select value={data.location} onValueChange={(value) => update("location", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose an area">
                {data.location || "Choose an area"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Nearby landmark">
          <Input
            value={data.landmark}
            onChange={(e) => update("landmark", e.target.value)}
            maxLength={100}
            placeholder="e.g. Near KU Gate"
            className="h-11"
          />
        </Field>
        <div className="sm:col-span-2">
          <Label>Exact location</Label>
          <MapPicker />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
            <MapPin className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Distance from Kathmandu University</p>
            <p className="text-sm text-muted-foreground">
              {data.location
                ? `${LOCATION_DISTANCE[data.location] ?? "Automatically calculated"} from KU`
                : "Automatically calculated"}
            </p>
          </div>
        </div>
        <p className="sm:col-span-2 flex gap-2 text-sm leading-6 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> Your exact address will
          not be publicly displayed unless you choose to share it.
        </p>
      </div>
    </div>
  );
}

function MapPicker() {
  const [pin, setPin] = useState({ x: 56, y: 49 });
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPin({
      x: Math.max(5, Math.min(95, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(8, Math.min(92, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  };
  return (
    <div
      onPointerDown={move}
      onPointerMove={move}
      className="relative mt-2 h-64 touch-none overflow-hidden rounded-xl border border-border bg-secondary cursor-crosshair"
      aria-label="Map location selector"
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      <div className="absolute left-6 top-8 h-2 w-2/3 rotate-6 rounded-full bg-background" />
      <div className="absolute bottom-14 right-0 h-2 w-3/4 -rotate-12 rounded-full bg-background" />
      <span className="absolute left-4 top-4 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold shadow-card">
        Drag the pin to the exact spot
      </span>
      <MapPin
        className="absolute size-9 -translate-x-1/2 -translate-y-full fill-accent text-accent drop-shadow"
        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
      />
    </div>
  );
}

function RoomDetails({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepTitle
        title="What does the room offer?"
        subtitle="Clear details help students decide whether the room fits their daily life."
      />
      <div className="mt-7 space-y-8">
        <Field label="Furnishing" error={errors.furnishing}>
          <ChoiceCards
            options={FURNISHING}
            value={data.furnishing}
            onChange={(value) => update("furnishing", value)}
            columns="sm:grid-cols-3"
          />
        </Field>
        <Field label="Furniture included">
          <CheckboxGrid
            options={FURNITURE}
            value={data.furniture}
            onChange={(value) => update("furniture", value)}
          />
        </Field>
        <Field label="Amenities">
          <CheckboxGrid
            options={AMENITIES}
            value={data.amenities}
            onChange={(value) => update("amenities", value)}
          />
        </Field>
        <Field label="Available from" error={errors.availableFrom}>
          <DatePicker
            value={data.availableFrom}
            onChange={(value) => update("availableFrom", value)}
          />
        </Field>
        <Field
          label="Description"
          error={errors.description}
          hint={`${data.description.length}/700`}
        >
          <Textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            maxLength={700}
            rows={7}
            placeholder="Describe the room, house rules, nearby facilities, and anything students should know."
          />
        </Field>
      </div>
    </div>
  );
}

function ShortStep({
  kind,
  step,
  data,
  errors,
  update,
}: StepProps & { kind: Exclude<ListingKind, "room">; step: number }) {
  if (step === 1) return <PhotoStep data={data} errors={errors} update={update} />;
  if (step === 2) return <ListingPreview kind={kind} data={data} />;
  const heading =
    kind === "furniture" ? "Sell furniture" : kind === "item" ? "List an item" : "Offer a service";
  return (
    <div>
      <StepTitle title={heading} subtitle="Add the essentials students need to decide quickly." />
      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <Field
          label={kind === "service" ? "Service category" : "Category"}
          error={errors.category}
          className="sm:col-span-2"
        >
          <ChoiceCards
            options={CATEGORIES[kind]}
            value={data.category}
            onChange={(value) => update("category", value)}
            columns="grid-cols-2 sm:grid-cols-3"
            compact
          />
        </Field>
        <Field
          label={kind === "service" ? "Service title" : kind === "item" ? "Item title" : "Title"}
          error={errors.title}
        >
          <Input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            maxLength={80}
            placeholder={
              kind === "furniture"
                ? "Wooden study table"
                : kind === "service"
                  ? "Affordable room moving help"
                  : "Item title"
            }
            className="h-11"
          />
        </Field>
        <MoneyField
          label={kind === "service" ? "Price / Starting price" : "Price"}
          value={data.price}
          onChange={(value) => update("price", value)}
          error={errors.price}
          required
        />
        {kind !== "service" && (
          <Field label="Condition" error={errors.condition}>
            <ChoiceCards
              options={CONDITIONS}
              value={data.condition}
              onChange={(value) => update("condition", value)}
              columns="grid-cols-2"
              compact
            />
          </Field>
        )}
        <Field
          label={kind === "service" ? "Location / Service area" : "Location"}
          error={errors.location}
        >
          <Select value={data.location} onValueChange={(value) => update("location", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose an area">
                {data.location || "Choose an area"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Description"
          error={errors.description}
          hint={`${data.description.length}/700`}
          className="sm:col-span-2"
        >
          <Textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            maxLength={700}
            rows={7}
            placeholder="Share condition, dimensions, pickup details, or anything students should know."
          />
        </Field>
      </div>
    </div>
  );
}

function PhotoStep({ data, errors, update, room = false }: StepProps & { room?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const images = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 10 - data.photos.length)
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    update("photos", [...data.photos, ...images]);
  };
  const remove = (id: string) => {
    const photo = data.photos.find((item) => item.id === id);
    if (photo) URL.revokeObjectURL(photo.url);
    update(
      "photos",
      data.photos.filter((item) => item.id !== id),
    );
  };
  const reorder = (fromId: string, toId: string) => {
    const from = data.photos.findIndex((photo) => photo.id === fromId);
    const to = data.photos.findIndex((photo) => photo.id === toId);
    if (from < 0 || to < 0) return;
    const next = [...data.photos];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    update("photos", next);
  };
  const moveBy = (index: number, direction: number) => {
    const to = index + direction;
    if (to < 0 || to >= data.photos.length) return;
    const next = [...data.photos];
    const current = next[index];
    if (!current) return;
    next[index] = next[to] as Photo;
    next[to] = current;
    update("photos", next);
  };
  return (
    <div>
      <StepTitle
        title="Add photos"
        subtitle="Good photos help students understand the place before contacting you."
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "mt-7 flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center transition-colors hover:border-primary hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging && "border-primary bg-secondary",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-card text-primary shadow-card">
          <ImagePlus className="size-6" />
        </span>
        <span className="mt-4 font-semibold">+ Add photos</span>
        <span className="mt-1 text-sm text-muted-foreground">
          Drag and drop your photos here or browse
        </span>
        <span className="mt-3 text-xs text-muted-foreground">
          JPG, PNG or WebP · up to 10 photos
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {errors.photos && (
        <p className="mt-2 text-sm font-medium text-destructive">{errors.photos}</p>
      )}
      {data.photos.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.photos.map((photo, index) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => setDraggedId(photo.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedId) reorder(draggedId, photo.id);
                setDraggedId(null);
              }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card"
            >
              <img
                src={photo.url}
                alt={`Uploaded preview ${index + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">
                  Cover photo
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-foreground/75 p-2 text-background">
                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-background hover:bg-background/20 hover:text-background"
                    onClick={() => moveBy(index, -1)}
                    disabled={index === 0}
                    aria-label="Move photo left"
                  >
                    <ArrowLeft className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-background hover:bg-background/20 hover:text-background"
                    onClick={() => moveBy(index, 1)}
                    disabled={index === data.photos.length - 1}
                    aria-label="Move photo right"
                  >
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
                <GripVertical className="size-4" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-background hover:bg-background/20 hover:text-background"
                  onClick={() => remove(photo.id)}
                  aria-label={`Remove ${photo.name}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex gap-3 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
        <Camera className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          <strong className="text-foreground">Recommended:</strong>{" "}
          {room
            ? "Add photos of the bedroom, bathroom, kitchen, exterior, and surroundings."
            : "Use bright, clear photos from a few angles and show any important details."}
        </p>
      </div>
    </div>
  );
}

function ListingPreview({ kind, data }: { kind: ListingKind; data: ListingData }) {
  const title = data.title || (kind === "room" ? "Sunny single room near KU" : OPTIONS[kind].title);
  const price = Number(data.price || 12000).toLocaleString("en-IN");
  const fallback =
    kind === "room"
      ? "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
      : "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80";
  const photos = data.photos.length ? data.photos.map((photo) => photo.url) : [fallback];
  return (
    <div>
      <StepTitle
        title="Review your listing"
        subtitle="This is how your listing will appear to students."
      />
      <article className="mt-7 overflow-hidden rounded-2xl border border-border bg-background shadow-card">
        <div className="grid gap-1 sm:grid-cols-[2fr_1fr]">
          <img
            src={photos[0]}
            alt="Listing cover preview"
            className="aspect-[16/10] h-full w-full object-cover"
          />
          <div className="hidden grid-rows-2 gap-1 sm:grid">
            {photos.slice(1, 3).map((photo, index) => (
              <img
                key={photo}
                src={photo}
                alt={`Listing preview ${index + 2}`}
                className="h-full min-h-0 w-full object-cover"
              />
            ))}
            {photos.length === 1 && (
              <div className="grid h-full place-items-center bg-secondary text-muted-foreground">
                <Camera className="size-7" />
              </div>
            )}
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl">{title}</h2>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4 text-accent" /> {data.location || "Dhulikhel"}
                {kind === "room"
                  ? ` · ${LOCATION_DISTANCE[data.location] ?? "1.2 km"} from KU`
                  : ""}
              </p>
            </div>
            <p className="text-xl font-bold text-primary">
              NPR {price}
              {kind === "room" ? (
                <span className="text-sm font-normal text-muted-foreground"> / month</span>
              ) : null}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[data.category, data.furnishing, data.condition].filter(Boolean).map((value) => (
              <span
                key={value}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold"
              >
                {value}
              </span>
            ))}
          </div>
          {kind === "room" && data.furniture.length > 0 && (
            <PreviewList title="Furniture" items={data.furniture} />
          )}
          {kind === "room" && data.amenities.length > 0 && (
            <PreviewList title="Amenities" items={data.amenities} />
          )}
          {kind === "room" && (
            <div className="mt-6 border-t border-border pt-5">
              <h3 className="text-sm font-semibold">Availability</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Available from{" "}
                {data.availableFrom
                  ? format(data.availableFrom, "MMMM d, yyyy")
                  : "September 20, 2026"}
              </p>
            </div>
          )}
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-sm font-semibold">Description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {data.description ||
                "A clear, student-friendly listing with everything needed to make a confident decision."}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
              <BadgeCheck className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Listed by</p>
              <p className="text-sm font-semibold">Verified owner</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function PreviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4 text-success" /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListingTips({ kind, step, data }: { kind: ListingKind; step: number; data: ListingData }) {
  const hints =
    kind === "room"
      ? [
          "Lead with monthly rent",
          "Use a nearby landmark",
          "Mention house rules",
          "Upload bright, recent photos",
          "Check every detail",
        ]
      : ["Keep the title specific", "Be honest about condition", "Use clear natural light"];
  return (
    <aside className="sticky top-24 hidden rounded-2xl border border-border bg-card p-5 shadow-card lg:block">
      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
        <BookOpen className="size-5" />
      </div>
      <h2 className="mt-4 text-lg">Make it easy to trust</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Students decide faster when the practical details are clear and the photos feel honest.
      </p>
      <ul className="mt-5 space-y-3">
        {hints.map((hint, index) => (
          <li
            key={hint}
            className={cn(
              "flex items-center gap-2 text-sm",
              index <= step ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border text-[10px]",
                index <= step && "border-primary bg-primary text-primary-foreground",
              )}
            >
              {index <= step ? <Check className="size-3" /> : index + 1}
            </span>
            {hint}
          </li>
        ))}
      </ul>
      {data.price && (
        <div className="mt-6 rounded-xl bg-secondary/60 p-4">
          <p className="text-xs text-muted-foreground">Your price</p>
          <p className="mt-1 font-semibold">
            NPR {Number(data.price).toLocaleString("en-IN")}
            {kind === "room" ? " / month" : ""}
          </p>
        </div>
      )}
    </aside>
  );
}

function PublishedState({
  kind,
  title,
  onAnother,
}: {
  kind: ListingKind;
  title: string;
  onAnother: () => void;
}) {
  return (
    <div className="min-h-[70vh] bg-surface/60 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-card sm:p-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl">Your listing is ready</h1>
        <p className="mt-3 text-muted-foreground">
          <strong className="text-foreground">{title || OPTIONS[kind].title}</strong> has been
          published for KU students to discover.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={onAnother}>
            Create another
          </Button>
          <Button asChild>
            {kind === "room" ? (
              <Link to="/rooms">
                View marketplace <ArrowRight className="size-4" />
              </Link>
            ) : kind === "furniture" ? (
              <Link to="/furniture">
                View marketplace <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link to="/others">
                View marketplace <ArrowRight className="size-4" />
              </Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <Label>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
}) {
  return (
    <Field label={label} error={error} hint={hint}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
          NPR
        </span>
        <Input
          type="number"
          min="0"
          step="100"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="h-11 pl-14"
        />
      </div>
    </Field>
  );
}

function ChoiceCards({
  options,
  value,
  onChange,
  columns,
  compact = false,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  columns: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", columns)}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            "flex items-center justify-between rounded-xl border border-border bg-background p-4 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            compact && "min-h-12 p-3",
            value === option && "border-primary bg-secondary text-primary ring-1 ring-primary/20",
          )}
        >
          <span>{option}</span>
          {value === option && <Check className="size-4" />}
        </button>
      ))}
    </div>
  );
}

function CheckboxGrid({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => {
        const checked = value.includes(option);
        return (
          <label
            key={option}
            className={cn(
              "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3 text-sm transition-colors hover:border-primary",
              checked && "border-primary bg-secondary",
            )}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(next) =>
                onChange(next ? [...value, option] : value.filter((item) => item !== option))
              }
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function DatePicker({
  value,
  onChange,
}: {
  value?: Date | undefined;
  onChange: (date: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? format(value, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={{ before: new Date() }}
          initialFocus
          className="pointer-events-auto p-3"
        />
      </PopoverContent>
    </Popover>
  );
}

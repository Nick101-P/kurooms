export type RoomType = "Single" | "Shared" | "Flat" | "Hostel";
export type FurnitureCategory =
  "Bed" | "Mattress" | "Table" | "Chair" | "Wardrobe" | "Shelf" | "Appliance" | "Other";

export interface Room {
  id: string;
  title: string;
  location: string;
  distanceKm: number;
  rent: number;
  type: RoomType;
  furnished: boolean;
  verified: boolean;
  available: string;
  amenities: string[];
  includedFurniture: string[];
  description: string;
  images: string[];
  owner: { name: string; phone: string; since: string };
}

export interface FurnitureItem {
  id: string;
  title: string;
  category: FurnitureCategory;
  price: number;
  condition: "New" | "Like new" | "Good" | "Used";
  location: string;
  description: string;
  images: string[];
  seller: { name: string; phone: string };
}

export type OtherItemCategory =
  "Electronics" | "Books" | "Bicycle" | "Kitchen" | "Appliances" | "Music & Sports" | "Other";

export interface OtherItem {
  id: string;
  title: string;
  category: OtherItemCategory;
  price: number;
  condition: "New" | "Like new" | "Good" | "Used";
  location: string;
  description: string;
  images: string[];
  seller: { name: string; phone: string };
}

export interface ReportedListing {
  id: string;
  targetId: string;
  targetType: "room" | "furniture" | "other";
  targetTitle: string;
  reporterName: string;
  reason: string;
  date: string;
  status: "pending" | "resolved" | "dismissed";
}

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const ROOMS: Room[] = [
  {
    id: "banepa-sunny-single",
    title: "Sunny single room with hill view",
    location: "Dhulikhel Bazaar",
    distanceKm: 0.8,
    rent: 6500,
    type: "Single",
    furnished: true,
    verified: true,
    available: "Available now",
    amenities: ["Wi-Fi", "Hot water", "Attached bathroom", "Water tank"],
    includedFurniture: ["Bed", "Mattress", "Study table", "Chair", "Wardrobe"],
    description:
      "A bright top-floor room a short walk from Dhulikhel Bazaar. Big window facing the hills, quiet building with mostly KU students, and a landlord who lives on the ground floor.",
    images: [
      img("1505693416388-ac5ce068fe85"),
      img("1522708323590-d24dbb6b0267"),
      img("1560448204-e02f11c3d0e2"),
    ],
    owner: { name: "Sabina Shrestha", phone: "+977 98•• ••4412", since: "2023" },
  },
  {
    id: "ku-gate-shared",
    title: "Shared twin room, 5 min from KU gate",
    location: "Kavre, near KU gate",
    distanceKm: 0.4,
    rent: 4000,
    type: "Shared",
    furnished: true,
    verified: true,
    available: "From Ashwin 1",
    amenities: ["Wi-Fi", "Shared kitchen", "Hot water", "Terrace"],
    includedFurniture: ["Bunk bed", "Mattress", "Study table", "Shelf"],
    description:
      "Budget twin-sharing room in a student house right beside the KU gate. Rent shown is per person and includes water.",
    images: [img("1598928506311-c55ded91a20c"), img("1540518614846-7eded433c457")],
    owner: { name: "Ram Bahadur Tamang", phone: "+977 98•• ••1180", since: "2021" },
  },
  {
    id: "dhulikhel-1bhk-flat",
    title: "Quiet 1BHK flat with kitchen",
    location: "Shreekhandapur",
    distanceKm: 2.6,
    rent: 11000,
    type: "Flat",
    furnished: false,
    verified: false,
    available: "Available now",
    amenities: ["Kitchen", "Balcony", "Parking", "24hr water"],
    includedFurniture: [],
    description:
      "Unfurnished one-bedroom flat on the Banepa road side. Good for two friends splitting rent, or a final-year student who cooks.",
    images: [img("1502672260266-1c1ef2d93688"), img("1484154218962-a197022b5858")],
    owner: { name: "Nabin Karki", phone: "+977 98•• ••9021", since: "2024" },
  },
  {
    id: "hostel-seat-dhulikhel",
    title: "Hostel seat with meals included",
    location: "Dhulikhel, Hospital road",
    distanceKm: 1.5,
    rent: 8500,
    type: "Hostel",
    furnished: true,
    verified: true,
    available: "3 seats left",
    amenities: ["Two meals", "Wi-Fi", "Study hall", "Warden"],
    includedFurniture: ["Bed", "Mattress", "Study table", "Locker"],
    description:
      "Managed student hostel with dal bhat twice a day, night study hall and a warden on site. Monthly rate includes food.",
    images: [img("1555854877-bab0e564b8d5"), img("1522771739844-6a9f6d5f14af")],
    owner: { name: "Himalayan Student Hostel", phone: "+977 98•• ••7733", since: "2019" },
  },
  {
    id: "panauti-road-single",
    title: "Furnished single with private balcony",
    location: "Panauti road",
    distanceKm: 3.8,
    rent: 7200,
    type: "Single",
    furnished: true,
    verified: false,
    available: "From next month",
    amenities: ["Wi-Fi", "Balcony", "Hot water", "Solar backup"],
    includedFurniture: ["Bed", "Mattress", "Wardrobe", "Study table"],
    description:
      "Newly painted room with its own balcony looking over the terraced fields. Bus to campus stops right outside.",
    images: [img("1567767292278-a4f21aa2d36e"), img("1616486338812-3dadae4b4ace")],
    owner: { name: "Gita Lama", phone: "+977 98•• ••3355", since: "2022" },
  },
  {
    id: "banepa-budget-shared",
    title: "Cheap shared room in Banepa",
    location: "Banepa",
    distanceKm: 6.2,
    rent: 3200,
    type: "Shared",
    furnished: false,
    verified: false,
    available: "Available now",
    amenities: ["Shared kitchen", "Water tank"],
    includedFurniture: [],
    description:
      "Simple unfurnished shared room in Banepa for students who don't mind the bus ride. Cheapest option on the list.",
    images: [img("1493809842364-78817add7ffb"), img("1524758631624-e2822e304c36")],
    owner: { name: "Krishna Dhakal", phone: "+977 98•• ••6644", since: "2020" },
  },
];

export const FURNITURE: FurnitureItem[] = [
  {
    id: "study-table-oak",
    title: "Wooden study table with drawer",
    category: "Table",
    price: 4500,
    condition: "Good",
    location: "Dhulikhel Bazaar",
    description:
      "Solid sal wood table used for two semesters. One deep drawer, no wobble. Pickup only.",
    images: [img("1518455027359-f3f8164ba6bd")],
    seller: { name: "Aayush K.", phone: "+977 98•• ••2211" },
  },
  {
    id: "single-mattress",
    title: "Single foam mattress, 3 inch",
    category: "Mattress",
    price: 2200,
    condition: "Like new",
    location: "Near KU gate",
    description: "Bought in Baisakh, barely used. Comes with a washed cover.",
    images: [img("1505693314120-0d443867891c")],
    seller: { name: "Prakriti B.", phone: "+977 98•• ••9098" },
  },
  {
    id: "steel-wardrobe",
    title: "Two-door steel wardrobe",
    category: "Wardrobe",
    price: 6800,
    condition: "Good",
    location: "Shreekhandapur",
    description:
      "Lockable steel almirah with hanging rail and three shelves. Small dent on the side.",
    images: [img("1595428774223-ef52624120d2")],
    seller: { name: "Sujan T.", phone: "+977 98•• ••4477" },
  },
  {
    id: "study-chair",
    title: "Rolling study chair",
    category: "Chair",
    price: 3100,
    condition: "Used",
    location: "Banepa",
    description: "Height adjustable, all five wheels working. Fabric slightly faded.",
    images: [img("1580480055273-228ff5388ef8")],
    seller: { name: "Nisha M.", phone: "+977 98•• ••1902" },
  },
  {
    id: "book-shelf",
    title: "Four-tier book shelf",
    category: "Shelf",
    price: 2600,
    condition: "Good",
    location: "Dhulikhel, Hospital road",
    description:
      "Light plywood shelf, easy for one person to carry. Great for engineering textbooks.",
    images: [img("1594620302200-9a762244a156")],
    seller: { name: "Bibek R.", phone: "+977 98•• ••7781" },
  },
  {
    id: "induction-cooker",
    title: "Induction cooktop 2000W",
    category: "Appliance",
    price: 3900,
    condition: "Like new",
    location: "Panauti road",
    description: "Works perfectly, selling because I'm moving into a hostel with meals.",
    images: [img("1585237017125-24baf8d7406f")],
    seller: { name: "Manish G.", phone: "+977 98•• ••5510" },
  },
  {
    id: "wooden-bed-frame",
    title: "Single wooden bed frame",
    category: "Bed",
    price: 7500,
    condition: "Good",
    location: "Dhulikhel Bazaar",
    description: "Sturdy frame with storage underneath. Mattress not included.",
    images: [img("1505692952047-1a78307da8f6")],
    seller: { name: "Sarita P.", phone: "+977 98•• ••3344" },
  },
  {
    id: "table-lamp",
    title: "LED table lamp with clamp",
    category: "Other",
    price: 900,
    condition: "New",
    location: "Near KU gate",
    description: "Extra lamp I never used. Three brightness levels, USB powered.",
    images: [img("1507473885765-e6ed057f782c")],
    seller: { name: "Ashim S.", phone: "+977 98•• ••8823" },
  },
];

export const OTHER_CATEGORIES: OtherItemCategory[] = [
  "Electronics",
  "Books",
  "Bicycle",
  "Kitchen",
  "Appliances",
  "Music & Sports",
  "Other",
];

export const OTHER_ITEMS: OtherItem[] = [
  {
    id: "scientific-calculator-casio",
    title: "Casio fx-991EX ClassWiz Scientific Calculator",
    category: "Electronics",
    price: 1800,
    condition: "Like new",
    location: "Kavre, near KU gate",
    description:
      "Original Casio ClassWiz fx-991EX. Used for two semesters in engineering mathematics. All buttons and solar cell working flawlessly.",
    images: [img("1587145820266-a5951ee6f620")],
    seller: { name: "Prashant R.", phone: "+977 98•• ••9123" },
  },
  {
    id: "mountain-bike-hero",
    title: "Hero Sprint 21-Speed Mountain Bicycle",
    category: "Bicycle",
    price: 9500,
    condition: "Good",
    location: "Dhulikhel Bazaar",
    description:
      "21-speed gear cycle ideal for the uphill Dhulikhel - KU route. Front suspension, newly replaced brake pads and mudguards included.",
    images: [img("1485965120184-e220f721d03e")],
    seller: { name: "Rohan S.", phone: "+977 98•• ••4152" },
  },
  {
    id: "ku-engineering-books-set",
    title: "1st & 2nd Year KU Engineering Textbooks Bundle",
    category: "Books",
    price: 1500,
    condition: "Good",
    location: "Near KU gate",
    description:
      "Complete set of textbooks including Engineering Mathematics by Erwin Kreyszig, Physics, Chemistry, and Basic Electrical. Free handwritten notes included.",
    images: [img("1497633762265-9d179a990aa6")],
    seller: { name: "Dipesh K.", phone: "+977 98•• ••7841" },
  },
  {
    id: "electric-kettle-prestige",
    title: "Prestige 1.5L Stainless Steel Electric Kettle",
    category: "Appliances",
    price: 1100,
    condition: "Good",
    location: "Shreekhandapur",
    description:
      "Fast-boiling 1.5-litre kettle, auto cut-off protection. Lifesaver during winter study nights. Clean interior.",
    images: [img("1544816155-12df9643f363")],
    seller: { name: "Anjali G.", phone: "+977 98•• ••3625" },
  },
  {
    id: "acoustic-guitar-yamaha",
    title: "Yamaha F310 Acoustic Guitar with Padded Bag",
    category: "Music & Sports",
    price: 7200,
    condition: "Like new",
    location: "Dhulikhel, Hospital road",
    description:
      "Rich tone, low action setup, comes with D'Addario strings, tuner, and a waterproof padded gig bag. Selling because of semester load.",
    images: [img("1510915361894-db8b60106cb1")],
    seller: { name: "Suman T.", phone: "+977 98•• ••1489" },
  },
  {
    id: "rice-cooker-baltra",
    title: "Baltra 1.8L Automatic Rice Cooker",
    category: "Kitchen",
    price: 1600,
    condition: "Good",
    location: "Banepa",
    description:
      "Comes with non-stick inner bowl and steamer tray. Perfect for quick student meals in rooms.",
    images: [img("1556911220-e15b29be8c8f")],
    seller: { name: "Kritika M.", phone: "+977 98•• ••8532" },
  },
  {
    id: "dell-24-inch-ips-monitor",
    title: 'Dell 24" Full HD IPS Monitor (HDMI + VGA)',
    category: "Electronics",
    price: 11500,
    condition: "Like new",
    location: "Dhulikhel Bazaar",
    description:
      "75Hz IPS panel with vivid colors and eye-saver mode. Ideal for coding and dual-monitor setup. Original box and cables included.",
    images: [img("1527443224154-c4a3942d3acf")],
    seller: { name: "Bikram N.", phone: "+977 98•• ••6621" },
  },
  {
    id: "badminton-set-yonex",
    title: "Yonex Muscle Power Badminton Rackets (Pair)",
    category: "Music & Sports",
    price: 1900,
    condition: "Good",
    location: "Near KU gate",
    description:
      "Pair of lightweight aluminium-carbon rackets with grip tape and a tube of nylon shuttles. Great for evening matches at the KU court.",
    images: [img("1626224583764-f87db24ac4ea")],
    seller: { name: "Kiran B.", phone: "+977 98•• ••9904" },
  },
];

export const LOCATIONS = [
  "Dhulikhel Bazaar",
  "Kavre, near KU gate",
  "Shreekhandapur",
  "Dhulikhel, Hospital road",
  "Panauti road",
  "Banepa",
];

export const AMENITIES = [
  "Wi-Fi",
  "Hot water",
  "Attached bathroom",
  "Kitchen",
  "Balcony",
  "Parking",
];

export const formatNpr = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

export const MOCK_REPORTS: ReportedListing[] = [
  {
    id: "rep-1",
    targetId: "dhulikhel-1bhk-flat",
    targetType: "room",
    targetTitle: "Quiet 1BHK flat with kitchen",
    reporterName: "KU Student (Batch 2022)",
    reason: "Phone number was unreachable and rent quoted on call was different.",
    date: "2026-09-12",
    status: "pending",
  },
  {
    id: "rep-2",
    targetId: "study-table-oak",
    targetType: "furniture",
    targetTitle: "Wooden study table with drawer",
    reporterName: "Aakash P.",
    reason: "Item was already sold last week but still shown as active.",
    date: "2026-09-10",
    status: "pending",
  },
];

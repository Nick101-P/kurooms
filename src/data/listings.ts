export type RoomType = "Single" | "Shared" | "Flat" | "Hostel";
export type FurnitureCategory =
  | "Bed"
  | "Mattress"
  | "Table"
  | "Chair"
  | "Wardrobe"
  | "Shelf"
  | "Appliance"
  | "Other";

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

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const ROOMS: Room[] = [
  {
    id: "banepa-sunny-single",
    title: "Sunny single room with study desk",
    location: "Dhulikhel Bazaar",
    distanceKm: 0.8,
    rent: 6500,
    type: "Single",
    furnished: true,
    verified: true,
    available: "Available now",
    amenities: ["Wi-Fi", "Hot water", "Attached bathroom", "Study desk", "Water tank"],
    includedFurniture: ["Bed", "Mattress", "Study table", "Chair", "Wardrobe"],
    description:
      "A bright top-floor room a short walk from Dhulikhel Bazaar. Big window facing the hills, quiet building with mostly KU students, and a landlord who lives on the ground floor.",
    images: [img("1505693416388-ac5ce068fe85"), img("1522708323590-d24dbb6b0267"), img("1560448204-e02f11c3d0e2")],
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
    amenities: ["Two meals", "Wi-Fi", "Laundry", "Study hall", "Warden"],
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
    description: "Solid sal wood table used for two semesters. One deep drawer, no wobble. Pickup only.",
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
    description: "Lockable steel almirah with hanging rail and three shelves. Small dent on the side.",
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
    description: "Light plywood shelf, easy for one person to carry. Great for engineering textbooks.",
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
  "Laundry",
  "Study desk",
];

export const formatNpr = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

import { useEffect, useState } from "react";
import type { FurnitureItem, OtherItem, ReportedListing, Room } from "./listings";
import { FURNITURE, MOCK_REPORTS, OTHER_ITEMS, ROOMS } from "./listings";

type StoreData = {
  rooms: Room[];
  furniture: FurnitureItem[];
  otherItems: OtherItem[];
  reports: ReportedListing[];
};

const STORAGE_KEY = "kurooms_listings_store_v2";

function loadInitialData(): StoreData {
  if (typeof window === "undefined") {
    return {
      rooms: ROOMS,
      furniture: FURNITURE,
      otherItems: OTHER_ITEMS,
      reports: MOCK_REPORTS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        rooms: ROOMS,
        furniture: FURNITURE,
        otherItems: OTHER_ITEMS,
        reports: MOCK_REPORTS,
      };
    }
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      rooms:
        Array.isArray(parsed.rooms) && parsed.rooms.length > 0
          ? parsed.rooms.map((r) => ({ ...r, status: r.status || "approved" }))
          : ROOMS,
      furniture:
        Array.isArray(parsed.furniture) && parsed.furniture.length > 0
          ? parsed.furniture
          : FURNITURE,
      otherItems:
        Array.isArray(parsed.otherItems) && parsed.otherItems.length > 0
          ? parsed.otherItems
          : OTHER_ITEMS,
      reports:
        Array.isArray(parsed.reports) && parsed.reports.length > 0 ? parsed.reports : MOCK_REPORTS,
    };
  } catch {
    return {
      rooms: ROOMS,
      furniture: FURNITURE,
      otherItems: OTHER_ITEMS,
      reports: MOCK_REPORTS,
    };
  }
}

let storeState: StoreData = loadInitialData();
const listeners = new Set<() => void>();

function persistAndNotify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }
  listeners.forEach((listener) => listener());
}

export const listingsStore = {
  getSnapshot(): StoreData {
    return storeState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Room Actions
  addRoom(room: Room) {
    storeState = {
      ...storeState,
      rooms: [room, ...storeState.rooms],
    };
    persistAndNotify();
  },

  approveRoom(id: string) {
    storeState = {
      ...storeState,
      rooms: storeState.rooms.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    };
    persistAndNotify();
  },

  rejectRoom(id: string) {
    storeState = {
      ...storeState,
      rooms: storeState.rooms.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    };
    persistAndNotify();
  },

  setRoomStatus(id: string, status: "pending" | "approved" | "rejected") {
    storeState = {
      ...storeState,
      rooms: storeState.rooms.map((r) => (r.id === id ? { ...r, status } : r)),
    };
    persistAndNotify();
  },

  updateRoom(id: string, patch: Partial<Room>) {
    storeState = {
      ...storeState,
      rooms: storeState.rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    };
    persistAndNotify();
  },

  toggleRoomVerification(id: string) {
    storeState = {
      ...storeState,
      rooms: storeState.rooms.map((r) => (r.id === id ? { ...r, verified: !r.verified } : r)),
    };
    persistAndNotify();
  },

  deleteRoom(id: string) {
    storeState = {
      ...storeState,
      rooms: storeState.rooms.filter((r) => r.id !== id),
    };
    persistAndNotify();
  },

  // Furniture Actions
  addFurniture(item: FurnitureItem) {
    storeState = {
      ...storeState,
      furniture: [item, ...storeState.furniture],
    };
    persistAndNotify();
  },

  updateFurniture(id: string, patch: Partial<FurnitureItem>) {
    storeState = {
      ...storeState,
      furniture: storeState.furniture.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    };
    persistAndNotify();
  },

  deleteFurniture(id: string) {
    storeState = {
      ...storeState,
      furniture: storeState.furniture.filter((f) => f.id !== id),
    };
    persistAndNotify();
  },

  // Other Items Actions
  addOtherItem(item: OtherItem) {
    storeState = {
      ...storeState,
      otherItems: [item, ...storeState.otherItems],
    };
    persistAndNotify();
  },

  updateOtherItem(id: string, patch: Partial<OtherItem>) {
    storeState = {
      ...storeState,
      otherItems: storeState.otherItems.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    };
    persistAndNotify();
  },

  deleteOtherItem(id: string) {
    storeState = {
      ...storeState,
      otherItems: storeState.otherItems.filter((o) => o.id !== id),
    };
    persistAndNotify();
  },

  // Reports Actions
  addReport(report: ReportedListing) {
    storeState = {
      ...storeState,
      reports: [report, ...storeState.reports],
    };
    persistAndNotify();
  },

  resolveReport(id: string, status: "resolved" | "dismissed") {
    storeState = {
      ...storeState,
      reports: storeState.reports.map((rep) => (rep.id === id ? { ...rep, status } : rep)),
    };
    persistAndNotify();
  },

  deleteReport(id: string) {
    storeState = {
      ...storeState,
      reports: storeState.reports.filter((rep) => rep.id !== id),
    };
    persistAndNotify();
  },

  resetToDefaults() {
    storeState = {
      rooms: ROOMS,
      furniture: FURNITURE,
      otherItems: OTHER_ITEMS,
      reports: MOCK_REPORTS,
    };
    persistAndNotify();
  },
};

export function useListingsStore() {
  const [state, setState] = useState<StoreData>(() => listingsStore.getSnapshot());

  useEffect(() => {
    // Sync on mount in case localStorage was read after hydration
    setState(listingsStore.getSnapshot());
    const unsubscribe = listingsStore.subscribe(() => {
      setState(listingsStore.getSnapshot());
    });
    return unsubscribe;
  }, []);

  return state;
}

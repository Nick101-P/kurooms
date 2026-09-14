import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  House,
  LogOut,
  Package,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sofa,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FurnitureItem, OtherItem, ReportedListing, Room } from "@/data/listings";
import { LOCATIONS, formatNpr } from "@/data/listings";
import { listingsStore, useListingsStore } from "@/data/listingsStore";
import { cn } from "@/lib/utils";

type AdminTab = "rooms" | "furniture" | "others" | "reports";

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { rooms, furniture, otherItems, reports } = useListingsStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [roomStatusFilter, setRoomStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingFurniture, setEditingFurniture] = useState<FurnitureItem | null>(null);
  const [editingOther, setEditingOther] = useState<OtherItem | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
    type: "room" | "furniture" | "other" | "report";
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics
  const pendingRooms = rooms.filter((r) => r.status === "pending").length;
  const approvedRooms = rooms.filter((r) => !r.status || r.status === "approved").length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;

  // Filtered Rooms
  const filteredRooms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rooms.filter((r) => {
      const status = r.status || "approved";
      if (roomStatusFilter !== "all" && status !== roomStatusFilter) return false;
      if (q && !(r.title + r.location + r.description).toLowerCase().includes(q)) return false;
      if (locationFilter !== "all" && r.location !== locationFilter) return false;
      return true;
    });
  }, [rooms, searchQuery, locationFilter, roomStatusFilter]);

  // Filtered Furniture
  const filteredFurniture = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return furniture.filter((f) => {
      if (q && !(f.title + f.category + f.location).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [furniture, searchQuery]);

  // Filtered Other Items
  const filteredOthers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return otherItems.filter((o) => {
      if (q && !(o.title + o.category + o.location).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [otherItems, searchQuery]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "room") {
      listingsStore.deleteRoom(deleteTarget.id);
      showToast(`Deleted "${deleteTarget.title}".`);
    } else if (deleteTarget.type === "furniture") {
      listingsStore.deleteFurniture(deleteTarget.id);
      showToast(`Deleted "${deleteTarget.title}".`);
    } else if (deleteTarget.type === "other") {
      listingsStore.deleteOtherItem(deleteTarget.id);
      showToast(`Deleted "${deleteTarget.title}".`);
    } else if (deleteTarget.type === "report") {
      listingsStore.deleteReport(deleteTarget.id);
      showToast(`Report removed.`);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-surface/40 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 shadow-lg animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-4 text-success" />
          <span className="text-sm font-medium text-foreground">{toastMessage}</span>
        </div>
      )}

      {/* Clean Top Navigation Bar */}
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="container-page py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                KU
              </span>
              <div>
                <h1 className="text-lg font-bold leading-none tracking-tight">BasaiKU Admin</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Management & Moderation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
                <Link to="/">
                  <ExternalLink className="size-3.5" /> Public Site
                </Link>
              </Button>
              <Button asChild size="sm" className="gap-1.5 text-xs">
                <Link to="/list">
                  <Plus className="size-3.5" /> Add Listing
                </Link>
              </Button>
              {onLogout && (
                <Button size="sm" variant="ghost" onClick={onLogout} className="size-8 p-0 text-muted-foreground hover:text-destructive">
                  <LogOut className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container-page pt-6 space-y-6">
        {/* Simple 4 Stat Tiles */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <div
            onClick={() => {
              setActiveTab("rooms");
              setRoomStatusFilter("all");
            }}
            className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Rooms</span>
              <House className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">{rooms.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{approvedRooms} live on site</p>
          </div>

          <div
            onClick={() => {
              setActiveTab("rooms");
              setRoomStatusFilter("pending");
            }}
            className={cn(
              "cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-xs",
              pendingRooms > 0
                ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500"
                : "border-border bg-card hover:border-primary/50",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Pending Approval</span>
              <Clock className={cn("size-4", pendingRooms > 0 ? "text-amber-500" : "text-muted-foreground")} />
            </div>
            <p className="mt-2 text-2xl font-bold">{pendingRooms}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pendingRooms > 0 ? "Needs admin review" : "All caught up"}
            </p>
          </div>

          <div
            onClick={() => setActiveTab("furniture")}
            className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Marketplace Items</span>
              <Sofa className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">{furniture.length + otherItems.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {furniture.length} furniture · {otherItems.length} items
            </p>
          </div>

          <div
            onClick={() => setActiveTab("reports")}
            className={cn(
              "cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-xs",
              pendingReports > 0
                ? "border-destructive/40 bg-destructive/5 hover:border-destructive"
                : "border-border bg-card hover:border-primary/50",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">User Reports</span>
              <ShieldAlert className={cn("size-4", pendingReports > 0 ? "text-destructive" : "text-success")} />
            </div>
            <p className="mt-2 text-2xl font-bold">{pendingReports}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pendingReports > 0 ? "Flags require action" : "No pending reports"}
            </p>
          </div>
        </div>

        {/* Pending Approval Attention Banner (Simple, Actionable) */}
        {pendingRooms > 0 && activeTab !== "rooms" && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-900 dark:text-amber-300">
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>{pendingRooms} room {pendingRooms === 1 ? "listing is" : "listings are"} awaiting your approval</strong> before publishing.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-amber-500/40 text-xs hover:bg-amber-500/20"
              onClick={() => {
                setActiveTab("rooms");
                setRoomStatusFilter("pending");
              }}
            >
              Review Now
            </Button>
          </div>
        )}

        {/* Clean Segmented Tabs */}
        <div className="flex items-center gap-1.5 border-b border-border pb-1 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("rooms");
              setSearchQuery("");
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "rooms"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground",
            )}
          >
            <House className="size-4" />
            Rooms
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs font-bold",
              pendingRooms > 0
                ? "bg-amber-500 text-white"
                : activeTab === "rooms"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
            )}>
              {rooms.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("furniture");
              setSearchQuery("");
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "furniture"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground",
            )}
          >
            <Sofa className="size-4" />
            Furniture
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs font-bold",
              activeTab === "furniture"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}>
              {furniture.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("others");
              setSearchQuery("");
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "others"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground",
            )}
          >
            <Package className="size-4" />
            Other Items
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs font-bold",
              activeTab === "others"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}>
              {otherItems.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("reports");
              setSearchQuery("");
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "reports"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground",
            )}
          >
            <ShieldAlert className="size-4" />
            Reports
            {pendingReports > 0 && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                {pendingReports}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Rooms */}
        {activeTab === "rooms" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search rooms by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="flex items-center rounded-lg border border-border bg-secondary/30 p-0.5">
                  {(
                    [
                      { id: "all" as const, label: "All" },
                      { id: "pending" as const, label: `Pending (${pendingRooms})` },
                      { id: "approved" as const, label: "Published" },
                      { id: "rejected" as const, label: "Rejected" },
                    ]
                  ).map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setRoomStatusFilter(st.id)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        roomStatusFilter === st.id
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchQuery || locationFilter !== "all" || roomStatusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => {
                      setSearchQuery("");
                      setLocationFilter("all");
                      setRoomStatusFilter("all");
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Clean Rooms Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Owner & Contact</th>
                      <th className="px-4 py-3">Rent</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Verified</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRooms.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                          No room listings found.
                        </td>
                      </tr>
                    ) : (
                      filteredRooms.map((room) => {
                        const status = room.status || "approved";
                        return (
                          <tr key={room.id} className="transition-colors hover:bg-muted/20">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={room.images[0]}
                                  alt={room.title}
                                  className="size-11 shrink-0 rounded-lg object-cover bg-muted"
                                />
                                <div className="min-w-0 max-w-xs">
                                  <p className="font-semibold text-foreground truncate">{room.title}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{room.type}</span>
                                    <span>·</span>
                                    <Link
                                      to="/rooms/$roomId"
                                      params={{ roomId: room.id }}
                                      className="inline-flex items-center gap-0.5 text-accent hover:underline"
                                    >
                                      Preview <ArrowUpRight className="size-3" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                              <p className="font-medium text-foreground">{room.location}</p>
                              <p>{room.distanceKm} km from KU</p>
                            </td>

                            <td className="px-4 py-3.5 text-xs">
                              <p className="font-medium text-foreground">{room.owner?.name || "—"}</p>
                              <p className="font-mono text-muted-foreground">{room.owner?.phone || "—"}</p>
                            </td>

                            <td className="px-4 py-3.5 font-semibold text-foreground text-sm">
                              {formatNpr(room.rent)}
                            </td>

                            <td className="px-4 py-3.5">
                              {status === "pending" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                  <Clock className="size-3" /> Pending
                                </span>
                              ) : status === "rejected" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                  <XCircle className="size-3" /> Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                                  <Check className="size-3" /> Live
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => {
                                  listingsStore.toggleRoomVerification(room.id);
                                  showToast(`Verification updated for "${room.title}".`);
                                }}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                                  room.verified
                                    ? "bg-success/15 text-success"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                                )}
                              >
                                <BadgeCheck className="size-3.5" />
                                {room.verified ? "Verified" : "Unverified"}
                              </button>
                            </td>

                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="h-7 bg-success hover:bg-success/90 text-success-foreground px-2.5 text-xs font-medium"
                                      onClick={() => {
                                        listingsStore.approveRoom(room.id);
                                        showToast(`Approved "${room.title}"!`);
                                      }}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-destructive hover:bg-destructive/10 px-2 text-xs"
                                      onClick={() => {
                                        listingsStore.rejectRoom(room.id);
                                        showToast(`Rejected "${room.title}".`);
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {status === "approved" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                      listingsStore.rejectRoom(room.id);
                                      showToast(`Unpublished "${room.title}".`);
                                    }}
                                  >
                                    Unpublish
                                  </Button>
                                )}
                                {status === "rejected" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-success hover:text-success/80"
                                    onClick={() => {
                                      listingsStore.approveRoom(room.id);
                                      showToast(`Published "${room.title}"!`);
                                    }}
                                  >
                                    Publish
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2.5 text-xs"
                                  onClick={() => setEditingRoom(room)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    setDeleteTarget({
                                      id: room.id,
                                      title: room.title,
                                      type: "room",
                                    })
                                  }
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Furniture */}
        {activeTab === "furniture" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              {searchQuery && (
                <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Condition</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Seller</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFurniture.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                          No furniture items found.
                        </td>
                      </tr>
                    ) : (
                      filteredFurniture.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-muted/20">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="size-11 shrink-0 rounded-lg object-cover bg-muted"
                              />
                              <div className="min-w-0 max-w-xs">
                                <p className="font-semibold text-foreground truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">{item.condition}</td>
                          <td className="px-4 py-3.5 font-semibold text-foreground">{formatNpr(item.price)}</td>
                          <td className="px-4 py-3.5 text-xs">
                            <p className="font-medium text-foreground">{item.seller.name}</p>
                            <p className="text-muted-foreground">{item.seller.phone}</p>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                onClick={() => setEditingFurniture(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setDeleteTarget({
                                    id: item.id,
                                    title: item.title,
                                    type: "furniture",
                                  })
                                }
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Other Items */}
        {activeTab === "others" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              {searchQuery && (
                <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Condition</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Seller</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOthers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                          No items found.
                        </td>
                      </tr>
                    ) : (
                      filteredOthers.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-muted/20">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="size-11 shrink-0 rounded-lg object-cover bg-muted"
                              />
                              <div className="min-w-0 max-w-xs">
                                <p className="font-semibold text-foreground truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">{item.condition}</td>
                          <td className="px-4 py-3.5 font-semibold text-foreground">{formatNpr(item.price)}</td>
                          <td className="px-4 py-3.5 text-xs">
                            <p className="font-medium text-foreground">{item.seller.name}</p>
                            <p className="text-muted-foreground">{item.seller.phone}</p>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                onClick={() => setEditingOther(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setDeleteTarget({
                                    id: item.id,
                                    title: item.title,
                                    type: "other",
                                  })
                                }
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reports & Moderation */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold">User Reports & Moderation Queue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review flags and complaints submitted by students.
              </p>

              <div className="mt-4 divide-y divide-border">
                {reports.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No reports currently filed. Everything is clean!
                  </p>
                ) : (
                  reports.map((rep) => (
                    <div key={rep.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold capitalize">
                            [{rep.targetType}] {rep.targetTitle}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                              rep.status === "pending"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-success/15 text-success",
                            )}
                          >
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reported by <strong className="text-foreground">{rep.reporterName}</strong> on {rep.date}:{" "}
                          <span className="italic text-foreground">"{rep.reason}"</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {rep.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => {
                                listingsStore.resolveReport(rep.id, "dismissed");
                                showToast("Report dismissed.");
                              }}
                            >
                              Dismiss
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 text-xs"
                              onClick={() => {
                                if (rep.targetType === "room") {
                                  listingsStore.deleteRoom(rep.targetId);
                                } else if (rep.targetType === "furniture") {
                                  listingsStore.deleteFurniture(rep.targetId);
                                } else {
                                  listingsStore.deleteOtherItem(rep.targetId);
                                }
                                listingsStore.resolveReport(rep.id, "resolved");
                                showToast("Listing deleted and report resolved.");
                              }}
                            >
                              Remove Listing
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-muted-foreground"
                            onClick={() => {
                              listingsStore.deleteReport(rep.id);
                              showToast("Report history deleted.");
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold">Edit Room Listing</h2>
              <button
                onClick={() => setEditingRoom(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingRoom.title}
                  onChange={(e) => setEditingRoom({ ...editingRoom, title: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Monthly Rent (NPR)</Label>
                  <Input
                    type="number"
                    value={editingRoom.rent}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, rent: Number(e.target.value) })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Distance (km from KU)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingRoom.distanceKm}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        distanceKm: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Select
                    value={editingRoom.location}
                    onValueChange={(val) => setEditingRoom({ ...editingRoom, location: val })}
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Publication Status</Label>
                  <Select
                    value={editingRoom.status || "approved"}
                    onValueChange={(val: "pending" | "approved" | "rejected") =>
                      setEditingRoom({ ...editingRoom, status: val })
                    }
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Published (Live)</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                      <SelectItem value="rejected">Rejected / Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Owner Phone Number</Label>
                  <Input
                    value={editingRoom.owner?.phone || ""}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        owner: {
                          ...editingRoom.owner,
                          name: editingRoom.owner?.name || "Owner",
                          since: editingRoom.owner?.since || "2026",
                          phone: e.target.value,
                        },
                      })
                    }
                    placeholder="+977 98XXXXXXXX"
                    className="mt-1.5 font-mono text-sm"
                  />
                </div>
                <div>
                  <Label>Owner Name</Label>
                  <Input
                    value={editingRoom.owner?.name || ""}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        owner: {
                          ...editingRoom.owner,
                          since: editingRoom.owner?.since || "2026",
                          phone: editingRoom.owner?.phone || "",
                          name: e.target.value.replace(/[0-9]/g, ""),
                        },
                      })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={editingRoom.description}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  rows={4}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setEditingRoom(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  listingsStore.updateRoom(editingRoom.id, editingRoom);
                  setEditingRoom(null);
                  showToast("Room details updated.");
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Furniture Modal */}
      {editingFurniture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold">Edit Furniture Listing</h2>
              <button
                onClick={() => setEditingFurniture(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingFurniture.title}
                  onChange={(e) =>
                    setEditingFurniture({ ...editingFurniture, title: e.target.value })
                  }
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (NPR)</Label>
                  <Input
                    type="number"
                    value={editingFurniture.price}
                    onChange={(e) =>
                      setEditingFurniture({
                        ...editingFurniture,
                        price: Number(e.target.value),
                      })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select
                    value={editingFurniture.condition}
                    onValueChange={(val: "New" | "Like new" | "Good" | "Used") =>
                      setEditingFurniture({ ...editingFurniture, condition: val })
                    }
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like new">Like new</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setEditingFurniture(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  listingsStore.updateFurniture(editingFurniture.id, editingFurniture);
                  setEditingFurniture(null);
                  showToast("Furniture details updated.");
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Other Item Modal */}
      {editingOther && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold">Edit Item Listing</h2>
              <button
                onClick={() => setEditingOther(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingOther.title}
                  onChange={(e) => setEditingOther({ ...editingOther, title: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (NPR)</Label>
                  <Input
                    type="number"
                    value={editingOther.price}
                    onChange={(e) =>
                      setEditingOther({ ...editingOther, price: Number(e.target.value) })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select
                    value={editingOther.condition}
                    onValueChange={(val: "New" | "Like new" | "Good" | "Used") =>
                      setEditingOther({ ...editingOther, condition: val })
                    }
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like new">Like new</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setEditingOther(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  listingsStore.updateOtherItem(editingOther.id, editingOther);
                  setEditingOther(null);
                  showToast("Item details updated.");
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong className="text-foreground">{deleteTarget?.title}</strong> from the marketplace. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Listing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

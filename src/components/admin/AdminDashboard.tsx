import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Eye,
  Filter,
  House,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Plus,
  RefreshCcw,
  RotateCcw,
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

type AdminTab = "overview" | "rooms" | "furniture" | "others" | "reports";

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { rooms, furniture, otherItems, reports } = useListingsStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Room Modal State
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  // Edit Furniture Modal State
  const [editingFurniture, setEditingFurniture] = useState<FurnitureItem | null>(null);
  // Edit Other Item Modal State
  const [editingOther, setEditingOther] = useState<OtherItem | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
    type: "room" | "furniture" | "other" | "report";
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics
  const totalListings = rooms.length + furniture.length + otherItems.length;
  const verifiedRooms = rooms.filter((r) => r.verified).length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const avgRent =
    rooms.length > 0 ? Math.round(rooms.reduce((acc, r) => acc + r.rent, 0) / rooms.length) : 0;

  // Filtered Rooms
  const filteredRooms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rooms.filter((r) => {
      if (q && !(r.title + r.location + r.description).toLowerCase().includes(q)) return false;
      if (locationFilter !== "all" && r.location !== locationFilter) return false;
      return true;
    });
  }, [rooms, searchQuery, locationFilter]);

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
      showToast(`Room "${deleteTarget.title}" deleted.`);
    } else if (deleteTarget.type === "furniture") {
      listingsStore.deleteFurniture(deleteTarget.id);
      showToast(`Furniture item "${deleteTarget.title}" deleted.`);
    } else if (deleteTarget.type === "other") {
      listingsStore.deleteOtherItem(deleteTarget.id);
      showToast(`Item "${deleteTarget.title}" deleted.`);
    } else if (deleteTarget.type === "report") {
      listingsStore.deleteReport(deleteTarget.id);
      showToast(`Report removed.`);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-surface/50 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-lift animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 text-success" />
          <span className="text-sm font-medium text-foreground">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <section className="border-b border-border bg-card">
        <div className="container-page py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  KU
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Moderator & Administration
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">BasaiKU Control Center</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage room verifications, student marketplace items, and report resolutions.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  listingsStore.resetToDefaults();
                  showToast("Reset all listings to initial demo data.");
                }}
                className="gap-1.5"
              >
                <RotateCcw className="size-3.5" /> Reset Demo
              </Button>
              <Button asChild size="sm" variant="secondary" className="gap-1.5">
                <Link to="/list">
                  <Plus className="size-4" /> Create Listing
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link to="/">
                  <ExternalLink className="size-3.5" /> Public Site
                </Link>
              </Button>
              {onLogout && (
                <Button size="sm" variant="destructive" onClick={onLogout} className="gap-1.5">
                  <LogOut className="size-3.5" /> Sign Out
                </Button>
              )}
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <MetricCard
              label="Total Active Listings"
              value={totalListings}
              sub={`${rooms.length} rooms · ${furniture.length + otherItems.length} items`}
              icon={<LayoutDashboard className="size-5 text-primary" />}
            />
            <MetricCard
              label="Rooms for Rent"
              value={rooms.length}
              sub={`${verifiedRooms} verified (${Math.round((verifiedRooms / (rooms.length || 1)) * 100)}%)`}
              icon={<House className="size-5 text-accent" />}
            />
            <MetricCard
              label="Furniture Items"
              value={furniture.length}
              sub="On marketplace"
              icon={<Sofa className="size-5 text-primary" />}
            />
            <MetricCard
              label="Other Student Goods"
              value={otherItems.length}
              sub="Electronics & gear"
              icon={<Package className="size-5 text-primary" />}
            />
            <MetricCard
              label="Pending Reports"
              value={pendingReports}
              sub={pendingReports === 0 ? "All clear" : "Needs review"}
              alert={pendingReports > 0}
              icon={
                <ShieldAlert
                  className={cn("size-5", pendingReports > 0 ? "text-destructive" : "text-success")}
                />
              }
            />
          </div>

          {/* Tab Navigation Buttons */}
          <div className="mt-8 flex overflow-x-auto border-b border-border/80 pb-px">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              label="Overview"
              icon={<LayoutDashboard className="size-4" />}
            />
            <TabButton
              active={activeTab === "rooms"}
              onClick={() => setActiveTab("rooms")}
              label="Rooms"
              count={rooms.length}
              icon={<House className="size-4" />}
            />
            <TabButton
              active={activeTab === "furniture"}
              onClick={() => setActiveTab("furniture")}
              label="Furniture"
              count={furniture.length}
              icon={<Sofa className="size-4" />}
            />
            <TabButton
              active={activeTab === "others"}
              onClick={() => setActiveTab("others")}
              label="Other Items"
              count={otherItems.length}
              icon={<Package className="size-4" />}
            />
            <TabButton
              active={activeTab === "reports"}
              onClick={() => setActiveTab("reports")}
              label="Moderation & Reports"
              count={pendingReports}
              alert={pendingReports > 0}
              icon={<AlertTriangle className="size-4" />}
            />
          </div>
        </div>
      </section>

      {/* Main Tab Contents */}
      <main className="container-page mt-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Actions & Highlights */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Student Rooms</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("rooms")}>
                    View all {rooms.length} <ArrowUpRight className="size-4" />
                  </Button>
                </div>
                <div className="mt-4 divide-y divide-border">
                  {rooms.slice(0, 4).map((room) => (
                    <div key={room.id} className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={room.images[0]}
                          alt={room.title}
                          className="size-12 rounded-xl object-cover bg-muted"
                        />
                        <div>
                          <p className="text-sm font-semibold">{room.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {room.location} · {formatNpr(room.rent)}/mo · {room.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            listingsStore.toggleRoomVerification(room.id);
                            showToast(
                              `Room verification ${!room.verified ? "activated" : "removed"}.`,
                            );
                          }}
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                            room.verified
                              ? "bg-success/15 text-success hover:bg-success/25"
                              : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                          )}
                        >
                          <BadgeCheck className="size-3.5" />
                          {room.verified ? "Verified" : "Unverified"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold">Moderation Queue</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Flags raised by students and visitors.
                  </p>
                  <div className="mt-4 space-y-3">
                    {reports.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No reports filed.</p>
                    ) : (
                      reports.map((rep) => (
                        <div
                          key={rep.id}
                          className="rounded-xl border border-border bg-secondary/40 p-3.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold capitalize text-foreground">
                              {rep.targetType}: {rep.targetTitle}
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
                          <p className="mt-1 text-xs text-muted-foreground">{rep.reason}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    size="sm"
                    onClick={() => setActiveTab("reports")}
                  >
                    Manage Reports
                  </Button>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="text-lg font-semibold">Quick Summary</h2>
                  <div className="mt-4 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Room Rent</span>
                      <span className="font-semibold">{formatNpr(avgRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification Ratio</span>
                      <span className="font-semibold">
                        {Math.round((verifiedRooms / (rooms.length || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Listed Items</span>
                      <span className="font-semibold">{furniture.length + otherItems.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search rooms by title or landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-10 w-44">
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
                {searchQuery || locationFilter !== "all" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setLocationFilter("all");
                    }}
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Listing</th>
                      <th className="px-4 py-3.5">Location & Distance</th>
                      <th className="px-4 py-3.5">Monthly Rent</th>
                      <th className="px-4 py-3.5">Type & Furnishing</th>
                      <th className="px-4 py-3.5">Verification</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRooms.map((room) => (
                      <tr key={room.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={room.images[0]}
                              alt={room.title}
                              className="size-14 shrink-0 rounded-xl object-cover bg-muted"
                            />
                            <div>
                              <p className="font-semibold text-foreground">{room.title}</p>
                              <p className="text-xs text-muted-foreground">ID: {room.id}</p>
                              <Link
                                to="/rooms/$roomId"
                                params={{ roomId: room.id }}
                                className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                              >
                                View public page <ArrowUpRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">{room.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {room.distanceKm} km from KU
                          </p>
                        </td>
                        <td className="px-4 py-4 font-display font-semibold text-foreground">
                          {formatNpr(room.rent)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="w-fit">
                              {room.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {room.furnished ? "Furnished" : "Unfurnished"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => {
                              listingsStore.toggleRoomVerification(room.id);
                              showToast(`Verification toggled for ${room.title}`);
                            }}
                            className={cn(
                              "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                              room.verified
                                ? "bg-success/15 text-success hover:bg-success/25"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                            )}
                          >
                            <BadgeCheck className="size-4" />
                            {room.verified ? "Verified" : "Unverified"}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingRoom(room)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() =>
                                setDeleteTarget({
                                  id: room.id,
                                  title: room.title,
                                  type: "room",
                                })
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Furniture Tab */}
        {activeTab === "furniture" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search furniture items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-9"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Item</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Condition</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Seller</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFurniture.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="size-14 shrink-0 rounded-xl object-cover bg-muted"
                            />
                            <div>
                              <p className="font-semibold text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.location}</p>
                              <Link
                                to="/furniture/$itemId"
                                params={{ itemId: item.id }}
                                className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                              >
                                View public page <ArrowUpRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="secondary">{item.category}</Badge>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-muted-foreground">
                          {item.condition}
                        </td>
                        <td className="px-4 py-4 font-display font-semibold text-foreground">
                          {formatNpr(item.price)}
                        </td>
                        <td className="px-4 py-4 text-xs">
                          <p className="font-semibold">{item.seller.name}</p>
                          <p className="text-muted-foreground">{item.seller.phone}</p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingFurniture(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() =>
                                setDeleteTarget({
                                  id: item.id,
                                  title: item.title,
                                  type: "furniture",
                                })
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other Items Tab */}
        {activeTab === "others" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search other student items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-9"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Item</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Condition</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Seller</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOthers.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="size-14 shrink-0 rounded-xl object-cover bg-muted"
                            />
                            <div>
                              <p className="font-semibold text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.location}</p>
                              <Link
                                to="/others/$itemId"
                                params={{ itemId: item.id }}
                                className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                              >
                                View public page <ArrowUpRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="secondary">{item.category}</Badge>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-muted-foreground">
                          {item.condition}
                        </td>
                        <td className="px-4 py-4 font-display font-semibold text-foreground">
                          {formatNpr(item.price)}
                        </td>
                        <td className="px-4 py-4 text-xs">
                          <p className="font-semibold">{item.seller.name}</p>
                          <p className="text-muted-foreground">{item.seller.phone}</p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingOther(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() =>
                                setDeleteTarget({
                                  id: item.id,
                                  title: item.title,
                                  type: "other",
                                })
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Moderation & Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-bold">Listing Moderation Reports</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Investigate and resolve reports raised by Kathmandu University students.
              </p>

              <div className="mt-6 divide-y divide-border">
                {reports.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <ShieldCheck className="mx-auto size-10 text-success" />
                    <p className="mt-3 font-semibold text-foreground">No reports pending</p>
                    <p className="text-xs">All student listings are in good standing.</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                              report.status === "pending"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-success/15 text-success",
                            )}
                          >
                            {report.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{report.date}</span>
                        </div>
                        <h3 className="text-base font-semibold">
                          Target: {report.targetTitle} (Type: {report.targetType})
                        </h3>
                        <p className="text-sm text-foreground/90">
                          <strong className="text-muted-foreground">Reason:</strong> {report.reason}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reported by: {report.reporterName}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {report.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                listingsStore.resolveReport(report.id, "dismissed");
                                showToast("Report dismissed.");
                              }}
                            >
                              Dismiss Report
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (report.targetType === "room") {
                                  listingsStore.deleteRoom(report.targetId);
                                } else if (report.targetType === "furniture") {
                                  listingsStore.deleteFurniture(report.targetId);
                                } else {
                                  listingsStore.deleteOtherItem(report.targetId);
                                }
                                listingsStore.resolveReport(report.id, "resolved");
                                showToast(`Listing removed and report marked as resolved.`);
                              }}
                            >
                              Remove Listing
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              listingsStore.deleteReport(report.id);
                              showToast("Report history deleted.");
                            }}
                          >
                            Delete Report
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
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lift animate-in fade-in">
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
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lift animate-in fade-in">
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
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lift animate-in fade-in">
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
              This will remove <strong className="text-foreground">{deleteTarget?.title}</strong>{" "}
              from the active marketplace. This action cannot be undone.
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

function MetricCard({
  label,
  value,
  sub,
  icon,
  alert = false,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-card",
        alert && "border-destructive/40 bg-destructive/5",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
  alert,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  alert?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-bold",
            alert
              ? "bg-destructive text-destructive-foreground"
              : active
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

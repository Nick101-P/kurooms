import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold">
            Basai<span className="text-accent">KU</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Rooms, furnished accommodation and second-hand furniture around Kathmandu University,
            Dhulikhel. Built for students, starting with KU.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <p className="font-medium">Browse</p>
            <Link to="/rooms" className="block text-muted-foreground hover:text-foreground">
              Rooms
            </Link>
            <Link to="/furniture" className="block text-muted-foreground hover:text-foreground">
              Furniture
            </Link>
            <Link to="/others" className="block text-muted-foreground hover:text-foreground">
              Others
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Areas</p>
            <p className="text-muted-foreground">Dhulikhel</p>
            <p className="text-muted-foreground">Banepa</p>
            <p className="text-muted-foreground">Panauti road</p>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col items-center justify-between gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row">
        <span>Sample listings shown for demonstration. © {new Date().getFullYear()} BasaiKU.</span>
      </div>
    </footer>
  );
}

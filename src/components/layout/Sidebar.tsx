import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  QrCode,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  MapPin,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "QR Scanner", href: "/scanner", icon: QrCode },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Time Tracking", href: "/timetracking", icon: Clock },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">AttendanceQR</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
              onClick={() => window.innerWidth < 768 && onClose()}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="bg-gradient-accent rounded-lg p-4">
            <h3 className="font-medium text-sm mb-2">Need Help?</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Contact admin for QR code assistance.
            </p>
            <Button size="sm" className="w-full" variant="outline">
              Get Support
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
// SmoothSidebar.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Inbox, LayoutDashboard, Menu, Settings } from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "./lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SmoothSidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = React.useState(false);
  const { pathname } = useLocation(); // Diperlukan agar pathname tersedia

  const expandSidebar = () => setExpanded(true);
  const collapseSidebar = () => setExpanded(false);

  return (
    <div
      className={cn(
        "group relative flex h-screen flex-col border-r bg-background transition-[width,padding] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
        expanded ? "w-64" : "w-16",
        className
      )}
      onMouseEnter={() => setExpanded(true)} // ⬅️ hover masuk ➝ expand
      onMouseLeave={() => setExpanded(false)} // ⬅️ hover keluar ➝ collapse
    >
      <div className="flex h-16 items-center justify-between px-4">
        <span
          className={cn(
            "text-lg font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
            expanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10 absolute"
          )}
        >
          Dashboard
        </span>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
            expanded ? "" : "mx-auto"
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <NavItem
            icon={Home}
            label="Home"
            href="/"
            isActive={pathname === "/"}
            expanded={expanded}
          />
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/dashboard"
            isActive={pathname === "/dashboard"}
            expanded={expanded}
          />
          <NavItem
            icon={Inbox}
            label="Inbox"
            href="/inbox"
            isActive={pathname === "/inbox"}
            expanded={expanded}
          />
        </nav>
      </div>

      <div className="border-t p-4">
        <NavItem
          icon={Settings}
          label="Settings"
          href="/settings"
          isActive={pathname === "/settings"}
          expanded={expanded}
        />
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
  expanded: boolean;
  nested?: boolean;
}

function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
  expanded,
  nested = false,
}: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        !expanded && "justify-center px-0",
        nested && "py-1.5"
      )}
    >
      <Icon className={cn("h-5 w-5", !expanded && "scale-110")} />
      <span
        className={cn(
          "whitespace-nowrap transition-all",
          expanded
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 absolute pointer-events-none"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

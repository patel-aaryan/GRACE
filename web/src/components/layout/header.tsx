import React from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const resources = [
  {
    title: "Documentation",
    href: "/docs",
    description: "Learn how to use our product effectively.",
  },
  {
    title: "API Reference",
    href: "/docs/api",
    description: "Detailed information about our API endpoints.",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Read our latest articles and updates.",
  },
  {
    title: "Support",
    href: "/support",
    description: "Get help from our support team.",
  },
];

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            `block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors
            hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`,
            className
          )}
          href={props.href || "#"}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b
                    from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">GRACE</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      A modern and accessible web application.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none
                    transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/about"
                  >
                    <div className="text-sm font-medium leading-none">
                      About
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn more about our project.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none
                    transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/docs/features"
                  >
                    <div className="text-sm font-medium leading-none">
                      Features
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Explore the features of our application.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {resources.map((resource) => (
                <ListItem
                  key={resource.title}
                  title={resource.title}
                  href={resource.href}
                >
                  {resource.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/dashboard">Dashboard</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[240px] p-6">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-center">GRACE</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-5">
          <Link
            href="/"
            className="flex items-center text-lg font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Features</h3>
            <div className="pl-2 flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-sm transition-colors hover:text-primary"
              >
                About
              </Link>
              <Link
                href="/docs/features"
                className="text-sm transition-colors hover:text-primary"
              >
                Features
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resources</h3>
            <div className="pl-2 flex flex-col space-y-2">
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="text-sm transition-colors hover:text-primary"
                >
                  {resource.title}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center text-lg font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-0 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">GRACE</span>
          </Link>
          <DesktopNav />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />

          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

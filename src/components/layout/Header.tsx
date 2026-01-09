// MainHeader.tsx
"use client";

import React from "react";
import {
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
  Newspaper,
  X,
  LogIn, // Added LogIn icon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GoogleTranslate } from "../ui/google-translate";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

type NavItem = {
  label: string;
  href: string;
  isActive: boolean;
};

type MainHeaderViewProps = {
  siteName: string;
  navItems: NavItem[];
  isLoading: boolean;
  isLoggedIn: boolean;
  user: any | undefined;
  onSignOut: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onAdminPanelClick: () => void;
  onWriterPanelClick: () => void;
};

/* -------------------------------------------------------------------------- */
/*                                  UI VIEW                                   */
/* -------------------------------------------------------------------------- */

const MainHeaderView: React.FC<MainHeaderViewProps> = ({
  siteName,
  navItems,
  isLoading,
  isLoggedIn,
  user,
  onSignOut,
  onProfileClick,
  onSettingsClick,
  onAdminPanelClick,
  onWriterPanelClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* CSS FOR MOBILE LANGUAGE FIX */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-translate-wrapper .goog-te-gadget span {
            display: none;
          }
          .mobile-translate-wrapper .goog-te-menu-value span:first-child,
          .mobile-translate-wrapper .goog-te-menu-value > span {
            display: inline-block;
            max-width: 2ch;
            overflow: hidden;
            white-space: nowrap;
            vertical-align: bottom;
            line-height: 1;
            margin-right: 4px;
          }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16">
          <div className="flex h-full items-center w-full relative">
            {/* ---------------------------------------------------------------- */}
            {/*                        PART 1: LOGO                              */}
            {/* ---------------------------------------------------------------- */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center">
                <img
                  src="/global_indians.png"
                  alt={`${siteName} Logo`}
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain max-w-[140px] sm:max-w-[180px]"
                />
              </Link>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/*                        PART 2: MENU (Desktop)                    */}
            {/* ---------------------------------------------------------------- */}
            <div className="hidden lg:flex flex-1 justify-center items-center">
              <nav className="flex items-center space-x-1 md:space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap px-2 py-1 rounded-md",
                      item.isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/*                   PART 3: ACTIONS (Right)                        */}
            {/* ---------------------------------------------------------------- */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-4">
              {/* A. Authentication Section */}
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              ) : isLoggedIn && user ? (
                // LOGGED IN STATE
                <div className="hidden lg:flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 h-9 px-1 sm:px-2"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onProfileClick}>
                        <UserCircle className="mr-2 h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onSettingsClick}>
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </DropdownMenuItem>
                      {(user as any).role === "ADMIN" && (
                        <DropdownMenuItem onClick={onAdminPanelClick}>
                          <Settings className="mr-2 h-4 w-4" /> Admin Panel
                        </DropdownMenuItem>
                      )}
                      {((user as any).role === "WRITER" ||
                        (user as any).role === "ADMIN") && (
                        <DropdownMenuItem onClick={onWriterPanelClick}>
                          <Newspaper className="mr-2 h-4 w-4" /> Writer Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onSignOut}
                        className="text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                // LOGGED OUT STATE
                <>
                  {/* DESKTOP: Full Text Button */}
                  <Link href="/sign-in" className="hidden lg:flex items-center">
                    <Button size="sm" className="h-9 px-4 text-sm font-medium">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}

              {/* B. Language Switcher */}
              <div className="flex items-center mobile-translate-wrapper">
                <GoogleTranslate />
              </div>

              {/* C. Mobile Menu Hamburger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9 shrink-0"
                    aria-label="Open Menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[400px] flex flex-col p-0"
                >
                  {/* Sheet Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold">Menu</h2>
                  </div>

                  {/* Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {/* Mobile Navigation */}
                    <nav className="flex flex-col gap-2 mb-8">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent w-full text-left",
                            item.isActive
                              ? "text-primary bg-accent"
                              : "text-foreground"
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile User Info / Auth Actions */}
                    {isLoggedIn && user ? (
                      <div className="border-t pt-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 overflow-hidden shrink-0">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              onProfileClick();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <UserCircle className="mr-2 h-4 w-4" /> Profile
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              onSettingsClick();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" /> Settings
                          </Button>
                          {(user as any).role === "ADMIN" && (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                onAdminPanelClick();
                                setMobileMenuOpen(false);
                              }}
                            >
                              <Settings className="mr-2 h-4 w-4" /> Admin Panel
                            </Button>
                          )}
                          {((user as any).role === "WRITER" ||
                            (user as any).role === "ADMIN") && (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                onWriterPanelClick();
                                setMobileMenuOpen(false);
                              }}
                            >
                              <Newspaper className="mr-2 h-4 w-4" /> Writer
                              Panel
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            className="w-full justify-start mt-4"
                            onClick={() => {
                              onSignOut();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" /> Sign out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-6">
                        <Link
                          href="/sign-in"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button className="w-full" size="lg">
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                CONTAINER                                   */
/* -------------------------------------------------------------------------- */

const MainHeader = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const siteName = "Global Indian Info";
  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  const navItemsConfig = [
    { label: "Home", href: "/" },
    { label: "Business in UK", href: "/listings" },
    { label: "Magazines", href: "/magazines" },
    { label: "About us", href: "/about" },
    { label: "Important Link", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ];

  const navItems = navItemsConfig.map((item) => ({
    ...item,
    isActive:
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  }));

  return (
    <MainHeaderView
      siteName={siteName}
      navItems={navItems}
      isLoading={isLoading}
      isLoggedIn={isLoggedIn}
      user={user}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      onProfileClick={() =>
        user?.username && (window.location.href = `/profile/${user.username}`)
      }
      onSettingsClick={() => console.log("Settings")}
      onAdminPanelClick={() => (window.location.href = "/admin")}
      onWriterPanelClick={() => (window.location.href = "/writer")}
    />
  );
};

export default MainHeader;

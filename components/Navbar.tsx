"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = session ? (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          router.push("/explore");
          setIsMenuOpen(false);
        }}
      >
        Explore
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          router.push("/submit");
          setIsMenuOpen(false);
        }}
      >
        Submit Idea
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          router.push("/profile");
          setIsMenuOpen(false);
        }}
      >
        Profile
      </Button>
    </>
  ) : (
    <Button
      onClick={() => {
        router.push("/auth");
        setIsMenuOpen(false);
      }}
    >
      Sign In
    </Button>
  );

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-xl font-bold"
              onClick={() => router.push("/")}
            >
              StartupMatch
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {navItems}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-2">{navItems}</div>
          </div>
        )}
      </div>
    </nav>
  );
}

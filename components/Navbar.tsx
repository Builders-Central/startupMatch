"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Browse Ideas", href: "/app" },
    ...(session
      ? [
          { name: "Submit Idea", href: "/submit" },
          { name: "Profile", href: "/profile" },
        ]
      : []),
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => router.push(item.href)}
              >
                {item.name}
              </Button>
            ))}
            {!session && (
              <Button onClick={() => router.push("/auth")}>Sign In</Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push(item.href);
                  setIsMenuOpen(false);
                }}
              >
                {item.name}
              </Button>
            ))}
            {!session && (
              <Button
                className="w-full"
                onClick={() => {
                  router.push("/auth");
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

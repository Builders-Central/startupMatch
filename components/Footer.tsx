import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-md border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand and Copyright */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">StartupMatch</span>
            <span className="text-sm text-muted-foreground">
              © 2024 All rights reserved
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-4">
            <Button variant="link" className="text-sm p-0">
              Privacy
            </Button>
            <Button variant="link" className="text-sm p-0">
              Terms
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

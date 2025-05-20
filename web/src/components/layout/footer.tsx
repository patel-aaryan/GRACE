import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 px-4 md:px-0 mx-auto md:h-16 md:flex-row md:py-0">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} GRACE. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/terms" // doens't exist yet
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            href="/privacy" // doens't exist yet
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/contact" // doens't exist yet
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

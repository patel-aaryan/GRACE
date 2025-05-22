import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ActivitiesLayoutProps {
  children: ReactNode;
}

export default function ActivitiesLayout({ children }: ActivitiesLayoutProps) {
  return (
    <>
      <div className="bg-muted py-2 border-b">
        <div className="container mx-auto flex items-center text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <span className="font-medium">Activities</span>
        </div>
      </div>

      {children}
    </>
  );
}

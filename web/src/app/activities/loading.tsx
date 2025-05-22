import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-12">
      <div className="space-y-4 mb-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-6 w-full max-w-md bg-muted animate-pulse rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="h-[250px] shadow animate-pulse relative">
              <CardHeader className="bg-muted rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-8 bg-background/50 rounded-md" />
                  <div className="h-10 w-10 rounded-full bg-background/50" />
                </div>
                <div className="h-7 w-36 bg-background/50 rounded-md mt-4" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-5 w-full bg-muted rounded-md mt-2" />
                <div className="h-5 w-2/3 bg-muted rounded-md mt-2" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center space-x-2 bg-background/80 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading activities...</span>
        </div>
      </div>
    </div>
  );
}

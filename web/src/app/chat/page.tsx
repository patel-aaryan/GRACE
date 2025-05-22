import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Cog, MessageSquare } from "lucide-react";
import { CurrentTime } from "@/components/current-time";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <Card className="rounded-none border-b border-x-0 border-t-0 backdrop-blur-sm bg-background/80 relative z-20">
        <CardContent className="p-0">
          <div className="h-14 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary">Grace</span>
              <span className="text-muted-foreground">•</span>
              <CurrentTime />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Mood Check-in
              </Button>

              <Link href="/activities">
                <Button variant="default" size="sm">
                  Start Activity...
                </Button>
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Cog className="h-4 w-4" />
                    <span>Speech Controls</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Speech Controls</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 py-4">
                    <div className="space-y-2">
                      <label className="text-base font-medium text-card-foreground flex justify-between items-center">
                        <span>Speech Rate</span>
                        <span className="text-sm text-muted-foreground">
                          50%
                        </span>
                      </label>
                      <Slider defaultValue={[50]} max={100} step={1} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-base font-medium text-card-foreground flex justify-between items-center">
                        <span>Volume</span>
                        <span className="text-sm text-muted-foreground">
                          75%
                        </span>
                      </label>
                      <Slider defaultValue={[75]} max={100} step={1} />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between p-1 rounded-lg hover:bg-accent/50 transition-colors">
                        <span className="text-base font-medium">
                          Avatar switch
                        </span>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-1 rounded-lg hover:bg-accent/50 transition-colors">
                        <span className="text-base font-medium">
                          Large-text mode
                        </span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="relative w-full max-w-4xl h-full max-h-[70vh] flex items-center justify-center">
          {/* <Card className="w-full h-full rounded-2xl flex items-center justify-center relative border-2 bg-background/80 backdrop-blur-sm"> */}
          <div className="text-center text-muted-foreground">
            {/* Placeholder for either 3D canvas or Tavus iframe */}
            <p className="text-primary font-medium">Avatar Surface</p>
            <p className="mt-4">
              • 3-D canvas <span className="text-primary font-medium">or</span>{" "}
              Tavus iframe
            </p>
            <p className="mt-2">• Centered for immersive experience</p>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-500/20"></div>
          </div>
          {/* </Card> */}
        </div>
      </div>

      <div className="mt-auto px-4 py-3 relative z-20">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Message..."
            className="w-full rounded-full border px-4 py-2 text-sm bg-background/80 backdrop-blur-sm"
          />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">Captions</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-52">
              <SheetHeader className="pb-0 pt-2">
                <div className="flex items-center justify-between">
                  <SheetTitle>Live Captions</SheetTitle>
                  <SheetClose className="cursor-pointer" />
                </div>
              </SheetHeader>
              <div className="h-32 overflow-y-auto py-2">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="font-medium">You:</span>
                    <span className="text-muted-foreground">…</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-primary">Grace:</span>
                    <span className="text-muted-foreground">…</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MoreVertical } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { CurrentTime } from "@/components/current-time";

export default function ChatPage() {
  return (
    <MainLayout>
      <div className="flex flex-col bg-background text-foreground">
        <Card className="rounded-none border-b border-x-0 border-t-0">
          <CardContent className="p-0">
            <div className="h-14 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <span className="font-medium text-primary">Grace</span>
                <span className="text-muted-foreground">•</span>
                <CurrentTime />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex flex-grow overflow-hidden min-h-2/3">
          <div className="w-2/3 p-4 border-r">
            <Card className="h-full rounded-2xl flex items-center justify-center relative border-2">
              <div className="text-center text-muted-foreground">
                {/* Placeholder for either 3D canvas or Tavus iframe */}
                <p className="text-primary font-medium">Avatar Surface</p>
                <p className="mt-4">
                  • 3-D canvas{" "}
                  <span className="text-primary font-medium">or</span> Tavus
                  iframe
                </p>
                <p className="mt-2">• Rounded corners (2x1)</p>
                <p className="mt-2">• Mic status halo</p>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-500/20"></div>
              </div>
            </Card>
          </div>

          <div className="w-1/3 p-4">
            <Card className="h-full overflow-auto bg-card">
              <CardHeader className="pb-4 pt-4">
                <h2 className="text-xl font-semibold text-primary">
                  Speech Controls
                </h2>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-card-foreground flex justify-between items-center">
                      <span>Speech Rate</span>
                      <span className="text-sm text-muted-foreground">50%</span>
                    </label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-medium text-card-foreground flex justify-between items-center">
                      <span>Volume</span>
                      <span className="text-sm text-muted-foreground">75%</span>
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

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="default"
                      className="h-10 text-base"
                    >
                      Mood Check-in
                    </Button>

                    <Button
                      variant="default"
                      size="default"
                      className="h-10 text-base"
                    >
                      Start Activity...
                    </Button>
                  </div>

                  <div className="mt-3 p-3 bg-accent/30 rounded-lg">
                    <h3 className="text-sm font-medium mb-1">Quick Tips</h3>
                    <p className="text-xs text-muted-foreground">
                      Try asking about today&apos;s weather or suggest a
                      relaxing activity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-auto px-4 py-3">
          <Card className="rounded-lg shadow-sm overflow-hidden">
            <CardHeader className="pb-0 pt-3 bg-muted/30">
              <h3 className="text-sm font-medium text-primary">
                Live Captions
              </h3>
            </CardHeader>
            <CardContent className="h-32 overflow-y-auto py-2">
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
            </CardContent>
          </Card>

          <div className="mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Message..."
                className="w-full rounded-full border px-4 py-2 text-sm bg-background"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

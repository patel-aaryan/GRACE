import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HomeBackground } from "@/components/backgrounds";

export default function Home() {
  return (
    <>
      <HomeBackground />
      <section className="relative w-full min-h-[90vh] overflow-hidden">
        <Card className="w-full max-w-full shadow-none border-0 bg-transparent">
          <CardContent className="p-0">
            <div className="grid grid-cols-12 min-h-[90vh]">
              <div className="col-span-12 md:col-span-4 p-8 md:p-12 lg:p-16 flex items-center">
                <div className="space-y-8 max-w-xl">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      Hi I&apos;m Grace!
                    </h2>
                    <p className="text-lg text-gray-400">
                      <span className="font-medium">G</span>uided
                      <span className="font-medium"> R</span>esponsive
                      <span className="font-medium"> A</span>ssistant for <br />
                      <span className="font-medium"> C</span>ompanionship &
                      <span className="font-medium"> E</span>ngagement
                    </p>
                  </div>

                  <h1 className="text-3xl font-bold">
                    Your friendly companion,{" "}
                    <span className="text-primary">any time</span> you need{" "}
                    <span className="text-primary">to talk.</span>
                  </h1>

                  <p className="text-gray-400">
                    I&apos;m here to chat, answer questions, or just keep you
                    company. My goal is to make your day a little brighter and
                    help reduce feelings of loneliness.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="font-medium rounded-full px-10 py-6"
                    >
                      <Link href="/chat">Get Started</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="font-medium rounded-full px-10 py-6"
                    >
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Avatar placeholder - to be replaced with actual 3D model */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-lg p-8 opacity-75">
                      (3-D Grace head waves, says &ldquo;Welcome back,
                      Mary!&rdquo;)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container max-w-5xl mx-auto pb-12 pt-4 px-4">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">How it Works</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center md:gap-8">
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="flex items-center gap-2 p-4">
                  <span className="text-primary font-bold">1</span>
                  <span className="text-primary font-medium">-</span>
                  <span>Speak naturally</span>
                </CardContent>
              </Card>
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="flex items-center gap-2 p-4">
                  <span className="text-primary font-bold">2</span>
                  <span className="text-primary font-medium">-</span>
                  <span>See & hear Grace reply</span>
                </CardContent>
              </Card>
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="flex items-center gap-2 p-4">
                  <span className="text-primary font-bold">3</span>
                  <span className="text-primary font-medium">-</span>
                  <span>Continue your conversation naturally</span>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

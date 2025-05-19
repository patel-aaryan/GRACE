import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <MainLayout>
      <section className="py-12 md:py-24 lg:py-32 w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-full">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Welcome to Web
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                A modern Next.js application with TypeScript and Shadcn UI
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 bg-muted/50 w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-full">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Features
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Explore the powerful features of this application
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Next.js</CardTitle>
                  <CardDescription>
                    App Router & React Server Components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Built with the latest Next.js features for optimal
                    performance and developer experience.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild>
                    <Link href="https://nextjs.org/docs">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>TypeScript</CardTitle>
                  <CardDescription>Type-safe Development</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Fully typed codebase for better reliability and developer
                    productivity.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild>
                    <Link href="https://www.typescriptlang.org/docs">
                      Learn More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shadcn UI</CardTitle>
                  <CardDescription>
                    Beautiful & Accessible Components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Beautifully designed components that are accessible and
                    customizable.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild>
                    <Link href="https://ui.shadcn.com">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

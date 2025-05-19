import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <MainLayout>
      <section className="py-12 w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-full">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your dashboard</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Users</CardTitle>
                  <CardDescription>Total number of users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Users</CardTitle>
                  <CardDescription>
                    Users active in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">789</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue</CardTitle>
                  <CardDescription>Total revenue this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,345</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Growth</CardTitle>
                  <CardDescription>User growth this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12.5%</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Activity from the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium leading-none">
                          User {i + 1} completed an action
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            Date.now() - i * 86400000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

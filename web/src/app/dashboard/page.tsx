"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  Pill,
  Activity,
  Heart,
  ChevronRight,
  Calendar,
  Phone,
  Clock,
  Info,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <section className="py-4 w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Care Portal</h1>
              <p className="text-muted-foreground">
                Caregiver insights and patient monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="border rounded-lg p-2 flex items-center gap-2 bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">ID: 12345678</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-2">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact
                </Button>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Users className="mr-2 h-4 w-4" />
                  All Patients
                </Button>
                <Button size="sm">
                  <Info className="mr-2 h-4 w-4" />
                  Emergency Info
                </Button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="md:col-span-3">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">
                      Last Check-in: Today at 9:25 AM
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Next scheduled: 4:00 PM
                    </p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full ml-6">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Active: 4h 25m Today</p>
                    <p className="text-xs text-muted-foreground">
                      Down 15% from average
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Active Alerts</p>
                  <Badge variant="destructive">3</Badge>
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-2">
                  View Alerts
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-4">
              {/* Top Cards Row */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Mood Trend Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md font-medium">
                        Mood Trend
                      </CardTitle>
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Declining</div>
                    <p className="text-sm text-muted-foreground">
                      Down from &ldquo;Good&rdquo; yesterday
                    </p>
                    <div className="mt-2 flex space-x-1">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Good
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Good
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        Okay
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        Poor
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        Poor
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => router.push("/history")}
                    >
                      View Mood History
                    </Button>
                  </CardFooter>
                </Card>

                {/* Minutes Spoken Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md font-medium">
                        Minutes Spoken
                      </CardTitle>
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23 minutes</div>
                    <p className="text-sm text-muted-foreground">
                      Down 12 min from avg (35 min)
                    </p>
                    <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                    >
                      View Conversation Details
                    </Button>
                  </CardFooter>
                </Card>

                {/* Missed Meds Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md font-medium">
                        Missed Meds
                      </CardTitle>
                      <ArrowUp className="h-4 w-4 text-red-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2 doses</div>
                    <p className="text-sm text-muted-foreground">
                      Morning & evening heart medication
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">8:00 AM</Badge>
                        <span className="text-sm">Lisinopril</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">8:00 PM</Badge>
                        <span className="text-sm">Lisinopril</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Medication Schedule
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Conversation Highlights Section */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        Conversation Highlights (AI-extracted)
                      </CardTitle>
                      <CardDescription>
                        Important notes from recent conversations
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">3 New</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card className="border border-gray-200">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            &ldquo;Feeling lonely at night.&rdquo;
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mentioned 3 times this week
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            &ldquo;Having trouble sleeping due to hip
                            pain.&rdquo;
                          </p>
                          <p className="text-sm text-muted-foreground">
                            New mention yesterday
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            &ldquo;Can&apos;t remember if I took my evening
                            pills.&rdquo;
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mentioned today at 7:45 PM
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline">View All Highlights</Button>
                </CardFooter>
              </Card>

              {/* Alerts Timeline */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Alerts Timeline</CardTitle>
                      <CardDescription>
                        Recent alerts requiring attention
                      </CardDescription>
                    </div>
                    <Button variant="destructive" size="sm">
                      Respond to All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 border-l-4 border-red-500 pl-4 pb-4">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Pill className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Missed Medication</p>
                          <Badge variant="outline">Today, 8:15 AM</Badge>
                        </div>
                        <p className="text-sm">
                          Morning dose of Lisinopril was not taken
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Send Reminder
                          </Button>
                          <Button variant="ghost" size="sm">
                            Mark as Resolved
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 border-l-4 border-amber-500 pl-4 pb-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Activity className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Low Activity</p>
                          <Badge variant="outline">Yesterday, 5:30 PM</Badge>
                        </div>
                        <p className="text-sm">
                          Significantly less app interaction than usual
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Check-in Call
                          </Button>
                          <Button variant="ghost" size="sm">
                            Mark as Resolved
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 border-l-4 border-blue-500 pl-4 pb-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Mood Decline</p>
                          <Badge variant="outline">2 days ago</Badge>
                        </div>
                        <p className="text-sm">
                          Consistent negative mood responses over 48 hours
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Schedule Visit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Mark as Resolved
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline">View All Alerts</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="week" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>Data for the past 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20 text-muted-foreground">
                    Weekly data visualization would appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="month" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                  <CardDescription>Data for the past 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20 text-muted-foreground">
                    Monthly data visualization would appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

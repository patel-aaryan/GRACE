"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MoveRight,
  Brain,
  Wind,
  Image,
  Music,
  Activity,
  BookOpen,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Trivia Game",
    description:
      "Test your knowledge with fun and engaging questions across various topics.",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-primary/10",
    href: "/activities/trivia",
  },
  {
    id: 2,
    title: "Guided Breathing",
    description:
      "Relax and reduce stress with guided breathing exercises and meditation.",
    icon: <Wind className="h-8 w-8" />,
    color: "bg-green-500/10",
    href: "/activities/breathing",
  },
  {
    id: 3,
    title: "Memory Slideshow",
    description:
      "View and reminisce with your favorite photos in an interactive slideshow.",
    icon: <Image className="h-8 w-8" />,
    color: "bg-blue-500/10",
    href: "/activities/slideshow",
  },
  {
    id: 4,
    title: "Listen Together",
    description: "Enjoy music and audio content with your companion.",
    icon: <Music className="h-8 w-8" />,
    color: "bg-orange-500/10",
    href: "/activities/listen",
  },
  {
    id: 5,
    title: "Chair Stretches",
    description:
      "Stay active with gentle chair exercises designed for comfort and mobility.",
    icon: <Activity className="h-8 w-8" />,
    color: "bg-purple-500/10",
    href: "/activities/stretches",
  },
  {
    id: 6,
    title: "Mini Story Club",
    description:
      "Engage with short stories, poems, and thought-provoking literature.",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-amber-500/10",
    href: "/activities/stories",
  },
];

export default function ActivitiesPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Activities</h1>
        <p className="text-muted-foreground text-lg">
          Explore our collection of engaging activities designed to entertain,
          relax, and stimulate your mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: activity.id * 0.1 }}
            onMouseEnter={() => setHoveredCard(activity.id)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.15, delay: 0 },
            }}
            className="h-full"
          >
            <Link href={activity.href} className="block h-full">
              <Card
                className={`h-full transition-all duration-300
                  ${hoveredCard === activity.id ? "shadow-lg" : "shadow"}`}
              >
                <CardHeader className={`${activity.color} rounded-t-lg`}>
                  <div className="flex justify-between items-center">
                    {activity.icon}
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center 
                      ${
                        hoveredCard === activity.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } 
                      transition-colors duration-300`}
                    >
                      <MoveRight className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">
                    {activity.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full mt-2 ${
                      hoveredCard === activity.id
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={(e) => e.preventDefault()}
                  >
                    Start Activity
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-4">Popular This Week</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Chair Yoga Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join other users in our 7-day gentle movement program.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/activities/stretches/challenge">
                <Button size="sm" variant="outline">
                  Join Challenge
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Brain Teasers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Daily puzzles to keep your mind sharp and engaged.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/activities/trivia/daily">
                <Button size="sm" variant="outline">
                  Try Today&apos;s Puzzle
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

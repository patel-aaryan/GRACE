"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  FileText,
  Search,
  Star,
  Flag,
  CalendarRange,
  Clock,
  Tag,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HistoryPage() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [filterDays, setFilterDays] = useState("7");
  const [searchQuery, setSearchQuery] = useState("");
  const [moodRange, setMoodRange] = useState([1, 10]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const sessions = [
    {
      date: "May 19",
      duration: "16",
      mood: "7",
      moodEmoji: "😊",
      topics: ["health", "sleep"],
      time: "Evening",
      hasActivity: true,
      activityType: "Trivia",
    },
    {
      date: "May 18",
      duration: "11",
      mood: "5",
      moodEmoji: "😐",
      topics: ["family", "weather"],
      time: "Morning",
      hasActivity: false,
      activityType: "",
    },
    {
      date: "May 15",
      duration: "7",
      mood: "3",
      moodEmoji: "😔",
      topics: ["health", "medication"],
      time: "Afternoon",
      hasActivity: true,
      activityType: "Breathing",
    },
  ];

  const transcript = [
    { time: "14:02", speaker: "You", message: "I couldn't sleep..." },
    {
      time: "14:02",
      speaker: "Pepper",
      message: "Have you tried a relaxation technique before bed?",
    },
    {
      time: "14:03",
      speaker: "You",
      message: "Sometimes I read, but last night my mind was racing.",
    },
    {
      time: "14:03",
      speaker: "Pepper",
      message:
        "That can be difficult. Would you like to try a quick breathing exercise now?",
    },
  ];

  const filteredSessions = sessions.filter((session) => {
    const moodInRange =
      parseInt(session.mood) >= moodRange[0] &&
      parseInt(session.mood) <= moodRange[1];

    const matchesSearch =
      searchQuery === "" ||
      session.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      session.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.activityType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopics =
      selectedTopics.length === 0 ||
      selectedTopics.some((topic) => session.topics.includes(topic));

    const matchesActivities =
      selectedActivities.length === 0 ||
      (session.hasActivity &&
        selectedActivities.includes(session.activityType));

    return moodInRange && matchesSearch && matchesTopics && matchesActivities;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "duration-asc":
        return parseInt(a.duration) - parseInt(b.duration);
      case "duration-desc":
        return parseInt(b.duration) - parseInt(a.duration);
      case "mood-asc":
        return parseInt(a.mood) - parseInt(b.mood);
      case "mood-desc":
        return parseInt(b.mood) - parseInt(a.mood);
      default:
        return 0;
    }
  });

  const totalSessionTime = sessions.reduce(
    (total, session) => total + parseInt(session.duration),
    0
  );

  const averageMood = (
    sessions.reduce((total, session) => total + parseInt(session.mood), 0) /
    sessions.length
  ).toFixed(1);

  const allTopics = Array.from(
    new Set(sessions.flatMap((session) => session.topics))
  );

  // Get all unique activity types
  const allActivities = Array.from(
    new Set(
      sessions
        .filter((session) => session.hasActivity && session.activityType)
        .map((session) => session.activityType)
    )
  );

  // Toggle activity in selected activities
  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        className="flex items-center space-x-2"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </Button>

      <h1 className="text-2xl font-bold m-4">Session History</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <CalendarRange className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Clock className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold">{totalSessionTime} min</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Star className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Avg. Mood</p>
                <p className="text-2xl font-bold">{averageMood}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Latest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="duration-desc">Longest first</SelectItem>
                <SelectItem value="duration-asc">Shortest first</SelectItem>
                <SelectItem value="mood-desc">Highest mood first</SelectItem>
                <SelectItem value="mood-asc">Lowest mood first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-hidden border rounded-md">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="divide-y">
                      {sortedSessions.length > 0 ? (
                        sortedSessions.map((session, index) => (
                          <tr
                            key={index}
                            className={`hover:bg-muted/50 cursor-pointer ${
                              selectedSession === index ? "bg-muted/50" : ""
                            }`}
                            onClick={() => setSelectedSession(index)}
                          >
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <span>•</span>
                                <span className="font-medium">
                                  {session.date}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {session.time}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {session.topics.map((topic, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <Badge variant="outline" className="font-mono">
                                {session.duration} min
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <Badge>
                                <span className="mr-1">
                                  {session.moodEmoji}
                                </span>
                                <span>Mood {session.mood}</span>
                              </Badge>
                            </td>
                            {session.hasActivity && (
                              <td className="p-4 text-right">
                                <Badge variant="secondary">
                                  {session.activityType}
                                </Badge>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-muted-foreground"
                          >
                            No sessions match your filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedSession !== null && (
            <Card>
              <CardHeader className="pb-2 border-b flex flex-row justify-between items-center">
                <h3 className="text-lg font-medium">Chat Transcript Viewer</h3>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Flag className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedSession(null)}
                    aria-label="Close transcript"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 space-y-3">
                  {transcript.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="text-muted-foreground font-mono w-16">
                        {item.time}
                      </span>
                      <span className="font-medium mr-2">{item.speaker}</span>
                      <span>{item.message}</span>
                    </div>
                  ))}
                  <div className="text-muted-foreground italic">
                    … (sticky date dividers)
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedSession !== null && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                <span>Download PDF</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Summarize day</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Tag size={16} />
                <span>Add Tags</span>
              </Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Tabs defaultValue="filters" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="filters">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm mb-1">Time Period</p>
                      <Select value={filterDays} onValueChange={setFilterDays}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Last 7 days</SelectItem>
                          <SelectItem value="14">Last 14 days</SelectItem>
                          <SelectItem value="30">Last 30 days</SelectItem>
                          <SelectItem value="90">Last 3 months</SelectItem>
                          <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <p className="text-sm mb-3">Mood Range (1-10)</p>
                      <Slider
                        defaultValue={[1, 10]}
                        max={10}
                        min={1}
                        step={1}
                        value={moodRange}
                        onValueChange={setMoodRange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{moodRange[0]}</span>
                        <span>{moodRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm mb-3">Topics</p>
                      <div className="space-y-2">
                        {allTopics.map((topic) => (
                          <div
                            key={topic}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`topic-${topic}`}
                              checked={selectedTopics.includes(topic)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTopics([...selectedTopics, topic]);
                                } else {
                                  setSelectedTopics(
                                    selectedTopics.filter((t) => t !== topic)
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`topic-${topic}`}
                              className="text-sm cursor-pointer"
                            >
                              {topic}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm mb-3">Activities</p>
                      <div className="flex flex-wrap gap-2">
                        {allActivities.map((activity) => (
                          <Badge
                            key={activity}
                            variant={
                              selectedActivities.includes(activity)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleActivity(activity)}
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        setSearchQuery("");
                        setMoodRange([1, 10]);
                        setSelectedTopics([]);
                        setSelectedActivities([]);
                        setFilterDays("7");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {selectedSession !== null ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Add notes for this session
                        </p>
                        <Input placeholder="Enter a title..." />
                        <div className="relative">
                          <Input
                            placeholder="Search notes..."
                            className="pl-8"
                          />
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Select a session to add notes
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

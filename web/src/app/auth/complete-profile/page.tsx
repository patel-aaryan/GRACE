"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { User } from "@supabase/supabase-js";

interface AccessibilityPreferences {
  largeText?: boolean;
  highContrast?: boolean;
  voiceInstructions?: boolean;
  simplifiedInterface?: boolean;
}

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Profile form fields
  const [dob, setDob] = useState("");
  const [preferredSpeechSpeed, setPreferredSpeechSpeed] = useState([1.0]);
  const [preferredAvatarType, setPreferredAvatarType] = useState("3D");
  const [accessibilityPrefs, setAccessibilityPrefs] =
    useState<AccessibilityPreferences>({
      largeText: false,
      highContrast: false,
      voiceInstructions: false,
      simplifiedInterface: false,
    });

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
    };

    checkUser();
  }, [router, supabase.auth]);

  const handleAccessibilityChange = (
    key: keyof AccessibilityPreferences,
    value: boolean
  ) => {
    setAccessibilityPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!user) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    if (!dob) {
      setError("Date of birth is required");
      setIsLoading(false);
      return;
    }

    try {
      const profileData = {
        id: user.id,
        dob,
        preferred_speech_speed: preferredSpeechSpeed[0],
        preferred_avatar_type: preferredAvatarType,
        accessibility_preferences: accessibilityPrefs,
      };

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      // Call your backend API to update the profile
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Redirect to chat after successful profile update
      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {user && <>Hello {user.user_metadata?.username || "there"}! 👋</>}
          </CardTitle>
          <CardDescription className="text-center">
            Help us personalize your GRACE experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Speech Speed Preference */}
            <div className="space-y-3">
              <Label>Preferred Speech Speed</Label>
              <div className="px-3">
                <Slider
                  value={preferredSpeechSpeed}
                  onValueChange={setPreferredSpeechSpeed}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Slower</span>
                  <span>{preferredSpeechSpeed[0]}x</span>
                  <span>Faster</span>
                </div>
              </div>
            </div>

            {/* Avatar Type Preference */}
            <div className="space-y-2">
              <Label htmlFor="avatarType">Preferred Avatar Type</Label>
              <Select
                value={preferredAvatarType}
                onValueChange={setPreferredAvatarType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose avatar type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3D">3D Avatar</SelectItem>
                  <SelectItem value="Realistic">Realistic Avatar</SelectItem>
                  <SelectItem value="Simple">Simple Avatar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Accessibility Preferences */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Accessibility Preferences
              </Label>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="large-text">Large Text</Label>
                    <p className="text-sm text-muted-foreground">
                      Use larger text throughout the interface
                    </p>
                  </div>
                  <Switch
                    id="large-text"
                    checked={accessibilityPrefs.largeText}
                    onCheckedChange={(checked) =>
                      handleAccessibilityChange("largeText", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Use high contrast colors for better visibility
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={accessibilityPrefs.highContrast}
                    onCheckedChange={(checked) =>
                      handleAccessibilityChange("highContrast", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-instructions">
                      Voice Instructions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive spoken instructions and feedback
                    </p>
                  </div>
                  <Switch
                    id="voice-instructions"
                    checked={accessibilityPrefs.voiceInstructions}
                    onCheckedChange={(checked) =>
                      handleAccessibilityChange("voiceInstructions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="simplified-interface">
                      Simplified Interface
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use a cleaner, less cluttered interface
                    </p>
                  </div>
                  <Switch
                    id="simplified-interface"
                    checked={accessibilityPrefs.simplifiedInterface}
                    onCheckedChange={(checked) =>
                      handleAccessibilityChange("simplifiedInterface", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                "Complete Profile & Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  email: string | null;
  role: string | null;
}

export function AuthTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const testAuth = async () => {
    setIsLoading(true);
    setError(null);
    setProfile(null);

    try {
      // Test authenticated endpoint
      const data = await api.get<UserProfile>("/api/v1/auth/me");
      setProfile(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testProtected = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get("/api/v1/auth/protected");
      console.log("Protected route response:", data);
      alert("Check console for protected route response");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
        <CardDescription>
          Test authenticated API calls to the FastAPI backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {profile && (
          <Alert>
            <AlertDescription>
              <strong>User Profile:</strong>
              <br />
              ID: {profile.id}
              <br />
              Email: {profile.email || "N/A"}
              <br />
              Role: {profile.role || "N/A"}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={testAuth} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test /auth/me"
            )}
          </Button>

          <Button
            onClick={testProtected}
            variant="outline"
            disabled={isLoading}
          >
            Test Protected Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

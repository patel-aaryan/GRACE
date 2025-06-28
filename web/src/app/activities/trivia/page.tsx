"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, HelpCircle, X } from "lucide-react";
import Link from "next/link";

// Example trivia questions
const triviaQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "What year did the Titanic sink?",
    options: ["1905", "1912", "1920", "1931"],
    correctAnswer: "1912",
  },
];

export default function TriviaGamePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === triviaQuestions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Game complete
      setCurrentQuestion(-1);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center mb-8">
        <Link href="/activities" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Trivia Game</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          {currentQuestion >= 0 ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestion + 1} of {triviaQuestions.length}
                </span>
                <span className="text-sm font-medium">Score: {score}</span>
              </div>
              <CardTitle className="text-xl">
                {triviaQuestions[currentQuestion].question}
              </CardTitle>
            </>
          ) : (
            <CardTitle className="text-xl text-center">
              Game Complete!
            </CardTitle>
          )}
        </CardHeader>

        <CardContent>
          {currentQuestion >= 0 ? (
            <div className="grid gap-3">
              {triviaQuestions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  variant={
                    selectedAnswer === option
                      ? option ===
                        triviaQuestions[currentQuestion].correctAnswer
                        ? "default"
                        : "destructive"
                      : option ===
                          triviaQuestions[currentQuestion].correctAnswer &&
                        showResult
                      ? "default"
                      : "outline"
                  }
                  className="justify-start h-auto py-3 px-4 relative"
                  disabled={showResult}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                  {showResult &&
                    option === selectedAnswer &&
                    option ===
                      triviaQuestions[currentQuestion].correctAnswer && (
                      <Check className="h-5 w-5 absolute right-3 text-green-500" />
                    )}
                  {showResult &&
                    option === selectedAnswer &&
                    option !==
                      triviaQuestions[currentQuestion].correctAnswer && (
                      <X className="h-5 w-5 absolute right-3" />
                    )}
                  {showResult &&
                    option !== selectedAnswer &&
                    option ===
                      triviaQuestions[currentQuestion].correctAnswer && (
                      <Check className="h-5 w-5 absolute right-3 text-green-500" />
                    )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-5xl font-bold mb-4">
                {score}/{triviaQuestions.length}
              </div>
              <p className="text-muted-foreground">
                {score === triviaQuestions.length
                  ? "Perfect score! Excellent work!"
                  : score >= triviaQuestions.length / 2
                  ? "Good job! You know your trivia."
                  : "Keep practicing to improve your score."}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {currentQuestion >= 0 ? (
            showResult ? (
              <Button className="w-full" onClick={handleNextQuestion}>
                {currentQuestion === triviaQuestions.length - 1
                  ? "See Results"
                  : "Next Question"}
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowResult(true)}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Skip Question
              </Button>
            )
          ) : (
            <Button className="w-full" onClick={resetGame}>
              Play Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

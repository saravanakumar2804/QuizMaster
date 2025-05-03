import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizWithQuestions } from "@shared/schema";
import AppBar from "@/components/AppBar";
import BottomNavigation from "@/components/BottomNavigation";
import { Trophy, Award, Check, X } from "lucide-react";

export default function Results() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/results/:id");
  const quizId = params?.id ? parseInt(params.id) : 0;

  // Fetch quiz data
  const { data: quiz, isLoading } = useQuery<QuizWithQuestions>({
    queryKey: [`/api/quizzes/${quizId}`],
    enabled: !!quizId,
  });

  if (isLoading || !quiz) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.totalQuestions;
  const correctCount = Object.values(quiz.answers).filter(Boolean).length;
  const scorePercentage = (correctCount / totalQuestions) * 100;
  
  // Calculate performance message
  let performanceMessage = "";
  let performanceIcon = null;
  
  if (scorePercentage >= 80) {
    performanceMessage = "Excellent! You're a quiz master!";
    performanceIcon = <Trophy className="w-12 h-12 text-yellow-500" />;
  } else if (scorePercentage >= 60) {
    performanceMessage = "Good job! You know your stuff!";
    performanceIcon = <Award className="w-12 h-12 text-blue-500" />;
  } else if (scorePercentage >= 40) {
    performanceMessage = "Not bad, but there's room for improvement!";
    performanceIcon = <Check className="w-12 h-12 text-green-500" />;
  } else {
    performanceMessage = "Keep practicing to improve your knowledge!";
    performanceIcon = <X className="w-12 h-12 text-red-500" />;
  }

  const handlePlayAgain = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppBar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md overflow-hidden">
            <div className="bg-primary p-6 text-white text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-4">
                {performanceIcon}
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Quiz Complete!</CardTitle>
              <p>{performanceMessage}</p>
            </div>
            
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Your Score</span>
                  <span className="text-2xl font-bold">{quiz.score}</span>
                </div>
                <Progress value={scorePercentage} className="h-2" />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Correct Answers:</span>
                  <span className="font-semibold text-green-600">{correctCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Incorrect Answers:</span>
                  <span className="font-semibold text-red-600">{totalQuestions - correctCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-semibold">{scorePercentage.toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-6 pt-0">
              <Button 
                className="w-full text-base py-6" 
                size="lg"
                onClick={handlePlayAgain}
              >
                Play Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <BottomNavigation activeItem="home" />
    </div>
  );
}

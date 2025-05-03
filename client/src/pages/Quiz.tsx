import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { QuizWithQuestions } from "@shared/schema";
import AppBar from "@/components/AppBar";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import NavigationButtons from "@/components/NavigationButtons";
import CategoryTabs from "@/components/CategoryTabs";
import BottomNavigation from "@/components/BottomNavigation";

export default function Quiz() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/quiz/:id");
  const quizId = params?.id ? parseInt(params.id) : 0;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Fetch quiz data
  const { data: quiz, isLoading } = useQuery<QuizWithQuestions>({
    queryKey: [`/api/quizzes/${quizId}`],
    enabled: !!quizId,
  });

  // Update quiz progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { questionIndex: number; isCorrect: boolean }) => {
      const response = await apiRequest("PATCH", `/api/quizzes/${quizId}/progress`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/quizzes/${quizId}`] });
      
      // If quiz is completed, navigate to results page
      if (data.completed) {
        setTimeout(() => {
          navigate(`/results/${quizId}`);
        }, 1500);
      }
    },
  });

  useEffect(() => {
    // Reset state when moving to a new question
    setSelectedOptionId(null);
    setShowFeedback(false);
  }, [currentIndex]);

  if (isLoading || !quiz) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleOptionSelect = (optionId: number) => {
    if (selectedOptionId !== null || showFeedback) return; // Prevent selecting after answer
    
    setSelectedOptionId(optionId);
    
    const selectedOption = currentQuestion.options.find(option => option.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    // Show feedback immediately
    setShowFeedback(true);
    
    // Update quiz progress
    updateProgressMutation.mutate({
      questionIndex: currentIndex,
      isCorrect
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigate(`/results/${quizId}`);
      return;
    }
    
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const getActiveCategoryId = () => {
    return quiz?.categoryId || 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppBar />
      
      <ProgressBar 
        currentQuestion={currentIndex + 1} 
        totalQuestions={quiz.totalQuestions} 
        score={quiz.score}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {currentQuestion && (
          <QuestionCard 
            question={currentQuestion}
            selectedOptionId={selectedOptionId}
            handleOptionSelect={handleOptionSelect}
            showFeedback={showFeedback}
          />
        )}
        
        <NavigationButtons 
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          isFirstQuestion={currentIndex === 0}
          isLastQuestion={isLastQuestion}
          showFeedback={showFeedback}
        />
      </main>
      
      <CategoryTabs activeCategoryId={getActiveCategoryId()} />
      <BottomNavigation activeItem="home" />
    </div>
  );
}

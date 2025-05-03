import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Category } from "@shared/schema";
import AppBar from "@/components/AppBar";
import BottomNavigation from "@/components/BottomNavigation";
import { Vote, Book, BrainCircuit, Dumbbell, Palette } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const [categoryId, setCategoryId] = useState<string>("0");
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Create new quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        categoryId: categoryId === "0" ? undefined : Number(categoryId),
        totalQuestions: questionCount,
      };
      const response = await apiRequest("POST", "/api/quizzes", payload);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      navigate(`/quiz/${data.id}`);
    },
  });

  const handleStartQuiz = () => {
    createQuizMutation.mutate();
  };

  const getCategoryIcon = (name?: string) => {
    switch (name?.toLowerCase()) {
      case "history":
        return <Book className="h-5 w-5" />;
      case "geography":
        return <Vote className="h-5 w-5" />;
      case "science":
        return <BrainCircuit className="h-5 w-5" />;
      case "sports":
        return <Dumbbell className="h-5 w-5" />;
      case "arts":
        return <Palette className="h-5 w-5" />;
      default:
        return <Vote className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppBar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">General Knowledge Vote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-2">Select Category</h3>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Categories</SelectItem>
                    {!isCategoriesLoading &&
                      categories?.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center">
                            {getCategoryIcon(category.name)}
                            <span className="ml-2">{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-medium">Number of Questions</h3>
                  <span className="font-semibold">{questionCount}</span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[questionCount]}
                  onValueChange={(value) => setQuestionCount(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full text-base py-6"
                size="lg"
                onClick={handleStartQuiz}
                disabled={createQuizMutation.isPending}
              >
                {createQuizMutation.isPending ? "Starting..." : "Start Vote"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Category Explorer</h2>
            <div className="grid grid-cols-2 gap-4">
              {!isCategoriesLoading &&
                categories?.map((category: Category) => (
                  <Card key={category.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        {getCategoryIcon(category.name)}
                      </div>
                      <span>{category.name}</span>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation activeItem="home" />
    </div>
  );
}

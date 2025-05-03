import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  handlePrevious: () => void;
  handleNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  showFeedback: boolean;
}

export default function NavigationButtons({
  handlePrevious,
  handleNext,
  isFirstQuestion,
  isLastQuestion,
  showFeedback,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-4">
      <Button
        variant="outline"
        className="px-5 py-2.5 border border-gray-300 text-foreground font-medium flex items-center"
        onClick={handlePrevious}
        disabled={isFirstQuestion}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Previous
      </Button>
      
      <Button
        className="px-5 py-2.5 bg-primary text-white font-medium flex items-center"
        onClick={handleNext}
        disabled={!showFeedback}
      >
        {isLastQuestion ? "Finish" : "Next"}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}

import { CheckCircle, XCircle } from "lucide-react";

interface FeedbackBoxProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
}

export default function FeedbackBox({ isCorrect, explanation, correctAnswer }: FeedbackBoxProps) {
  return (
    <div className={`mt-6 p-4 ${isCorrect ? 'bg-green-50 border border-success' : 'bg-red-50 border border-destructive'} rounded-lg fade-enter`}>
      <div className="flex items-start">
        {isCorrect ? (
          <CheckCircle className="text-success mr-2 h-5 w-5" />
        ) : (
          <XCircle className="text-destructive mr-2 h-5 w-5" />
        )}
        <div>
          <h3 className="font-medium text-foreground">
            {isCorrect ? "Correct!" : "Incorrect!"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isCorrect ? explanation : `The correct answer is: ${correctAnswer}. ${explanation}`}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
}

export default function ProgressBar({ currentQuestion, totalQuestions, score }: ProgressBarProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion}/{totalQuestions}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            Score: <span className="text-primary font-bold">{score}</span>
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

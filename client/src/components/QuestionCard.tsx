import { QuestionWithOptions } from "@shared/schema";
import FeedbackBox from "./FeedbackBox";
import AnswerOptions from "./AnswerOptions";

interface QuestionCardProps {
  question: QuestionWithOptions;
  selectedOptionId: number | null;
  handleOptionSelect: (optionId: number) => void;
  showFeedback: boolean;
}

export default function QuestionCard({ 
  question, 
  selectedOptionId, 
  handleOptionSelect,
  showFeedback
}: QuestionCardProps) {
  const getCorrectOption = () => {
    return question.options.find(option => option.isCorrect);
  };

  const isCorrectAnswer = () => {
    if (!selectedOptionId) return false;
    const selectedOption = question.options.find(option => option.id === selectedOptionId);
    return selectedOption?.isCorrect || false;
  };

  return (
    <div className="question-card bg-white rounded-xl p-5 mb-6 shadow-md fade-enter">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">{question.text}</h2>
        
        {question.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={question.imageUrl} 
              alt="Question illustration" 
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </div>
      
      <AnswerOptions 
        options={question.options}
        selectedOptionId={selectedOptionId}
        handleOptionSelect={handleOptionSelect}
      />
      
      {showFeedback && (
        <FeedbackBox 
          isCorrect={isCorrectAnswer()}
          explanation={question.explanation || ""}
          correctAnswer={getCorrectOption()?.text || ""}
        />
      )}
    </div>
  );
}

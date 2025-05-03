import { Option } from "@shared/schema";
import { Check, X } from "lucide-react";

interface AnswerOptionsProps {
  options: Option[];
  selectedOptionId: number | null;
  handleOptionSelect: (optionId: number) => void;
}

export default function AnswerOptions({ options, selectedOptionId, handleOptionSelect }: AnswerOptionsProps) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  
  const getButtonClasses = (option: Option) => {
    const baseClasses = "option-btn w-full text-left p-3 border rounded-lg flex items-center focus:outline-none focus:ring-2 focus:ring-primary";
    
    if (selectedOptionId === null) {
      return `${baseClasses} hover:bg-gray-50`;
    }
    
    if (option.id === selectedOptionId) {
      return option.isCorrect
        ? `${baseClasses} border-2 border-success bg-green-50`
        : `${baseClasses} border-2 border-destructive bg-red-50`;
    }
    
    if (option.isCorrect && selectedOptionId !== null) {
      return `${baseClasses} border-2 border-success bg-green-50`;
    }
    
    return baseClasses;
  };
  
  const getCircleClasses = (option: Option) => {
    const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center mr-3";
    
    if (selectedOptionId === null) {
      return `${baseClasses} border-2 border-primary`;
    }
    
    if (option.id === selectedOptionId) {
      return option.isCorrect
        ? `${baseClasses} bg-success text-white`
        : `${baseClasses} bg-destructive text-white`;
    }
    
    if (option.isCorrect && selectedOptionId !== null) {
      return `${baseClasses} bg-success text-white`;
    }
    
    return `${baseClasses} border-2 border-primary`;
  };
  
  const getIcon = (option: Option) => {
    if (selectedOptionId === null) {
      return <span className="text-sm font-medium">{letters[options.indexOf(option) % letters.length]}</span>;
    }
    
    if (option.id === selectedOptionId) {
      return option.isCorrect 
        ? <Check className="h-3 w-3" /> 
        : <X className="h-3 w-3" />;
    }
    
    if (option.isCorrect && selectedOptionId !== null) {
      return <Check className="h-3 w-3" />;
    }
    
    return <span className="text-sm font-medium">{letters[options.indexOf(option) % letters.length]}</span>;
  };
  
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          className={getButtonClasses(option)}
          onClick={() => handleOptionSelect(option.id)}
          disabled={selectedOptionId !== null}
        >
          <span className={getCircleClasses(option)}>
            {getIcon(option)}
          </span>
          <span className="text-foreground">{option.text}</span>
        </button>
      ))}
    </div>
  );
}

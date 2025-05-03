import { 
  Category, InsertCategory, 
  Question, InsertQuestion,
  Option, InsertOption,
  Quiz, InsertQuiz,
  QuestionWithOptions, QuizWithQuestions
} from "@shared/schema";

export interface IStorage {
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  
  // Question operations
  getQuestions(categoryId?: number): Promise<QuestionWithOptions[]>;
  getQuestionById(id: number): Promise<QuestionWithOptions | undefined>;
  
  // Quiz operations
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizById(id: number): Promise<QuizWithQuestions | undefined>;
  updateQuizProgress(id: number, questionIndex: number, isCorrect: boolean): Promise<Quiz | undefined>;
  getQuizQuestions(quizId: number): Promise<QuestionWithOptions[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private questions: Map<number, Question>;
  private options: Map<number, Option>;
  private quizzes: Map<number, Quiz>;
  
  private categoryId: number;
  private questionId: number;
  private optionId: number;
  private quizId: number;

  constructor() {
    this.categories = new Map();
    this.questions = new Map();
    this.options = new Map();
    this.quizzes = new Map();
    
    this.categoryId = 1;
    this.questionId = 1;
    this.optionId = 1;
    this.quizId = 1;
    
    // Initialize with some data
    this.initData();
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  // Question operations
  async getQuestions(categoryId?: number): Promise<QuestionWithOptions[]> {
    let filteredQuestions = Array.from(this.questions.values());
    
    if (categoryId) {
      filteredQuestions = filteredQuestions.filter(q => q.categoryId === categoryId);
    }
    
    return Promise.all(filteredQuestions.map(q => this.getQuestionById(q.id) as Promise<QuestionWithOptions>));
  }

  async getQuestionById(id: number): Promise<QuestionWithOptions | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;
    
    const questionOptions = Array.from(this.options.values())
      .filter(option => option.questionId === id);
    
    const category = this.categories.get(question.categoryId);
    
    return { ...question, options: questionOptions, category };
  }

  // Quiz operations
  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const quiz: Quiz = {
      id: this.quizId++,
      categoryId: quizData.categoryId,
      totalQuestions: quizData.totalQuestions,
      currentQuestion: 0,
      score: 0,
      completed: false,
      answers: {},
    };
    
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  async getQuizById(id: number): Promise<QuizWithQuestions | undefined> {
    const quiz = this.quizzes.get(id);
    if (!quiz) return undefined;
    
    const questions = await this.getQuizQuestions(id);
    
    return { ...quiz, questions };
  }

  async updateQuizProgress(id: number, questionIndex: number, isCorrect: boolean): Promise<Quiz | undefined> {
    const quiz = this.quizzes.get(id);
    if (!quiz) return undefined;
    
    // Update quiz state
    const updatedQuiz: Quiz = {
      ...quiz,
      currentQuestion: questionIndex + 1,
      score: isCorrect ? quiz.score + 10 : quiz.score,
      completed: questionIndex + 1 >= quiz.totalQuestions,
      answers: {
        ...quiz.answers,
        [questionIndex]: isCorrect,
      },
    };
    
    this.quizzes.set(id, updatedQuiz);
    return updatedQuiz;
  }

  async getQuizQuestions(quizId: number): Promise<QuestionWithOptions[]> {
    const quiz = this.quizzes.get(quizId);
    if (!quiz) return [];
    
    let questions = await this.getQuestions(quiz.categoryId);
    
    // If category is not specified, get random questions
    if (!quiz.categoryId) {
      questions = this.shuffleArray(questions);
    }
    
    // Limit to total questions in quiz
    return questions.slice(0, quiz.totalQuestions);
  }
  
  // Helper methods
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  // Initialize test data
  private initData() {
    // Add categories
    const categories = [
      { id: this.categoryId++, name: "History" },
      { id: this.categoryId++, name: "Geography" },
      { id: this.categoryId++, name: "Science" },
      { id: this.categoryId++, name: "Sports" },
      { id: this.categoryId++, name: "Arts" }
    ];
    
    categories.forEach(category => {
      this.categories.set(category.id, category);
    });
    
    // Add questions and options
    // Geography questions
    const geographyQuestions = [
      {
        text: "Which mountain range separates Europe from Asia?",
        categoryId: 2,
        difficulty: 2,
        imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
        explanation: "The Ural Mountains form a natural boundary between Europe and Asia."
      },
      {
        text: "What is the capital city of Australia?",
        categoryId: 2,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
        explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne as many people think."
      },
      {
        text: "Which is the largest ocean on Earth?",
        categoryId: 2,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1518563222397-1fc14abdaf2f",
        explanation: "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface."
      }
    ];
    
    geographyQuestions.forEach(q => {
      const questionId = this.questionId++;
      this.questions.set(questionId, { ...q, id: questionId });
    });
    
    // History questions
    const historyQuestions = [
      {
        text: "In which year did World War II end?",
        categoryId: 1,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9",
        explanation: "World War II ended in 1945 with the surrender of Japan after the atomic bombings of Hiroshima and Nagasaki."
      },
      {
        text: "Who was the first President of the United States?",
        categoryId: 1,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1551970634-747a9a949307",
        explanation: "George Washington was the first President of the United States, serving from 1789 to 1797."
      }
    ];
    
    historyQuestions.forEach(q => {
      const questionId = this.questionId++;
      this.questions.set(questionId, { ...q, id: questionId });
    });
    
    // Science questions
    const scienceQuestions = [
      {
        text: "What is the chemical symbol for gold?",
        categoryId: 3,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1610375461249-b54fe1c53482",
        explanation: "The chemical symbol for gold is Au, derived from the Latin word 'aurum'."
      },
      {
        text: "What is the hardest natural substance on Earth?",
        categoryId: 3,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1606922913834-d27398e224a7",
        explanation: "Diamond is the hardest naturally occurring substance found on Earth."
      }
    ];
    
    scienceQuestions.forEach(q => {
      const questionId = this.questionId++;
      this.questions.set(questionId, { ...q, id: questionId });
    });
    
    // Sports questions
    const sportsQuestions = [
      {
        text: "Which country won the FIFA World Cup in 2018?",
        categoryId: 4,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6",
        explanation: "France won the 2018 FIFA World Cup, defeating Croatia 4-2 in the final match."
      },
      {
        text: "In which sport would you perform a slam dunk?",
        categoryId: 4,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        explanation: "A slam dunk is a move in basketball where a player jumps and forcefully puts the ball through the hoop."
      }
    ];
    
    sportsQuestions.forEach(q => {
      const questionId = this.questionId++;
      this.questions.set(questionId, { ...q, id: questionId });
    });
    
    // Arts questions
    const artsQuestions = [
      {
        text: "Who painted the Mona Lisa?",
        categoryId: 5,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1549060279-e92f7f51b85e",
        explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1506."
      },
      {
        text: "Which musical instrument has 88 keys?",
        categoryId: 5,
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1552422535-c45813c61732",
        explanation: "A standard piano has 88 keys: 52 white keys and 36 black keys."
      }
    ];
    
    artsQuestions.forEach(q => {
      const questionId = this.questionId++;
      this.questions.set(questionId, { ...q, id: questionId });
    });
    
    // Add options for the first geography question (Ural Mountains)
    const options1 = [
      { questionId: 1, text: "The Andes", isCorrect: false },
      { questionId: 1, text: "The Alps", isCorrect: false },
      { questionId: 1, text: "The Ural Mountains", isCorrect: true },
      { questionId: 1, text: "The Himalayas", isCorrect: false }
    ];
    
    options1.forEach(option => {
      const optionId = this.optionId++;
      this.options.set(optionId, { ...option, id: optionId });
    });
    
    // Add options for other questions
    const allQuestions = [
      ...geographyQuestions, 
      ...historyQuestions, 
      ...scienceQuestions, 
      ...sportsQuestions, 
      ...artsQuestions
    ];
    
    // Start from question ID 2 (we've already added options for question 1)
    for (let i = 2; i <= allQuestions.length; i++) {
      const questionOptions = [];
      
      // Based on question category, create appropriate options
      if (i === 2) { // Australia capital
        questionOptions.push(
          { questionId: i, text: "Sydney", isCorrect: false },
          { questionId: i, text: "Melbourne", isCorrect: false },
          { questionId: i, text: "Canberra", isCorrect: true },
          { questionId: i, text: "Brisbane", isCorrect: false }
        );
      } else if (i === 3) { // Largest ocean
        questionOptions.push(
          { questionId: i, text: "Atlantic Ocean", isCorrect: false },
          { questionId: i, text: "Indian Ocean", isCorrect: false },
          { questionId: i, text: "Pacific Ocean", isCorrect: true },
          { questionId: i, text: "Arctic Ocean", isCorrect: false }
        );
      } else if (i === 4) { // WWII end
        questionOptions.push(
          { questionId: i, text: "1943", isCorrect: false },
          { questionId: i, text: "1944", isCorrect: false },
          { questionId: i, text: "1945", isCorrect: true },
          { questionId: i, text: "1946", isCorrect: false }
        );
      } else if (i === 5) { // First US President
        questionOptions.push(
          { questionId: i, text: "Thomas Jefferson", isCorrect: false },
          { questionId: i, text: "Abraham Lincoln", isCorrect: false },
          { questionId: i, text: "George Washington", isCorrect: true },
          { questionId: i, text: "John Adams", isCorrect: false }
        );
      } else if (i === 6) { // Gold symbol
        questionOptions.push(
          { questionId: i, text: "Ag", isCorrect: false },
          { questionId: i, text: "Go", isCorrect: false },
          { questionId: i, text: "Au", isCorrect: true },
          { questionId: i, text: "Gd", isCorrect: false }
        );
      } else if (i === 7) { // Hardest substance
        questionOptions.push(
          { questionId: i, text: "Steel", isCorrect: false },
          { questionId: i, text: "Titanium", isCorrect: false },
          { questionId: i, text: "Diamond", isCorrect: true },
          { questionId: i, text: "Platinum", isCorrect: false }
        );
      } else if (i === 8) { // FIFA World Cup 2018
        questionOptions.push(
          { questionId: i, text: "Brazil", isCorrect: false },
          { questionId: i, text: "Germany", isCorrect: false },
          { questionId: i, text: "France", isCorrect: true },
          { questionId: i, text: "Croatia", isCorrect: false }
        );
      } else if (i === 9) { // Slam dunk
        questionOptions.push(
          { questionId: i, text: "Tennis", isCorrect: false },
          { questionId: i, text: "Volleyball", isCorrect: false },
          { questionId: i, text: "Basketball", isCorrect: true },
          { questionId: i, text: "Soccer", isCorrect: false }
        );
      } else if (i === 10) { // Mona Lisa
        questionOptions.push(
          { questionId: i, text: "Vincent van Gogh", isCorrect: false },
          { questionId: i, text: "Pablo Picasso", isCorrect: false },
          { questionId: i, text: "Leonardo da Vinci", isCorrect: true },
          { questionId: i, text: "Michelangelo", isCorrect: false }
        );
      } else if (i === 11) { // 88 keys
        questionOptions.push(
          { questionId: i, text: "Guitar", isCorrect: false },
          { questionId: i, text: "Violin", isCorrect: false },
          { questionId: i, text: "Piano", isCorrect: true },
          { questionId: i, text: "Flute", isCorrect: false }
        );
      }
      
      // Add options to storage
      questionOptions.forEach(option => {
        const optionId = this.optionId++;
        this.options.set(optionId, { ...option, id: optionId });
      });
    }
  }
}

export const storage = new MemStorage();

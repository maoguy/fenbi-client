export type TCacheData = {
  combineKey: string;
  exerciseId: number;
  keypointIds: number[];
  sheetType: number;
}

export type TCategory = {
  id: number;
  name: string;
  count: number;
  children:TCategory[]|null;
  answerCount:number;
}

export type TPageInitData = {
  cache:TCacheData;
  categories:TCategory[];
  fbVscExtConfig?:any;
}

export type TQuestionItem = {
  id: number;
  content: string;
  material: number[] | null;
  type: number;
  difficulty: number;
  createdTime: number;
  shortSource: null;
  accessories: {
    options: string[];
    type: 101 | 102 | 210;
  }[];
  correctAnswer: { choice: string; type: 101 | 102 | 210 } | null;
  hasVideo: number;
  materialIndexes: number[] | null;
}

export type TSolutionItem = TQuestionItem&{
  solution:string;
  source:string;
  correctAnswer:{
    choice: string,
    type: number;
  };
}

export type TMaterialItem = {
  content:string;
}

export type TUserAnswerItem = {
  questionId: number;
  answer: {
    choice: "0"|"1"|"2"|"3";
    type: number;
  };
  questionIndex:number;
  time: number;
  flag: number;
}

export type TQuestionData = {
  exerciseId: number;
  questions: TQuestionItem[]; //习题集合
  materials: TMaterialItem[]; //材料集合
  userAnswers: {
    [key:number]:TUserAnswerItem;
  }
};

export type TSolutionData = {
  exerciseId: number;
  solutions: TSolutionItem[]; //习题集合
  materials: TMaterialItem[]; //材料集合
  userAnswers: {
    [key:number]:TUserAnswerItem;
  },
  correctCount:number;
  questionCount:number;
}

export interface TLastAnswerRecord {
  // lastTime: number;
  lastCount: number | null;
  lastAnswer: string | null;
  lastQuestionId: number | null | undefined;
}
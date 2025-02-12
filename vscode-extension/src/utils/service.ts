import request from "./request";

export const getCache = async () => {
  const url = `https://tiku.fenbi.com/api/xingce/category-exercises-unfinished?noCacheTag=${Math.round(1e3 * Math.random())}&app=web&kav=100&av=100&hav=100&version=3.0.0.0`;
  const response = await request.get(url);
  return response;
};

export const getCategories = async () => {
  const url = "https://tiku.fenbi.com/api/xingce/categories?&filter=keypoint&app=web&kav=100&av=100&hav=100&version=3.0.0.0";
  const response = await request.get(url);
  return response;
};

export const getUserQuestionInfo = async () => {
  const url = `https://tiku.fenbi.com/activity/userquiz/getUserQuestionInfo?app=web&kav=100&av=100&hav=100&version=3.0.0.0`;
  const response = await request.get(url);
  return response;
}

export const getExerciseId = async (params: { keypointId:number }) => {
  const userInfoResponse = await getUserQuestionInfo();
  console.log(userInfoResponse);
  //用户设置的配置信息
  const {
    questionCount,
    yearScope,
    correctRatioLow,
    correctRatioHigh
  } = userInfoResponse.data.data;
  const url = "https://tiku.fenbi.com/api/xingce/exercises?app=web&kav=100&av=100&hav=100&version=3.0.0.0";
  
  // 创建一个表单数据对象
  const data = new URLSearchParams();
  data.append("type", "3");
  data.append("exerciseTimeMode","2");
  data.append("keypointId", `${params.keypointId}`);
  data.append("limit", `${questionCount||5}`);
  data.append("yearScope", `${yearScope}`);
  data.append("correctRatioLow",`${correctRatioLow}`);
  data.append("correctRatioHigh",`${correctRatioHigh}`);

  const response = await request({
    method:"POST",
    url,
    headers:{
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    data
  });

  return response;
};

export const getExercise = async (exerciseId: number) => {
  const url = `https://tiku.fenbi.com/api/xingce/exercises/${exerciseId}?app=web&kav=100&av=100&hav=100&version=3.0.0.0`;
  const response = await request.get(url);
  return response;
}

export const getQuestions = async (id:number) => {
  const url = `https://tiku.fenbi.com/api/xingce/universal/auth/questions?type=0&id=${id}&app=web&kav=100&av=100&hav=100&version=3.0.0.0`;
  const response = await request.get(url);
  return response;
}

export interface TIncrPayload {
  exerciseId:number;
  questionId:number;
  questionIndex:number;
  answerChoice:string;
  time?:number; //花费时间(秒)
}

export const incr = async (payload:TIncrPayload) => {
  const {
    exerciseId,
    questionId,
    questionIndex,
    answerChoice,
    time,
  } = payload;
  const url = `https://tiku.fenbi.com/api/xingce/async/exercises/${exerciseId}/incr?app=web&kav=100&av=100&hav=100&version=3.0.0.0`;
  const response = await request({
    method:"POST",
    url,
    data:[
      {
        answer:{
          type:201,
          choice: answerChoice
        },
        flag:0,
        questionId,
        questionIndex,
        time,
      }
    ]
  });
  return response;
}

export const submitExercise = async (exerciseId: number) => {
  const url = `https://tiku.fenbi.com/api/xingce/async/exercises/${exerciseId}/submit?app=web&kav=100&av=100&hav=100&version=3.0.0.0`;
  // 创建一个表单数据对象
  const data = new URLSearchParams();
  data.append("status", "3");
  const response = await request({
    method:"POST",
    url,
    headers:{
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    data
  });
  return response;
}

export const getSolution = async(exerciseId: number) => {
  const url = `https://tiku.fenbi.com/api/xingce/universal/auth/solutions?type=0&id=${exerciseId}&app=web&kav=100&av=100&hav=100&version=3.0.0.0`;
  const response = await request.get(url);
  return response;
}
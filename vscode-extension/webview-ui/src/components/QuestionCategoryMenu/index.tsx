//试题目录
import {
  TPageInitData,
} from "../../types";
import CategoryItem from "./CategoryItem";

interface TProps {
  pageInitData:TPageInitData;
  enterAnswerSheet:(id:number)=>void;
}

function QuestionCategoryMenu (props:TProps) {
  const {
    pageInitData:{
      categories,
      cache
    },
    enterAnswerSheet,
  } = props;

  return (
    <ul
      style={{
        width:"100%"
      }}
    >
      {
        categories?.map((category)=>{
          return (
            <CategoryItem
              key={category.id}
              category={category}
              cacheData={cache}
              enterAnswerSheet={enterAnswerSheet}
            />
          )
        })
      }
    </ul>
  );
}

export default QuestionCategoryMenu;
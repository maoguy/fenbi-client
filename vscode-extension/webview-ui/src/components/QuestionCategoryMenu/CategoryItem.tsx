import { useState } from "react";
import{
  TCategory,
  TCacheData,
} from "../../types";

interface TProps {
  category:TCategory;
  cacheData:TCacheData;
  enterAnswerSheet:(id:number)=>void;
}

function CategoryItem (props:TProps) {
  const { category,cacheData,enterAnswerSheet } = props;
  const {
    id,
    name,
    answerCount,
    count,
    children,
  } = category;
  const [isShowChildren,setIsShowChildren] = useState<boolean>(false);

  function toggleIsShowChildren () {
    //切换子项展开态
    setIsShowChildren(!isShowChildren);
  }

  function handleClickOfEnter (id:number) {
    //进入答卷
    return () => {
      enterAnswerSheet(id);
    }
  }

  return (
    <li>
      <div
        style={{
          display:"flex",
          justifyContent:"space-between"
        }}
      >
        <div>
          {
            children
            &&
            <button
              onClick={toggleIsShowChildren}
              title={isShowChildren?"收起":"展开"}
              style={{paddingRight:5}}
            >
              {isShowChildren?"▼":"▶"}
            </button>
          }
          {name}
          <small>
            ({answerCount}/{count})
          </small>
        </div>
        <div>
          <button
            title={"做题"}
            onClick={handleClickOfEnter(id)}
          >
            {
              cacheData?.keypointIds?.includes(id)
              &&
              <small>(ing)</small>
            }
            ✒️
          </button>
        </div>
      </div>
      {
        children
        &&
        isShowChildren
        &&
        <ul
          style={{
            paddingLeft:15,
            paddingBottom:5,
          }}
        >
          <hr/>
          {
            children.map((category)=>{
              return (
                <CategoryItem
                  key={id}
                  category={category}
                  cacheData={cacheData}
                  enterAnswerSheet={enterAnswerSheet}
                />
              );
            })
          }       
        </ul>
      }
    </li>
  );
}

export default CategoryItem;
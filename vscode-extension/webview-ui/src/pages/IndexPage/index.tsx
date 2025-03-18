import { vscode } from "../../utils/vscode"

import QuestionCategoryMenu from "../../components/QuestionCategoryMenu";
import { useNavigate } from "react-router-dom"; 
import useXingceState from "../../hooks/useXingceState";
import Mask from "../../components/Mask";
import Loading from "../../components/Loading";

function IndexPage() {
  const navigate = useNavigate();

  const {states,methods} = useXingceState();

  const {
    isLoading,
    pageInitData,
  } = states;

  const {
    fetchPageInitData
  } = methods;


  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    })
  }

  function enterAnswerSheet (id:number) {
    return navigate(`/exercise/${id}`);
  }

  return (
    <>
    <main
      style={{
        opacity:pageInitData?.fbVscExtConfig?.opacity,
        fontSize:pageInitData?.fbVscExtConfig?.fontSize,
        color:pageInitData?.fbVscExtConfig?.fontColor,
      }}
    >
      {/* 菜单模式 */}
      {
        (
          pageInitData
        )  
        &&
        <QuestionCategoryMenu
          pageInitData={pageInitData}
          enterAnswerSheet={enterAnswerSheet}
        />
      }    
      {/* <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton> */}
    </main>
    {
      isLoading
      &&
      <Loading/>
    }
    {
      pageInitData?.fbVscExtConfig?.isShowMask
      &&
      <Mask
        style={{
          opacity:pageInitData?.fbVscExtConfig.maskOpacity,
          fontSize:pageInitData?.fbVscExtConfig.maskFontSize,
        }}
      />
    }
    </>
  )
}

export default IndexPage;

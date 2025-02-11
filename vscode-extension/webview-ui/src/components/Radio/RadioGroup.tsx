import React, { useEffect } from "react";
import Radio from './index';

interface TProps {
  disabled?:boolean;
  defaultValue?:any;
  value?:any;
  onChange?:(value?:any)=>void;
  children?:React.ReactNode;
  // options?:string[]|number[]|{
  //   label:React.ReactNode;
  //   value:number|string;
  // }[]
}

function RadioGroup (props:TProps) {
  const {
    disabled,
    defaultValue,
    value:trulyValue,
    onChange=()=>console.log("has no onChange Func for RadioGroup"),
    children
  } = props;

  //缓存组件状态,避免闪动
  const [value,setValue] = React.useState(
    trulyValue!==undefined
    ?
    trulyValue
    :
    defaultValue
  );

  function handleChangeValueTo (newValue?:any) {
    return (checked:boolean)=>{
      //子组件先行消费
      setValue(newValue);
      //向父组件冒泡
      onChange(checked?newValue:undefined);   
    }
  }

  useEffect(()=>{
    // 如果父组件传递了新的 value，更新内部状态
    if(trulyValue!==undefined){
      setValue(trulyValue);
    }
  },[trulyValue]);

  return (
    <div>
      {
        React.Children.map(children,(child)=>{
          // 确保子元素是 Radio 组件
          if (React.isValidElement(child) && child.type === Radio) {
            const radioValue = (child?.props as any)?.value;
            return React.cloneElement(child as any, {
              disabled,
              checked: radioValue === value, // 设置 checked 属性
              onChange: handleChangeValueTo(radioValue), // 传递 onChange 处理函数
              ...(child?.props as any),
            });
          }
        })
      }
    </div>
  )
}

export default RadioGroup;
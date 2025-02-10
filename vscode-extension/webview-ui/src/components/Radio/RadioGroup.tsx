import React from "react";
import Radio from './index';

interface TProps {
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
    defaultValue,
    value=defaultValue,
    onChange=()=>console.log("has no onChange Func for RadioGroup"),
    children
  } = props;
  
  function handleChangeValueTo (newValue?:any) {
    return (checked:boolean)=>{
      onChange(checked?newValue:undefined);      
    }
  }
  return (
    <div>
      <pre>defaultValue:{defaultValue} value:{value}</pre>
      {
        React.Children.map(children,(child)=>{
          // 确保子元素是 Radio 组件
          if (React.isValidElement(child) && child.type === Radio) {
            const radioValue = (child?.props as any)?.value;
            return React.cloneElement(child as any, {
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
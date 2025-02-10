import RadioGroup from "./RadioGroup";

interface TProps {
  value: any;
  checked?: boolean;
  onChange?: (checked:boolean)=>void;
  children?:React.ReactNode;
}

function Radio (props:TProps) {
  const {
    value,
    checked=false,
    children,
    onChange=()=>console.log("has no onChange Func for Radio")
  } = props;
  
  function handleClickOfRadio () {
    onChange(!checked)
  }

  return (
    <div
      style={{
        border:checked?"solid":undefined,
        cursor:"pointer",
      }}
      onClick={handleClickOfRadio}
    >
      {children||value}
    </div>
  );
}

Radio.Group = RadioGroup;

export default Radio;
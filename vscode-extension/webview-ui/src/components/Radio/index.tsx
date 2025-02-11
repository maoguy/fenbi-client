import RadioGroup from "./RadioGroup";

interface TProps {
  disabled?:boolean;
  value: any;
  checked?: boolean;
  onChange?: (checked:boolean)=>void;
  children?:React.ReactNode;
}

function Radio (props:TProps) {
  const {
    disabled,
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
        cursor:disabled?undefined:"pointer",
      }}
      onClick={disabled?undefined:handleClickOfRadio}
    >
      {children||value}
    </div>
  );
}

Radio.Group = RadioGroup;

export default Radio;
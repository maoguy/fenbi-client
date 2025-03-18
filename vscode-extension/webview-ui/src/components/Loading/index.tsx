import "./index.css";

function Loading () {
  return (
    <svg
      className="pencil"
      viewBox="0 0 200 200"
      width="200px"
      height="200px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="pencil-eraser">
          <rect rx="5" ry="5" width="30" height="30"></rect>
        </clipPath>
      </defs>
      <circle
        className="pencil__stroke"
        r="70"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="439.82 439.82"
        stroke-dashoffset="439.82"
        stroke-linecap="round"
        transform="rotate(-113,100,100)"
      ></circle>
      <g className="pencil__rotate" transform="translate(100,100)">
        <g fill="none">
          <circle
            className="pencil__body1"
            r="64"
            stroke="hsl(30, 30%, 50%)"
            stroke-width="30"
            stroke-dasharray="402.12 402.12"
            stroke-dashoffset="402"
            transform="rotate(-90)"
          ></circle>
          <circle
            className="pencil__body2"
            r="74"
            stroke="hsl(30, 30%, 60%)"
            stroke-width="10"
            stroke-dasharray="464.96 464.96"
            stroke-dashoffset="465"
            transform="rotate(-90)"
          ></circle>
          <circle
            className="pencil__body3"
            r="54"
            stroke="hsl(30, 30%, 40%)"
            stroke-width="10"
            stroke-dasharray="339.29 339.29"
            stroke-dashoffset="339"
            transform="rotate(-90)"
          ></circle>
        </g>
        <g className="pencil__eraser" transform="rotate(-90) translate(49,0)">
          <g className="pencil__eraser-skew">
            <rect
              fill="hsl(30, 20%, 90%)"
              rx="5"
              ry="5"
              width="30"
              height="30"
            ></rect>
            <rect
              fill="hsl(30, 20%, 85%)"
              width="5"
              height="30"
              clip-path="url(#pencil-eraser)"
            ></rect>
            <rect fill="hsl(30, 20%, 80%)" width="30" height="20"></rect>
            <rect fill="hsl(30, 20%, 75%)" width="15" height="20"></rect>
            <rect fill="hsl(30, 20%, 85%)" width="5" height="20"></rect>
            <rect fill="hsla(30, 20%, 75%, 0.2)" y="6" width="30" height="2"></rect>
            <rect
              fill="hsla(30, 20%, 75%, 0.2)"
              y="13"
              width="30"
              height="2"
            ></rect>
          </g>
        </g>
        <g className="pencil__point" transform="rotate(-90) translate(49,-30)">
          <polygon fill="hsl(33,90%,70%)" points="15 0,30 30,0 30"></polygon>
          <polygon fill="hsl(33,90%,50%)" points="15 0,6 30,0 30"></polygon>
          <polygon fill="hsl(223,10%,10%)" points="15 0,20 10,10 10"></polygon>
        </g>
      </g>
    </svg>

  )
}

export default Loading;
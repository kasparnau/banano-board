// https://loading.io/css/
export default ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

// import * as React from "react";

// const cssUnit = {
//   cm: true,
//   mm: true,
//   in: true,
//   px: true,
//   pt: true,
//   pc: true,
//   em: true,
//   ex: true,
//   ch: true,
//   rem: true,
//   vw: true,
//   vh: true,
//   vmin: true,
//   vmax: true,
//   "%": true,
// };

// const parseLengthAndUnit = (size) => {
//   if (typeof size === "number") {
//     return {
//       value: size,
//       unit: "px",
//     };
//   }
//   let value;
//   const valueString = (size.match(/^[0-9.]*/) || "").toString();
//   if (valueString.includes(".")) {
//     value = parseFloat(valueString);
//   } else {
//     value = parseInt(valueString, 10);
//   }

//   const unit = (size.match(/[^0-9]*$/) || "").toString();

//   if (cssUnit[unit]) {
//     return {
//       value,
//       unit,
//     };
//   }

//   return {
//     value,
//     unit: "px",
//   };
// };

// const cssValue = (value) => {
//   const lengthWithunit = parseLengthAndUnit(value);

//   return `${lengthWithunit.value}${lengthWithunit.unit}`;
// };

// const createAnimation = (loaderName, frames, suffix) => {
//   const animationName = `react-spinners-${loaderName}-${suffix}`;

//   if (typeof window == "undefined" || !window.document) {
//     return animationName;
//   }

//   const styleEl = document.createElement("style");
//   document.head.appendChild(styleEl);
//   const styleSheet = styleEl.sheet;

//   const keyFrames = `
//     @keyframes ${animationName} {
//       ${frames}
//     }
//   `;

//   if (styleSheet) {
//     styleSheet.insertRule(keyFrames, 0);
//   }

//   return animationName;
// };

// const clip = createAnimation(
//   "ClipLoader",
//   "0% {transform: rotate(0deg) scale(1)} 50% {transform: rotate(180deg) scale(0.8)} 100% {transform: rotate(360deg) scale(1)}",
//   "clip"
// );

// function ClipLoader({
//   loading = true,
//   color = "#000000",
//   speedMultiplier = 1,
//   cssOverride = {},
//   size = 35,
//   ...additionalprops
// }) {
//   const style = {
//     background: "transparent !important",
//     width: cssValue(size),
//     height: cssValue(size),
//     borderRadius: "100%",
//     border: "2px solid",
//     borderTopColor: color,
//     borderBottomColor: "transparent",
//     borderLeftColor: color,
//     borderRightColor: color,
//     display: "inline-block",
//     animation: `${clip} ${0.75 / speedMultiplier}s 0s infinite linear`,
//     animationFillMode: "both",
//     ...cssOverride,
//   };

//   if (!loading) {
//     return null;
//   }

//   return <span style={style} {...additionalprops} />;
// }

// const Loader = ({ loading, size, color }) => {
//   return (
//     <ClipLoader
//       loading={loading !== undefined ? loading : true}
//       size={size !== undefined ? size : 24}
//       color={color !== undefined ? color : "#78662d"}
//     />
//   );
// };

// export default Loader;

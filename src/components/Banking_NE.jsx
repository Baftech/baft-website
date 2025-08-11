import React from "react";
import "./Banking_NE.css";
import ConcentricCircles from "./ConcentricCircles.jsx";
const Banking_NE = () => {
  return (
    <section
      id="hero"
      className=" bg-black relative min-h-screen flex flex-col items-center justify-center  shadow-lg"
    >
     <h1
  className="leading-tight"
  style={{
  color: "#EDEDED", // just text color, no background clipping
  fontFamily: "Satoshi",
  fontWeight: 700,
  fontSize: "64px",
}}
>
  Banking was never easy...
</h1>


      <p className="mt-4 text-lg text-center text-gray-600" style = {{
        fontFamily: "Satoshi",
        fontWeight: 500,
        fontSize: "22px",
        fontStyle: "medium",
        color: "#9898A8",

      }}>
        BAFT - Build for You. Powered by Tech
      </p>
      <ConcentricCircles />
    </section>
  );
};

export default Banking_NE;

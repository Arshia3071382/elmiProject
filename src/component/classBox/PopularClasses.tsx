import React from "react";
import Container from "../Container";
import ClassCart from "./ClassCart";

function PopularClasses() {
  return (
  <Container>
    <div className=" text-center mt-20">
        <div className="bg-accent w-30 h-0.5 mx-auto"></div>
        <h2 className="font-[iranBold] text-primary py-3 text-xl">کلاس های پرطرفدار</h2>
        <div className="bg-accent w-50 h-0.5 mx-auto"></div>
    </div>
    <div>
        <ClassCart />
    </div>
    </Container>
  );
}

export default PopularClasses;

import Image from "next/image";
import React from "react";
import photo from "./../../../public/image/gspgrtki0bmhvyglawxv.jpg";

function ClassCart() {
  const cartItem = [
    {
      id: 1,
      title: "کلاس ریاضی هشتم",
      image : "/image/1.jpg"
    },
    {
      id: 2,
      title: "کلاس علوم نهم",
      image : "/image/2.jpg"
    },
    {
      id: 3,
      title: "کارگاه مشاوره کنکور",
      image : "/image/1.jpg"
    },
  ];

  return (
    <div className="flex flex-wrap justify-between w-5/6 mx-auto">
      {cartItem.map((item) => (
        <div
          key={item.id}
          className="group shadow-2xl flex flex-col mx-auto justify-center items-center mt-10 rounded overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
        >
          <div className="overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={200}
              className="transition-transform duration-500 group-hover:scale-110 object-cover"
            />
          </div>
          <div className="flex flex-col gap-10 w-full">
            <div className="flex justify-center items-center flex-col gap-10">
              <h3 className="font-[iranBold] text-primary text-xl mt-5">
                {item.title}
              </h3>
            </div>
            <div className="bg-accent px-20 w-3/4 py-1 rounded shadow mb-5 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 mx-auto">
              <button className="font-[iranBold] text-white w-full">
                جزئیات
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClassCart;
"use client"
import React, { useState } from "react";
import Container from "./Container";
import { QuestionItem } from "@/type/page";




function Questions() {
  
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  const questionItem: QuestionItem[] = [
    {
      id: 1,
      question: "هزینه کلاس ها چقدر است؟",
      answer: "کاملا رایگان برای اعضای فعال مجموعه"
    },
    {
      id: 2,
      question: "مکان برگزاری کلاس ها کجا میباشد؟",
      answer: "کلاس های درسی در واحد علمی مجموعه منتظران برگزار میشود"
    },
    {
      id: 3,
      question: "چه درس هایی تدریس میشوند؟",
      answer: "دروس اصلی شامل ریاضی ، علوم ، عربی و زبان انگلیسی"
    },
    {
      id: 4,
      question: "علاوه بر تدریس چه محتوا های آموزشی داریم؟",
      answer: "کارگاه های مشاوره تحصیلی ، آزمون های جامع و مسابقات علمی"
    },
  ];

  
  const handleQuestionClick = (id: number): void => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  
  const handleMouseEnter = (id: number): void => {
    setHoveredIndex(id);
  };

  const handleMouseLeave = (): void => {
    setHoveredIndex(null);
  };

  return (
    <Container>
      <div className="w-5/6 mx-auto">
        <div className="mt-20 mb-10 text-center">
          <div className="bg-accent w-30 h-0.5 mx-auto"></div>
          <h2 className="font-[iranBold] text-primary py-3 text-xl">
            سوالات متداول
          </h2>
          <div className="bg-accent w-50 h-0.5 mx-auto"></div>
        </div>
        <div>
          <div className="flex flex-col justify-between gap-5">
            {questionItem.map((item: QuestionItem) => (
              <div 
                key={item.id}
                className="flex flex-col"
              >
                <div 
                  className="flex flex-row-reverse justify-between items-center bg-gray-100 py-5 shadow rounded cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleQuestionClick(item.id)}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <h3 className="mr-4 font-[iranSans-r] text-primary font-bold">
                    {item.question}
                  </h3>
                  <div 
                    className={`ml-2 rounded-3xl w-8 h-8 flex items-center justify-center cursor-pointer transition ${hoveredIndex === item.id || activeQuestion === item.id ? 'bg-accent text-white' : 'bg-gray-200'}`}
                  >
                    <p className="`text-xl transform transition-transform  font-bold">
                     {activeQuestion === item.id ? "-" : "+"}
                    </p>
                  </div>
                </div>
                
                
                {activeQuestion === item.id && (
                  <div className="bg-gray-50 p-5 shadow-inner rounded-b border-t">
                    <p className="font-[iranSans-r] text-gray-700 text-right leading-8">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Questions;
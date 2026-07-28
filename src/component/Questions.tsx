"use client";
import React, { useState } from "react";
import Container from "./Container";
import { QuestionItem } from "@/type/page";

function Questions() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const questionItem: QuestionItem[] = [
    {
      id: 1,
      question: "هزینه کلاس ها چقدر است؟",
      answer: "کلاس های حضوری اکثرا رایگان و یا با هزینه بسیار اندک برگزار میشود",
    },
    {
      id: 2,
      question: "مکان برگزاری کلاس ها کجا میباشد؟",
      answer: "کلاس های درسی در واحد علمی مجموعه و مدرسه منتظران برگزار میشود",
    },
    {
      id: 3,
      question: "چه درس هایی تدریس میشوند؟",
      answer: "دروس اصلی شامل ریاضی ، علوم ، عربی و زبان انگلیسی",
    },
    {
      id: 4,
      question: "علاوه بر تدریس چه محتوا های آموزشی داریم؟",
      answer: "کارگاه های مشاوره تحصیلی ، آزمون های جامع ، مسابقات علمی ، برنامه ویژه امتحانات و اردوهای جذاب",
    },
  ];

  const handleQuestionClick = (id: number): void => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <Container>
      <section className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden dir-rtl font-[iranSans-r]">
        
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

       
        <div className="w-full max-w-3xl mx-auto mb-16 text-center relative z-10">
          <div className="flex justify-end gap-1 mb-6 pl-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${
                  i === 4 ? 'bg-blue-400 w-16' : 
                  i === 3 ? 'bg-emerald-400 w-14' : 
                  i === 2 ? 'bg-cyan-400 w-12' :
                  i === 1 ? 'bg-teal-400 w-10' : 'bg-indigo-400 w-8'
                }`}
              />
            ))}
          </div>

          <h2 className="font-[iranBold] text-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            سوالات متداول
          </h2>
          
          <div className="flex justify-start gap-1 mt-6 pr-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${
                  i === 0 ? 'bg-blue-400 w-16' : 
                  i === 1 ? 'bg-emerald-400 w-14' : 
                  i === 2 ? 'bg-cyan-400 w-12' :
                  i === 3 ? 'bg-teal-400 w-10' : 'bg-indigo-400 w-8'
                }`}
              />
            ))}
          </div>
        </div>

        
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 relative z-10">
          {questionItem.map((item: QuestionItem) => {
            const isOpen = activeQuestion === item.id;

            return (
              <div 
                key={item.id}
                className="bg-white border-2 border-slate-100 rounded-3xl shadow-lg overflow-hidden transition-all duration-300"
              >
                
                <div 
                  className="flex flex-row-reverse justify-between items-center p-5 sm:p-6 cursor-pointer select-none gap-4 text-right"
                  onClick={() => handleQuestionClick(item.id)}
                >
                  
                  <h3 className="font-[iranBold] text-primary text-base sm:text-lg flex-1 leading-relaxed text-right">
                    {item.question}
                  </h3>

                 
                  <div 
                    className={`shrink-0 rounded-2xl w-10 h-10 flex items-center justify-center transition-all duration-300 border-2 ${
                      isOpen 
                        ? 'bg-blue-100 text-blue-600 border-blue-200 rotate-180' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <span className="text-xl font-bold leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                </div>

                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    <p className="font-[iranSans-r] text-slate-600 text-right leading-8 text-sm sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </Container>
  );
}

export default Questions;
// models/Contact.ts
import mongoose, { Schema, model, models } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "نام و نام خانوادگی الزامی است"],
      maxlength: [50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"]
    },
    grade: { 
      type: String, 
      required: [true, "پایه تحصیلی الزامی است"] 
    },
    subject: { 
      type: String, 
      required: [true, "موضوع پیام الزامی است"] 
    },
    phone: { 
      type: String, 
      required: [true, "شماره تماس الزامی است"],
      match: [/^09[0-9]{9}$/, "شماره تماس نامعتبر است"]
    },
    message: { 
      type: String, 
      required: [true, "متن پیام الزامی است"],
      maxlength: [500, "متن پیام نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"]
    },
  },
  { timestamps: true }
);

export default models.Contact || model("Contact", ContactSchema);
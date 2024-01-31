import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    // required: true
    default:"TODO"
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
},
  created_at: {
    type: String,
    default: new Date().toLocaleDateString('en-IN'),
  },
  updated_at: {
    type: String,
    default: null,
  },
  deleted_at: {
    type: String,
    default: null,
    // select: false 
  },
  due_date: {
    type: String,
    required: true,
  }
  
});

taskSchema.pre(/^find/, function () {
  this.where({ deleted_at: null });
});

export const Task= mongoose.model("Task", taskSchema);

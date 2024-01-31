import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema({

  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 0,
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
  },
});

subTaskSchema.pre('find', function () {
  this.where({ deleted_at: null });
});

export const SubTask= mongoose.model("Subtask", subTaskSchema);


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

subTaskSchema.pre(/^find/, function () {
  this.where({ deleted_at: null });
});

subTaskSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  this.deleted_at = new Date().toLocaleDateString('en-IN');
  await this.save(); // Soft delete the task
  next();
});

subTaskSchema.pre('deleteMany', async function (next) {
  // Access the documents to be deleted using `this._conditions`
  const documentsToDelete = await this.model.find(this._conditions);

  // Perform any necessary operations on the documents before deletion
  const date = new Date().toLocaleDateString('en-IN');
  for (const document of documentsToDelete) {
    document.deleted_at = date;
    await document.save(); // Soft delete each document
  }
  next();
});

export const SubTask= mongoose.model("Subtask", subTaskSchema);


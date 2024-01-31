import  express from "express"
import { SubTask } from "../models/subTask.js";
import { Task } from "../models/task.js";
import { isAuthenticated } from "../middlewares/auth.js";
// import { subtract } from "lodash";
const router = express.Router();

const calculateTaskStatus = async (taskId) => {
    const subtasks = await SubTask.find({ task_id: taskId });
    const allSubtasksCompleted = subtasks.every((subtask) => subtask.status === 1);
    if(allSubtasksCompleted){
        return "DONE";
    }
    else{
        const hasCompletedSubtask = subtasks.some((subtask) => subtask.status === 1);
        if(hasCompletedSubtask){
            return 'IN_PROGRESS';
        }
        else{
            return "TODO";
        }
    }
  };

router.post("/", isAuthenticated, async (req, res) => {
    const { task_id } = req.body;
    const subtask = await SubTask.create({ task_id });
    res.status(201).json(subtask);
})

router.get("/:id",isAuthenticated, async (req, res) => {
    const subTaskId = req.params.id;

    const subTask = await SubTask.findById(subTaskId);

    if (!subTask) {
        return res.status(404).json({ message: 'Subtask not found' });
    }

    res.status(200).json( subTask );
});

router.delete("/:id",isAuthenticated, async (req, res) => {
    const taskId = req.params.id;

    const subTask = await SubTask.findById(taskId)

    // );
    if (!subTask) {
        return res.status(404).json({ message: 'Subtask not found' });
    }
    subTask.deleted_at=new Date().toLocaleDateString('en-IN')
    subTask.save();
    res.status(200).json(subTask);
})


router.put("/:id",isAuthenticated, async (req, res) => {
    const taskId = req.params.id;
    const {status} = req.body;

    const subTask = await SubTask.findById(taskId)

    // );
    if (!subTask) {
        return res.status(404).json({ message: 'Subtask not found' });
    }
    subTask.status=status;
    subTask.updated_at=new Date().toLocaleDateString('en-IN');
    await subTask.save();
    const newTaskStatus= await calculateTaskStatus(subTask.task_id);
    const task = await Task.findByIdAndUpdate(
        subTask.task_id,
        { status: newTaskStatus, updated_at:new Date().toLocaleDateString('en-IN')},
        { new: true }
      );

    res.status(200).json(subTask);
    // res.status(200).json({message: "Subtask updated"});
})


router.get("/task/:id",isAuthenticated, async (req, res) => {
    const taskId = req.params.id;
    const subtasks = await SubTask.find({ task_id: taskId });
    res.status(200).json(subtasks);
})

export default router
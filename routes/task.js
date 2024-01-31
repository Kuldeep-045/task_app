import express from "express"
import { Task } from "../models/task.js";
const router = express.Router();
import { isAuthenticated } from "../middlewares/auth.js";
import { User } from "../models/user.js";

router.post("/", isAuthenticated, async (req, res) => {
    const { title, description, priority } = req.body;
    // console.log(req.body);
    const today = new Date();
    const getDate = new Date(today);
    getDate.setDate(today.getDate() + priority);
    const due_date = getDate.toLocaleDateString('en-IN');

    const task = await Task.create({ title, description, due_date,user: req.user._id });
    res.status(201).json(
        task
        // message: "Successfully Task Created"
    );
})

router.get("/",isAuthenticated,async(req,res)=>{

    // res.status(200).json({ user:req.user._id });
    const user=req.user._id
    const tasks = await Task.find({ user });
    res.status(200).json(tasks);

})

router.get("/:id", isAuthenticated, async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
})

router.delete("/:id", isAuthenticated, async (req, res) => {
    const taskId = req.params.id;

    const task = await Task.findById(taskId)
    // );
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.deleted_at = new Date().toLocaleDateString('en-IN');
    task.save();
    res.status(200).json(task);
})

export default router
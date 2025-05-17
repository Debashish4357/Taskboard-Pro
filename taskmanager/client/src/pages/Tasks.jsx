import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useGetTasksQuery } from "../redux/slices/taskApiSlice";
import toast from "react-hot-toast";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("TODO");

  const status = params?.status || "";
  
  const { data: tasksData, isLoading, error, refetch } = useGetTasksQuery({ 
    stage: status.toLowerCase() || undefined,
    isTrashed: false
  });

  useEffect(() => {
    // Refetch tasks when the component mounts or when status changes
    refetch();
  }, [status, refetch]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load tasks. Please try again.");
    }
  }, [error]);

  const handleCreateTask = (stage = "TODO") => {
    setSelectedStage(stage);
    setOpen(true);
  };

  const handleTodoAdd = () => handleCreateTask("TODO");
  const handleInProgressAdd = () => handleCreateTask("IN PROGRESS");
  const handleCompletedAdd = () => handleCreateTask("COMPLETED");

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => handleCreateTask()}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle 
              label='To Do' 
              className={TASK_TYPE.todo} 
              onAddClick={handleTodoAdd}
            />
            <TaskTitle
              label='In Progress'
              className={TASK_TYPE["in progress"]}
              onAddClick={handleInProgressAdd}
            />
            <TaskTitle 
              label='Completed' 
              className={TASK_TYPE.completed} 
              onAddClick={handleCompletedAdd}
            />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={tasksData?.tasks || []} />
        ) : (
          <div className='w-full'>
            <Table tasks={tasksData?.tasks || []} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} initialStage={selectedStage} />
    </div>
  );
};

export default Tasks;
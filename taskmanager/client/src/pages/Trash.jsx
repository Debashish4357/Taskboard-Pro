import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { useDeleteRestoreTaskMutation, useGetTasksQuery } from "../redux/slices/taskApiSlice";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const { data: tasksData, isLoading, refetch } = useGetTasksQuery({ isTrashed: true });
  const [deleteRestoreTask, { isLoading: isActionLoading }] = useDeleteRestoreTaskMutation();

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    try {
      let actionType = type;
      let id = selected;

      if (type === "deleteAll" || type === "restoreAll") {
        id = "";
      }

      await deleteRestoreTask({ 
        id, 
        action: actionType 
      }).unwrap();
      
      toast.success(`${type === "delete" || type === "deleteAll" ? "Delete" : "Restore"} operation successful`);
      setOpenDialog(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
        <th className='py-2 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className=''>{item?.priority}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage}
      </td>
      <td className='py-2 text-sm'>{formatDate(new Date(item?.date))}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
          disabled={isActionLoading}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
          disabled={isActionLoading}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => restoreAllClick()}
              disabled={isActionLoading || !tasksData?.tasks?.length}
            />
            <Button
              label='Delete All'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => deleteAllClick()}
              disabled={isActionLoading || !tasksData?.tasks?.length}
            />
          </div>
        </div>
        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : (
            <div className='overflow-x-auto'>
              {tasksData?.tasks?.length > 0 ? (
                <table className='w-full mb-5'>
                  <TableHeader />
                  <tbody>
                    {tasksData?.tasks?.map((task, id) => (
                      <TableRow key={id} item={task} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No tasks in trash
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
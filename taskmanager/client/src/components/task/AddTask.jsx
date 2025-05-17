import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import { useCreateTaskMutation } from "../../redux/slices/taskApiSlice";
import toast from "react-hot-toast";
import { uploadAssets } from "../../utils/uploadAssets";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, initialStage = "TODO" }) => {
  const task = "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(initialStage);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileNames, setFileNames] = useState([]);

  const [createTask, { isLoading }] = useCreateTaskMutation();

  // Update stage when initialStage prop changes
  useEffect(() => {
    if (initialStage && LISTS.includes(initialStage)) {
      setStage(initialStage);
    }
  }, [initialStage]);

  const submitHandler = async (data) => {
    try {
      if (team.length === 0) {
        return toast.error("Please select at least one team member");
      }

      setUploading(true);
      let uploadedFileURLs = [];

      if (assets.length > 0) {
        // This is a placeholder for the actual file upload function
        // In a real implementation, you would upload the files to a storage service
        // and get back the URLs
        uploadedFileURLs = await uploadAssets(assets);
      }

      const taskData = {
        title: data.title,
        team,
        stage,
        date: data.date,
        priority,
        assets: uploadedFileURLs,
      };

      await createTask(taskData).unwrap();
      toast.success("Task created successfully");
      reset();
      setTeam([]);
      setAssets([]);
      setFileNames([]);
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    setAssets(files);
    setFileNames(files.map(file => file.name));
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task Title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className='w-full'>
                <Textbox
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Date'
                  className='w-full rounded'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className='w-full flex flex-col items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)}
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
                {fileNames.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    {fileNames.length} file(s) selected
                  </div>
                )}
              </div>
            </div>

            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading || isLoading ? (
                <span className='text-sm py-2 text-red-500'>
                  {uploading ? "Uploading assets" : "Creating task..."}
                </span>
              ) : (
                <Button
                  label='Submit'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
                />
              )}

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => {
                  setOpen(false);
                  reset();
                  setTeam([]);
                  setAssets([]);
                  setFileNames([]);
                }}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
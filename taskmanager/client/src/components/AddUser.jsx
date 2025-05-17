import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useRegisterMutation, useUpdateProfileMutation } from "../redux/slices/userApiSlice";
import toast from "react-hot-toast";

const AddUser = ({ open, setOpen, userData, onSuccess }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues });

  const handleOnSubmit = async (data) => {
    try {
      if (userData) {
        // Update existing user
        await updateProfile({
          userId: userData._id,
          ...data
        }).unwrap();
        toast.success("User updated successfully");
      } else {
        // Create new user
        await register(data).unwrap();
        toast.success("User created successfully");
        reset();
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to process user data");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded'
              register={registerField("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder='Title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={registerField("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              register={registerField("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder='Role'
              type='text'
              name='role'
              label='Role'
              className='w-full rounded'
              register={registerField("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />

            {!userData && (
              <Textbox
                placeholder='Password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded'
                register={registerField("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password ? errors.password.message : ""}
              />
            )}
          </div>

          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
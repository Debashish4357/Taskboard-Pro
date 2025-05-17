import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import Button from "./Button";

const ChangePasswordModal = ({ open, setOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const submitHandler = async (data) => {
    try {
      setIsLoading(true);
      // Here you would typically make an API call to change the password
      // For example: await changePasswordMutation(data).unwrap();
      
      toast.success("Password changed successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          Change Password
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Current Password"
            type="password"
            name="currentPassword"
            label="Current Password"
            className="w-full rounded"
            register={register("currentPassword", { 
              required: "Current password is required" 
            })}
            error={errors.currentPassword ? errors.currentPassword.message : ""}
          />

          <Textbox
            placeholder="New Password"
            type="password"
            name="newPassword"
            label="New Password"
            className="w-full rounded"
            register={register("newPassword", { 
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            error={errors.newPassword ? errors.newPassword.message : ""}
          />

          <Textbox
            placeholder="Confirm New Password"
            type="password"
            name="confirmPassword"
            label="Confirm New Password"
            className="w-full rounded"
            register={register("confirmPassword", { 
              required: "Please confirm your password",
              validate: value => 
                value === watch("newPassword") || "Passwords do not match"
            })}
            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
          />

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            <Button
              label={isLoading ? "Changing..." : "Change Password"}
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            />

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ChangePasswordModal;
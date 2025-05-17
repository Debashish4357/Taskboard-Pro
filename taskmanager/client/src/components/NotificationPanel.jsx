import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState, useEffect } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "../redux/slices/userApiSlice";
import toast from "react-hot-toast";

const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, refetch, isLoading: isLoadingNotifications } = useGetNotificationsQuery();
  const [markNotificationRead, { isLoading }] = useMarkNotificationReadMutation();

  // Refetch notifications when panel opens
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const readHandler = async (isReadType, id) => {
    try {
      await markNotificationRead({ isReadType, id }).unwrap();
      toast.success("Notification marked as read");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };
  
  const viewHandler = (notification) => {
    setSelected(notification);
    readHandler("single", notification._id);
  };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),
    },
  ];

  return (
    <>
      <Popover className='relative'>
        {({ open: popoverOpen }) => (
          <>
            <Popover.Button 
              className='inline-flex items-center outline-none'
              onClick={() => setOpen(popoverOpen)}
            >
              <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
                <IoIosNotificationsOutline className='text-2xl' />
                {!isLoadingNotifications && data?.length > 0 && (
                  <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                    {data?.length}
                  </span>
                )}
              </div>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
              afterLeave={() => setOpen(false)}
            >
              <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
                {({ close }) => (
                  <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                    {isLoadingNotifications ? (
                      <div className='p-4 text-center'>Loading notifications...</div>
                    ) : data?.length > 0 ? (
                      <>
                        <div className='p-4'>
                          {data?.slice(0, 5).map((item, index) => (
                            <div
                              key={item._id + index}
                              className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50'
                            >
                              <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                                {ICONS[item.notiType]}
                              </div>

                              <div
                                className='cursor-pointer flex-1'
                                onClick={() => viewHandler(item)}
                              >
                                <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize'>
                                  <p>{item.notiType}</p>
                                  <span className='text-xs font-normal lowercase'>
                                    {moment(item.createdAt).fromNow()}
                                  </span>
                                </div>
                                <p className='line-clamp-1 mt-1 text-gray-600'>
                                  {item.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className='grid grid-cols-2 divide-x bg-gray-50'>
                          {callsToAction.map((item) => (
                            <Link
                              key={item.name}
                              onClick={
                                item?.onClick ? () => item.onClick() : () => close()
                              }
                              className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100'
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className='p-4 text-center'>No new notifications</div>
                    )}
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default NotificationPanel;
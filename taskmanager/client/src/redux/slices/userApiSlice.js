import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: '/user/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/user/login',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/user/logout',
        method: 'POST',
      }),
    }),
    getTeam: builder.query({
      query: () => ({
        url: '/user/get-team',
      }),
      providesTags: ['Team'],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: '/user/notifications',
      }),
      providesTags: ['Notifications'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Team'],
    }),
    markNotificationRead: builder.mutation({
      query: (data) => ({
        url: `/user/read-noti?isReadType=${data.isReadType}${data.id ? `&id=${data.id}` : ''}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/user/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
    activateUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Team'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetTeamQuery,
  useGetNotificationsQuery,
  useUpdateProfileMutation,
  useMarkNotificationReadMutation,
  useChangePasswordMutation,
  useActivateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
import { apiSlice } from './apiSlice';

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (data) => ({
        url: '/task/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tasks', 'Dashboard'],
    }),
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `/task/duplicate/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Tasks', 'Dashboard'],
    }),
    postTaskActivity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/activity/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: '/task/dashboard',
      }),
      providesTags: ['Dashboard'],
    }),
    getTasks: builder.query({
      query: (params) => ({
        url: '/task',
        params,
      }),
      providesTags: ['Tasks'],
    }),
    getTaskById: builder.query({
      query: (id) => ({
        url: `/task/${id}`,
      }),
      providesTags: ['Task'],
    }),
    createSubTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/create-subtask/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Tasks', 'Task', 'Dashboard'],
    }),
    trashTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Tasks', 'Dashboard'],
    }),
    deleteRestoreTask: builder.mutation({
      query: ({ id, action }) => ({
        url: `/task/delete-restore/${id}`,
        method: 'DELETE',
        params: { action },
      }),
      invalidatesTags: ['Tasks', 'Dashboard'],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useDuplicateTaskMutation,
  usePostTaskActivityMutation,
  useGetDashboardStatsQuery,
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateSubTaskMutation,
  useUpdateTaskMutation,
  useTrashTaskMutation,
  useDeleteRestoreTaskMutation,
} = taskApiSlice;
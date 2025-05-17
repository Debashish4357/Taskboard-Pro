import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({ 
  baseUrl: API_URI,
  credentials: 'include', // This ensures cookies are sent with requests
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Tasks', 'Task', 'Team', 'Dashboard', 'Notifications'],
  endpoints: (builder) => ({}),
});
//src/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const myApi = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts'
    })
  })
});

export const { useGetPostsQuery } = myApi;

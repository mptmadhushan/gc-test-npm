// api.js (in gc-test-npm)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const myApi = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://example.com/api/' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts'
    }),

    getPdfDocument: builder.query({
      query: (pdfUrl) => ({
        url: pdfUrl,
        method: 'GET',
        responseHandler: (response) => response.blob() // Return as a blob to handle file data
      })
    }),

    getDocumentUrl: builder.query({
      // query: (url) => `doc/${url}`,
      query: (docUrl) => ({
        url: 'https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf',
        method: 'GET',
        responseType: 'blob'
      })
    })
  })
})

export const {
  useGetPostsQuery,
  useGetPdfDocumentQuery,
  useGetDocumentUrlQuery
} = myApi

//src/DataList.js
import React from 'react';
import { useGetPostsQuery } from './api';

const DataList = () => {
  const { data, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error occurred</p>;

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export default DataList;

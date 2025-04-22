import React, { useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PostBox } from '../components/web/PostBox';
import NavBar from '../components/web/NavBar';
import CreatePost from '../components/web/CreatePost';

export default function FeedPage() {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([
    { id: 1, author: 'Alice', content: 'Hello world!' },
    { id: 2, author: 'Bob', content: 'This is a sample post.' },
  ]);

  useEffect(() => {
    if(!userSelector) {
      navigate('/login');
    }
  }, [userSelector, navigate]);


  // Handle new post creation
  const handlePostCreated = (newPost) => {
    // In a real app, the API would return the full post object with ID
    // For this example, we'll create a post object with a temporary ID
    const postWithId = {
      id: Date.now(), // Use timestamp as temporary ID
      author: userSelector?.name || 'Current User',
      content: newPost.content
    };
    
    setPosts([postWithId, ...posts]);
  };

  return (
    <>
      <NavBar />
      <Box maxW="2xl" mx="auto" mt={10} p={0} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={0} align="stretch">
          <CreatePost onPostCreated={handlePostCreated} user={userSelector} />
          {posts.map(post => (
            <PostBox author={post.author} content={post.content} key={post.id} />
          ))}
        </VStack>
      </Box>
    </>
  );
}

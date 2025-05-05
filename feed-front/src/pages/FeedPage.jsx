import React, { useEffect, useState } from 'react';
import { Box, VStack, Spinner, Center, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PostBox } from '../components/web/PostBox';
import NavBar from '../components/web/NavBar';
import CreatePost from '../components/web/CreatePost';

export default function FeedPage() {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/posts/get-all-posts');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!userSelector) {
      navigate('/login');
    } else {
      fetchPosts();
    }
  }, [userSelector, navigate]);


  // Handle new post creation
  const handlePostCreated = (newPost) => {
    // API returns the full post object - add it to the posts array
    setPosts([newPost.post, ...posts]);
  };

  return (
    <>
      <NavBar />
      <Box maxW="2xl" mx="auto" mt={10} p={0} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={0} align="stretch">
          <CreatePost onPostCreated={handlePostCreated} />
          
          {loading ? (
            <Center py={10}>
              <Spinner size="xl" />
            </Center>
          ) : error ? (
            <Center py={10}>
              <Text color="red.500">{error}</Text>
            </Center>
          ) : posts.length === 0 ? (
            <Center py={10}>
              <Text color="gray.500">No posts yet. Be the first to post!</Text>
            </Center>
          ) : (
            posts.map(post => (
              <PostBox 
                userId={post.userId}
                content={post.description} 
                createdAt={post.createdAt}
                key={post._id}
                _id={post._id}
                likes={post.likes}
                comments={post.comments}
              />
            ))
          )}
        </VStack>
      </Box>
    </>
  );
}

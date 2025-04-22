import { useState } from 'react';
import {
  Box,
  Textarea,
  Button,
  Flex,
  Avatar,
  Card,
  Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const user = useSelector((state) => state.user.user);

  const handlePost = async () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts/create-post', {
        userId: user?.user?._id,
        description: content,
      });
      
      setContent('');
      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card.Root width="full" mb={4}>
      <Card.Body p={4}>
        <Flex gap={3}>
          <Avatar.Root size="md">
            <Avatar.Fallback name={user?.user?.name || 'User'} />
            {user?.user?.profilePicture && <Avatar.Image src={user.user.profilePicture} />}
          </Avatar.Root>
          
          <Box width="full">
            <Textarea
              placeholder="What's happening?"
              resize="none"
              minH="100px"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              border="none"
              _focus={{ border: 'none', boxShadow: 'none' }}
              fontSize="lg"
              px={0}
              mb={2}
            />
            
            
            <Flex justifyContent="flex-end">
              <Text color="gray.500" mr={3} alignSelf="center">
                {content.length > 0 ? `${content.length}/280` : ''}
              </Text>
              <Button 
                colorScheme="blue" 
                borderRadius="full" 
                px={6}
                isLoading={isPosting}
                isDisabled={!content.trim() || isPosting}
                onClick={handlePost}
              >
                Post
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default CreatePost;
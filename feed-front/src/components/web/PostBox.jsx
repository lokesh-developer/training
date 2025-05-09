import { useState, useEffect } from "react";
import { 
  Avatar, 
  Button, 
  Card, 
  Flex, 
  Text, 
  Box, 
  Input,
  IconButton,
  VStack,
  HStack,
  // Divider,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";

export const PostBox = ({ userId, content, createdAt, _id, likes = [], comments = [] }) => {
  // Format the date if it exists
  const formattedDate = createdAt ? new Date(createdAt).toLocaleString() : 'Just now';
  const [user, setUser] = useState(null);
  const [postLikes, setPostLikes] = useState(likes);
  const [postComments, setPostComments] = useState(comments);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { isOpen: isCommentsOpen, onToggle: toggleComments } = useDisclosure();
  const currentUser = useSelector((state) => state.user.user);

  // Check if current user has liked this post
  const hasLiked = postLikes.includes(currentUser?.user?._id);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/user/get-user/${userId}`)
      .then(response => {
        setUser(response.data.user)
      })
      .catch(error => {
        console.log(error)
      })
    }
  }, [userId])
  
  // Handle like
  const handleLike = async () => {
    if (!currentUser?.user?._id) {
     
      return;
    }

    setIsLiking(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts/like-post', {
        postId: _id,
        userId: currentUser.user._id
      });
      
      setPostLikes(response.data.post.likes);
      
      
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment submission
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUser?.user?._id) {
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts/add-comment', {
        postId: _id,
        userId: currentUser.user._id,
        text: commentText
      });
      
      setPostComments(response.data.post.comments);
      setCommentText('');
      
      // If comments aren't already open, open them
      if (!isCommentsOpen) {
        toggleComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Fetch comments if they're not included in the post object
  useEffect(() => {
    if (isCommentsOpen && postComments.length === 0 && _id) {
      axios.get(`http://localhost:5000/api/posts/comments/${_id}`)
        .then(response => {
          setPostComments(response.data);
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
        });
    }
  }, [isCommentsOpen, _id, postComments.length]);
  
  return (
    <Card.Root width="full" mb={2} borderBottomWidth="1px">
      <Card.Body gap="2">
        <Flex alignItems="center" gap={3}>
          <Avatar.Root size="md">
            <Avatar.Fallback name={user?.name || 'User'} />
            {user?.profilePicture && <Avatar.Image src={user.profilePicture} />}
          </Avatar.Root>
          <Box>
            <Text fontWeight="bold">{user?.name || 'User'}</Text>
            <Text fontSize="sm" color="gray.500">{formattedDate}</Text>
          </Box>
        </Flex>
        <Card.Description mt={3} px={2}>
          {content}
        </Card.Description>

        {/* Likes count */}
        {postLikes.length > 0 && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            {postLikes.length} {postLikes.length === 1 ? 'like' : 'likes'}
          </Text>
        )}
      </Card.Body>

      {/* Action buttons */}
      <Card.Footer justifyContent="space-between">
        <Button 
          variant="ghost" 
          size="sm" 
          colorScheme={hasLiked ? "red" : "gray"}
          onClick={handleLike}
          isLoading={isLiking}
        >
          {hasLiked ? '❤️' : '🤍'} {hasLiked ? 'Liked' : 'Like'}
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleComments}>
          💬 Comments {postComments.length > 0 && `(${postComments.length})`}
        </Button>
        <Button variant="ghost" size="sm">↗️ Share</Button>
      </Card.Footer>

      {/* Comments section */}
      {/* <Collapse in={isCommentsOpen} animateOpacity> */}
        <Box px={4} pb={4}>
          {/* <Divider my={3} /> */}
          
          {/* Comment input */}
          <Flex mb={4}>
            <Avatar.Root size="sm" mr={2}>
              <Avatar.Fallback name={currentUser?.user?.name || 'Me'} />
              {currentUser?.user?.profilePicture && (
                <Avatar.Image src={currentUser.user.profilePicture} />
              )}
            </Avatar.Root>
            <Input 
              placeholder="Write a comment..." 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)}
              mr={2}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button 
              colorScheme="blue" 
              size="sm"
              onClick={handleAddComment}
              isLoading={submittingComment}
              isDisabled={!commentText.trim() || submittingComment}
            >
              Post
            </Button>
          </Flex>
          
          {/* Comments list */}
          <VStack align="stretch" spacing={3}>
            {postComments.length === 0 ? (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                No comments yet. Be the first to comment!
              </Text>
            ) : (
              postComments.map((comment, index) => (
                <CommentItem 
                  key={index} 
                  userId={comment.userId} 
                  text={comment.text} 
                  createdAt={comment.createdAt} 
                />
              ))
            )}
          </VStack>
        </Box>
      {/* </Collapse> */}
    </Card.Root>
  )
}

// Helper component for displaying individual comments
const CommentItem = ({ userId, text, createdAt }) => {
  const [commentUser, setCommentUser] = useState(null);
  const formattedDate = createdAt ? new Date(createdAt).toLocaleString() : '';

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/user/get-user/${userId}`)
        .then(response => {
          setCommentUser(response.data.user)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [userId]);

  return (
    <Flex>
      <Avatar.Root size="xs" mr={2} mt={1}>
        <Avatar.Fallback name={commentUser?.name || 'User'} />
        {commentUser?.profilePicture && <Avatar.Image src={commentUser.profilePicture} />}
      </Avatar.Root>
      <Box bg="gray.50" p={2} borderRadius="md" flex={1}>
        <Text fontWeight="bold" fontSize="sm">{commentUser?.name || 'User'}</Text>
        <Text fontSize="sm">{text}</Text>
        <Text fontSize="xs" color="gray.500" mt={1}>{formattedDate}</Text>
      </Box>
    </Flex>
  )
}

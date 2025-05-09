import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Avatar,
  Flex,
  Spinner,
  Center,
  Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NavBar from '../components/web/NavBar';
import ProfileEditForm from '../components/web/ProfileEditForm';

export default function ProfilePage() {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.user.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  // Get user data from localStorage
  const userData = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  // Fetch user profile data
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Parse the user data from localStorage if it exists
      if (!userData) {
        throw new Error('User not authenticated');
      }

      // Handle different user data structures - some might have user data nested in a 'user' property
      const userInfo = userData.user;

      if (!userInfo._id) {
        throw new Error('Invalid user data');
      }

      // Set basic profile from localStorage
      setProfile(userInfo);

      // Fetch user's posts
      const postsResponse = await axios.get(`http://localhost:5000/api/posts/user-posts/${userInfo._id}`);
      setUserPosts(postsResponse.data);
      console.log(postsResponse)

      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/edit-profile',
        updatedProfile,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data) {
        // Update local state and localStorage
        setProfile(response?.data?.user);
        localStorage.setItem('user', JSON.stringify(response?.data));

        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);

    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Center py={10}>
          <Spinner size="xl" />
        </Center>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Center py={10}>
          <Text color="red.500">{error}</Text>
        </Center>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Box maxW="2xl" mx="auto" mt={10} p={5} borderWidth={1} borderRadius={8} boxShadow="lg">
        {isEditing ? (
          <ProfileEditForm
            profile={profile}
            onSave={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <VStack spacing={5} align="stretch">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="lg">My Profile</Heading>
              <Button
                colorScheme="blue"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} alignItems="center" gap={6}>
              <Avatar.Root>
                <Avatar.Fallback name="Segun Adebayo" />
                <Avatar.Image src="https://bit.ly/sage-adebayo" />
              </Avatar.Root>
              <VStack align="start" spacing={2} flex={1}>
                <Heading size="md">{profile?.name || "User"}</Heading>
                <Text color="gray.600">{profile?.email || ""}</Text>
                <Text fontWeight="bold" mt={2}>Posts: {userPosts.length}</Text>
              </VStack>
            </Flex>

            <Box mt={8}>
              <Heading size="md" mb={4}>Your Posts</Heading>
              {userPosts.length === 0 ? (
                <Text color="gray.500">You haven't created any posts yet.</Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {userPosts.map(post => (
                    <Box
                      key={post._id}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      boxShadow="sm"
                    >
                      <Text>{post.description}</Text>
                      <Flex mt={2} justifyContent="space-between">
                        <Text fontSize="sm" color="gray.500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Text>
                        <Flex gap={2}>
                          <Text fontSize="sm" color="gray.500">
                            {post.likes?.length || 0} likes
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {post.comments?.length || 0} comments
                          </Text>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        )}
      </Box>
    </>
  );
}

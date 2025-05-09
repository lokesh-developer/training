import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Textarea,
  Button,
  Flex,
  Heading
} from '@chakra-ui/react';

export default function ProfileEditForm({ profile, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Only send id and name as expected by the backend
      const updatedProfile = {
        id: profile._id,
        name: formData.name
      };
      
      await onSave(updatedProfile);
    } catch (error) {
      console.error('Profile update error:', error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={5} align="stretch">
        <Heading size="lg">Edit Profile</Heading>
        
        <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        
        <Input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            disabled
          />
        
        <Flex justifyContent="flex-end" gap={4} mt={4}>
          <Button
            variant="outline"
            onClick={onCancel}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Saving"
          >
            Save Changes
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}

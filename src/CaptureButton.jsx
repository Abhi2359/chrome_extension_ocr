
import React from 'react';
import { Button } from '@chakra-ui/react';

const CaptureButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      colorScheme="teal"
      size="md"
      borderRadius="md"
      _hover={{ bg: 'teal.500' }}
      _active={{ bg: 'teal.600' }}
    >
      Capture Screen
    </Button>
  );
};

export default CaptureButton;

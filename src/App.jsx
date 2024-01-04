
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Button, Input, Box, Image, Text } from '@chakra-ui/react';
import CaptureButton from './CaptureButton';

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [convertedText, setConvertedText] = useState(null);

  const captureScreen = () => {
    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
      setCapturedImage(dataUrl);
    });
  };

  const handleUpload = () => {
    setUploadedImage(capturedImage);
  };

  const handleConvertToText = () => {
    if (uploadedImage) {
      Tesseract.recognize(
        uploadedImage,
        'eng',
        { logger: (info) => console.log(info) }
      ).then(({ data: { text } }) => {
        setConvertedText(text);
      });
    }
  };

  return (
    <Box width="300px" textAlign="center" p="4">
      <CaptureButton onClick={captureScreen} />
      {capturedImage && (
        <Box mt="4">
          <Text>Captured Image:</Text>
          <Image src={capturedImage} alt="Captured Screen" maxW="100%" />
        </Box>
      )}
      {uploadedImage && (
        <Box mt="4">
          <Text>Uploaded Image:</Text>
          <Image src={uploadedImage} alt="Uploaded Image" maxW="100%" />
        </Box>
      )}
      {capturedImage && (
        <Box mt="4">
          <Text>Upload Image:</Text>
          <Input type="text" value={uploadedImage || ''} readOnly my="2" />
          <Button onClick={handleUpload}>Upload</Button>
        </Box>
      )}
      {uploadedImage && (
        <Box mt="4">
          <Text>Convert to Text:</Text>
          <Button onClick={handleConvertToText}>Convert to Text</Button>
        </Box>
      )}
      {convertedText && (
        <Box mt="4">
          <Text>Converted Text:</Text>
          <Text>{convertedText}</Text>
        </Box>
      )}
    </Box>
  );
}

export default App;

import { useCallback, useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import {
  Box,
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Image,
} from '@chakra-ui/react';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [screenshotImage, setScreenshotImage] = useState(null);
  const [textResult, setTextResult] = useState("");

  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data } = await worker.recognize(selectedImage);
    setTextResult(data.text);
  }, [worker, selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, convertImageToText]);

  const handleScreenshot = () => {
    chrome.tabs.captureVisibleTab(null, {}, async (screenshotUrl) => {
      console.log(screenshotUrl);

      //Save the screenshot to the user's downloads
      chrome.downloads.download({
        url: screenshotUrl,
        filename: 'screenshot.png',
        saveAs: false,
      });

      setScreenshotImage(screenshotUrl);
      setSelectedImage(screenshotUrl);
    });
  };

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      setScreenshotImage(null);
    } else {
      setSelectedImage(null);
      setTextResult("");
      setScreenshotImage(null);
    }
  };

  return (
    
      <VStack spacing={4} align="center" p={4} bg="gray.100" borderRadius="md">
        <Box>
          <h1 color="teal.500">Image To Text</h1>
          
        </Box>
        <Box>
          <FormControl>
            <FormLabel color="teal.500">Screenshot or Upload Image</FormLabel>
            <Input type="file" onChange={handleChangeImage} />
          </FormControl>
        </Box>
        <Box>
          {(screenshotImage || selectedImage) && (
            <Image
              src={screenshotImage || URL.createObjectURL(selectedImage)}
              alt="thumb"
              boxSize="300px"
              objectFit="cover"
              borderRadius="md"
            />
          )}
        </Box>
        <Box>
          <Button
            colorScheme="teal"
            onClick={handleScreenshot}
            _hover={{ bg: 'teal.600' }}
          >
            Capture Screenshot
          </Button>
        </Box>
        <Box>
          {textResult && (
            <Box>
              <p color="teal.500">{textResult}</p>
            </Box>
          )}
        </Box>
      </VStack>
    
  );
};

export default App;

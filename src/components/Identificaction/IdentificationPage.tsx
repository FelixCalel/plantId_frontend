import React, { useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Image,
  Heading,
  Spinner,
  Center,
  Text,
} from '@chakra-ui/react';
import IdentificationResult from './IdentificationResult';
import { useIdentifyImageMutation } from '../../services/plantApi';

const IdentificationPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [identifyImage, { data, isLoading, error }] = useIdentifyImageMutation();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async () => {
    if (!file) return;
    await identifyImage(file);
  };

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <Heading mb={6}>Identificación de Plantas</Heading>

      <VStack gap={4} align="stretch">
        <Input
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />

        {preview && (
          <Image
            src={preview}
            alt="Preview"
            borderRadius="md"
            boxSize={{ base: '100px', md: '200px' }}
            objectFit="cover"
          />
        )}

        <Button
          colorScheme="green"
          onClick={onSubmit}
          disabled={!file || isLoading} 
        >
          {isLoading ? 'Identificando...' : 'Identificar planta'}
        </Button>

        {isLoading && (
          <Center>
            <Spinner size="lg" />
          </Center>
        )}

        {error && (
          <Text color="red.500">Error al identificar la planta.</Text>
        )}

        {data && (
          <IdentificationResult result={data} />
        )}
      </VStack>
    </Box>
  );
};

export default IdentificationPage;

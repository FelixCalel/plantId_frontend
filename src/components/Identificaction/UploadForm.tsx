import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useIdentifyImageMutation } from '../../services/plantApi';
import IdentificationResult from './IdentificationResult';
import type { IdentResult } from '../../models/types';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [identifyImage, { data, isLoading, error }] = useIdentifyImageMutation();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (file) {
      identifyImage(file);
    }
  };

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <form onSubmit={onSubmit}>
        <VStack align="stretch" gap={3}>
          <Input type="file" accept="image/*" onChange={onFileChange} />
          <Button
            type="submit"
            colorScheme="green"
            disabled={!file || isLoading}  // Disabled en lugar de isDisabled
          >
            {isLoading ? 'Identificando...' : 'Identificar planta'}
          </Button>
        </VStack>
      </form>

      {error && (
        <Text color="red.500" mt={4}>
          Error al identificar la planta.
        </Text>
      )}

      {data && (
        <Box mt={6}>
          <IdentificationResult result={data as IdentResult} />
        </Box>
      )}
    </Box>
  );
}

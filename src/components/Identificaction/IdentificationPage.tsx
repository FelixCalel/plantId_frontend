// src/components/Identificaction/IdentificationPage.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
} from "@chakra-ui/react";
import { useIdentifyImageMutation } from "../../services/plantApi";
import IdentificationResult from "./IdentificationResult";
import ChatWidget from "../chat/ChatWidget";

const IdentificationPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [chatToken, setChatToken] = useState<string | null>(null);

  const [identifyImage, { data: identData, isLoading, error }] =
    useIdentifyImageMutation();

  useEffect(() => {
    if (!identData) return;

    // tu API puede devolverlo en identData.secret o en identData.respuestaApi.access_token
    const topLevel = (identData as any).secret as string | undefined;
    const fromApi =
      (identData as any).respuestaApi?.access_token ??
      (identData as any).respuestaApi?.secret;
    setChatToken(topLevel ?? fromApi ?? null);
  }, [identData]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    // .unwrap() para que lance excepción si hubo error
    await identifyImage(file).unwrap();
  };

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <Heading mb={6}>Identificación de Plantas</Heading>

      <form onSubmit={onSubmit}>
        <VStack spacing={4} align="stretch">
          <Input type="file" accept="image/*" onChange={onFileChange} />

          {preview && (
            <Image
              src={preview}
              alt="Vista previa"
              borderRadius="md"
              boxSize={{ base: "100px", md: "200px" }}
              objectFit="cover"
            />
          )}

          <Button
            type="submit"
            colorScheme="green"
            disabled={!file || isLoading}
          >
            {isLoading ? "Identificando..." : "Identificar planta"}
          </Button>
        </VStack>
      </form>

      {isLoading && (
        <Center mt={4}>
          <Spinner size="lg" />
        </Center>
      )}

      {error && (
        <Text mt={4} color="red.500">
          Error al identificar la planta.
        </Text>
      )}

      {identData && (
        <Box mt={6}>
          <IdentificationResult result={identData as any} />
        </Box>
      )}

      {/* Montamos el chat solo cuando ya tengamos el token válido */}
      {identData?.id && chatToken && (
        <ChatWidget
          identificationId={String(identData.id)}
          secret={chatToken}
        />
      )}
    </Box>
  );
};

export default IdentificationPage;

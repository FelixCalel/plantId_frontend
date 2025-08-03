import React from 'react';
import { Box, Image, Heading, Text, VStack } from '@chakra-ui/react';
import type { IdentResult, IdentifyApiSuggestion } from '../../models/types';

interface Props {
  result: IdentResult;
}

const IdentificationResult: React.FC<Props> = ({ result }) => {
  const api = result.respuestaApi;
  const main = api.suggestions[0] as IdentifyApiSuggestion;
  const confidence = (main.probability * 100).toFixed(2);
  const remoteImg = api.images?.[0]?.url;

  const commonNames = main.plant_details?.common_names ?? [];
  const taxonomy = main.plant_details?.taxonomy;

  return (
    <Box
      mt={8}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg="white"
      shadow="sm"
    >
      <VStack align="start" gap={4}>
        <Heading size="md">Resultado de Identificación</Heading>

        <Text><strong>Confianza:</strong> {confidence}%</Text>

        {remoteImg && (
          <Image
            src={remoteImg}
            alt={main.plant_name}
            borderRadius="md"
            w="100%"
            maxH="300px"
            objectFit="contain"
          />
        )}

        <Box>
          <Text fontWeight="bold">Planta:</Text>
          <Text>{main.plant_name}</Text>
          {commonNames.length > 0 && (
            <Text>
              <em>Común:</em> {commonNames.join(', ')}
            </Text>
          )}
        </Box>

        {taxonomy && (
          <Box>
            <Text fontWeight="bold">Taxonomía:</Text>
            <Text>
              {taxonomy.genus ?? ''} {taxonomy.species ?? ''}
            </Text>
            <Text>
              <em>Familia:</em> {taxonomy.family ?? ''}
            </Text>
          </Box>
        )}
        <Box as="hr" w="100%" borderColor="gray.200" my={4} />

        <Box>
          <Text fontWeight="bold">Otras sugerencias:</Text>
          <Box as="ul" pl={4}>
            {api.suggestions.slice(1).map((sug: IdentifyApiSuggestion) => (
              <Box as="li" key={sug.id}>
                {sug.plant_name} — {(sug.probability * 100).toFixed(2)}%
              </Box>
            ))}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default IdentificationResult;

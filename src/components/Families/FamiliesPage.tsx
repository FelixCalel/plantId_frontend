import React, { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useGetFamiliasQuery } from "../../services/plantApi";

const FamiliesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const toast = useToast();

  const { data: result, isLoading, isError } = useGetFamiliasQuery({ page, q });

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (isError) {
    toast({ status: "error", title: "Error al cargar familias" });
    return (
      <Box p={4} textAlign="center">
        <Text>Hubo un error al cargar las familias.</Text>
      </Box>
    );
  }

  const familias = result?.items ?? [];

  return (
    <Box p={6}>
      <Heading mb={4}>Familias</Heading>
      <VStack spacing={4} mb={6} align="stretch">
        <Input
          placeholder="Buscar familias..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select
          placeholder="Página"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
        >
          {Array.from(
            { length: Math.ceil((result?.total ?? 0) / (result?.limit || 1)) },
            (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            )
          )}
        </Select>
      </VStack>

      {familias.length === 0 ? (
        <Text>No se encontraron familias.</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill,minmax(240px,1fr))" gap={6}>
          {familias.map((f) => (
            <GridItem
              key={f.id}
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              p={4}
            >
              <VStack align="start" spacing={2}>
                <Heading size="md">{f.nombre}</Heading>
                {f.descripcion && <Text>{f.descripcion}</Text>}
                <Text fontSize="sm" color={f.estado ? "green.600" : "red.600"}>
                  {f.estado ? "Activa" : "Inactiva"}
                </Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FamiliesPage;

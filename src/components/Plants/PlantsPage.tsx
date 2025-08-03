// src/components/Plants/PlantsPage.tsx
import React, { useState, ChangeEvent, FormEvent, useMemo } from "react";
import {
  Box,
  Heading,
  HStack,
  Input,
  Select,
  Button,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import Header from "../common/Header";
import PlantList from "./PlantList";
import { useGetPlantasQuery } from "../../services/plantApi";
import type { Plant } from "../../models/types";

const PlantsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(""); // texto de búsqueda
  const [estado, setEstado] = useState<"ACTIVA" | "INACTIVA" | "">("");

  // Llamamos al endpoint sin pasarle q (o pasándole '' para que no filtre aún)
  const { data, isLoading, isError } = useGetPlantasQuery(
    { q: "", page, estado },
    { skip: false }
  );

  // Aquí aplicamos el filtro local usando nombreCientifico y nombresComunes
  const filteredItems: Plant[] = useMemo(() => {
    if (!data) return [];
    if (!q.trim()) return data.items;

    const term = q.trim().toLowerCase();
    return data.items.filter((plant) => {
      // 1) coincide en el nombre científico
      const sci = plant.nombreCientifico.toLowerCase().includes(term);
      // 2) o coincide en alguno de los nombres comunes (substring)
      const common = plant.nombresComunes.some((nc) =>
        nc.toLowerCase().includes(term)
      );
      return sci || common;
    });
  }, [data, q]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    // ya no necesitamos re-disparar la query, porque filtramos localmente
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />

      <Box maxW="container.lg" mx="auto" p={4}>
        <Heading mb={6}>Búsqueda de Plantas</Heading>

        <Box as="form" onSubmit={handleSearch} mb={6}>
          <HStack spacing={4} wrap="wrap">
            <Input
              placeholder="Buscar por nombre o comunes..."
              value={q}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQ(e.target.value)
              }
              flex="1"
              maxW={{ base: "100%", md: "300px" }}
            />

            <Select
              placeholder="Estado"
              value={estado}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setEstado(e.target.value as "ACTIVA" | "INACTIVA" | "")
              }
              maxW="160px"
            >
              <option value="ACTIVA">Activas</option>
              <option value="INACTIVA">Inactivas</option>
            </Select>

            <Button type="submit" colorScheme="green">
              Buscar
            </Button>
          </HStack>
        </Box>

        {isLoading && (
          <Center py={10}>
            <Spinner size="xl" color="green.500" />
          </Center>
        )}

        {isError && !isLoading && (
          <Center py={10}>
            <Text color="red.500">Error al cargar plantas.</Text>
          </Center>
        )}

        {!isLoading && data && filteredItems.length === 0 && (
          <Center py={10}>
            <Text>No se encontraron plantas.</Text>
          </Center>
        )}

        {data && data.items.length > 0 && (
          <PlantList
            items={data.items}
            page={page}
            total={data.total}
            limit={25}
            onPageChange={setPage}
          />
        )}
      </Box>
    </Box>
  );
};

export default PlantsPage;

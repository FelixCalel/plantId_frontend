// src/components/Plants/PlantList.tsx
import React from "react";
import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import PlantCard from "./PlantCard";
import Pagination from "../common/Pagination";
import type { Plant } from "../../models/types";

interface Props {
  items?: Plant[];
  page: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

const PlantList: React.FC<Props> = ({
  items = [],
  page,
  total,
  limit,
  onPageChange,
}) => {
  if (items.length === 0) {
    return (
      <Box p={4}>
        <Text>No se encontraron plantas.</Text>
      </Box>
    );
  }

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {items.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </SimpleGrid>

      <Box mt={6}>
        <Pagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
        />
      </Box>
    </>
  );
};

export default PlantList;

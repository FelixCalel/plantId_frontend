// src/components/Usage/UsagePage.tsx
import React from "react";
import { useGetUsageQuery } from "../../services/usageApi";
import {
  Spinner,
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  used: "#4caf50",
  remaining: "#f44336",
};

export const UsagePage: React.FC = () => {
  const { data, isLoading, error } = useGetUsageQuery();
  const bgColor = useColorModeValue("gray.50", "gray.700");

  if (isLoading) return <Spinner size="xl" mt="20" />;
  if (error || !data)
    return (
      <Box p={6}>
        <Heading size="md" color="red.500">
          Error cargando estadísticas
        </Heading>
      </Box>
    );

  const pieData = [
    { name: "Usados", value: data.used.total, fill: COLORS.used },
    { name: "Restantes", value: data.remaining.total, fill: COLORS.remaining },
  ];

  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="start">
        <Heading as="h1" size="xl">
          Estadísticas de Plant.ID
        </Heading>

        <SimpleGrid columns={[1, 2]} spacing={4} w="full">
          <Stat p={4} bg="white" rounded="md" shadow="sm">
            <StatLabel>Status</StatLabel>
            <StatNumber color={data.active ? "green.500" : "red.500"}>
              {data.active ? "Activo ✅" : "Inactivo ❌"}
            </StatNumber>
          </Stat>
          <Stat p={4} bg="white" rounded="md" shadow="sm">
            <StatLabel>Créditos Límite</StatLabel>
            <StatNumber>{data.credit_limits.total}</StatNumber>
          </Stat>
          <Stat p={4} bg="white" rounded="md" shadow="sm">
            <StatLabel>Créditos Usados</StatLabel>
            <StatNumber>{data.used.total}</StatNumber>
          </Stat>
          <Stat p={4} bg="white" rounded="md" shadow="sm">
            <StatLabel>Créditos Restantes</StatLabel>
            <StatNumber>{data.remaining.total}</StatNumber>
          </Stat>
        </SimpleGrid>

        <Box w="full" bg="white" p={6} rounded="md" shadow="sm">
          <Heading as="h2" size="md" mb={4}>
            Consumo de Créditos
          </Heading>
          <Center>
            <Box w={["100%", "400px"]} h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.value}`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [value, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Center>
        </Box>
      </VStack>
    </Box>
  );
};

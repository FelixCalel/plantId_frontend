// src/components/chat/ChatHistory.tsx

import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { useGetHistoryQuery } from "../../services/chatApi";

interface ChatHistoryProps {
  conversacionId: number;
  limit?: number;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversacionId,
  limit = 25,
}) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetHistoryQuery(
    { conversacionId, page, limit },
    { skip: !conversacionId }
  );

  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">Error cargando historial</Text>;

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <Box p={4} bg="white" boxShadow="md" borderRadius="md">
      <VStack align="stretch" spacing={3}>
        {data?.items.map((msg) => (
          <Box
            key={msg.id}
            bg={msg.role === "BOT" ? "gray.100" : "blue.50"}
            p={3}
            borderRadius="md"
          >
            <HStack justify="space-between" mb={1}>
              <Badge
                colorScheme={msg.role === "BOT" ? "gray" : "blue"}
                variant="subtle"
              >
                {msg.role}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {new Date(msg.createdAt).toLocaleString()}
              </Text>
            </HStack>
            <Text whiteSpace="pre-wrap">{msg.content}</Text>
          </Box>
        ))}
      </VStack>

      <HStack justify="space-between" mt={4}>
        <Button
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          isDisabled={page === 1}
        >
          Anterior
        </Button>

        <Text fontSize="sm">
          Página {page} / {totalPages}
        </Text>

        <Button
          size="sm"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          isDisabled={page === totalPages}
        >
          Siguiente
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatHistory;

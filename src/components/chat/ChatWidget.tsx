import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Input,
  HStack,
  Text,
  IconButton,
  Collapse,
  Flex,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  useStartConversationMutation,
  useGetConversationQuery,
  useSendMessageMutation,
} from "../../services/chatApi";

interface ChatWidgetProps {
  identificationId: string;
  secret: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  identificationId,
  secret,
}) => {
  const [open, setOpen] = useState(false);

  // 1) Iniciar conversación
  const [startConversation, { data: convo, isLoading: starting }] =
    useStartConversationMutation();
  useEffect(() => {
    if (!open && identificationId && secret) {
      startConversation({ identificationId, secret })
        .unwrap()
        .then(() => setOpen(true))
        .catch(console.error);
    }
  }, [identificationId, secret, startConversation, open]);

  const conversationId = convo?.id ?? 0;

  // 2) Leer historial en "vivo"
  const { data: conversation, isLoading: loadingConv } =
    useGetConversationQuery(conversationId, { skip: conversationId === 0 });

  // 3) Enviar mensaje
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [message, setMessage] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages?.length]);

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      w="300px"
      bg="white"
      boxShadow="lg"
      borderRadius="md"
      overflow="hidden"
      zIndex={1000}
    >
      {/* Cabecera */}
      <Flex
        bg="teal.500"
        color="white"
        px={3}
        py={2}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <Heading size="sm">Chat Botánico</Heading>
        <IconButton
          aria-label={open ? "Cerrar chat" : "Abrir chat"}
          icon={open ? <ChevronDownIcon /> : <ChevronUpIcon />}
          variant="ghost"
          color="white"
        />
      </Flex>

      {/* Cuerpo */}
      <Collapse in={open} animateOpacity>
        <Box h="300px" overflowY="auto" bg="gray.50" p={2}>
          {(starting || loadingConv) && (
            <Flex justify="center">
              <Spinner />
            </Flex>
          )}

          {conversation?.messages?.map((m) => (
            <Box
              key={m.id}
              bg={m.role === "BOT" ? "gray.200" : "blue.100"}
              p={2}
              borderRadius="md"
              mb={2}
            >
              <Text fontSize="xs" color="gray.600">
                {m.role}
              </Text>
              <Text>{m.content}</Text>
            </Box>
          ))}

          <div ref={endRef} />
        </Box>

        {/* Input */}
        <HStack bg="white" p={2} borderTop="1px solid" borderColor="gray.200">
          <Input
            flex={1}
            placeholder="Escribe..."
            size="sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !sending && conversationId) {
                sendMessage({
                  conversacionId: conversationId,
                  content: message,
                })
                  .unwrap()
                  .then(() => setMessage(""))
                  .catch(console.error);
              }
            }}
            disabled={sending}
          />
          <Button
            size="sm"
            onClick={() => {
              if (!sending && conversationId) {
                sendMessage({
                  conversacionId: conversationId,
                  content: message,
                })
                  .unwrap()
                  .then(() => setMessage(""))
                  .catch(console.error);
              }
            }}
            isLoading={sending}
          >
            Enviar
          </Button>
        </HStack>
      </Collapse>
    </Box>
  );
};

export default ChatWidget;

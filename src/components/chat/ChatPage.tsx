// src/components/Chat/ChatPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Spinner,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import {
  useStartConversationMutation,
  useSendMessageMutation,
  useGetHistoryQuery,
} from "../../services/chatApi";

const ChatPage: React.FC = () => {
  const [identificationId, setIdentificationId] = useState("");
  const [secret, setSecret] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const toast = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [startConversation, { isLoading: starting }] =
    useStartConversationMutation();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const {
    data: history,
    isLoading: loadingHistory,
    refetch,
  } = useGetHistoryQuery(
    { conversacionId: conversationId ?? 0, page: 1, limit: 100 },
    { skip: !conversationId }
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleStart = async () => {
    setErrorMsg(null);
    if (!identificationId || !secret) {
      setErrorMsg("Debes completar Identification ID y Secret");
      return;
    }
    try {
      console.log("⏳ Iniciando conversación con:", {
        identificationId,
        secret,
      });
      const convo = await startConversation({
        identificationId,
        secret,
      }).unwrap();
      console.log("✅ Conversación iniciada:", convo);
      setConversationId(convo.id);
      toast({ status: "success", title: `Chat iniciado (ID ${convo.id})` });
    } catch (err: any) {
      console.error("❌ Error al iniciar chat:", err);
      setErrorMsg(err?.data?.error || err.message || "Error desconocido");
      toast({ status: "error", title: "Error al iniciar conversación" });
    }
  };

  const handleSend = async () => {
    setErrorMsg(null);
    if (!conversationId) {
      setErrorMsg("No hay conversación iniciada");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Escribe un mensaje antes de enviar");
      return;
    }
    try {
      console.log("⏳ Enviando mensaje:", message);
      const res = await sendMessage({
        conversacionId: conversationId,
        content: message.trim(),
      }).unwrap();
      console.log("✅ Mensaje enviado, respuesta:", res);
      setMessage("");
      refetch();
    } catch (err: any) {
      console.error("❌ Error al enviar mensaje:", err);
      setErrorMsg(err?.data?.error || err.message || "Error desconocido");
      toast({ status: "error", title: "Error al enviar mensaje" });
    }
  };

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <VStack spacing={6} align="stretch">
        {!conversationId && (
          <Box>
            <Text mb={2} fontWeight="bold">
              Iniciar Chatbot
            </Text>
            <HStack spacing={2}>
              <Input
                placeholder="Identification ID"
                value={identificationId}
                onChange={(e) => setIdentificationId(e.target.value)}
              />
              <Input
                placeholder="Secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
              />
              <Button
                onClick={handleStart}
                isLoading={starting}
                colorScheme="blue"
              >
                Iniciar
              </Button>
            </HStack>
          </Box>
        )}

        {errorMsg && (
          <Text color="red.500" fontSize="sm">
            {errorMsg}
          </Text>
        )}
        {conversationId && (
          <>
            <Box
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              h="400px"
              p={4}
              overflowY="auto"
            >
              {loadingHistory && <Spinner />}
              {history?.items.map((msg) => (
                <HStack
                  key={msg.id}
                  justify={msg.role === "USUARIO" ? "flex-end" : "flex-start"}
                  mb={2}
                >
                  {msg.role === "BOT" && <Avatar size="sm" name="Bot" />}
                  <Box
                    bg={msg.role === "USUARIO" ? "green.100" : "gray.100"}
                    px={4}
                    py={2}
                    borderRadius="md"
                    maxW="70%"
                  >
                    <Text whiteSpace="pre-wrap">{msg.content}</Text>
                    <Text fontSize="xs" color="gray.500" textAlign="right">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </Text>
                  </Box>
                  {msg.role === "USUARIO" && <Avatar size="sm" name="Tú" />}
                </HStack>
              ))}
              <div ref={bottomRef} />
            </Box>

            <HStack spacing={2}>
              <Input
                placeholder="Escribe tu mensaje…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                onClick={handleSend}
                isLoading={sending}
                colorScheme="blue"
              >
                Enviar
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ChatPage;

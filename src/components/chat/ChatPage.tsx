import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
import ChatHistory from "./ChatHistory";

interface ChatPageProps {
  identificationId: string;
  secret: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ identificationId, secret }) => {
  const toast = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    startConversation({ identificationId, secret })
      .unwrap()
      .then((convo) => {
        setConversationId(convo.id);
        toast({
          status: "success",
          title: `Chat iniciado (ID ${convo.id})`,
          duration: 2000,
        });
      })
      .catch((err) => {
        toast({
          status: "error",
          title: "No se pudo iniciar la conversación",
          description: err?.data?.error ?? err.message,
        });
      });
  }, [identificationId, secret]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSend = async () => {
    setErrorMsg(null);
    if (!conversationId) {
      setErrorMsg("Chat no iniciado");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Escribe algo antes de enviar");
      return;
    }
    try {
      await sendMessage({
        conversacionId: conversationId,
        content: message.trim(),
      }).unwrap();
      setMessage("");
      refetch();
    } catch (err: any) {
      setErrorMsg(err?.data?.error ?? err.message);
    }
  };

  if (!conversationId) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      w="320px"
      bg="white"
      boxShadow="lg"
      borderRadius="md"
      zIndex={1000}
    >
      <Tabs variant="soft-rounded" colorScheme="teal">
        <TabList p={2}>
          <Tab>Chat</Tab>
          <Tab>Historial</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Box maxH="300px" overflowY="auto" px={3} py={2} bg="gray.50">
              {(starting || loadingHistory) && (
                <Spinner size="sm" mx="auto" my={4} />
              )}

              {history?.items.map((m) => (
                <HStack
                  key={m.id}
                  mb={2}
                  justify={m.role === "USUARIO" ? "flex-end" : "flex-start"}
                >
                  {m.role === "BOT" && <Avatar size="sm" name="Bot" />}
                  <Box
                    bg={m.role === "USUARIO" ? "green.100" : "gray.100"}
                    px={3}
                    py={2}
                    borderRadius="md"
                    maxW="75%"
                  >
                    <Text whiteSpace="pre-wrap">{m.content}</Text>
                    <Text fontSize="xs" color="gray.500" textAlign="right">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </Text>
                  </Box>
                  {m.role === "USUARIO" && <Avatar size="sm" name="Tú" />}
                </HStack>
              ))}

              <div ref={bottomRef} />
            </Box>

            <HStack px={3} py={2} borderTop="1px solid" borderColor="gray.200">
              <Input
                placeholder="Escribe…"
                size="sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                isDisabled={sending}
              />
              <Button
                size="sm"
                onClick={handleSend}
                isLoading={sending}
                colorScheme="teal"
              >
                Enviar
              </Button>
            </HStack>

            {errorMsg && (
              <Text color="red.500" fontSize="xs" px={3} py={1}>
                {errorMsg}
              </Text>
            )}
          </TabPanel>

          <TabPanel p={4}>
            <ChatHistory conversacionId={conversationId} limit={50} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ChatPage;

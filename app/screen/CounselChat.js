import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { deleteMessageAsMember, getChatRoomInfoAsMember, getMessagesAsMember, pollMessagesAsMember, sendMessageAsMember } from "../api/chat/chat.api";

export default function CounselChat() {
  const router = useRouter();
  const { id, name, chatRoomId } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatRoomInfo, setChatRoomInfo] = useState(null);
  const [polling, setPolling] = useState(false);
  const scrollRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    if (chatRoomId) {
      fetchChatRoomInfo();
      fetchMessages();
      startPolling();
    } else {
      setLoading(false);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [chatRoomId]);

  const fetchChatRoomInfo = async () => {
    if (!chatRoomId) return;

    try {
      const response = await getChatRoomInfoAsMember(chatRoomId);
      const info = response.data.data || response.data;
      setChatRoomInfo(info);
    } catch (error) {
      console.log("Fetch chat room info error:", error);
    }
  };

  const fetchMessages = async () => {
    if (!chatRoomId) return;
    
    try {
      setLoading(true);
      const response = await getMessagesAsMember(chatRoomId, {
        page: 0,
        size: 50,
        sort: ["createdAt,asc"],
      });
      
      const messageData = response.data.data?.messages || [];
      setMessages(messageData.map((msg) => ({
        id: msg.id,
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: msg.senderType === "MEMBER",
        senderName: msg.senderName,
      })));
    } catch (error) {
      console.log("Fetch messages error:", error);
      Alert.alert("오류", "메시지를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatRoomId || sending) return;

    try {
      setSending(true);
      const response = await sendMessageAsMember(chatRoomId, {
        content: input.trim(),
      });

      const newMsg = response.data.data;
      setMessages((prev) => [
        ...prev,
        {
          id: newMsg.id,
          text: newMsg.content,
          time: new Date(newMsg.createdAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: newMsg.senderType === "MEMBER",
          senderName: newMsg.senderName,
        },
      ]);
      setInput("");

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 30);
    } catch (error) {
      console.log("Send message error:", error);
      Alert.alert("오류", "메시지 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  const startPolling = () => {
    if (!chatRoomId || polling) return;

    setPolling(true);
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0;
        if (lastMessageId === 0) return;

        const response = await pollMessagesAsMember(chatRoomId, lastMessageId);
        const newMessages = response.data.data || [];

        if (newMessages.length > 0) {
          const formattedMessages = newMessages.map((msg) => ({
            id: msg.id,
            text: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: msg.senderType === "MEMBER",
            senderName: msg.senderName,
          }));

          setMessages((prev) => [...prev, ...formattedMessages]);
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 30);
        }
      } catch (error) {
        console.log("Poll messages error:", error);
      }
    }, 5000);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!chatRoomId) return;

    Alert.alert(
      "메시지 삭제",
      "이 메시지를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMessageAsMember(chatRoomId, messageId);
              setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
            } catch (error) {
              console.log("Delete message error:", error);
              Alert.alert("오류", "메시지 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const isActive = input.trim().length > 0;

  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{name}</Text>

        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -30 : -30}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 5 }}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5DA7DB" />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>메시지가 없습니다.</Text>
            </View>
          ) : (
            messages.map((msg) => (
            <TouchableOpacity
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.isMe ? styles.myWrapper : styles.otherWrapper
              ]}
              onLongPress={() => msg.isMe && handleDeleteMessage(msg.id)}
              activeOpacity={0.8}
            >
              <View style={styles.rowBubble}>
                {msg.isMe ? (
                  <>
                    <Text style={styles.time}>{msg.time}</Text>
                    <View style={[styles.bubble, styles.myBubble]}>
                      <Text style={[styles.msgText, { color: "#FFFFFF" }]}>
                        {msg.text}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.bubble, styles.otherBubble]}>
                      <Text style={styles.msgText}>{msg.text}</Text>
                    </View>
                    <Text style={styles.time}>{msg.time}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="상담내용 입력"
              placeholderTextColor="#BFC5CC"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
            />

            <TouchableOpacity
              onPress={sendMessage}
              disabled={!isActive || sending}
              style={styles.sendIconWrapper}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#5DA7DB" />
              ) : (
                <Ionicons
                  name="paper-plane-outline"
                  size={22}
                  color={isActive ? "#5DA7DB" : "#B6BCC3"}
                  style={{ transform: [{ rotate: "20deg" }] }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    paddingTop: 60
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10
  },

  backBtn: {
    width: 26
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
    textAlign: "center",
    flex: 1
  },

  chatArea: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 5
  },

  messageWrapper: {
    marginBottom: 18,
    maxWidth: "80%"
  },

  myWrapper: {
    alignSelf: "flex-end"
  },

  otherWrapper: {
    alignSelf: "flex-start"
  },

  rowBubble: {
    flexDirection: "row",
    alignItems: "flex-end"
  },

  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    maxWidth: "80%"
  },

  myBubble: {
    backgroundColor: "#5DA7DB",
    borderTopRightRadius: 2
  },

  otherBubble: {
    backgroundColor: "#E7ECF1",
    borderTopLeftRadius: 2
  },

  msgText: {
    fontSize: 17,
    color: "#1d1d1d"
  },

  time: {
    fontSize: 13,
    color: "#8A8A8A",
    marginHorizontal: 6
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 25,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E6E6E6"
  },

  inputWrapper: {
    flex: 1,
    backgroundColor: "#EEF2F6",
    borderRadius: 10,
    height: 45,
    justifyContent: "center",
    position: "relative",
    top: -15,
    paddingHorizontal: 12
  },

  input: {
    flex: 1,
    fontSize: 17,
    height: "100%",
    paddingRight: 36
  },

  sendIconWrapper: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -16 }],
    padding: 4
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#8A8A8A",
  },
});

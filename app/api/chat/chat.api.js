import apiClient from "../axios";

// 1. 상담 시작
export const startChat = (data) => {
  return apiClient.post("/members/me/chat/start", data);
};

// 2. 메시지 목록 조회
export const getMessagesAsMember = (chatRoomId, { page = 0, size = 20, sort = ["createdAt,desc"] } = {}) => {
  return apiClient.get(`/members/me/chat/rooms/${chatRoomId}/messages`, {
    params: { page, size, sort },
  });
};

// 3. 메시지 전송
export const sendMessageAsMember = (chatRoomId, payload) => {
  return apiClient.post(`/members/me/chat/rooms/${chatRoomId}/messages`, payload);
};

// 4. 메시지 롱 폴링
export const pollMessagesAsMember = (chatRoomId, lastMessageId) => {
  return apiClient.get(`/members/me/chat/rooms/${chatRoomId}/messages/poll`, {
    params: { lastMessageId },
  });
};

// 5. 메시지 삭제
export const deleteMessageAsMember = (chatRoomId, messageId) => {
  return apiClient.delete(`/members/me/chat/rooms/${chatRoomId}/messages/${messageId}`);
};

// 6. 채팅방 정보 조회
export const getChatRoomInfoAsMember = (chatRoomId) => {
  return apiClient.get(`/members/me/chat/rooms/${chatRoomId}`);
};

// 7. 상담 종료
export const closeChatAsMember = (chatRoomId) => {
  return apiClient.post(`/members/me/chat/rooms/${chatRoomId}/close`);
};

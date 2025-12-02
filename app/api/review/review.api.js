// app/api/review/review.api.js
import apiClient from "../axios";

// -----------------------------------
// 1. 리뷰 작성 (POST /api/v1/members/me/reviews)
// -----------------------------------
export const createReview = (payload) => {
  return apiClient.post("/members/me/reviews", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => data,
  });
};

// -----------------------------------
// 2. 리뷰 상세 조회
// -----------------------------------
export const getReviewDetail = (reviewId) => {
  return apiClient.get(`/reviews/${reviewId}`);
};

// -----------------------------------
// 3. 리뷰 수정
// -----------------------------------
export const updateReview = (reviewId, payload) => {
  return apiClient.put(`/reviews/${reviewId}`, payload);
};

// -----------------------------------
// 4. 리뷰 삭제
// -----------------------------------
export const deleteReview = (reviewId) => {
  return apiClient.delete(`/reviews/${reviewId}`);
};

// -----------------------------------
// 5. 리뷰 신고
// -----------------------------------
export const reportReview = (reviewId, payload) => {
  return apiClient.post(`/reviews/${reviewId}/report`, payload);
};

// -----------------------------------
// 6. 내가 작성한 리뷰 목록
// -----------------------------------
export const getMyReviews = (page = 0, size = 10, sort = "createdAt,desc") => {
  return apiClient.get(`/members/me/reviews`, {
    params: { page, size, sort },
  });
};

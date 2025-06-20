// @/app/lib/https/message.https.js
import axiosInstance from "../axios";

// Get all messages for a booking
export const getMessages = async (bookingId) => {
  try {
    const res = await axiosInstance.get(`/message/${bookingId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Send a message for a booking
export const sendMessage = async (messageData) => {
  try {
    const res = await axiosInstance.post(`/message`, messageData);
    return res.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
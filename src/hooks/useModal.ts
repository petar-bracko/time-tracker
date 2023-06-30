import { useState } from "react";

export const useModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);

  const closeModal = () => setIsModalVisible(false);

  return { isModalVisible, openModal, closeModal };
};

export type Modal = ReturnType<typeof useModal>;

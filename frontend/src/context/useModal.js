// frontend/src/context/useModal.js
import { useContext } from 'react';
import { ModalContext } from './Modal'; // Update this to point to the correct file

const useModal = () => useContext(ModalContext);

export default useModal;

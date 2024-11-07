"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { Button } from "@nextui-org/button";

export const CustomModal = ({
  isModalOpen,
  closeModal,
  joined,
  error,
  loading,
  handleJoinNewLetter,
}: any) => {
  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <ModalContent>
        <ModalHeader className=" text-white bg-gray-700">Alert</ModalHeader>
        <ModalBody className=" ">
          <p className="pt-5">
            {joined
              ? "You have already subscribed to newsletter"
              : "Would you like to join newsletter?"}{" "}
          </p>
          {error ? (
            <p className=" text-red-600"> **Error joining, try again** </p>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={closeModal}>
            Close
          </Button>
          {joined ? null : (
            <Button color="primary" onPress={handleJoinNewLetter}>
              {loading ? "Loading" : "Join"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

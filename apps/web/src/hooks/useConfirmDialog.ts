"use client";

import { useState } from "react";

type UseConfirmDialogReturn = {
  isOpen: boolean;
  itemToDelete: string | null;
  openConfirmDialog: (itemId: string) => void;
  closeConfirmDialog: () => void;
  confirmDelete: (onConfirm: (itemId: string) => Promise<void>) => Promise<void>;
};

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const openConfirmDialog = (itemId: string): void => {
    setItemToDelete(itemId);
    setIsOpen(true);
  };

  const closeConfirmDialog = (): void => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async (onConfirm: (itemId: string) => Promise<void>): Promise<void> => {
    if (itemToDelete) {
      await onConfirm(itemToDelete);
      closeConfirmDialog();
    }
  };

  return {
    isOpen,
    itemToDelete,
    openConfirmDialog,
    closeConfirmDialog,
    confirmDelete,
  };
}

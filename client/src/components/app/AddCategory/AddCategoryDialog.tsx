import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddCategoryForm from "@/components/app/AddCategory/AddCategoryForm";

const AddCategoryDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj novu kategoriju</DialogTitle>
          <DialogDescription className="mb-4">
            Unesite ime za novu glavnu kategoriju proizvoda.
          </DialogDescription>
        </DialogHeader>
        <AddCategoryForm onFinished={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
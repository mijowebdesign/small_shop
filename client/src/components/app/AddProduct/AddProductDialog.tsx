import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddProductForm from "@/components/app/AddProduct/AddProductForm";

const AddProductDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-6xl w-[95vw] md:w-[90vw] p-0 border-none shadow-none bg-transparent">
        <DialogHeader className="sr-only">
          <DialogTitle>Dodaj novi proizvod</DialogTitle>
          <DialogDescription>
            Forma za dodavanje novog proizvoda.
          </DialogDescription>
        </DialogHeader>
        <AddProductForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddSubCategoryForm from "./AddSubCategoryForm";

const AddSubCategoryDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj novu podkategoriju</DialogTitle>
          <DialogDescription className="mb-4">
            Unesite ime i izaberite glavnu kategoriju za novu podkategoriju.
          </DialogDescription>
        </DialogHeader>
        <AddSubCategoryForm onFinished={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddSubCategoryDialog;
import { EllipsisVertical } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SubCategoryFilters  from "@/components/app/SubCategoryFilters";
import PriceFilters from './PriceFilters';

export function SidebarFilters() {
  return (
    <div className="sticky top-0">
      <div className="block lg:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center justify-center p-2">
            <EllipsisVertical className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side={"left"} className="w-64 p-4">
            <SheetHeader className="sr-only">
              <SheetTitle className="sr-only">Filteri</SheetTitle>
              <SheetDescription className="sr-only">Filteri</SheetDescription>
            </SheetHeader>
            <div className="space-y-4">
              <SubCategoryFilters />
              <PriceFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block w-64 p-4">
        <SubCategoryFilters />
        <PriceFilters />
      </aside>
    </div>
  );
}

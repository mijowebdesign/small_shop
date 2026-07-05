import React, {  useEffect } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { productsItems } from "@/constants/navbarItems";
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch} from '@/state/hooks';

import { Badge } from "@/components/ui/badge"
import { fetchSubCategoriesByCategoryId } from '@/state/category/categorySlice';

const defaultOpenItems = ["Povrce", "Sveze voce", "Mleko i mlečni proizvodi"];



const SidebarFiltersArea: React.FC = () => {
  const dispatch = useAppDispatch();
const { categorySlug } = useParams();
const { categories, selectedSubCategories } = useAppSelector((state) => state.category);
const currentCategory = categories.find(
  (cat) => cat.slug === categorySlug
);

useEffect(() => { 
  if (currentCategory?.id) {    
  dispatch(fetchSubCategoriesByCategoryId(currentCategory?.id || ""))}
  }, [currentCategory?.id, dispatch]);


    return (
        <ScrollArea className="h-full ">
          <div className="space-y-4 py-4">
            {/* <h2 className="text-lg font-semibold tracking-tight">Filteri</h2> */}

            <Accordion
              type="multiple"
              defaultValue={defaultOpenItems}
              className="w-full border rounded-md bg-popover p-3 shadow-xl "
            >
              
                <AccordionItem value={currentCategory?.id || ""}>
                  <AccordionTrigger className='flex'>{ currentCategory?.name?.sr || currentCategory?.name?.en || "" }  <Badge variant="secondary">2</Badge></AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {selectedSubCategories?.map((subItem) => (
                        <div
                          key={subItem?.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox id={subItem?.id} />
                          <label
                            htmlFor={subItem?.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {subItem?.name?.sr || subItem?.name?.en || "" }
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              
            </Accordion>
          </div>
        </ScrollArea>
    );
};

export default SidebarFiltersArea;
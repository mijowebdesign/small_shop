import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector, useAppDispatch } from '@/state/hooks';
import { fetchSubCategoriesByCategoryId } from '@/state/category/categorySlice';
import { setSubCategoryFilters } from '@/state/product/productSlice';

const SubCategoryFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categorySlug } = useParams();
  const { categories, selectedSubCategories } = useAppSelector((state) => state.category);
  const { subcategories: selectedFilters } = useAppSelector((state) => state.product.filters);
  
  const currentCategory = categories.find((cat) => cat.slug === categorySlug);
  
  useEffect(() => {
    if (currentCategory?.id) {
      dispatch(fetchSubCategoriesByCategoryId(currentCategory.id));
    }
  }, [dispatch, categorySlug, currentCategory]);
  console.log('Selected Filters:', selectedFilters);
 

  const handleCheckedChange = (checked: boolean, subCategoryId: string) => {
    const newFilters = checked
      ? [...selectedFilters, subCategoryId]
      : selectedFilters.filter((id) => id !== subCategoryId);
    dispatch(setSubCategoryFilters(newFilters));
  };

  if (!currentCategory || selectedSubCategories.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 py-4">
        <Accordion
          type="single"
          collapsible
          value={currentCategory.id || ''}
          className="w-full border rounded-md bg-popover p-3 shadow-xl"
        >
          <AccordionItem value={currentCategory.id} key={currentCategory.id}>
            <AccordionTrigger className='flex text-md font-semibold'>
              {currentCategory?.name?.sr}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {selectedSubCategories.map((subItem) => (
                  <div key={subItem.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={subItem.id}
                      checked={selectedFilters.includes(subItem.id)}
                      onCheckedChange={(checked) => handleCheckedChange(!!checked, subItem.id)}
                    />
                    <label htmlFor={subItem.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {subItem?.name?.sr}
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

export default SubCategoryFilters;
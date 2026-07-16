import React, { useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { setPriceFilter } from '@/state/product/productSlice';
import { debounce } from 'lodash';

const PriceFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const priceRange = useAppSelector((state) => state.product.filters.priceRange);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDispatch = useCallback(
    debounce((value: [number, number]) => {
      dispatch(setPriceFilter(value));
    }, 300),
    [dispatch]
  );

  return (
    <div className="space-y-4 py-4">
      <div className="p-3 border rounded-md bg-popover shadow-xl">
        <h3 className="text-md font-semibold tracking-tight">Cena</h3>
        <Slider
          value={priceRange}
          max={10000}
          step={100}
          onValueChange={(value) => debouncedDispatch(value as [number, number])}
          className="my-4 [&>span]:bg-slate-300"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]} din</span>
          <span>{priceRange[1]} din</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilters;
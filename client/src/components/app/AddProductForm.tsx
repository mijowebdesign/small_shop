import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { createProduct } from '@/state/product/productSlice';
import type { Product } from '@/types/Products';
import ProductDetailsForm from './ProductDetailsForm';

const AddProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.product);
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/400');

  const handleSubmit = async (data: Partial<Product>) => {

    dispatch(createProduct(data)).unwrap().then(() => {

    })
    .catch((err) => {
      console.error('Failed to create product:', err);
    }); 
    
  };

  return (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
    {error && (
      <div className="p-8">
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      </div>
    )}
      
     
        <div className="md:flex">

          <div className="md:w-1/3 p-2 border-b pt-6 ml-4" >
            <img
              src={imageUrl }
              alt={"new product"}
              className="w-full object-cover h-[300px] border rounded-sm p-3"
            />
          </div>

          <div className="md:w-2/3 p-8">
           <ProductDetailsForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={loading}
          setImageUrl={setImageUrl}
        /> 
          </div>
        </div>
      </div>
  )

 
};

export default AddProductForm;

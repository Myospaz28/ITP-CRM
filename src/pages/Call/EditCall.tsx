import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';

interface TeleCallerData {
  name: string;
  cat_id: string;
  tc_status: string;
  tc_remark: string;
  tc_call_duration: string;
  master_id: number;
  category: string;
  selected_products?: number[]; 
}

interface Product {
  product_id: number;
  product_name: string;
}

interface EditTeleCallerFormProps {
  data: TeleCallerData;
  onClose: () => void;
  onUpdate: () => void;
}

const EditTeleCallerForm: React.FC<EditTeleCallerFormProps> = ({
  data,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: data.name || '',
    call_status: '',
    call_remark: data.tc_remark || '',
    call_duration: data.tc_call_duration || '',
    master_id: data.master_id || 0,
    cat_id: data.cat_id || 0,
    next_followup_date: '',
  });

  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedRawStatus, setSelectedRawStatus] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  const [subStageList, setSubStageList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [statusMap, setStatusMap] = useState<any>({});

  const rawUserId = localStorage.getItem('user_id');
  const currentUserId =
    rawUserId && !isNaN(parseInt(rawUserId)) ? parseInt(rawUserId) : null;

const loadStages = async () => {
  try {
    const res = await axios.get(`${BASE_URL}api/leadstages`, {
      withCredentials: true,
    });

    const stages = Array.isArray(res.data.data) ? res.data.data : [];

    setStageList(stages);

    const map: any = {};
    stages.forEach((stage: any) => {
      if (stage?.stage_id && stage?.stage_name) {
        map[stage.stage_id] = stage.stage_name;
      }
    });
    setStatusMap(map);

   
    const currentStatus = data?.tc_status ? data.tc_status.toLowerCase() : null;

    if (!currentStatus) {
      console.warn("tc_status missing or empty in props:", data);
      return;
    }

    const matchedStage = stages.find(
      (s: any) =>
        s?.stage_name &&
        s.stage_name.toLowerCase() === currentStatus
    );

    if (matchedStage) {
      setFormData((prev) => ({
        ...prev,
        call_status: matchedStage.stage_id,
      }));

      fetchSubStagesByStage(matchedStage.stage_id);
    }
  } catch (error) {
    console.error("Error fetching stages:", error);
  }
};


  useEffect(() => {
    loadStages();
  }, []);

  useEffect(() => {
    if (data.selected_products) {
      setSelectedProducts(data.selected_products.map((p) => Number(p)));
    }
  }, [data]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/categories`);

        const categoryData = res.data.map((cat: any) => ({
          id: cat.cat_id,
          name: cat.cat_name,
        }));

        setCategories(categoryData);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async (catId: string | number) => {
    try {
      const res = await axios.get(`${BASE_URL}api/products/${catId}`);
      setProductList(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleProductSelection = (productId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  useEffect(() => {
    if (formData.cat_id) {
      fetchProducts(formData.cat_id);
    }
  }, [formData.cat_id]);

  const fetchSubStagesByStage = async (stageId: string | number) => {
    if (!stageId) {
      setSubStageList([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}api/lead-sub-stages/${stageId}`, {
        withCredentials: true,
      });
      setSubStageList(res.data.sub_stages || []);
    } catch (err) {
      console.error('Error fetching sub-stages:', err);
    }
  };

  useEffect(() => {
    if (data.selected_products && Array.isArray(data.selected_products)) {
      setSelectedProducts(data.selected_products.map(Number));
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (productId: number) => {
    setSelectedProducts((prev) => {
      const pid = Number(productId);

      return prev.includes(pid)
        ? prev.filter((id) => id !== pid)
        : [...prev, pid];
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tcStatus = statusMap[formData.call_status];

    const payload = {
      master_id: formData.master_id,
      cat_id: formData.cat_id,
      client_name: formData.name,
      tc_status: tcStatus,
      tc_remark: formData.call_remark,
      tc_call_duration: formData.call_duration,

      lead_stage_id: formData.call_status,
      lead_sub_stage_id: selectedRawStatus,

      // ✅ ADD THIS ↓↓↓
      selected_products: selectedProducts,
    };

    console.log('Final Payload:', payload);

    try {
      await axios.put(`${BASE_URL}api/edittelecaller`, payload, {
        withCredentials: true,
      });

      alert('Updated successfully');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating data:', err);
      alert('Failed to update');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-[999]">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-700">
        Edit Tele-Caller Data
      </h2>

      <form onSubmit={handleEdit} className="space-y-4">
        {/* Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.cat_id}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  cat_id: val,
                }));
                fetchProducts(val); // ⬅️ NO RESET OF selectedProducts
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status + Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Call Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Lead Stage
            </label>
            <select
              name="call_status"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.call_status}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  call_status: value,
                }));
                setSelectedRawStatus('');
                fetchSubStagesByStage(value);
              }}
            >
              <option value=""> Select Lead Stage</option>
              {stageList.map((stage) => (
                <option key={stage.stage_id} value={stage.stage_id}>
                  {stage.stage_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Sub Stage
            </label>
            <select
              name="selected_raw_status"
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedRawStatus}
              onChange={(e) => setSelectedRawStatus(e.target.value)}
            >
              <option value="">Select Sub Stage</option>
              {subStageList.map((subStage: any) => (
                <option
                  key={subStage.lead_sub_stage_id}
                  value={subStage.lead_sub_stage_id}
                >
                  {subStage.lead_sub_stage_name}
                </option>
              ))}
            </select>
          </div>

          {/* Product List */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Products
            </label>

            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded">
         {productList?.map((product) => (
  <label key={product.product_id} className="flex items-center gap-2">
    <input
      type="checkbox"
      value={product.product_id}
      checked={selectedProducts.includes(product.product_id)}
      onChange={(e) =>
        handleProductSelection(
          product.product_id,
          e.target.checked
        )
      }
    />
    {product.product_name}
  </label>
))}

            </div>
          </div> */}
        </div>

        {/* Sub Status + Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          {/* Call Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call Duration (sec)
            </label>
            <input
              type="number"
              name="call_duration"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.call_duration}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call Remark
          </label>
          <input
            type="text"
            name="call_remark"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.call_remark}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Products
          </label>

          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 rounded">
            {productList?.map((product) => (
              <label
                key={product.product_id}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  value={product.product_id}
                  checked={selectedProducts.includes(product.product_id)}
                  onChange={(e) =>
                    handleProductSelection(product.product_id, e.target.checked)
                  }
                />
                {product.product_name}
              </label>
            ))}
          </div>
        </div>

        {/* Remark */}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeleCallerForm;
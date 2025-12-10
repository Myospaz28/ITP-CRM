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
    call_status: data.tc_status || '',
    call_remark: data.tc_remark || '',
    call_duration: data.tc_call_duration || '',
    master_id: data.master_id || 0,
    cat_id: data.cat_id || 0,
    next_followup_date: '',
  });

  

  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [rawStatuses, setRawStatuses] = useState<string[]>([]);
  const [selectedRawStatus, setSelectedRawStatus] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [tcStatuses, setTcStatuses] = useState<string[]>([]);
  const [subStageList, setSubStageList] = useState([]);


  const [stageList, setStageList] = useState([]);
  const rawUserId = localStorage.getItem('user_id');
  const currentUserId =
    rawUserId && !isNaN(parseInt(rawUserId)) ? parseInt(rawUserId) : null;

  const loadStages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/leadstages`, {
        withCredentials: true,
      });
      setStageList(res.data.data);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };
  useEffect(() => {
    loadStages();
  }, []);

useEffect(() => {
  const fetchSubStages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/leadsubstage`, {
        withCredentials: true,
      });
      setSubStageList(res.data.data); // save all sub-stages
    } catch (err) {
      console.error("Error fetching lead sub-stages:", err);
    }
  };

  fetchSubStages();
}, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/categories`);
        const categoryData = res.data.map((cat: any) => ({
          id: cat.cat_id,
          name: cat.cat_name,
        }));
        setCategories(categoryData);

        const matchedCategory = categoryData.find(
          (cat) => cat.name.toLowerCase() === data.category?.toLowerCase(),
        );
        if (matchedCategory) {
          setFormData((prev) => ({
            ...prev,
            category: matchedCategory.id.toString(),
            cat_id: matchedCategory.id,
          }));
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTcStatuses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/tcstatus`);
        setTcStatuses(res.data);
      } catch (err) {
        console.error('Error fetching tc statuses', err);
      }
    };

    fetchTcStatuses();
  }, []);

  const fetchRawStatuses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/rawdatastatus`);
      setRawStatuses(res.data);
    } catch (err) {
      console.error('Error fetching raw statuses:', err);
    }
  };

  useEffect(() => {
    fetchRawStatuses();
  }, []);

  const fetchProducts = async (catId: string | number) => {
    try {
      const res = await axios.get(`${BASE_URL}api/products/${catId}`);
      setProductList(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };
  useEffect(() => {
    if (formData.cat_id) {
      fetchProducts(formData.cat_id);
    }
  }, [formData.cat_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      master_id: formData.master_id,
      cat_id: formData.cat_id,
      client_name: formData.name,
      tc_status: formData.call_status,
      tc_remark: formData.call_remark,
      tc_call_duration: formData.call_duration,
      selected_products:
        formData.call_status === 'Interested' ? selectedProducts : [],
      tc_next_followup_date: formData.next_followup_date || null,
      selected_raw_status:
        formData.call_status === 'Interested' ? selectedRawStatus : null,
      created_by_user: currentUserId,
    };
    console.log('sending payload', payload);

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


  const fetchSubStagesByStage = async (stageId: string | number) => {
  if (!stageId) {
    setSubStageList([]); // clear sub-stages if no stage selected
    return;
  }

  try {
    const res = await axios.get(`${BASE_URL}api/lead-sub-stages/${stageId}`, {
      withCredentials: true,
    });
    setSubStageList(res.data.sub_stages || []);
  } catch (err) {
    console.error("Error fetching sub-stages:", err);
  }
};

  const showInterestedFields = formData.call_status === 'Interested';
  const showFollowupDate = formData.call_status === 'Interested';

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-[999]">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-700">
        Edit Tele-Caller Data
      </h2>

      <form onSubmit={handleEdit} className="space-y-4">
        {/* Client + Category */}
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

          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.cat_id}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    category: val,
                    cat_id: parseInt(val, 10),
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Call Status
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
        selected_raw_status: "", // reset sub-stage when stage changes
      }));
      fetchSubStagesByStage(value);
    }}
  >
    <option value="">Select Status</option>
    {stageList.map((stage) => (
      <option key={stage.stage_id} value={stage.stage_id}>
        {stage.stage_name}
      </option>
    ))}
  </select>
</div>


          {/* Products Right */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Products
            </label>

            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded">
              {productList.map((product) => (
                <label
                  key={product.product_id}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    value={product.product_id}
                    checked={selectedProducts.includes(product.product_id)}
                    onChange={() => handleProductChange(product.product_id)}
                    className="h-4 w-4"
                  />
                  <span>{product.product_name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Select Status + Next Followup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
      <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Select Status
  </label>
  <select
    name="selected_raw_status"
    className="w-full p-2 border border-gray-300 rounded"
    value={formData.selected_raw_status}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        selected_raw_status: e.target.value,
      }))
    }
  >
    <option value="">Select Status</option>
    {subStageList.map((subStage) => (
      <option key={subStage.lead_sub_stage_id} value={subStage.lead_sub_stage_id}>
        {subStage.lead_sub_stage_name}
      </option>
    ))}
  </select>
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Follow-Up Date
            </label>
            <input
              type="date"
              name="next_followup_date"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.next_followup_date}
              onChange={handleChange}
            />
          </div>
        </div>

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

        {/* Call Remark */}
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import { toast } from 'react-toastify';

const UpdateActiveLeads = ({
  open,
  onClose,
  leadData,
  categories = [],
  references = [],
  areaList = [],
  sources = [],
  users = [],
  stageList = [],
  subStageList = [],
  setRefeshTrigger,
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [localSubStageList, setLocalSubStageList] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    address: '',
    area_id: '',
    qualification: '',
    passout_year: '',
    cat_id: '',
    reference_id: '',
    source_id: '',
    status: '',
    lead_status: '',
    assign_id: '',
    created_by_user: '',
    stage_id: '',
    lead_sub_stage_id: '',
    mode: '',
    assign_date: '',
    target_date: '',
    products: '',
    call_duration: '',
    call_remark: '',
    remark: '',
    follow_up_date: '',
    follow_up_time: '',
  });

  const [callStatus, setCallStatus] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [selectedReference, setSelectedReference] = useState('');
  const [sourceList, setSourceList] = useState([]);

  const fetchSubStages = async (stageId) => {
    try {
      const res = await axios.get(`${BASE_URL}api/lead-sub-stages/${stageId}`, {
        withCredentials: true,
      });

      setLocalSubStageList(res.data.sub_stages || []);

      if (leadData.lead_sub_stage_id) {
        setSubStatus(leadData.lead_sub_stage_id);
      }
    } catch (err) {
      console.error('Error loading sub-stages:', err);
    }
  };

  const fetchSourcesByReference = async (referenceId: string) => {
    if (!referenceId) {
      setSourceList([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}api/source/${referenceId}`, {
        withCredentials: true,
      });

      setSourceList(res.data.sources || []);
    } catch (err) {
      console.error('Error fetching sources', err);
    }
  };
  useEffect(() => {
    if (formData.reference_id) {
      fetchSourcesByReference(formData.reference_id);
    }
  }, [formData.reference_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatDateForInput = (utcDate) => {
    if (!utcDate) return '';

    // Convert UTC → IST properly
    const istDate = new Date(
      new Date(utcDate).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      }),
    );

    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const day = String(istDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (open && leadData) {
      setSelectedType(leadData.lead_status?.toLowerCase() || 'active');

      setFormData({
        name: leadData.name || '',
        number: leadData.number || '',
        email: leadData.email || '',
        address: leadData.address || '',
        // area_id: leadData.area_id || '',
        area_id: leadData.area_id ? String(leadData.area_id) : '',
        qualification: leadData.qualification || '',
        passout_year: leadData.passout_year || '',
        cat_id: leadData.cat_id || '',
        reference_id: leadData.reference_id || '',
        source_id: leadData.source_id || '',
        status: leadData.status || '',
        lead_status: leadData.lead_status || '',
        // assign_id: leadData.assign_id || '',
        assign_id: leadData.assigned_to_user_id || '',
        created_by_user: leadData.created_by_user || '',
        stage_id: leadData.stage_id || '',
        lead_sub_stage_id: leadData.lead_sub_stage_id || '',
        mode: leadData.mode || '',
        assign_date: leadData.assign_date
          ? formatDateForInput(leadData.assign_date)
          : '',
        target_date: leadData.target_date
          ? formatDateForInput(leadData.target_date)
          : '',
        products: leadData.products || '',
        call_duration: leadData.call_duration || '',
        call_remark: leadData.call_remark || '',
        remark: '',
        follow_up_date: leadData.follow_up_date
          ? formatDateForInput(leadData.follow_up_date)
          : '',
        follow_up_time: leadData.follow_up_time || '',
      });

      setCallStatus(
        leadData.lead_stage_id ? String(leadData.lead_stage_id) : '',
      );
      setSubStatus(
        leadData.lead_sub_stage_id ? String(leadData.lead_sub_stage_id) : '',
      );

      if (leadData.lead_stage_id) {
        fetchSubStages(String(leadData.lead_stage_id));
      }
    }
  }, [open, leadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      ...formData,
      lead_status: selectedType,
      lead_stage_id: callStatus,
      lead_sub_stage_id: subStatus,
      call_duration: formData.call_duration,
      call_remark: formData.call_remark,
      remark: formData.remark || '',
    };

    try {
      await axios.put(
        `${BASE_URL}api/update-lead/${leadData.master_id}`,
        updateData,
        { withCredentials: true },
      );

      // ✅ SUCCESS MESSAGE
      toast.success('Lead updated successfully');

      onClose();
      setRefeshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error updating lead:', error);

      toast.error('Failed to update lead. Please try again.');
    }
  };

  if (!open || !leadData) return null;

  const formatDateTime = (date: string | null, time?: string | null) => {
    if (!date) return 'NA';

    // 🔥 Convert UTC → IST (+05:30)
    const utcDate = new Date(date);
    const istTime = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, '0');
    const day = String(istTime.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    if (!time) return formattedDate;

    return `${formattedDate} ${time}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-3xl mt-20 max-h-[90vh] overflow-y-auto dark:border-strokedark dark:bg-boxdark ml-20">
        <div className="flex justify-between items-center border-b-2 mb-6 pb-3 dark:border-strokedark">
          <h2 className="text-xl font-bold dark:text-white">
            Edit Lead - {leadData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-6 mb-6">
          {['invalid', 'lose', 'win'].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedType === type}
                onChange={() => {
                  if (selectedType === type) {
                    setSelectedType(''); // uncheck
                  } else {
                    setSelectedType(type); // check
                  }
                }}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-semibold mb-3 dark:text-white border-b pb-2">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-sm dark:text-white">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm dark:text-white">
                        Passout Year
                      </label>
                      <input
                        type="text"
                        name="passout_year"
                        value={formData.passout_year}
                        onChange={handleInputChange}
                        placeholder="YYYY"
                        className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Products
                    </label>
                    <input
                      type="text"
                      name="products"
                      value={formData.products}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Call Duration
                    </label>
                    <textarea
                      name="call_duration"
                      value={formData.call_duration}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Add call remark here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Lead Details & Status */}
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-semibold mb-3 dark:text-white border-b pb-2">
                  Lead Details & Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Category
                    </label>
                    <select
                      name="cat_id"
                      value={formData.cat_id}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.cat_id} value={category.cat_id}>
                          {category.cat_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Reference
                    </label>
                    <select
                      name="reference_id"
                      value={formData.reference_id}
                      onChange={(e) => {
                        handleInputChange(e);
                        fetchSourcesByReference(e.target.value);
                      }}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select reference</option>
                      {references.map((reference) => (
                        <option
                          key={reference.reference_id}
                          value={reference.reference_id}
                        >
                          {reference.reference_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Source
                    </label>
                    <select
                      name="source_id"
                      value={formData.source_id}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select source</option>
                      {sourceList.map((source) => (
                        <option key={source.source_id} value={source.source_id}>
                          {source.source_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Center
                    </label>
                    <select
                      name="area_id"
                      value={formData.area_id}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select Center</option>
                      {areaList.map((area) => (
                        <option key={area.area_id} value={area.area_id}>
                          {area.area_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Assigned To
                    </label>
                    <select
                      name="assign_id"
                      value={formData.assign_id}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    >
                      <option value="">Select user</option>
                      {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Status Section - Conditional based on selectedType */}
              <div>
                <h3 className="text-md font-semibold mb-3 dark:text-white border-b pb-2">
                  Lead Status
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Lead Stage
                    </label>
                    <select
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      value={callStatus}
                      onChange={(e) => {
                        const stageId = e.target.value;
                        setCallStatus(stageId);
                        setSubStatus('');
                        fetchSubStages(stageId);
                      }}
                    >
                      <option value="">Select Stage</option>
                      {stageList.map((stage) => (
                        <option key={stage.stage_id} value={stage.stage_id}>
                          {stage.stage_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm dark:text-white">
                      Lead Sub Stage
                    </label>
                    <select
                      className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      value={subStatus}
                      onChange={(e) => setSubStatus(e.target.value)}
                    >
                      <option value="">Select Sub Stage</option>
                      {localSubStageList.map((sub) => (
                        <option
                          key={sub.lead_sub_stage_id}
                          value={sub.lead_sub_stage_id}
                        >
                          {sub.lead_sub_stage_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm dark:text-white">
                Follow Up Date
              </label>
              <input
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleInputChange}
                className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm dark:text-white">
                Follow Up Time
              </label>
              <input
                type="time"
                name="follow_up_time"
                value={formData.follow_up_time}
                onChange={handleInputChange}
                className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className=" mb-1 text-sm dark:text-white">Call Remark</label>
            <textarea
              name="call_remark"
              value={formData.call_remark}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-2.5 border rounded text-sm dark:border-form-strokedark dark:bg-form-input dark:text-white"
              placeholder="Add call remark here..."
            />
          </div>
          {/* Submit Buttons */}
          <div className="flex justify-center space-x-4 pt-6 border-t dark:border-strokedark">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-6 py-2.5 rounded text-sm font-medium transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded text-sm font-medium transition duration-200"
            >
              Update Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateActiveLeads;

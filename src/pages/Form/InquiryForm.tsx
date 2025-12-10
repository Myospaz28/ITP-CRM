
// import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config.js';

// interface InquiryFormState {
//   full_name: string;
//   city: string;
//   mobile: string;
//   email: string;
//   education_qualification: string;
//   passout_year: string;
//   itp_center: string;
//   reference_name: string;
//   course_interest: string;
// }

// interface CategoryType {
//   cat_id: number;
//   cat_name: string;
// }

// interface ReferenceType {
//   reference_id: number;
//   reference_name: string;
// }

// interface AreaType {
//   area_id: number;
//   area_name: string;
// }

// const InquiryForm: React.FC = () => {
//   const [formData, setFormData] = useState<InquiryFormState>({
//     full_name: '',
//     city: '',
//     mobile: '',
//     email: '',
//     education_qualification: '',
//     passout_year: '',
//     itp_center: '',
//     reference_name: '',
//     course_interest: '',
//   });

//   const [categories, setCategories] = useState<CategoryType[]>([]);
//   const [references, setReferences] = useState<ReferenceType[]>([]);
//   const [areas, setAreas] = useState<AreaType[]>([]);
//   const [loading, setLoading] = useState(false);

//   const API_KEY = 'RAM_COMPANY_SECRET_KEY';

//   // 📌 Fetch Category List
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}api/category`);
//         setCategories(res.data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // 📌 Fetch Reference List
//   useEffect(() => {
//     const fetchReferences = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}api/reference`);
//         setReferences(res.data);
//       } catch (error) {
//         console.error('Error fetching references:', error);
//       }
//     };
//     fetchReferences();
//   }, []);

//   // 📌 Fetch ITP Center (Area List)
//   useEffect(() => {
//     const fetchAreas = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}api/area`);
//         setAreas(res.data);
//       } catch (error) {
//         console.error('Error fetching areas:', error);
//       }
//     };
//     fetchAreas();
//   }, []);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(`${BASE_URL}api/inquiry`, formData, {
//         headers: { 'x-api-key': API_KEY },
//       });

//       alert('✔ ' + res.data.message);

//       setFormData({
//         full_name: '',
//         city: '',
//         mobile: '',
//         email: '',
//         education_qualification: '',
//         passout_year: '',
//         itp_center: '',
//         reference_name: '',
//         course_interest: '',
//       });
//     } catch (error) {
//       console.error(error);
//       alert('❌ Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
//         Inquiry Form
//       </h2>

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         {/* 🔽 AUTO INPUT FIELDS FIRST */}
//         {Object.keys(formData).map((key) =>
//           key !== 'course_interest' &&
//           key !== 'reference_name' &&
//           key !== 'itp_center' ? (
//             <div key={key} className="flex flex-col">
//               <label className="text-sm font-medium mb-1 text-gray-600">
//                 {key.replace(/_/g, ' ').toUpperCase()}
//               </label>
//               <input
//                 type="text"
//                 name={key}
//                 value={(formData as any)[key]}
//                 onChange={handleChange}
//                 required
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />
//             </div>
//           ) : null,
//         )}

//         {/* 🔽 ITP CENTER DROPDOWN BELOW */}
//         <div className="flex flex-col">
//           <label className="text-sm font-medium mb-1 text-gray-600">
//             ITP CENTER
//           </label>
//           <select
//             name="itp_center"
//             value={formData.itp_center}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="">Select ITP Center</option>
//             {areas.map((area) => (
//               <option key={area.area_id} value={area.area_name}>
//                 {area.area_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 🔽 REFERENCE DROPDOWN BELOW */}
//         <div className="flex flex-col">
//           <label className="text-sm font-medium mb-1 text-gray-600">
//             REFERENCE
//           </label>
//           <select
//             name="reference_name"
//             value={formData.reference_name}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="">Select Reference</option>
//             {references.map((ref) => (
//               <option key={ref.reference_id} value={ref.reference_name}>
//                 {ref.reference_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 🔽 COURSE DROPDOWN LAST */}
//         <div className="flex flex-col">
//           <label className="text-sm font-medium mb-1 text-gray-600">
//             COURSE INTEREST
//           </label>
//           <select
//             name="course_interest"
//             value={formData.course_interest}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="">Select Course</option>
//             {categories.map((cat) => (
//               <option key={cat.cat_id} value={cat.cat_id}>
//                 {cat.cat_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className={`md:col-span-2 w-full py-3 text-white text-lg font-semibold rounded-lg mt-2 transition-all ${
//             loading
//               ? 'bg-blue-300 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? 'Submitting...' : 'Register Now'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default InquiryForm;




// import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config.js';

// interface InquiryFormState {
//   full_name: string;
//   city: string;
//   mobile: string;
//   email: string;
//   education_qualification: string;
//   passout_year: string;
//   itp_center: string;
//   reference_name: string; // reference_id store karenge
//   source_name: string;    // source_id store karenge
//   course_interest: string;
// }

// interface CategoryType {
//   cat_id: number;
//   cat_name: string;
// }

// interface ReferenceType {
//   reference_id: number;
//   reference_name: string;
// }

// interface AreaType {
//   area_id: number;
//   area_name: string;
// }

// interface SourceType {
//   source_id: number;
//   source_name: string;
//   reference_id: number;
// }

// const InquiryForm: React.FC = () => {
//   const [formData, setFormData] = useState<InquiryFormState>({
//     full_name: '',
//     city: '',
//     mobile: '',
//     email: '',
//     education_qualification: '',
//     passout_year: '',
//     itp_center: '',
//     reference_name: '',
//     source_name: '',
//     course_interest: '',
//   });

//   const [categories, setCategories] = useState<CategoryType[]>([]);
//   const [references, setReferences] = useState<ReferenceType[]>([]);
//   const [areas, setAreas] = useState<AreaType[]>([]);
//   const [sources, setSources] = useState<SourceType[]>([]);
//   const [filteredSources, setFilteredSources] = useState<SourceType[]>([]);
//   const [loading, setLoading] = useState(false);

//   const API_KEY = 'RAM_COMPANY_SECRET_KEY';

//   // CATEGORY
//   useEffect(() => {
//     axios.get(`${BASE_URL}api/category`)
//       .then(res => setCategories(res.data))
//       .catch(err => console.error('Category Error:', err));
//   }, []);

//   // REFERENCE
//   useEffect(() => {
//     axios.get(`${BASE_URL}api/reference`)
//       .then(res => setReferences(res.data))
//       .catch(err => console.error('Reference Error:', err));
//   }, []);

//   // AREA (ITP CENTER)
//   useEffect(() => {
//     axios.get(`${BASE_URL}api/area`)
//       .then(res => setAreas(res.data))
//       .catch(err => console.error('Area Error:', err));
//   }, []);

//   // SOURCE - dependent on reference
//   useEffect(() => {
//     axios.get(`${BASE_URL}api/source`)
//       .then(res => setSources(res.data))
//       .catch(err => console.error('Source Error:', err));
//   }, []);

//   // HANDLE CHANGES
//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     setFormData({ ...formData, [name]: value });

//     // 🔽 When reference changes → filter sources
//     if (name === "reference_name") {
//       const ref = references.find(r => r.reference_id.toString() === value);

//       if (ref) {
//         const filtered = sources.filter(src => src.reference_id.toString() === value);
//         setFilteredSources(filtered);
//       } else {
//         setFilteredSources([]);
//       }

//       // reset source when reference changed
//       setFormData(prev => ({ ...prev, source_name: '' }));
//     }
//   };

//   // SUBMIT
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(`${BASE_URL}api/inquiry`, formData, {
//         headers: { 'x-api-key': API_KEY }
//       });

//       alert("✔ " + res.data.message);

//       setFormData({
//         full_name: '',
//         city: '',
//         mobile: '',
//         email: '',
//         education_qualification: '',
//         passout_year: '',
//         itp_center: '',
//         reference_name: '',
//         source_name: '',
//         course_interest: '',
//       });
//       setFilteredSources([]);

//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
//         Inquiry Form
//       </h2>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {/* AUTO FIELDS */}
//         {[
//           "full_name", "city", "mobile", "email",
//           "education_qualification", "passout_year"
//         ].map(key => (
//           <div key={key} className="flex flex-col">
//             <label className="text-sm font-medium mb-1">{key.replace(/_/g, " ").toUpperCase()}</label>
//             <input
//               type="text"
//               name={key}
//               value={(formData as any)[key]}
//               onChange={handleChange}
//               required
//               className="border border-gray-300 rounded-lg px-3 py-2"
//             />
//           </div>
//         ))}

//         {/* ITP CENTER */}
//         <div className="flex flex-col">
//           <label className="text-sm font-medium mb-1">ITP CENTER</label>
//           <select name="itp_center" value={formData.itp_center} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2">
//             <option value="">Select ITP Center</option>
//             {areas.map(area => (
//               <option key={area.area_id} value={area.area_name}>{area.area_name}</option>
//             ))}
//           </select>
//         </div>

//           <div className="flex flex-col">
//           <label className="text-sm font-medium mb-1">COURSE INTEREST</label>
//           <select name="course_interest" value={formData.course_interest} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2">
//             <option value="">Select Course</option>
//             {categories.map(cat => (
//               <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
//             ))}
//           </select>
//         </div>

//         {/* REFERENCE */}
//         <div className="flex flex-col">
//           <label className="text-sm font-medium mb-1">REFERENCE</label>
//           <select
//             name="reference_name"
//             value={formData.reference_name}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="">Select Reference</option>
//             {references.map(ref => (
//               <option key={ref.reference_id} value={ref.reference_id}>{ref.reference_name}</option>
//             ))}
//           </select>
//         </div>

//         {/* SOURCE (DEPENDENT) */}
//         <div className="flex flex-col">
//           <label className="text-sm font-medium mb-1">SOURCE</label>
//           <select
//             name="source_name"
//             value={formData.source_name}
//             onChange={handleChange}
//             disabled={filteredSources.length === 0}
//             required
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="">Select Source</option>
//             {filteredSources.map(src => (
//               <option key={src.source_id} value={src.source_id}>{src.source_name}</option>
//             ))}
//           </select>
//         </div>

//         {/* COURSE */}
      

//         {/* SUBMIT BTN */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`md:col-span-2 w-full py-3 text-white text-lg font-semibold rounded-lg mt-2 ${
//             loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? "Submitting..." : "Register Now"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default InquiryForm;




import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';

interface InquiryFormState {
  full_name: string;
  city: string;
  mobile: string;
  email: string;
  education_qualification: string;
  passout_year: string;
  itp_center: string;      // area_id
  reference_name: string;  // reference_id
  source_name: string;     // source_id
  course_interest: string; // cat_id
}

interface CategoryType {
  cat_id: number;
  cat_name: string;
}

interface ReferenceType {
  reference_id: number;
  reference_name: string;
}

interface AreaType {
  area_id: number;
  area_name: string;
}

interface SourceType {
  source_id: number;
  source_name: string;
  reference_id: number;
}

const InquiryForm: React.FC = () => {
  const [formData, setFormData] = useState<InquiryFormState>({
    full_name: '',
    city: '',
    mobile: '',
    email: '',
    education_qualification: '',
    passout_year: '',
    itp_center: '',
    reference_name: '',
    source_name: '',
    course_interest: '',
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [references, setReferences] = useState<ReferenceType[]>([]);
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [sources, setSources] = useState<SourceType[]>([]);
  const [filteredSources, setFilteredSources] = useState<SourceType[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'RAM_COMPANY_SECRET_KEY';

  // CATEGORY
  useEffect(() => {
    axios.get(`${BASE_URL}api/category`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Category Error:', err));
  }, []);

  // REFERENCE
  useEffect(() => {
    axios.get(`${BASE_URL}api/reference`)
      .then(res => setReferences(res.data))
      .catch(err => console.error('Reference Error:', err));
  }, []);

  // AREA
  useEffect(() => {
    axios.get(`${BASE_URL}api/area`)
      .then(res => setAreas(res.data))
      .catch(err => console.error('Area Error:', err));
  }, []);

  // SOURCE
  useEffect(() => {
    axios.get(`${BASE_URL}api/source`)
      .then(res => setSources(res.data))
      .catch(err => console.error('Source Error:', err));
  }, []);

  // HANDLE CHANGE
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "reference_name") {
      const filtered = sources.filter(src => src.reference_id.toString() === value);
      setFilteredSources(filtered);
      setFormData(prev => ({ ...prev, source_name: '' }));
    }
  };

  // SUBMIT
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}api/inquiry`, formData, {
        headers: { 'x-api-key': API_KEY }
      });

      alert("✔ " + res.data.message);

      setFormData({
        full_name: '',
        city: '',
        mobile: '',
        email: '',
        education_qualification: '',
        passout_year: '',
        itp_center: '',
        reference_name: '',
        source_name: '',
        course_interest: '',
      });
      setFilteredSources([]);

    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
        Inquiry Form
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* AUTO INPUT FIELDS */}
        {[
          "full_name", "city", "mobile", "email",
          "education_qualification", "passout_year"
        ].map(key => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              {key.replace(/_/g, " ").toUpperCase()}
            </label>
            <input
              type="text"
              name={key}
              value={(formData as any)[key]}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        ))}

        {/* ITP CENTER — AREA ID */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">ITP CENTER</label>
          <select
            name="itp_center"
            value={formData.itp_center}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select ITP Center</option>
            {areas.map(area => (
              <option key={area.area_id} value={area.area_id}>
                {area.area_name}
              </option>
            ))}
          </select>
        </div>

        {/* COURSE — CATEGORY ID */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">COURSE INTEREST</label>
          <select
            name="course_interest"
            value={formData.course_interest}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Course</option>
            {categories.map(cat => (
              <option key={cat.cat_id} value={cat.cat_id}>
                {cat.cat_name}
              </option>
            ))}
          </select>
        </div>

        {/* REFERENCE — REFERENCE ID */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">REFERENCE</label>
          <select
            name="reference_name"
            value={formData.reference_name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Reference</option>
            {references.map(ref => (
              <option key={ref.reference_id} value={ref.reference_id}>
                {ref.reference_name}
              </option>
            ))}
          </select>
        </div>

        {/* SOURCE — SOURCE ID */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">SOURCE</label>
          <select
            name="source_name"
            value={formData.source_name}
            onChange={handleChange}
            disabled={filteredSources.length === 0}
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Source</option>
            {filteredSources.map(src => (
              <option key={src.source_id} value={src.source_id}>
                {src.source_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`md:col-span-2 w-full py-3 text-white text-lg font-semibold rounded-lg mt-2 ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? "Submitting..." : "Register Now"}
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;

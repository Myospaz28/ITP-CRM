import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
// import Add_client from './pages/client/Add_client';
import AddClient from './pages/Client/Add_client';
import Client_list from './pages/Client/Client_list';
import Add_user from './pages/User/Add_user';
import User_list from './pages/User/User_list';
import Category from './pages/Master/Category';
import Reference from './pages/Master/Reference';
import Product from './pages/Master/Product';
import Followup from './pages/Marketing/Followup';
import MarketingProduct from './pages/Marketing/MarketingProduct';
// import View_task from './pages/Task/View_task';

import { BASE_URL } from '../public/config.js';

import Raw_data from './pages/Rawdata/Raw_data';
import Call from './pages/Call/Call';
import Visit from './pages/Visit/Visit';
import Area from './pages/Master/Area';
import CallReport from './pages/Report/CallReport';
import UploadDocument from './pages/Master/DocumentUpload';

import CampaignPage from './pages/Campaign/CampaignPage';
import ViewCampaign from './pages/Campaign/ViewCampaign';
import PreviewPage from './pages/Campaign/PreviewPage';
import ResponsesPage from './pages/Campaign/ResponsesPage';
import StudentForm from './pages/Campaign/studentForm.jsx';
import InquiryForm from './pages/Form/InquiryForm';
import LeadStagePage from './pages/Master/LeadStagePage';
import ActiveLeads from './pages/Call/ActiveLeads';
import WinLeads from './pages/Call/WinLeads';
import LoseLeads from './pages/Call/LoseLeads';
import InvalidLeads from './pages/Call/InvalidLeads';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Scroll to the top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Simulate loading effect
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Check session-based authentication
  // Check authentication except for public routes
  useEffect(() => {
    const publicRoutes = ['/signin', '/followup/campaign/student']; // base public routes

    // ✅ Allow all routes starting with /followup/campaign/student (even with :id)
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

    if (isPublic) return; // ⛔ Skip authentication check

    const checkAuth = async () => {
      try {
        const response = await axios.get(BASE_URL + 'auth/check-session', {
          withCredentials: true,
        });
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
        } else {
          setIsAuthenticated(false);
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
        navigate('/signin');
      }
    };

    checkAuth();
  }, [pathname, navigate]);

  // Handle login
  const handleLogin = (auth: boolean, role: string) => {
    setIsAuthenticated(auth);
    setUserRole(role);
    if (auth) {
      navigate('/dashboard');
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* <Route path="/signin" element={<InquiryForm />} /> */}
      <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
      
      <Route
        path="/followup/campaign/student/:id"
        element={
          <>
            <PageTitle title="Preview Campaign" />
            <StudentForm />
          </>
        }
      />

      {isAuthenticated ? (
        <>
          <Route
            path="/dashboard"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </DefaultLayout>
            }
          />

          <Route
            path="/master/category"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="category" />
                <Category />
              </DefaultLayout>
            }
          />

          <Route
            path="/master/product"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="product" />
                <Product />
              </DefaultLayout>
            }
          />
          <Route
            path="/upload-document/:product_id"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Upload Document" />
                <UploadDocument />
              </DefaultLayout>
            }
          />

          <Route
            path="/master/reference"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="reference" />
                <Reference />
              </DefaultLayout>
            }
          />

          <Route
            path="/master/area"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="area" />
                <Area />
              </DefaultLayout>
            }
          />

          <Route
            path="/user/add-user"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Add user" />
                <Add_user />
              </DefaultLayout>
            }
          />

          <Route
            path="/user/user-list"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="User List" />
                <User_list />
              </DefaultLayout>
            }
          />

          <Route
            path="/master-data"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Master Data" />
                <Raw_data />
              </DefaultLayout>
            }
          />

          <Route
            path="/inquiry-form"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Master Data" />
                <InquiryForm/>
              </DefaultLayout>
            }
          />

          <Route
            path="/client/add-client"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Add Client" />
                <AddClient />
              </DefaultLayout>
            }
          />

          <Route
            path="/client/client-list"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Client List" />
                <Client_list />
              </DefaultLayout>
            }
          />
          <Route
            path="/followup/followup-list"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Followup Record" />
                <Followup />
              </DefaultLayout>
            }
          />
          <Route
            path="/followup/meeting-scheduled"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Followup Record" />
                <MarketingProduct />
              </DefaultLayout>
            }
          />
          <Route
            path="/followup/campaign-page"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Create Campaign" />
                <CampaignPage />
              </DefaultLayout>
            }
          />

          <Route
            path="/followup/view-campaign"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="View Campaign" />
                <ViewCampaign />
              </DefaultLayout>
            }
          />

          <Route
            path="/followup/campaign/responses/:id"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Campaign Responses" />
                <ResponsesPage />
              </DefaultLayout>
            }
          />

          <Route
            path="/marketing-management/followup"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Followup Record" />
                <Followup />
              </DefaultLayout>
            }
          />
          <Route
            path="/marketing-management/meeting-scheduled"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Product Marketing" />
                <MarketingProduct />
              </DefaultLayout>
            }
          />
          <Route
            path="/marketing-management/meeting-scheduled"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Meeting Schedule" />
                <User_list />
              </DefaultLayout>
            }
          />
          <Route
            path="/call"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Call" />
                <Call />
              </DefaultLayout>
            }
          />
          <Route
            path="/visit"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Visit" />
                <Visit />
              </DefaultLayout>
            }
          />
          <Route
            path="/followup/campaign/preview/:id"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Preview Campaign" />
                <PreviewPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/master/leadstage"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Lead Stage" />
                <LeadStagePage />
              </DefaultLayout>
            }
          />

          <Route
            path="/report/call"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Report" />
                <CallReport />
              </DefaultLayout>
            }
          />
          <Route
            path="/activeleads"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Report" />
                <ActiveLeads />
              </DefaultLayout>
            }
          />

            <Route
            path="/winleads"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Report" />
                <WinLeads />
              </DefaultLayout>
            }
          />
          <Route
            path="/loseleads"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Report" />
                <LoseLeads />
              </DefaultLayout>
            }
          />
             <Route
            path="/invalidleads"
            element={
              <DefaultLayout userRole={userRole}>
                <PageTitle title="Report" />
                <InvalidLeads/>
              </DefaultLayout>
            }
          />
        </>
      ) : (
        <Route path="/signin" element={<Navigate to="/signin" />} />
      )}
    </Routes>
  );
}

export default App;

// import { useEffect, useState } from 'react';
// import { Route, Routes, useLocation } from 'react-router-dom';

// import Loader from './common/Loader';
// import PageTitle from './components/PageTitle';
// import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';

// import ECommerce from './pages/Dashboard/ECommerce';

// import DefaultLayout from './layout/DefaultLayout';
// import Dashboard from './pages/Dashboard';
// import Create_project from './pages/Project/Create_project';
// import Project_list from './pages/Project/Project_list';
// import Add_client from './pages/client/Add_client';
// import client_list from './pages/client/client_list';
// import Add_user from './pages/User/Add_user';
// import User_list from './pages/User/User_list';
// import Create_task from './pages/Task/Create_task';
// import Task_list from './pages/Task/Task_list';
// import View_task from './pages/Task/View_task';
// import EditProject  from './pages/Project/EditProject '

// interface ProjectFormProps {
//   onClose: () => void; // Example prop
//   // Add other props as needed
// }

// function App() {
//   const [loading, setLoading] = useState<boolean>(true);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   return loading ? (
//     <Loader />
//   ) : (
//     <DefaultLayout>
//       <Routes>
//         <Route
//           index
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <ECommerce />
//             </>
//           }
//         />

//         {/* dashboard
//         <Route
//             path="/dashboard"
//           element={
//             <>
//               <PageTitle title="Dashboard | PDM" />
//               <Dashboard/>
//             </>
//           }
//         /> */}

//         {/* create product  */}
//         <Route
//             path="/product/create-product"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <Create_project/>
//             </>
//           }
//         />

//         {/* project list  */}
//         <Route
//             path="/product/product-list"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <Project_list />
//             </>
//           }
//         />

//         {/* Edit project */}
//         <Route
//             path="/product/edit/:id"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <EditProject  />
//             </>
//           }
//         />

//         {/* add client  */}
//         <Route
//             path="/client/add-client"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <Add_client />
//             </>
//           }
//         />

//         {/* client list  */}
//         <Route
//             path="/client/client-list"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <client_list />
//             </>
//           }
//         />

//         {/* add user  */}
//         <Route
//             path="/user/add-user"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <Add_user />
//             </>
//           }
//         />

//         {/* user list  */}
//         <Route
//             path="/user/user-list"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <User_list />
//             </>
//           }
//         />

//         {/* create Part  */}
//         <Route
//             path="part/create-part"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <Create_task/>
//             </>
//           }
//         />

//         {/* Part list  */}
//         <Route
//             path="part/part-list"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <Task_list />
//             </>
//           }
//         />

//         {/* view task */}
//         {/* <Route
//             path="task/view-list"
//           element={
//             <>
//               <PageTitle title="PDM" />
//               <View_task/>
//             </>
//           }
//         /> */}

//         <Route
//           path="/auth/signin"
//           element={
//             <>
//               <PageTitle title="Signin | PDM" />
//               <SignIn />
//             </>
//           }
//         />
//         <Route
//           path="/auth/signup"
//           element={
//             <>
//               <PageTitle title="Signup | PDM" />
//               <SignUp />
//             </>
//           }
//         />
//       </Routes>
//     </DefaultLayout>
//   );
// }

// export default App;

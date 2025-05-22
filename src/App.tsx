

import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import ProjectForm from './pages/Project/Create_project';
import ShowProject from './pages/Project/Project_list';
// import Add_client from './pages/client/Add_client';
import AddClient from './pages/Client/Add_client';
import Client_list from './pages/Client/Client_list';
import Add_user from './pages/User/Add_user';
import User_list from './pages/User/User_list';
import TaskForm from './pages/Task/Create_task';
import Category from './pages/Master/Category';
import Reference from './pages/Master/Reference';
import Product from './pages/Master/Product';
import Followup from './pages/Marketing/Followup';
import MarketingProduct from './pages/Marketing/MarketingProduct';
// import View_task from './pages/Task/View_task';
import Task_list from './pages/Task/Task_list';
import Pending_task from './pages/Task/Pending_task';
import Inprogress_task from './pages/Task/Inprogress_task';
import Onhold_task from './pages/Task/Onhold_task';
import Completed_task from './pages/Task/Completed_task';
import UnderReview_task from './pages/Task/UnderReview_task';
import MyBucket from './pages/Task/MyBucket';
import { BASE_URL } from '../public/config.js';
import Raw_data from './pages/Rawdata/Raw_data';
import Call from './pages/Call/Call';
import Visit from './pages/Visit/Visit';

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
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(BASE_URL + 'auth/check-session', { withCredentials: true });
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
  }, [navigate]);

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
      <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
      {isAuthenticated ? (
        <>
          <Route
            path="/dashboard"
            element={
              <DefaultLayout>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </DefaultLayout>
            }
          />
          <Route
            path="/project/create-project"
            element={
              <DefaultLayout>
                <PageTitle title="Create Project" />
                <ProjectForm />
              </DefaultLayout>
            }
          />
          
          
          <Route
            path="/project/project-list"
            element={
              <DefaultLayout>
                <PageTitle title="Project List" />
                <ShowProject />
              </DefaultLayout>
            }
          />
          <Route
            path="/master/category"
            element={
              <DefaultLayout>
                <PageTitle title="category" />
                <Category/>
              </DefaultLayout>
            }
          />
          <Route
            path="/master/product"
            element={
              <DefaultLayout>
                <PageTitle title="product" />
                <Product/>
              </DefaultLayout>
            }
          />
          <Route
            path="/master/reference"
            element={
              <DefaultLayout>
                <PageTitle title="reference" />
                <Reference/>
              </DefaultLayout>
            }
          />

          <Route
            path="/user/add-user"
            element={
              <DefaultLayout>
                <PageTitle title="Add user" />
                <Add_user />
              </DefaultLayout>
            }
          />
          <Route
            path="/user/user-list"
            element={
              <DefaultLayout>
                <PageTitle title="User List" />
                <User_list />
              </DefaultLayout>
            }
          />
           <Route
            path="/raw-data"
            element={
              <DefaultLayout>
                <PageTitle title="Raw Data" />
                <Raw_data />
              </DefaultLayout>
            }
          />
          <Route
            path="/client/add-client"
            element={
              <DefaultLayout>
                <PageTitle title="Add Client" />
                <AddClient />
              </DefaultLayout>
            }
          />
          <Route
            path="/client/client-list"
            element={
              <DefaultLayout>
                <PageTitle title="Client List" />
                <Client_list/>
              </DefaultLayout>
            }
          />
          <Route
            path="/marketing-management/followup"
            element={
              <DefaultLayout>
                <PageTitle title="Followup Record" />
                <Followup/>
              </DefaultLayout>
            }
          />
            <Route
            path="/marketing-management/marketing-products"
            element={
              <DefaultLayout>
                <PageTitle title="Product Marketing" />
                <MarketingProduct />
              </DefaultLayout>
            }
          />
           <Route
            path="/marketing-management/meeting-scheduled"
            element={
              <DefaultLayout>
                <PageTitle title="Meeting Schedule" />
                <User_list />
              </DefaultLayout>
            }
          />
           <Route
            path="/call"
            element={
              <DefaultLayout>
                <PageTitle title="Call" />
                <Call/>
              </DefaultLayout>
            }
          />
          <Route
            path="/visit"
            element={
              <DefaultLayout>
                <PageTitle title="Visit" />
                <Visit/>
              </DefaultLayout>
            }
          />         
          <Route
            path="/task/create-task"
            element={
              <DefaultLayout>
                <PageTitle title="Create Parts" />
                <TaskForm />
              </DefaultLayout>
            }
          />
          <Route
            path="/task/task-list"
            element={
              <DefaultLayout>
                <PageTitle title="View Parts" />
                <Task_list />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/pending-task"
            element={
              <DefaultLayout>
                <PageTitle title="Pending Parts" />
                <Pending_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/inProgress-task"
            element={
              <DefaultLayout>
                <PageTitle title="InProgress Parts" />
                <Inprogress_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/onHold-task"
            element={
              <DefaultLayout>
                <PageTitle title="On Hold Parts" />
                <Onhold_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/completed-task"
            element={
              <DefaultLayout>
                <PageTitle title="Completed Parts" />
                <Completed_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/underReview-task"
            element={
              <DefaultLayout>
                <PageTitle title="Under Review Parts" />
                <UnderReview_task />
              </DefaultLayout>
            }
          />

          <Route
            path="myBucket/bucket-list"
            element={
            <DefaultLayout>
              <PageTitle title="My Bucket" />
              <MyBucket />
            </DefaultLayout>
          }
        />

       {/* Part list  */}
         <Route
            path="part/part-list"
          element={
            <>
              <PageTitle title="PDM" />
              <Task_list />
            </>
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












import React, { useState, ReactNode, useEffect  } from 'react';
import Header from '../components/Header/index';
import AdminSidebar from '../components/Sidebar/AdminSidebar';
import PMsidebar from '../components/Sidebar/PMsidebar';
import TLsidebar from '../components/Sidebar/TLsidebar';
import UserSidebar from '../components/Sidebar/UserSidebar';
import axios from 'axios';
import { BASE_URL } from '../../public/config.js';


const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


    // Fetch user role from the backend
    useEffect(() => {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(BASE_URL + 'auth/get-role', { withCredentials: true });
          setUserRole(response.data.role); 
        } catch (error) {
          console.error('Error fetching role:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserRole();
    }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  let SidebarComponent;
  switch (userRole) {
    case 'admin':
      SidebarComponent = AdminSidebar;
      break;
    case 'project manager':
      SidebarComponent = PMsidebar;
      break;
    case 'team lead':
      SidebarComponent = TLsidebar;
      break;
    case 'designer':
      SidebarComponent = UserSidebar;
      break;
    default:
      SidebarComponent = AdminSidebar; 
      break;
  }


  return (

    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar: Dynamically render the sidebar based on the role */}
        {SidebarComponent && <SidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>



    // <div className="dark:bg-boxdark-2 dark:text-bodydark">
    //   {/* <!-- ===== Page Wrapper Start ===== --> */}
    //   <div className="flex h-screen overflow-hidden">
    //     {/* <!-- ===== Sidebar Start ===== --> */}
    //     <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    //     {/* <!-- ===== Sidebar End ===== --> */}

    //     {/* <!-- ===== Content Area Start ===== --> */}
    //     <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
    //       {/* <!-- ===== Header Start ===== --> */}
    //       <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    //       {/* <!-- ===== Header End ===== --> */}

    //       {/* <!-- ===== Main Content Start ===== --> */}
    //       <main>
    //         <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    //           {children}
    //         </div>
    //       </main>
    //       {/* <!-- ===== Main Content End ===== --> */}
    //     </div>
    //     {/* <!-- ===== Content Area End ===== --> */}
       
    //   </div>
    //   {/* <!-- ===== Page Wrapper End ===== --> */}

    // </div>

    
  );
};

export default DefaultLayout;





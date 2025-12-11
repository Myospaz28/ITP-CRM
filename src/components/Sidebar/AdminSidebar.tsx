import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/MMS_logo.png';
import {
  LayoutDashboard,
  Database,
  Users,
  FileText,
  Megaphone,
  CalendarCheck,
  MapPin,
  BarChart3,
  FolderOpen,
  Package,
  Bookmark,
  Map,
  UserPlus,
  List,
  FolderPlus,
  Eye,
  PhoneOutgoing,
  ClipboardList,
  TrendingUp,
  ChevronDown,
  X,
  Layers,
  Trophy,
  Activity,
  Ban,
  XCircle,
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close other dropdowns when one opens, but keep current one open if clicking the same
  const handleDropdownToggle = (menuName: string) => {
    if (openDropdown === menuName) {
      // If clicking the same dropdown, keep it open (or close it if you want toggle behavior)
      setOpenDropdown(null); // Uncomment this if you want toggle behavior
    } else {
      // If clicking a different dropdown, close the previous one and open the new one
      setOpenDropdown(menuName);
    }
  };

  // Close dropdown when route changes to a non-child route
  useEffect(() => {
    // Only close dropdown if we're navigating to a completely different section
    const shouldCloseDropdown =
      !pathname.includes('/master') &&
      !pathname.includes('/user') &&
      !pathname.includes('/followup') &&
      !pathname.includes('/report');

    if (shouldCloseDropdown) {
      setOpenDropdown(null);
    }
  }, [pathname]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gradient-to-b from-gray-900 to-black duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-3 py-6.5 lg:py-1.5">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <img className="h-35 w-70 rounded-xl" src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-1 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-blue-400 uppercase tracking-wider">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-2">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-blue-500/20 hover:border-l-4 hover:border-l-blue-400 hover:pl-3 ${
                      isActive
                        ? 'bg-blue-500/20 border-l-4 border-l-blue-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <LayoutDashboard className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="transition-all duration-300">Dashboard</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Master --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/master' || pathname.includes('master')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-purple-500/20 hover:border-l-4 hover:border-l-purple-400 hover:pl-3 ${
                          (pathname === '/master' ||
                            pathname.includes('master')) &&
                          'bg-purple-500/20 border-l-4 border-l-purple-400 text-white shadow-lg'
                        } text-gray-300`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle('master');
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <Database className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="transition-all duration-300">
                          Master
                        </span>
                        <ChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-300 ${
                            openDropdown === 'master' ? 'rotate-180' : ''
                          }`}
                        />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden transition-all duration-300 ${
                          openDropdown !== 'master' && 'hidden'
                        }`}
                      >
                        <ul className="mt-2 mb-3 flex flex-col gap-1 pl-8">
                          {/* <!-- Menu Item Master Data --> */}
                          <li>
                            <NavLink
                              to="/master-data"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-purple-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <FileText className="w-4 h-4" />
                              Data Import
                            </NavLink>
                          </li>
                          {/* <!-- Menu Item Master Data --> */}

                          <li>
                            <NavLink
                              to="/master/category"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-purple-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                              // Don't close dropdown when clicking submenu items
                            >
                              <FolderOpen className="w-4 h-4" />
                              Category
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/master/product"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-purple-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <Package className="w-4 h-4" />
                              Product
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/master/reference"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-purple-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <Bookmark className="w-4 h-4" />
                              Reference
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/master/leadstage"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-purple-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <Layers className="w-4 h-4" />
                              Lead Stage
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/master/area"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-purple-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <Map className="w-4 h-4" />
                              Center
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/inquiry-form"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-purple-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <Map className="w-4 h-4" />
                              Form
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Master --> */}

              {/* <!-- Menu Item User --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/user' || pathname.includes('user')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-green-500/20 hover:border-l-4 hover:border-l-green-400 hover:pl-3 ${
                          (pathname === '/user' || pathname.includes('user')) &&
                          'bg-green-500/20 border-l-4 border-l-green-400 text-white shadow-lg'
                        } text-gray-300`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle('user');
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="transition-all duration-300">
                          User
                        </span>
                        <ChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-300 ${
                            openDropdown === 'user' ? 'rotate-180' : ''
                          }`}
                        />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden transition-all duration-300 ${
                          openDropdown !== 'user' && 'hidden'
                        }`}
                      >
                        <ul className="mt-2 mb-3 flex flex-col gap-1 pl-8">
                          <li>
                            <NavLink
                              to="/user/add-user"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-green-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-green-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <UserPlus className="w-4 h-4" />
                              Add User
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/user/user-list"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-green-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-green-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <List className="w-4 h-4" />
                              User List
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item User --> */}

              {/* <!-- Menu Item Assigned Call --> */}
              <li>
                <NavLink
                  to="/call"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-teal-500/20 hover:border-l-4 hover:border-l-teal-400 hover:pl-3 ${
                      isActive
                        ? 'bg-teal-500/20 border-l-4 border-l-teal-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <PhoneOutgoing className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="transition-all duration-300">
                    Assigned Call
                  </span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Assigned Call --> */}



{/* <!-- Menu Item: active List --> */}
              <li>
                <NavLink
                  to="/activeleads"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-yellow-500/20 hover:border-l-4 hover:border-l-yellow-400 hover:pl-3 ${
                      isActive
                        ? 'bg-yellow-500/20 border-l-4 border-l-yellow-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <Activity className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="transition-all duration-300">
                    Active Leads
                  </span>
                </NavLink>
              </li>
              {/* <!-- Menu Item: active List --> */}
              {/* <!-- Menu Item: win --> */}
           
              <li>
                <NavLink
                  to="/winleads"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-indigo-500/20 hover:border-l-4 hover:border-l-indigo-400 hover:pl-3 ${
                      isActive
                        ? 'bg-indigo-500/20 border-l-4 border-l-indigo-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <Trophy className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="transition-all duration-300">Win Leads</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item: win --> */}

              {/* <!-- Menu Item: Lose --> */}
              <li>
                <NavLink
                  to="/loseleads"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-indigo-500/20 hover:border-l-4 hover:border-l-indigo-400 hover:pl-3 ${
                      isActive
                        ? 'bg-indigo-500/20 border-l-4 border-l-indigo-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <XCircle className="w-5 h-5 transition-transform group-hover:scale-110 " />
                  <span className="transition-all duration-300">
                    Lose Leads
                  </span>
                </NavLink>
              </li>
              {/* <!-- Menu Item: Lose --> */}

              {/* <!-- Menu Item: Invalid --> */}
              <li>
                <NavLink
                  to="/invalidleads"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-indigo-500/20 hover:border-l-4 hover:border-l-indigo-400 hover:pl-3 ${
                      isActive
                        ? 'bg-indigo-500/20 border-l-4 border-l-indigo-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <Ban className="w-5 h-5 transition-transform group-hover:scale-110 " />
                  <span className="transition-all duration-300">
                    Invalid Leads
                  </span>
                </NavLink>
              </li>

              {/* <!-- Menu Item: Invalid --> */}

              {/* <!-- Menu Item Campaign --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/followup' || pathname.includes('followup')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-pink-500/20 hover:border-l-4 hover:border-l-pink-400 hover:pl-3 ${
                          (pathname === '/campaign' ||
                            pathname.includes('campaign')) &&
                          'bg-pink-500/20 border-l-4 border-l-pink-400 text-white shadow-lg'
                        } text-gray-300`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle('campaign');
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <Megaphone className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="transition-all duration-300">
                          Campaign
                        </span>
                        <ChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-300 ${
                            openDropdown === 'campaign' ? 'rotate-180' : ''
                          }`}
                        />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden transition-all duration-300 ${
                          openDropdown !== 'campaign' && 'hidden'
                        }`}
                      >
                        <ul className="mt-2 mb-3 flex flex-col gap-1 pl-8">
                          <li>
                            <NavLink
                              to="/followup/campaign-page"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-pink-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-pink-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <FolderPlus className="w-4 h-4" />
                              Create Campaign
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/followup/view-campaign"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-pink-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-pink-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <Eye className="w-4 h-4" />
                              View Campaign
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Campaign --> */}

              {/* <!-- Menu Item: Follow-up List --> */}
              {/* <li>
                <NavLink
                  to="/followup/followup-list"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-yellow-500/20 hover:border-l-4 hover:border-l-yellow-400 hover:pl-3 ${
                      isActive
                        ? 'bg-yellow-500/20 border-l-4 border-l-yellow-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <ClipboardList className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="transition-all duration-300">
                    Follow-up List
                  </span>
                </NavLink>
              </li> */}
              {/* <!-- Menu Item: Follow-up List --> */}

              {/* <!-- Menu Item: Meeting Scheduled --> */}
              {/* <li>
                <NavLink
                  to="/followup/meeting-scheduled"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-indigo-500/20 hover:border-l-4 hover:border-l-indigo-400 hover:pl-3 ${
                      isActive
                        ? 'bg-indigo-500/20 border-l-4 border-l-indigo-400 text-white shadow-lg'
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <CalendarCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="transition-all duration-300">
                    Meeting Scheduled
                  </span>
                </NavLink>
              </li> */}
              {/* <!-- Menu Item: Meeting Scheduled --> */}

              {/* <!-- Menu Item Visit --> */}
              {/* <li>
                <NavLink
                  to="/visit"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-red-500/20 hover:border-l-4 hover:border-l-red-400 hover:pl-3 ${
                      isActive 
                        ? 'bg-red-500/20 border-l-4 border-l-red-400 text-white shadow-lg' 
                        : 'text-gray-300'
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="transition-all duration-300">Visit</span>
                </NavLink>
              </li> */}
              {/* <!-- Menu Item Visit --> */}

              {/* <!-- Menu Item Report --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/report' || pathname.includes('report')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out transition-all hover:bg-cyan-500/20 hover:border-l-4 hover:border-l-cyan-400 hover:pl-3 ${
                          (pathname === '/report' ||
                            pathname.includes('report')) &&
                          'bg-cyan-500/20 border-l-4 border-l-cyan-400 text-white shadow-lg'
                        } text-gray-300`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle('report');
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <BarChart3 className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="transition-all duration-300">
                          Report
                        </span>
                        <ChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-300 ${
                            openDropdown === 'report' ? 'rotate-180' : ''
                          }`}
                        />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden transition-all duration-300 ${
                          openDropdown !== 'report' && 'hidden'
                        }`}
                      >
                        <ul className="mt-2 mb-3 flex flex-col gap-1 pl-8">
                          <li>
                            <NavLink
                              to="/report/call"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-cyan-500/10 hover:text-white ${
                                  isActive
                                    ? 'text-white bg-cyan-500/20'
                                    : 'text-gray-400'
                                }`
                              }
                            >
                              <TrendingUp className="w-4 h-4" />
                              Call Report
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Report --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default AdminSidebar;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import { ChevronDown, LogOut, Key, Lock } from 'lucide-react';
import ForgotPasswordModal from './ForgotPasswordModal';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}auth/get-role`, { withCredentials: true })
      .then((res) => setUserRole(res.data.role));
    axios
      .get(`${BASE_URL}auth/get-name`, { withCredentials: true })
      .then((res) => setUserName(res.data.username));
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/signin';
  };

  return (
    <>
      <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
        <Link
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2"
          to="#"
        >
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium">Hi, {userName}</span>
            <span className="block text-xs">{userRole}</span>
          </span>

          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </Link>

        {dropdownOpen && (
          <div className="absolute right-0 mt-4 w-64 rounded-sm z-999 border bg-white shadow">
            <button
              onClick={() => {
                setIsForgotOpen(true);
                setDropdownOpen(false);
              }}
              className="flex w-full items-center gap-3 px-6 py-4 hover:text-primary"
            >
              <Lock className="w-5 h-5" />
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-6 py-4 hover:text-primary"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        )}
      </ClickOutside>

      {/* Popup */}
      {isForgotOpen && (
        <ForgotPasswordModal onClose={() => setIsForgotOpen(false)} />
      )}
    </>
  );
};

export default DropdownUser;

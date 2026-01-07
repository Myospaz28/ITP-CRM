import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { X } from 'lucide-react';
import { BASE_URL } from '../../../public/config';

const ForgotPasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [contactNo, setContactNo] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const sendOtp = async () => {
    try {
      setErrorMsg(''); // clear old error

      await axios.post(
        `${BASE_URL}auth/forget-password/send-otp`,
        { contact_no: contactNo },
        { withCredentials: true },
      );

      setStep(2);
    } catch (error: any) {
      if (error.response) {
        setErrorMsg(error.response.data.message || 'Invalid mobile number');
      } else {
        setErrorMsg('Something went wrong. Try again.');
      }
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post(
        `${BASE_URL}auth/forget-password/reset`,
        {
          contact_no: contactNo,
          otp,
          new_password: password,
        },
        { withCredentials: true },
      );

      alert('Password reset successful');
      onClose();
    } catch (error) {
      console.error('Reset password failed:', error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="mb-6 text-lg font-semibold text-center">
          Change Password
        </h2>

        {step === 1 && (
          <>
            {errorMsg && (
              <div className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <input
              type="text"
              placeholder="Registered Mobile Number"
              className="w-full border px-3 py-2 rounded mb-4 focus:ring-1 focus:ring-primary"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full bg-primary text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border px-3 py-2 rounded mb-3 focus:ring-1 focus:ring-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border px-3 py-2 rounded mb-4 focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              className="w-full bg-primary text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ForgotPasswordModal;

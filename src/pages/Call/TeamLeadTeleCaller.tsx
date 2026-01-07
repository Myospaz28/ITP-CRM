import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../public/config';
import { useNavigate } from 'react-router-dom';

interface TeleCaller {
  tele_caller_id: number;
  tele_caller_name: string;
  total_assigned_leads: number;
  active_count: number;
  inactive_count: number;
  lose_count: number;
  win_count: number;
  invalid_count: number;
}

interface TeamLeadTeleCaller {
  lead_id: number;
  lead_name: string;
  tele_callers: TeleCaller[];
}

const TeamLeadTeleCaller: React.FC = () => {
  const [data, setData] = useState<TeamLeadTeleCaller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeleCallerData = async () => {
      try {
        const sessionRes = await axios.get(`${BASE_URL}auth/get-role`, {
          withCredentials: true,
        });

        if (!sessionRes.data || !sessionRes.data.id) {
          setError('Lead ID not found in session');
          setLoading(false);
          return;
        }

        const leadId = sessionRes.data.id;

        const res = await axios.get(
          `${BASE_URL}api/team-leads/${leadId}/telecallers`,
          { withCredentials: true }
        );

        if (res.data && res.data.length > 0) {
          setData(res.data[0]);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeleCallerData();
  }, []);

  return (
    <div className="p-4">
      <button
        className="mb-4 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
        onClick={() => navigate('/dashboard')}
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-4">
        Team Lead – Assigned Telecallers
      </h2>

      <div className="max-w-full mt-2 overflow-hidden rounded border bg-white shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4">Telecaller Name</th>
              <th className="py-4 px-4">Total Assigned Leads</th>
              <th className="py-4 px-4">Active</th>
              <th className="py-4 px-4">Inactive</th>
              <th className="py-4 px-4">Lose</th>
              <th className="py-4 px-4">Win</th>
              <th className="py-4 px-4">Invalid</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-5">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-red-600">{error}</td>
              </tr>
            ) : data && data.tele_callers.length > 0 ? (
              data.tele_callers.map((tc) => (
                <tr key={tc.tele_caller_id}>
                  <td className="border-b py-3 px-4 font-medium">{tc.tele_caller_name}</td>
                  <td className="border-b py-3 px-4">{tc.total_assigned_leads}</td>
                  <td className="border-b py-3 px-4">{tc.active_count}</td>
                  <td className="border-b py-3 px-4">{tc.inactive_count}</td>
                  <td className="border-b py-3 px-4">{tc.lose_count}</td>
                  <td className="border-b py-3 px-4">{tc.win_count}</td>
                  <td className="border-b py-3 px-4">{tc.invalid_count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-5">No telecallers assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamLeadTeleCaller;

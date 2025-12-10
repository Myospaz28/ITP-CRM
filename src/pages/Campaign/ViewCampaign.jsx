import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCopy, faMessage } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../../public/config.js";

const ViewCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}api/campaign/all`);
        setCampaigns(response.data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handlePreview = (campaign) => {
    navigate(`/followup/campaign/preview/${campaign.id}`, { state: campaign });
  };

const handleResponses = (campaign) => {
  navigate(`/followup/campaign/responses/${campaign.id}`, { state: campaign });
};


  const handleCopyLink = (campaign) => {
  if (!campaign?.id) {
    alert("⚠️ Invalid campaign. Please try again.");
    return;
  }

  // Create a public form link
  const link = `${window.location.origin}/followup/campaign/student/${campaign.id}`;

  // Copy link to clipboard
  navigator.clipboard.writeText(link)
    .then(() => {
      alert(`✅ Link copied!\nYou can share this form:\n${link}`);
    })
    .catch((err) => {
      console.error("❌ Copy failed:", err);
      alert("Failed to copy link. Please try again.");
    });
};



  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        ⏳ Loading campaigns...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-lg">{error}</div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        View Campaigns
      </h2>

      {campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-200 p-2">#</th>
              <th className="border border-gray-200 p-2">Campaign Name</th>
              <th className="border border-gray-200 p-2">Platform</th>
              <th className="border border-gray-200 p-2">Start Date</th>
              <th className="border border-gray-200 p-2">End Date</th>
              <th className="border border-gray-200 p-2">Description</th>
              <th className="border border-gray-200 p-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-2">
                  {item.campaign_name}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {item.platform}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {new Date(item.start_date).toLocaleDateString()}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {new Date(item.end_date).toLocaleDateString()}
                </td>
                <td className="border border-gray-200 p-2">
                  {item.description}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handlePreview(item)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Preview"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>

                    <button
                      onClick={() => handleResponses(item)}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      title="Responses"
                    >
                      <FontAwesomeIcon icon={faMessage} />
                    </button>

                  <button
  onClick={() => handleCopyLink(item)}
  className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
  title="Copy & Preview"
>
  <FontAwesomeIcon icon={faCopy} />
</button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCampaign;

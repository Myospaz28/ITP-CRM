import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  ClipboardList,
  CalendarCheck,
  Layers,
  Package,
  Megaphone,
  Hourglass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardDataStats from '../../components/CardDataStats';
import { BASE_URL } from '../../../public/config.js';
import { useNavigate } from 'react-router-dom';

const ECommerce: React.FC = () => {
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [assignedLeads, setAssignedLeads] = useState<number | null>(null);
  const [totalfollowups, setfollowups] = useState<number | null>(null);
  const [meetingScheduled, setMeetingScheduled] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [totalcategory, settotalcategory] = useState<number | null>(null);
  const [convertedLeads, setConvertedLeads] = useState<number | null>(null);
  const [pendingLeads, setpendingLeads] = useState<number | null>(null);
  const [totalCampaigns, setTotalCampaigns] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}api/master-data`);
        const rawData = await response.json();
        setTotalLeads(rawData.length || 0);

        const assignedRes = await fetch(
          `${BASE_URL}api/dashboard/master-data/assigned-count`,
          {
            credentials: 'include',
          },
        );
        const assignedData = await assignedRes.json();
        setAssignedLeads(assignedData.assigned_count || 0);

        const followupsRes = await fetch(
          `${BASE_URL}api/dashboard/master-data/fllowups`,
        );
        const partsData = await followupsRes.json();
        setfollowups(partsData.followup_count || 0);

        const meetingRes = await fetch(
          `${BASE_URL}api/dashboard/master-data/meeting-scheduled`,
        );
        const meetingData = await meetingRes.json();
        setMeetingScheduled(meetingData.meeting_count || 0);

        const categoryRes = await fetch(
          `${BASE_URL}api/dashboard/master-data/category`,
        );
        const categoryData = await categoryRes.json();
        settotalcategory(categoryData.category_count || 0);

        const productRes = await fetch(
          `${BASE_URL}api/dashboard/master-data/product`,
        );
        const productData = await productRes.json();
        setTotalProducts(productData.product_count || 0);

        const convertedRes = await fetch(
          `${BASE_URL}api/dashboard/master-data/converted-leads`,
        );
        const convertedData = await convertedRes.json();
        setConvertedLeads(convertedData.converted_count || 0);

        const pendingRes = await fetch(`${BASE_URL}api/pending-leads`);
        const pendingData = await pendingRes.json();
        setpendingLeads(pendingData.pending_count || 0);

        // Campaigns Count
        const campaignRes = await fetch(
          `${BASE_URL}api/dashboard/master-data/campaign-count`,
        );
        const campaignData = await campaignRes.json();
        setTotalCampaigns(campaignData.campaign_count || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ⭐ Navigation Handlers
  const handleGoToTotalLeads = () => navigate('/master-data');
  const handleGoToAssignedLeads = () => navigate('/call');
  const handleGoToFollowups = () => navigate('/followup/followup-list');
  const handleGoToMeetingScheduled = () =>
    navigate('/followup/meeting-scheduled');
  const handleGoToCategory = () => navigate('/master/category');
  const handleGoToProducts = () => navigate('/master/product');
  const handleGoToConvertedLeads = () => navigate('/followup/view-campaign');
  const handleGoToPendingLeads = () => navigate('/pending-leads');

  // Card data configuration
  const cardData = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'text-blue-500',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-200/50',
      animation: { rotate: [0, -5, 0], scale: [1, 1.05, 1] },
      onClick: handleGoToTotalLeads,
    },
    {
      title: 'Assigned Leads',
      value: assignedLeads,
      icon: UserCheck,
      color: 'text-green-500',
      bgGradient: 'from-green-500/10 to-green-600/5',
      borderColor: 'border-green-200/50',
      animation: { y: [0, -2, 0], scale: [1, 1.02, 1] },
      onClick: handleGoToAssignedLeads,
    },
    {
      title: 'Followups',
      value: totalfollowups,
      icon: ClipboardList,
      color: 'text-yellow-500',
      bgGradient: 'from-yellow-500/10 to-yellow-600/5',
      borderColor: 'border-yellow-200/50',
      animation: { x: [0, 2, 0], scale: [1, 1.03, 1] },
      onClick: handleGoToFollowups,
    },
    {
      title: 'Meeting Scheduled',
      value: meetingScheduled,
      icon: CalendarCheck,
      color: 'text-purple-500',
      bgGradient: 'from-purple-500/10 to-purple-600/5',
      borderColor: 'border-purple-200/50',
      animation: { rotate: [0, 5, 0], scale: [1, 1.04, 1] },
      onClick: handleGoToMeetingScheduled,
    },
    {
      title: 'Category',
      value: totalcategory,
      icon: Layers,
      color: 'text-indigo-500',
      bgGradient: 'from-indigo-500/10 to-indigo-600/5',
      borderColor: 'border-indigo-200/50',
      animation: { y: [0, 3, 0], scale: [1, 1.02, 1] },
      onClick: handleGoToCategory,
    },
    {
      title: 'Products',
      value: totalProducts,
      icon: Package,
      color: 'text-amber-500',
      bgGradient: 'from-amber-500/10 to-amber-600/5',
      borderColor: 'border-amber-200/50',
      animation: { rotate: [0, -3, 0], scale: [1, 1.03, 1] },
      onClick: handleGoToProducts,
    },
    {
      title: 'All Campaigns',
      value: totalCampaigns,
      icon: Megaphone,
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
      borderColor: 'border-emerald-200/50',
      animation: { y: [0, -3, 0], scale: [1, 1.05, 1] },
      onClick: handleGoToConvertedLeads,
    },
    {
      title: 'Pending Leads',
      value: pendingLeads,
      icon: Hourglass,
      color: 'text-red-500',
      bgGradient: 'from-red-500/10 to-red-600/5',
      borderColor: 'border-red-200/50',
      animation: { rotate: [0, 180, 0], scale: [1, 1.02, 1] },
      onClick: handleGoToPendingLeads,
    },
  ];

  const handleGoToInProcessStudents = () => {
    navigate('/students/in-process');
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:gap-8">
        {cardData.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-xl dark:bg-slate-900/60 border border-white/20 shadow-lg rounded-2xl p-6"
          >
            <div className="animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              </div>
              <div className="h-8 bg-gray-400 rounded w-16"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:gap-8">
        <AnimatePresence>
          {cardData.map((card, index) => (
            <motion.div
              key={card.title}
              onClick={card.onClick}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                y: -4,
                transition: { type: 'spring', stiffness: 400, damping: 17 },
              }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className={`
              relative p-6 bg-gradient-to-br ${card.bgGradient} 
              rounded-2xl shadow-lg border-l-4 ${card.borderColor}
              hover:shadow-2xl hover:scale-105 hover:-translate-y-1
              transform transition-all duration-300 ease-out
              cursor-pointer overflow-hidden
             
            `}
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 bg-white dark:bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide">
                    {card.title}
                  </h3>
                  <motion.div
                    animate={card.animation}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                    className={`p-2 rounded-xl bg-white/50 dark:bg-black/20 shadow-sm ${card.color}`}
                  >
                    <card.icon className="w-5 h-5" />
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={card.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {card.value?.toLocaleString() || (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-gray-400"
                      >
                        ⏳
                      </motion.span>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Progress bar indicator */}
                <motion.div
                  className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                >
                  <motion.div
                    className={`h-full ${card.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        ((card.value || 0) / 100) * 100,
                        100,
                      )}%`,
                    }}
                    transition={{
                      delay: index * 0.1 + 1,
                      duration: 1,
                      type: 'spring',
                    }}
                  />
                </motion.div>
              </div>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.color.replace(
                  'text-',
                  'bg-',
                )} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CHART SECTION (Optional Placeholder for future charts) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-10 grid grid-cols-12 gap-6"
      >
        <div className="col-span-12 xl:col-span-8"></div>
      </motion.div>
    </>
  );
};

export default ECommerce;

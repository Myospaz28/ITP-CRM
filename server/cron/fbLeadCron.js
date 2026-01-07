import cron from 'node-cron';
import { fetchFormsAndLeadsForPage } from '../services/metaLeadService.js';
import dotenv from 'dotenv';
dotenv.config();

const PAGE_ID = process.env.FB_PAGE_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

// Run every 1 minute
cron.schedule('* * * * *', async () => {
  console.log('⏳ FB Lead Auto Sync (every 1 minute)');

  if (!PAGE_ID || !ACCESS_TOKEN) {
    console.error('❌ FB_PAGE_ID or FB_ACCESS_TOKEN missing in .env');
    return;
  }

  try {
    // Sidha env values se fetch karo
    await fetchFormsAndLeadsForPage(PAGE_ID, ACCESS_TOKEN);

    console.log('✅ FB Leads auto synced');
  } catch (err) {
    console.error('❌ FB Cron Error:', err.message);
  }
});

// // import db from '../database/db.js';
// // import dashboardModel from './../models/dashboardModel.js';
// import { totalClients, totalParts, totalProducts, completedParts, PartsInProgress ,PartsOnHold , PartsUnderReview , PendingParts } from './../models/dashboardModel.js';
// // const { totalClients, totalParts, totalProducts, completedParts, PartsInProgress ,PartsOnHold , PartsUnderReview , PendingParts } = dashboardModel;

// export const getClients = async (req, res) => {
//     try {
//         const clients = await totalClients();
//         res.status(200).json(clients);
//     } catch (error) {
//         console.error('Error retrieving count of clients:', error);
//         res.status(500).json({ error: 'Failed to retrieve count of clients' });
//     }
// };

// // Add similar implementations for getParts and getProducts if needed


// //fetching count of Products
// export const getProducts = async (req, res) => {
//     try {
//       const products = await totalProducts();
//       res.status(200).json(products);
//     } catch (error) {
//       console.error('Error retrieving count of products:', error);
//       res.status(500).json({ error: 'Failed to retrieve count of products' });
//     }
// };

// //fetching count of Parts
// export const getParts = async (req, res) => {
//     try {
//       const parts = await totalParts();
//       res.status(200).json(parts);
//     } catch (error) {
//       console.error('Error retrieving count of parts:', error);
//       res.status(500).json({ error: 'Failed to retrieve count of parts' });
//     }
// };

// //fetching count of completed parts
// export const getCompletedParts = async (req, res) => {
//     try {
//       const completdedParts = await completedParts();
//       res.status(200).json(completdedParts);
//     } catch (error) {
//       console.error('Error retrieving count of completed parts:', error);
//       res.status(500).json({ error: 'Failed to retrieve count of completed parts' });
//     }
// };

// //fetching count of in progress parts
// export const getPartsInProgress = async (req, res) => {
//     try {
//       const partsInProgress = await PartsInProgress();
//       res.status(200).json(partsInProgress);
//     } catch (error) {
//       console.error('Error retrieving count of parts in progress:', error);
//       res.status(500).json({ error: 'Failed to retrieve count of parts in progress' });
//     }
// };

// //fetching count of on hold parts
// export const getPartsOnHold = async (req, res) => {
//     try {
//       const partsOnHold = await PartsOnHold();
//       res.status(200).json(partsOnHold);
//     } catch (error) {
//       console.error('Error retrieving count of parts on hold:', error);
//       res.status(500).json({ error: 'Failed to retrieve count of parts on hold' });
//     }
// };

// //fetching count of under review parts
// export const getPartsUnderReview = async (req, res) => {
//     try {
//       const partsUnderReview = await PartsUnderReview();
//       res.status(200).json(partsUnderReview);
//     } catch (error) {
//       console.error('Error retrieving count of parts under review:', error);
//       res.status(500).json({ error: 'Failed to retrieve count of parts under review' });
//     }
// };

// //fetching count of pending parts
// export const getPendingParts = async (req, res) => {
//     try {
//       const Pendingparts = await PendingParts();
//       res.status(200).json(Pendingparts);
//     } catch (error) {
//       console.error('Error retrieving count of pending parts:', error);
//       res.status(500).json({ error: 'Failed to retrieve count of pending parts' });
//     }
// };

  
import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import TableOne from '../../components/Tables/TableOne';
import { BASE_URL } from '../../../public/config.js'


const ECommerce: React.FC = () => {
  const [totalClients, setTotalClients] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [totalParts, setTotalParts] = useState<number | null>(null);
  const [compltedparts, setcompltedparts] = useState<number | null>(null);
  const [partsOnHold, setpartsOnHold] = useState<number | null>(null);
  const [partsInProgress, setpartsInProgress] = useState<number | null>(null);
  const [PartsUnderReview, setPartsUnderReview] = useState<number | null>(null);
  const [pendingParts, setpendingParts] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalClients = async () => {
      try {
//------------------------------------------------------------------------------------//
        //tota clients 1
        const response = await fetch(`${BASE_URL}api/total-clients`);
        if (!response.ok) {
          throw new Error('Failed to fetch total clients');
        }
        const clientdata = await response.json();
        const totalEntries = clientdata?.[0]?.[0]?.total_entries || 0;
        setTotalClients(totalEntries);
//------------------------------------------------------------------------------------//
        // total products 2
        const productsResponse = await fetch(`${BASE_URL}api/total-products`);
        if (!response.ok) {
          throw new Error('Failed to fetch total products');
        }
        const productsData = await productsResponse.json();
        console.log('Products Data:', productsData);
        setTotalProducts(productsData[0]?.[0]?.total_entries || 0);
//------------------------------------------------------------------------------------//
        //total Parts  3
        const partsResponse = await fetch(`${BASE_URL}api/total-parts`);
        if (!response.ok) {
          throw new Error('Failed to fetch total parts');
        }
        const partsData = await partsResponse.json();
        console.log('Parts Data:', partsData);
        setTotalParts(partsData[0]?.[0]?.total_entries || 0);
//------------------------------------------------------------------------------------//
        //total Parts 4
        const completedPartsResponse = await fetch(`${BASE_URL}api/completed-parts`);
        if (!response.ok) {
          throw new Error('Failed to fetch total parts');
        }
        const completedPartsData = await completedPartsResponse.json();
        console.log('Parts Data:', completedPartsData);
        setcompltedparts(completedPartsData[0]?.[0]?.total_entries || 0);
//------------------------------------------------------------------------------------//
        //total Parts 5
        const partsOnHoldResponse = await fetch(`${BASE_URL}api/parts-on-hold`);
        if (!response.ok) {
          throw new Error('Failed to fetch total parts');
        }
        const partsOnHoldData = await partsOnHoldResponse.json();
        console.log('Parts Data:', partsOnHoldData);
        setpartsOnHold(partsOnHoldData[0]?.[0]?.total_entries || 0);
//------------------------------------------------------------------------------------//
        //total Parts 6
        const partsInProgressResponse = await fetch(`${BASE_URL}api/parts-in-progress`);
        if (!response.ok) {
          throw new Error('Failed to fetch total parts');
        }
        const partsInProgressData = await partsInProgressResponse.json();
        console.log('Parts Data:', partsInProgressData);
        setpartsInProgress(partsInProgressData[0]?.[0]?.total_entries || 0);
//------------------------------------------------------------------------------------//
        //total Parts 7
        const partsUnderReviewResponse = await fetch(`${BASE_URL}api/parts-under-review`);
        if (!response.ok) {
          throw new Error('Failed to fetch total parts');
        }
        const partsUnderReviewData = await partsUnderReviewResponse.json();
        console.log('Parts Data:', partsUnderReviewData);
        setPartsUnderReview(partsUnderReviewData[0]?.[0]?.total_entries || 0);
//------------------------------------------------------------------------------------//
        //total Parts 8
        const pendingpartsResponse = await fetch(`${BASE_URL}api/pending-parts`);
        if (!response.ok) {
          throw new Error('Failed to fetch total parts');
        }
        const pendingpartsData = await pendingpartsResponse.json();
        console.log('Parts Data:', pendingpartsData);
        setpendingParts(pendingpartsData[0]?.[0]?.total_entries || 0);
//------------------------------------------------------------------------------------//

      } catch (error) {
        console.error('Error fetching total clients:', error);
        setTotalClients(0); // Set a fallback value in case of error
      }
    };

    fetchTotalClients();
  }, []);

    return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Clients" total={totalClients !== null ? totalClients.toString() : 'Loading...'}
        >
          {/* SVG Icon */}
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 8C12.6569 8 14 6.65685 14 5C14 3.34315 12.6569 2 11 2C9.34315 2 8 3.34315 8 5C8 6.65685 9.34315 8 11 8Z" />
            <path d="M5 6C6.10457 6 7 5.10457 7 4C7 2.89543 6.10457 2 5 2C3.89543 2 3 2.89543 3 4C3 5.10457 3.89543 6 5 6Z" />
            <path d="M17 6C18.1046 6 19 5.10457 19 4C19 2.89543 18.1046 2 17 2C15.8954 2 15 2.89543 15 4C15 5.10457 15.8954 6 17 6Z" />
            <path d="M0 14C0 12.3431 1.34315 11 3 11H7C8.65685 11 10 12.3431 10 14V15H0V14Z" />
            <path d="M12 15V14C12 12.3431 13.3431 11 15 11H19C20.6569 11 22 12.3431 22 14V15H12Z" />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Products" total={totalProducts !== null ? totalProducts.toString() : 'Loading...'}> {/* rate="0.43%" levelUp */} 
          <svg
            className="fill-primary dark:fill-white"
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
              fill=""
            />
            <path
              d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
              fill=""
            />
            <path
              d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Parts" total={totalParts !== null ? totalParts.toString() : 'Loading...'}> {/* rate="0.43%" levelUp */}   
            <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 2H4C2.9 2 2 2.9 2 4V18C2 19.1 2.9 20 4 20H18C19.1 20 20 19.1 20 18V4C20 2.9 19.1 2 18 2ZM18 18H4V4H18V18ZM6 6H8V8H6V6ZM10 6H12V8H10V6ZM6 10H8V12H6V10ZM10 10H12V12H10V10ZM6 14H8V16H6V14ZM10 14H12V16H10V14Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Completed Parts" total={compltedparts !== null ? compltedparts.toString() : 'Loading...'}> {/* rate="0.43%" levelUp */} 
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 2H4C2.9 2 2 2.9 2 4V18C2 19.1 2.9 20 4 20H18C19.1 20 20 19.1 20 18V4C20 2.9 19.1 2 18 2ZM18 18H4V4H18V18ZM9 13.5L6.5 11L7.91 9.59L9 10.67L14.09 5.59L15.5 7L9 13.5Z"
              fill=""
            />
          </svg>

        </CardDataStats>
        <CardDataStats title="Parts in Progress" total={partsInProgress !== null ? partsInProgress.toString() : 'Loading...'} > {/* rate="0.43%" levelUp */} 
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 2C6.03 2 2 6.03 2 11C2 15.97 6.03 20 11 20C15.97 20 20 15.97 20 11C20 6.03 15.97 2 11 2ZM11 18C7.69 18 5 15.31 5 11C5 6.69 7.69 4 11 4C14.31 4 17 6.69 17 11C17 15.31 14.31 18 11 18ZM14.5 7L13 8.5L14.5 10L12 11.5L10.5 10L12 8.5L10.5 7L9 8.5L10.5 10L9 11.5L10.5 13L12 11.5L14.5 13L12 14.5L10.5 13L12 11.5L14.5 10L12 8.5L13 7L14.5 7Z"
              fill=""
            />
          </svg>


        </CardDataStats>
        <CardDataStats title="Parts Under Review" total={PartsUnderReview !== null ? PartsUnderReview.toString() : 'Loading...'}> {/* rate="0.43%" levelUp */} 
          <svg
            className="fill-primary dark:fill-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M16 2H8C6.9 2 6 2.9 6 4V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V4C18 2.9 17.1 2 16 2ZM8 4H16V20H8V4ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14ZM12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11Z"
              />
              <path
                d="M17.5 17.5L16 16C16 15.45 15.55 15 15 15C14.45 15 14 15.45 14 16L14.5 16.5C14.5 16.5 13.5 17.5 13 18L15 20L16.5 17.5C17 17 17.5 17 17.5 17.5Z"
              />
            </g>
          </svg>

        </CardDataStats>
        <CardDataStats title="Parts On Hold" total={partsOnHold !== null ? partsOnHold.toString() : 'Loading...'}> {/* rate="0.43%" levelUp */} 
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 2H5C4.45 2 4 2.45 4 3V19C4 19.55 4.45 20 5 20H7C7.55 20 8 19.55 8 19V3C8 2.45 7.55 2 7 2ZM17 2H15C14.45 2 14 2.45 14 3V19C14 19.55 14.45 20 15 20H17C17.55 20 18 19.55 18 19V3C18 2.45 17.55 2 17 2Z"
              fill=""
            />
          </svg>

        </CardDataStats>
        <CardDataStats title="Pending Parts" total={pendingParts !== null ? pendingParts.toString() : 'Loading...'} > {/* rate="0.43%" levelUp */} 
          <svg
            className="fill-primary dark:fill-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.03 20 4 15.97 4 12C4 8.03 7.03 4 12 4C16.97 4 20 8.03 20 12C20 15.97 16.97 20 12 20Z"
              />
              <path
                d="M13 7H11V13L15.25 15.25L16.25 14.25L13 11V7Z"
              />
            </g>
          </svg>

        </CardDataStats> 
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        {/* <ChartThree />
        <MapOne /> */}
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        {/* <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;

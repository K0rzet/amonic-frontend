// src/components/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.scss';
import { instance } from '@/api/axios';

interface DashboardData {
  confirmedCancelledFlights: {
    confirmedFlights: number;
    cancelledFlights: number;
  };
  busyFreeDay: {
    busiestDay: [string, number];
    quietestDay: [string, number];
  };
  topPassengers: Array<{ name: string; ticketCount: number }>;
  ticketSalesRevenue: {
    yesterday: number;
    twoDaysAgo: number;
    threeDaysAgo: number;
  };
  averageFlightTime: number;
  weeklyOccupancyRates: {
    thisWeek: number;
    lastWeek: number;
    twoWeeksAgo: number;
  };
  topOffices: Array<{ id: number; title: string; ticketCount: number }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get<DashboardData>('/dashboard/statistics');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  const formatPercentage = (value: number) => (100 - value).toFixed(2);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>AMONIC Airlines Short Summary</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <h2>In the last 30 days...</h2>
          <div className={styles.flightInfo}>
            <p>Number confirmed: {data.confirmedCancelledFlights.confirmedFlights}</p>
            <p>Number cancelled: {data.confirmedCancelledFlights.cancelledFlights}</p>
            <p>Average daily flight time: {Math.round(data.averageFlightTime)} minutes</p>
          </div>
        </div>
        <div className={styles.section}>
          <h2>Top Customers (Number of purchases)</h2>
          <ul>
            {data.topPassengers.map((passenger, index) => (
              <li key={index}>{`${index + 1}. ${passenger.name} (${passenger.ticketCount} Tickets)`}</li>
            ))}
          </ul>
        </div>
        <div className={styles.section}>
          <h2>Number of passengers flying</h2>
          <p>Busiest day: {new Date(data.busyFreeDay.busiestDay[0]).toLocaleDateString()} with {data.busyFreeDay.busiestDay[1]} flying</p>
          <p>Most quiet day: {new Date(data.busyFreeDay.quietestDay[0]).toLocaleDateString()} with {data.busyFreeDay.quietestDay[1]} flying</p>
        </div>
        <div className={styles.section}>
          <h2>Revenue from ticket sales</h2>
          <p>Yesterday: ${data.ticketSalesRevenue.yesterday.toFixed(2)}</p>
          <p>Two days ago: ${data.ticketSalesRevenue.twoDaysAgo.toFixed(2)}</p>
          <p>Three days ago: ${data.ticketSalesRevenue.threeDaysAgo.toFixed(2)}</p>
        </div>
        <div className={styles.section}>
          <h2>Weekly report of percentage of empty seats</h2>
          <div className={styles.weeklyReport}>
            <p>This week: {formatPercentage(data.weeklyOccupancyRates.thisWeek)}%</p>
            <p>Last week: {formatPercentage(data.weeklyOccupancyRates.lastWeek)}%</p>
            <p>Two weeks ago: {formatPercentage(data.weeklyOccupancyRates.twoWeeksAgo)}%</p>
          </div>
        </div>
        <div className={styles.section}>
          <h2>Top Offices (Number of tickets sold)</h2>
          <ul>
            {data.topOffices.map((office, index) => (
              <li key={office.id}>{`${index + 1}. ${office.title} (${office.ticketCount} Tickets)`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
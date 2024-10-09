import { useState } from 'react';
import axios from 'axios';
import { instance } from '@/api/axios';
import styles from './AmenitiesReport.module.scss';
const AmenitiesReport = () => {
  const [filterType, setFilterType] = useState('date');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let params = {};
      if (filterType === 'date') {
        params = { startDate, endDate };
      } else {
        params = { flightNumber, flightDate };
      }

      const response = await instance.get('/reports/amenities', { params });
      setReport(response.data);
    } catch (err) {
      setError('Failed to fetch report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Amenities Report</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="date"
              checked={filterType === 'date'}
              onChange={() => setFilterType('date')}
            />
            Filter by Date Range
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="flight"
              checked={filterType === 'flight'}
              onChange={() => setFilterType('flight')}
            />
            Filter by Flight
          </label>
        </div>

        {filterType === 'date' ? (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="flightNumber">Flight Number:</label>
              <input
                type="text"
                id="flightNumber"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="flightDate">Flight Date:</label>
              <input
                type="date"
                id="flightDate"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {report && (
        <div>
          <h2>Report Results</h2>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.service}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AmenitiesReport;
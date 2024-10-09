import React, { useEffect, useState } from "react";
import { instance } from "@/api/axios";
import styles from './Survey.module.scss';

interface QuestionRatings {
  [key: string]: number;
}

interface CategoryData {
  q1: QuestionRatings;
  q2: QuestionRatings;
  q3: QuestionRatings;
  q4: QuestionRatings;
}

interface TopOffice {
  id: number;
  title: string;
  ticketCount: number;
}

interface SurveyData {
  gender: {
    M: CategoryData;
    F: CategoryData;
  };
  cabinType: {
    Business: CategoryData;
    First: CategoryData;
    Economy: CategoryData;
  };
  departure: {
    [key: string]: CategoryData;
  };
  arrival: {
    [key: string]: CategoryData;
  };
  ageGroup: {
    [key: string]: CategoryData;
  };
  total: CategoryData;
  topOffices: TopOffice[];
}

const SurveyProgressBar: React.FC<{ data: number[] }> = ({ data }) => {
  const colors = [
    '#006400', '#00FF00', '#90EE90', 'yellow', 'orange', 'red', '#d0d0d0'
  ];

  const total = data.reduce((sum, value) => sum + value, 0);

  return (
    <div className={styles.progressBar}>
      {data.map((value, index) => (
        <div
          key={index}
          className={styles.progressSegment}
          style={{
            width: `${(value / total) * 100}%`,
            backgroundColor: colors[index],
          }}
        />
      ))}
    </div>
  );
};

const Survey: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [filters, setFilters] = useState({
    ageGroups: [] as string[],
    gender: '',
    month: '',
    year: '',
  });
  const [isDetailedView, setIsDetailedView] = useState(true);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const params = new URLSearchParams();
        filters.ageGroups.forEach(age => params.append('ageGroups', age));
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.month) params.append('month', filters.month);
        if (filters.year) params.append('year', filters.year);

        const response = await instance.get<SurveyData>("/survey/detailed-stats", { params });
        
        // Ensure all necessary properties exist in the response
        const safeData = {
          ...response.data,
          gender: {
            M: response.data.gender?.M || { total: 0 },
            F: response.data.gender?.F || { total: 0 },
          },
          ageGroup: {
            '18-24': response.data.ageGroup?.['18-24'] || { total: 0 },
            '25-39': response.data.ageGroup?.['25-39'] || { total: 0 },
            '40-59': response.data.ageGroup?.['40-59'] || { total: 0 },
            '60+': response.data.ageGroup?.['60+'] || { total: 0 },
          },
          cabinType: {
            Economy: response.data.cabinType?.Economy || { total: 0 },
            Business: response.data.cabinType?.Business || { total: 0 },
            First: response.data.cabinType?.First || { total: 0 },
          },
          arrival: {
            AUH: response.data.arrival?.AUH || { total: 0 },
            BAH: response.data.arrival?.BAH || { total: 0 },
            DOH: response.data.arrival?.DOH || { total: 0 },
            RUH: response.data.arrival?.RUH || { total: 0 },
            CAI: response.data.arrival?.CAI || { total: 0 },
          },
          total: response.data.total || { grandTotal: 0 },
        };

        setSurveyData(safeData);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveyData();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'ageGroups') {
      const newAgeGroups = filters.ageGroups.includes(value)
        ? filters.ageGroups.filter(age => age !== value)
        : [...filters.ageGroups, value];
      setFilters(prev => ({ ...prev, ageGroups: newAgeGroups }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const questions = [
    "Please rate our aircraft flown on AMONIC Airlines",
    "How would you rate our flight attendants",
    "How would you rate our inflight entertainment",
    "Please rate the ticket price for the trip you are taking",
  ];

  const ratings = [
    "Outstanding", "Very Good", "Good", "Adequate", "Needs Improvement", "Poor", "Don't know"
  ];

  const headers = [
    "Question", "Total", "Male", "Female", "18-24", "25-39", "40-59", "60+",
    "Economy", "Business", "First", "AUH", "BAH", "DOH", "RUH", "CAI"
  ];

  const toggleView = () => {
    setIsDetailedView(!isDetailedView);
  };

  const renderSummaryTable = () => {
    if (!surveyData) return null;

    const getTotal = (data: any) => data?.total || 0;

    return (
      <div className={styles.summaryContainer}>
        <div className={styles.sampleSize}>Available dates: 06.2024-{new Date().getMonth() + 1}.{new Date().getFullYear()}</div>
        <h2 className={styles.summaryTitle}>Fieldwork {filters.month}/{filters.year}</h2>
        <div className={styles.sampleSize}>Sample Size: {surveyData.total.grandTotal} Adults</div>
        <table className={styles.summaryTable}>
          <tbody>
            <tr>
              <th colSpan={2}>Gender</th>
              <th colSpan={4}>Age</th>
              <th colSpan={3}>Cabin Type</th>
              <th colSpan={5}>Destination Airport</th>
            </tr>
            <tr className={styles.evenRow}>
              <th>Male</th>
              <th>Female</th>
              <th>18-24</th>
              <th>25-39</th>
              <th>40-59</th>
              <th>60+</th>
              <th>Economy</th>
              <th>Business</th>
              <th>First</th>
              <th>AUH</th>
              <th>BAH</th>
              <th>DOH</th>
              <th>RUH</th>
              <th>CAI</th>
            </tr>
            <tr>
              <td>{getTotal(surveyData.gender.M)}</td>
              <td>{getTotal(surveyData.gender.F)}</td>
              <td>{getTotal(surveyData.ageGroup['18-24'])}</td>
              <td>{getTotal(surveyData.ageGroup['25-39'])}</td>
              <td>{getTotal(surveyData.ageGroup['40-59'])}</td>
              <td>{getTotal(surveyData.ageGroup['60+'])}</td>
              <td>{getTotal(surveyData.cabinType.Economy)}</td>
              <td>{getTotal(surveyData.cabinType.Business)}</td>
              <td>{getTotal(surveyData.cabinType.First)}</td>
              <td>{getTotal(surveyData.arrival.AUH)}</td>
              <td>{getTotal(surveyData.arrival.BAH)}</td>
              <td>{getTotal(surveyData.arrival.DOH)}</td>
              <td>{getTotal(surveyData.arrival.RUH)}</td>
              <td>{getTotal(surveyData.arrival.CAI)}</td>
            </tr>
          </tbody>
        </table>
        
      </div>
    );
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.surveyContainer}>
      <h1>Flight Satisfaction Survey Reports</h1>
      <form className={styles.filters} onSubmit={(e) => { e.preventDefault(); /* Apply filters logic */ }}>
        <div className={styles.inputGroup}>
          <label>Month:</label>
          <input
            type="number"
            name="month"
            min="1"
            max="12"
            value={filters.month}
            onChange={handleFilterChange}
            placeholder="Month"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Year:</label>
          <input
            type="number"
            name="year"
            min="2000"
            max="2099"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="Year"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Gender:</label>
          <select name="gender" value={filters.gender} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Age Groups:</label>
          <div className={styles.checkboxGroup}>
            {['18-24', '25-39', '40-59', '60+'].map(age => (
              <label key={age} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="ageGroups"
                  value={age}
                  checked={filters.ageGroups.includes(age)}
                  onChange={handleFilterChange}
                />
                {age}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className={styles.applyFilters}>Apply Filters</button>
      </form>
      
      <div className={styles.viewToggle}>
        <button onClick={() => setIsDetailedView(false)} className={!isDetailedView ? styles.active : ''}>
          View Results Summary
        </button>
        <button onClick={() => setIsDetailedView(true)} className={isDetailedView ? styles.active : ''}>
          View Detailed Results
        </button>
      </div>
      
      {isDetailedView ? (
        // Existing detailed view
        <div className={styles.grid}>
          {headers.map(header => (
            <div key={header} className={styles.headerCell}>{header}</div>
          ))}
          {questions.flatMap((question, qIndex) => [
            <React.Fragment key={`question-${qIndex}`}>
              <div className={styles.questionCell}>
                {question}
                <SurveyProgressBar data={ratings.map((_, rIndex) => {
                  const qKey = `q${qIndex + 1}` as keyof CategoryData;
                  const rKey = `${rIndex + 1}`;
                  return surveyData.total?.[qKey]?.[rKey] || 0;
                })} />
              </div>

            </React.Fragment>,
            ...ratings.map((rating, rIndex) => {
              const qKey = `q${qIndex + 1}` as keyof CategoryData;
              const rKey = `${rIndex + 1}`;
              return (
                <React.Fragment key={`${qIndex}-${rIndex}`}>
                  <div className={styles.ratingCell}>{rating}</div>
                  <div className={styles.dataCell}>{surveyData.total?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.gender?.M?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.gender?.F?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.ageGroup?.["18-24"]?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.ageGroup?.["25-39"]?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.ageGroup?.["40-59"]?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.ageGroup?.["60+"]?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.cabinType?.Economy?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.cabinType?.Business?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.cabinType?.First?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.arrival?.AUH?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.arrival?.BAH?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.arrival?.DOH?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.arrival?.RUH?.[qKey]?.[rKey] || 0}</div>
                  <div className={styles.dataCell}>{surveyData.arrival?.CAI?.[qKey]?.[rKey] || 0}</div>
                </React.Fragment>
              );
            })
          ])}
        </div>
      ) : (
        // New summary view
        renderSummaryTable()
      )}
    </div>
  );
};

export default Survey;
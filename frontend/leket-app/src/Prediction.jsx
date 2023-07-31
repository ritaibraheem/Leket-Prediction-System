import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { kinds_list } from './utils';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { css } from '@emotion/react';
import "./LoadingSpinner.css"; // Import the CSS file
import { Multiselect } from 'multiselect-react-dropdown';

export const Prediction = () => {
  // State variables to hold form input values
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kinds, setKinds] = useState([]);
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [maxTemp, setmaxTemp] = useState('');
  const [minTemp, setminTemp] = useState('');
  const [hail, sethail] = useState('');
  const [gale, setgale] = useState('');
  const [rain, setrain] = useState('');
  const [snow, setsnow] = useState('');

  // State variable to manage loading spinner visibility
  const [isLoading, setIsLoading] = useState(false);

  // Get the current date in the format "YYYY-MM-DD"
  const today = new Date().toISOString().split("T")[0];

  // Options for the Kind dropdown
  const kind_options = kinds_list;

  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to check if the uploaded file is a CSV file
  const isCSVFile = (file) => {
    return file.name.endsWith('.csv') || file.type === 'text/csv';
  };

  // Function to handle the submission of the file upload form
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a CSV file.');
      return;
    }

    if (file) {
      if (!isCSVFile(file)) {
        alert('Please upload a CSV file.');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);

      setIsLoading(true);

      axios.post('//localhost:4000/processing', formData)
        .then(response => {
          console.log(response.data);
          alert('File uploaded successfully!');
          setIsLoading(false); // Stop the loading spinner
        })
        .catch(error => {
          console.error(error);
          alert('Error uploading file.');
          setIsLoading(false); // Stop the loading spinner
        });
    }
  };

  // Function to handle the prediction process
  const handlePrediction = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios.post('//localhost:4000/results', {
      startDate: startDate,
      endDate: endDate,
      kind: kinds,
      maxTemp: maxTemp,
      minTemp: minTemp,
      rain: rain,
      snow: snow,
      hail: hail,
      gale: gale,
      holidayStartDate: holidayStartDate,
      holidayEndDate: holidayEndDate
    })
      .then(response => {
        console.log(response);
        const results = response.data; // Get the results from the response
        console.log(results);
        console.log(response.data)
        setIsLoading(false); // Stop the loading spinner
        navigate("/Results", { state: { jsonData: results } });
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false); // Stop the loading spinner
        alert(`Error ${error}. Please try again later.`);
      });
    console.log(isLoading);
  };

  // Function to handle the form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(kinds);
    if (!kinds || kinds === 'בחר סוג') {
      alert('Please select a Kind.');
      return;
    }

    if (!startDate) {
      alert('Please select a Start Date.');
      return;
    }
    if (!endDate) {
      alert('Please select a Due Date value.');
      return;
    }
    if (!maxTemp) {
      alert('Please select a Max Temp.');
      return;
    }
    if (!minTemp) {
      alert('Please select a Min Temp.');
      return;
    }

    if (startDate > endDate) {
      alert('Please select a valid start and due dates');
      return;
    }

    if (holidayStartDate > holidayEndDate) {
      alert('Please select a valid holiday dates');
      return;
    }

    if (holidayStartDate && !holidayEndDate) {
      alert('Please select a valid holiday dates');
      return;
    }

    if (!holidayStartDate && holidayEndDate) {
      alert('Please select a valid holiday dates');
      return
    }
    // Call the handlePrediction function to start the prediction process
    handlePrediction(e);
    console.log(isLoading);
  };

  // Function to handle the change in the "Start Date" input
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  // Function to handle the change in the "End Date" input
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Function to handle the change in the selected "Kind" options
  const handleKindChange = (selectedList, selectedItem) => {
    // selectedList is an array containing the selected "Kind" values
    setKinds(selectedList);
  };

  // Function to handle the change in the "Max Temp" input
  const handlemaxTempChange = (event) => {
    setmaxTemp(event.target.value);
  };

  // Function to handle the change in the "Min Temp" input
  const handleminTempChange = (event) => {
    setminTemp(event.target.value);
  };

  // Function to handle the change in the "Holiday Start Date" input
  const handleholidayStartDateChange = (event) => {
    setHolidayStartDate(event.target.value);
  };

  // Function to handle the change in the "Holiday End Date" input
  const handleholidayEndDateChange = (event) => {
    setHolidayEndDate(event.target.value);
  };

  // Function to handle the change in the "Snow" checkbox
  const handlesnowChange = (event) => {
    setsnow(event.target.checked);
    console.log(event.target.checked);
  };

  // Function to handle the change in the "Hail" input
  const handlehailChange = (event) => {
    sethail(event.target.value);
  };

  // Function to handle the change in the "Gale" input
  const handlegaleChange = (event) => {
    setgale(event.target.value);
  };

  // Function to handle the change in the "Rain" input
  const handlerainChange = (event) => {
    console.log('rain value:', event.target.value);
    setrain(event.target.value);
  };

  // State variable to manage the display of the reminder message
  const [showReminder, setShowReminder] = useState(false);

  // useEffect hook to check for special reminder dates
  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();

    // Check if today is one of the special reminder dates (January 1st, April 1st, July 1st, or October 1st)
    if (
      (currentMonth === 0 && currentDay === 1) ||
      (currentMonth === 3 && currentDay === 1) ||
      (currentMonth === 6 && currentDay === 1) ||
      (currentMonth === 9 && currentDay === 1)
    ) {
      setShowReminder(true); // Display the reminder message
    } else {
      setShowReminder(false); // Hide the reminder message
    }
  }, []);

  // JSX rendering of the Prediction component
  return (
    <div className="prediction-page">
      {/* Include the navigation bar component */}
      <Navbar className='nav' />

      <div className="auth-form-container2">
        <form className="prediction-form" onSubmit={handleFormSubmit}>
          <h2 className="h2"> Prediction </h2>
          <a className="weather " href='https://weather.com/weather/today/l/32.78,35.02?par=google' target="_blank" rel="noreferrer">
            See the weather please! </a>
          <div>
            <div>
              {/* Display the reminder message */}
              {showReminder && (
                <div className="reminder-message" >
                  <span style={{ fontWeight: 'bold', color: 'red' }}>
                    Remember to upload a file today!
                  </span>
                </div>
              )}
            </div>
            {/* Input field for file upload */}
            <input type="file" id="without-back-button-csv" onChange={handleFileChange}></input>
            {/* Button to submit the file upload form */}
            <button className="without-back-button-csv" type="submit" onClick={handleFileSubmit}>Upload</button>
          </div>

          <div className="data-form">
            {/* Input fields for various data */}
            <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="Start Date">Start Date</label>
              <input className="datebox" value={startDate} onChange={handleStartDateChange} name='Start Date' id="startDate" type='date' placeholder="20/1/2022" min={today} />
              <label htmlFor="numeric-input">Max Temp:</label>
              <input type="number" id="MaxTemp" min="-20" max="60" onChange={handlemaxTempChange} />
              <label htmlFor="Start Date">Holiday Start</label>
              <input className="datebox" value={holidayStartDate} onChange={handleholidayStartDateChange} name='Start Date' id="holidayStartDate" type='date' placeholder="20/1/2022" min={today} />
            </div>

            <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="End Date">Due Date</label>
              <input className="datebox" value={endDate} onChange={handleEndDateChange} type='date' placeholder="20/10/2022" id="endDate" name="End Date" min={today} />
              <label htmlFor="numeric-input">Min Temp:</label>
              <input type="number" id="MinTemp" min="-20" max="60" onChange={handleminTempChange} />
              <label htmlFor="End Date">Holiday End</label>
              <input className="datebox" value={holidayEndDate} onChange={handleholidayEndDateChange} type='date' placeholder="20/10/2022" id="holidayEndDate" name="End Date" min={today} />
            </div>

            <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
              <label><input type="checkbox" value="rain" onChange={handlerainChange} />Rain - גשם</label>
              <label><input type="checkbox" value="snow" onChange={handlesnowChange} />Snow - שלג</label>
              <label><input type="checkbox" value="hail" onChange={handlehailChange} />Hail - ברד</label>
              <label><input type="checkbox" value="gale" onChange={handlegaleChange} />Gale - סערה</label>
            </div>

            <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="Kind">Kind:</label>
              {/* Multiselect dropdown for selecting "Kind" */}
              <Multiselect className="multi"
                isObject={false}
                id="dropdown"
                options={kind_options}
                selectedValues={kinds}
                onSelect={handleKindChange}
                onRemove={handleKindChange}
                style={{
                  multiselectContainer: {
                    width: '300px',
                    marginTop: '10px',
                  },
                  multiSelectContainerInput: {
                    border: 'none',
                    marginTop: '3px',
                  },
                  searchBox: {
                    borderBottom: '1px solid #ccc',
                    borderRadius: '0',
                  },
                  inputField: {
                    fontSize: '10px',
                  },
                  optionContainer: {
                    borderRadius: '4px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 1,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    fontSize: '16px',
                    backgroundColor: '#fff',
                    color: '#333',
                    marginTop: '0',
                    marginBottom: '0',
                    textAlign: 'left',
                  },
                  optionGroup: {
                    paddingLeft: '10px',
                  },
                  option: {
                    padding: '10px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    ':hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  },
                  subOption: {
                    paddingLeft: '30px',
                  },
                  chips: {
                    borderRadius: '4px',
                    background: '#f2f2f2',
                    border: '1px solid #ccc',
                    color: '#333',
                    padding: '5px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '5px',
                    marginRight: '5px',
                  },
                  chipLabel: {
                    marginLeft: '5px',
                  },
                }}
              />
            </div>
          </div>
        </form>
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          `}
        >
          {/* Display loading spinner or "RUN" button based on isLoading state */}
          {isLoading ? (
            <RingLoader
              css={css`
                display: block;
              `}
              size={50}
              color="#123abc"
              loading={isLoading}
            />
          ) : (
            <button className="black-back-button" onClick={handleFormSubmit}>RUN</button>
          )}
        </div>
      </div>
    </div>
  );
};

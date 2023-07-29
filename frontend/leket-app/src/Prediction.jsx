import React, {useState} from "react"
import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";
import image6 from "./assets/images/image6.jpg"
import { kinds } from './utils';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { css } from '@emotion/react';
import "./LoadingSpinner.css"; // Import the CSS file

export const Prediction = () => {
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kind, setKind] = useState('');
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [maxTemp, setmaxTemp] = useState('');
  const [minTemp, setminTemp] = useState('');
  const [hail, sethail] = useState('');
  const [gale, setgale] = useState('');
  const [rain, setrain] = useState('');
  const [snow, setsnow] = useState('');
  
  var [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0]; // Get the current date in the format "YYYY-MM-DD"

  const kind_options = kinds;
  const navigate = useNavigate()
 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const isCSVFile = (file) => {
    return file.name.endsWith('.csv') || file.type === 'text/csv';
  };

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

      axios.post('//localhost:4000/processing', formData)
        .then(response => {
          console.log(response.data);
          if (response.status === 200) {
            alert('File uploaded successfully!');
          }
        })
        .catch(error => {
          console.error(error);
          alert('Error uploading file.');
        });
    }
  };

  const handlePrediction = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    axios.post('//localhost:4000/results', {
      startDate: startDate,
      endDate: endDate,
      kind: kind,
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
        console.log((response.data)['result'])
        console.log(results);
        console.log(response.data)
        console.log(response.data['result'])
        console.log(response.data['r2'])
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!kind || kind === 'בחר סוג') {
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

    if (startDate>endDate){
      alert('please select a valid start and due dates')
      return;
    }

    if (holidayStartDate>holidayEndDate){
      alert('please select a valid holiday dates')
      return;
    }

    if (holidayStartDate && !holidayEndDate){
      alert('please select a valid holiday dates')
      return;
    }

    if (!holidayStartDate && holidayEndDate){
      alert('please select a valid holiday dates')
      return;
    }
    handlePrediction(e)
    console.log(isLoading);
  }


  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleKindChange = (event) => {
    setKind(event.target.value);
  };

  const handlemaxTempChange = (event) => {
    setmaxTemp(event.target.value);
  };

  const handleminTempChange = (event) => {
    setminTemp(event.target.value);
  };

  const handleholidayStartDateChange = (event) => {
    setHolidayStartDate(event.target.value);
  };

  const handleholidayEndDateChange = (event) => {
    setHolidayEndDate(event.target.value);
  };

  const handlesnowChange = (event) => {
    setsnow(event.target.checked);
    console.log(event.target.checked);
};

  const handlehailChange = (event) => {
    sethail(event.target.value);
};

  const handlegaleChange = (event) => {
    setgale(event.target.value);
  };

  const handlerainChange = (event) => {
    console.log('rain value:', event.target.value);
    setrain(event.target.value);
  };

    return(
       <div className="prediction-page">
        <Navbar className='nav' />
        
        <div className="auth-form-container2">
            <form className="prediction-form" onSubmit={handleFormSubmit}>
                <h2 className="h2"> Prediction </h2>
                <a className="weather "href = 'https://weather.com/weather/today/l/32.78,35.02?par=google' target="_blank" >
             see the weather please! </a>
             <div>
                <input type="file" id="without-back-button-csv" onChange={handleFileChange}></input>
                <button className="without-back-button-csv" type="submit" onClick ={handleFileSubmit} >Upload</button>
            </div>

                <div className="data-form">
                <div className="my-dev" style={{ display: 'flex', alignItems: 'center'}}>      
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
                <label><input type="checkbox" value="rain"  onChange={handlerainChange} />Rain - גשם</label>
                <label><input type="checkbox" value="snow" onChange={handlesnowChange} />Snow - שלג</label>
                <label><input type="checkbox" value="hail" onChange={handlehailChange} />Hail - ברד</label>
                <label><input type="checkbox" value="gale" onChange={handlegaleChange} />Gale - סערה</label>
                </div>


                
                <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor = "Kind">Kind:</label>
                <label >
                <select id="dropdown" className="kind_dropdown" name="selectMenu" onChange={handleKindChange}>
                  {kind_options.map((option, index) => (
                  <option key={index} value={option}>
                  {option}
                  </option>))}
                </select>
                </label>
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

    )
}
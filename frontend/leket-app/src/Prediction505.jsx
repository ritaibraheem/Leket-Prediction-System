import React, {useState, useEffect} from "react"
import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";
import image6 from "./assets/images/image6.jpg"
import { kinds } from './utils';
import axios from 'axios';
import {Multiselect} from 'multiselect-react-dropdown';


export const Prediction = () => {
  const [file, setFile] = useState(null);
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [Kind, setKind] = useState('');
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [maxTemp, setmaxTemp] = useState('');
  const [minTemp, setminTemp] = useState('');
  const [hail, sethail] = useState('');
  const [gale, setgale] = useState('');
  const [rain, setrain] = useState('');
  const [snow, setsnow] = useState('');

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

      axios.post('//localhost:4000/prediction', formData)
        .then(response => {
          console.log(response.data);
          alert('File uploaded successfully!');
        })
        .catch(error => {
          console.error(error);
          alert('Error uploading file.');
        });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!Kind || Kind === 'בחר סוג') {
        alert('Please select a Kind.');
        return;
      }

    if (!StartDate) {
        alert('Please select a Start Date.');
        return;
      }
      if (!EndDate) {
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

      if (StartDate>EndDate){
        alert('please select a valid start and due dates')
        return;
      }

      if (holidayStartDate>holidayEndDate){
        alert('please select a valid holiday dates')
        return;
      }

    axios.post('//localhost:4000/Results', {
      startDate: StartDate,
      endDate: EndDate,
      kind: Kind,
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
        console.log(response.data);
        alert('Successfully input parameters!');
        navigate("/Results"); 
      })
      .catch(error => {
        console.error(error);
        alert('Error ${error}. Please try again later.');
      });
  };

  const handleKindChange = (selectedList) => {
    setKind(selectedList);
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
    setsnow(event.target.value);
  };

  const handlehailChange = (event) => {
    sethail(event.target.value);
  };

  const handlegaleChange = (event) => {
    setgale(event.target.value);
  };

  const handlerainChange = (event) => {
    setrain(event.target.value);
  };


    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth();
  
      if (currentMonth === 0 && currentDay === 1) { // January 1st
        setShowReminder(true);
      } else if (currentMonth === 6 && currentDay === 1) { // July 1st
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }
    }, []);


    /*salma*/ 



    return(
       <div className="prediction-page">
        <Navbar className='nav' />
        
        <div className="auth-form-container2">
            <form className="prediction-form" onSubmit={handleFormSubmit}>
                <h2 className="h2"> Prediction </h2>
                <a className="weather "href = 'https://weather.com/weather/today/l/32.78,35.02?par=google' target="_blank" >
             Here you can check the weather! </a>
             <div>
             <div>
      {showReminder && (
        <div className="reminder-message" >
          <span style={{ fontWeight: 'bold', color: 'red'}}>
          Remember to upload a file today!</span></div>
      )}
      {/* Rest of your component */}
    </div>

              {/* <a> Don't Forget To Update The File Every:</a> */}
                <input type="file" id="without-back-button-csv" onChange={handleFileChange}></input>
                <button className="without-back-button-csv" type="submit" onClick ={handleFileSubmit} >Upload</button>
            </div>

            

                <div className="data-form">
                <div className="my-dev" style={{ display: 'flex', alignItems: 'center'}}>      
                <label htmlFor="Start Date">Start Date</label>
                <input className="datebox" value={StartDate} onChange={(e) => setStartDate(e.target.value)} name='Start Date' id="StartDate" type='date' placeholder="20/1/2022" />
                <label htmlFor="numeric-input">Max Temp:</label>
                <input type="number" id="MaxTemp" min="-20" max="60" onChange={handlemaxTempChange} />
                <label htmlFor="Start Date">Holiday Start</label>
                <input className="datebox" value={holidayStartDate} onChange={handleholidayStartDateChange} name='Start Date' id="holidayStartDate" type='date' placeholder="20/1/2022" />
                </div> 
                

                <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="End Date">Due Date</label>
                <input className="datebox" value={EndDate} onChange={(e) => setEndDate(e.target.value)} type='date' placeholder="20/10/2022" id="EndDate" name="End Date" />
                <label htmlFor="numeric-input">Min Temp:</label>
                <input type="number" id="MinTemp" min="-20" max="60" onChange={handleminTempChange} />
                <label htmlFor="End Date">Holiday End</label>
                <input className="datebox" value={holidayEndDate} onChange={handleholidayEndDateChange} type='date' placeholder="20/10/2022" id="holidayEndDate" name="End Date" />
                </div>


                <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
                <label><input type="checkbox" onChange={handlerainChange} />Rain - גשם</label>
                <label><input type="checkbox" onChange={handlesnowChange} />Snow - שלג</label>
                <label><input type="checkbox" onChange={handlehailChange} />Hail - ברד</label>
                <label><input type="checkbox" onChange={handlegaleChange} />Gale - סערה</label>
                </div>


                
                <div className="my-dev" style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="Kind">Kind:</label>
        <Multiselect className="multi"
          isObject = {false}
          id="dropdown"
          options={kind_options}
          selectedValues={Kind}
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
            <button className="black-back-button" onClick={handleFormSubmit}>RUN</button>
            
        </div>
        </div>
    )
}
import React, { useEffect, useState } from "react";
import { Segment, Input, Dropdown, Dimmer } from "semantic-ui-react";
import { FaSun, FaCloud, FaCloudSun, FaCloudRain, FaSnowflake, FaWind, FaColumns } from 'react-icons/fa';
import axios from "axios";
import MapContainer from "./MapContainer";
import WeatherCard from "./WeatherCard";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const SnowReport = () => {
  const [location, setLocation] = useState("");
  const [daysLimit, setDaysLimit] = useState(1); // Default limit is set to 7 days
  const [snowData, setSnowData] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [temperatureDifferenceData, setTemperatureDifferenceData] = useState(null);
  const [showHourlyTemperature, setShowHourlyTemperature] = useState(false); // State to control the visibility of hourly temperature chart

  const handleExpandClick = () => {
    // Check if snowData is defined and has days property
    if (snowData && snowData.days) {
      // Assuming you want to get temperatures for the second day (index 1)
      const temperaturesForOneDay = snowData.days[1].hours.map(hour => hour.temp);
      console.log(temperaturesForOneDay);
  
      // Update state if necessary
      setDayData(temperaturesForOneDay);
    }
    console.log(dayData)
    setShowHourlyTemperature(!showHourlyTemperature); // Toggle the visibility state
  };

  const handleLocationClick = (data) => {
    setClickedLocation(data);
    // const component1 = data.address_components[1];
    // const component3 = data.address_components[3];
    // // Set the location name based on the extracted components
    // setLocationName(`${component1.long_name}, ${component3.long_name}`);
    handleSearch()
    console.log( "testClickedLocation", clickedLocation)
  };
  
  // const locationString1 = clickedLocation ? `${clickedLocation.lat},${clickedLocation.lng}` : 'default value';

  const handleSearch = () => {
    // Check if clickedLocation is defined
    if (clickedLocation) {
      // Make API request to Snow API with the new location and days limit
      axios
        .get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${clickedLocation}?key=F4QHX8D2ZCFH2D6ACBBWT4N6W&days=${daysLimit}`)
        .then((response) => {
          // Handle successful response
          console.log("test2", clickedLocation);
          console.log('resObj', response.data);
          setSnowData(response.data);
        })
        .catch((error) => {
          // Handle error
          console.error('Error fetching snow data:', error);
        });
    }
  };

  const calculateTemperatureDifferences = () => {
    if (snowData && snowData.days) {
      const labels = [];
      const temperatureDifferences = [];

      snowData.days.slice(0, daysLimit).forEach(dayData => {
        labels.push(dayData.datetime);
        const difference = (dayData.tempmax || dayData.temp) - (dayData.tempmin || dayData.temp);
        temperatureDifferences.push(difference);
      });

      setTemperatureDifferenceData({
        labels: labels,
        datasets: [{
          label: 'Temperature Difference',
          data: temperatureDifferences,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      });
    }
  };
  

  useEffect(() => {
    // Load default snow data for initial render
    handleSearch();
  }, [clickedLocation]);

  useEffect(() => {
    // Recalculate temperature differences whenever relevant state changes
    calculateTemperatureDifferences();
  }, [snowData, daysLimit]);

  // Options for the days limit selector
  const daysLimitOptions = [
    { key: 1, text: "1 day", value: 1 },
    { key: 3, text: "3 days", value: 3 },
    { key: 7, text: "7 days", value: 7 },
    { key: 14, text: "14 days", value: 14 },
  ];

  return (
    <div>
      <Segment className="snow-conditions-segment" style={{borderRadius: '0px', background: 'rgb(34, 40, 49)', marginTop: '100px'}}>
        <div style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
        <h2 style={{fontFamily: 'Anta', color: 'white', marginBottom: '0px'}}>Check</h2>
        <h2 style={{fontFamily: 'Anta', color: 'white', marginTop: '0px'}}>Snow Conditions</h2>
        <p style={{fontFamily: 'Anta', color: 'white', textAlign: 'center', marginBlock: '20px'}}>Search a location to see temeratures and conditions and use the wax key to wax accordingly</p>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <Segment style={{width: '500px', textAlign: 'center'}}>
          <h2>Recommended Wax Key</h2>
          <h5 style={{background: 'rgb(251 238 71)'}}>Swix HS 10</h5>
          <h5 style={{background: 'rgb(228 70 59)'}}>Swix HS 8</h5>
          <h5 style={{background: 'rgb(186 110 158)'}}>Swix HS 7</h5>
          <h5 style={{background: 'rgb(111 172 206)'}}>Swix HS 6</h5>
          <h5 style={{background: 'rgb(117 173 115)'}}>Swix HS 5</h5>

        </Segment>
        </div>
        
    
        {/* Search bar */}
        <div style={{display: "flex", flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
        {/* <Input
          placeholder="Enter location..."
          value={""}
          style={{fontFamily: 'Anta', marginBottom: '10px'}}
          onChange={(e) => setLocation(e.target.value)}
          action={{
            icon: "search",
            onClick: handleSearch,
          }}
        /> */}
        <MapContainer onLocationClick={handleLocationClick}/>
        {/* Days limit selector */}
        <div>
        <Dropdown
        placeholder="Select days limit"
        options={daysLimitOptions}
        value={daysLimit}
        onChange={(e, { value }) => setDaysLimit(value)}
        selection
        style={{fontFamily: 'Anta', marginTop: '10px'}}
      />
      </div>
        </div>
       
        {snowData && snowData.days && (
          // <div style={{display: 'flex', alignItems: 'center'}}>
          //   <WeatherCard data={snowData}/>
          // </div>
          
          <div className="weather-cards-container" style={{ overflow: "auto", height: '250px', marginTop: '20px', scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
            {snowData.days.slice(0, daysLimit).map((dayData, index) => {
              // Convert the timestamp to a Date object
              const timestamp = new Date(dayData.datetime);
              // Get the day of the week
              const dayOfWeek = `${timestamp.toLocaleDateString(undefined, { weekday: "long" })} ${timestamp.getDate()}/${timestamp.getMonth() + 1}`;



              let weatherIcon;
              switch (dayData.icon) {
                case 'clear-day':
                  weatherIcon = <FaSun style={{ fontSize: '5em' }} />;
                  break;
                case 'partly-cloudy-day':
                  weatherIcon = <FaCloudSun style={{ fontSize: '5em' }} />;
                  break;
                case 'cloudy':
                  weatherIcon = <FaCloud style={{ fontSize: '5em' }} />;
                  break;
                case 'rain':
                  weatherIcon = <FaCloudRain style={{ fontSize: '5em' }} />;
                  break;
                case 'snow':
                  weatherIcon = <FaSnowflake style={{ fontSize: '5em' }} />;
                  break;
                case 'wind':
                  weatherIcon = <FaWind style={{ fontSize: '5em' }} />;
                  break;
                default:
                  weatherIcon = null;
              }
              const getTemperatureColor = (temperature) => {
                if (temperature >= 35) {
                  return "rgb(251 238 71)"; // Red for high temperatures
                } else if (temperature >= 25) {
                  return "rgb(228 70 59)"; // Orange for warm temperatures
                } else if (temperature >= 18) {
                  return "rgb(186 110 158)"; // Orange for mild temperatures
                } else if (temperature >= 10) {
                  return "rgb(111 172 206)"; // Yellow for cool temperatures
                } else if (temperature >= 3) {
                  return "rgb(117 173 115)"; // Blue for cold temperatures
                } else {
                  return "rgb(117 173 115)"; // Light blue for very cold temperatures
                }
              };
              
              const temperatureColor = getTemperatureColor(dayData.temp || dayData.tempmax || dayData.tempmin);
              return (
                <div key={index} style={{display: 'flex', fontFamily: 'Anta', justifyContent: 'center'}}>
                  {/* Render snow condition data for each day */}
                  <Segment style={{borderRadius: '10px', bordertop: '20px', width: '325px', marginBottom: '20px', marginRight: '20px', display: 'flex', flexDirection: 'column'}}>
                  <div>
                  <p>Location: {snowData.address}</p>
                  <p>{dayOfWeek}</p>
                  
                  {/* <p>Conditions: {dayData.conditions}</p> */}
                  <p>Tempurature:</p>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems:'flex-start' }}>
                  <p style={{ backgroundColor: temperatureColor }}>High: {dayData.tempmax} F</p>
                  <p style={{ backgroundColor: temperatureColor }}>Avg: {dayData.temp} F</p>
                  <p style={{ backgroundColor: temperatureColor }}>Low: {dayData.tempmin} F</p>
                  </div>
                  </div>
                  
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                  {weatherIcon || dayData.icon}
                  </div>
                  <button onClick={handleExpandClick}>Show Hourly Temperature</button> {/* Button to expand/collapse */}
                  {showHourlyTemperature && snowData && snowData.days && (
    <div style={{ display: "flex", justifyContent: 'center', marginTop: '20px' }}>
      <div>
        <h3>Temperature Difference Chart</h3>
        <Bar
          data={{
            labels: dayData.hours.map(hour => hour.datetime), // Use the datetime as labels
            datasets: [
              {
                label: 'Hourly Temperature',
                data: dayData.hours.map(hour => hour.temp), // Use the hourly temperature data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          }}
          options={{
            scales: {
              y: {
                type: 'linear',
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </div>
  )}

                  </Segment>

                </div>
              );
            })}
          </div>
        )}
      </Segment>
    </div>
  );
};

export default SnowReport;







// import React, { useEffect, useState } from "react";
// import { Segment, Dropdown } from "semantic-ui-react";
// import { FaSun, FaCloud, FaCloudSun, FaCloudRain, FaSnowflake, FaWind } from 'react-icons/fa';
// import axios from "axios";
// import MapContainer from "./MapContainer";
// import WeatherCard from "./WeatherCard";
// import { Bar } from 'react-chartjs-2';
// import { Chart, Linear, CategoryScale, BarController, BarElement } from 'chart.js';

// const SnowReport = () => {
//   // Your existing state variables
  
//   const [location, setLocation] = useState("");
//   const [daysLimit, setDaysLimit] = useState(1); // Default limit is set to 7 days
//   const [snowData, setSnowData] = useState(null);
//   const [clickedLocation, setClickedLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [temperatureDifferenceData, setTemperatureDifferenceData] = useState(null);


//   const handleLocationClick = (data) => {
//     setClickedLocation(data);
//     // const component1 = data.address_components[1];
//     // const component3 = data.address_components[3];
//     // // Set the location name based on the extracted components
//     // setLocationName(`${component1.long_name}, ${component3.long_name}`);
//     handleSearch()
//     console.log( "testClickedLocation", clickedLocation)
//   };
  
//   // const locationString1 = clickedLocation ? `${clickedLocation.lat},${clickedLocation.lng}` : 'default value';

//   const handleSearch = () => {
//     // Check if clickedLocation is defined
//     if (clickedLocation) {
//       // Make API request to Snow API with the new location and days limit
//       axios
//         .get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${clickedLocation}?key=F4QHX8D2ZCFH2D6ACBBWT4N6W&days=${daysLimit}`)
//         .then((response) => {
//           // Handle successful response
//           console.log("test2", clickedLocation);
//           console.log('resObj', response.data);
//           setSnowData(response.data);
//         })
//         .catch((error) => {
//           // Handle error
//           console.error('Error fetching snow data:', error);
//         });
//     }
//   };

//   const calculateTemperatureDifferences = () => {
//     if (snowData && snowData.days) {
//       const labels = [];
//       const temperatureDifferences = [];

//       snowData.days.slice(0, daysLimit).forEach(dayData => {
//         labels.push(dayData.datetime);
//         const difference = (dayData.tempmax || dayData.temp) - (dayData.tempmin || dayData.temp);
//         temperatureDifferences.push(difference);
//       });

//       setTemperatureDifferenceData({
//         labels: labels,
//         datasets: [{
//           label: 'Temperature Difference',
//           data: temperatureDifferences,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       });
//     }
//   };
  

//   useEffect(() => {
//     // Load default snow data for initial render
//     handleSearch();
//   }, [clickedLocation]);

//   useEffect(() => {
//     // Recalculate temperature differences whenever relevant state changes
//     calculateTemperatureDifferences();
//   }, [snowData, daysLimit]);

//   // Options for the days limit selector
//   const daysLimitOptions = [
//     { key: 1, text: "1 day", value: 1 },
//     { key: 3, text: "3 days", value: 3 },
//     { key: 7, text: "7 days", value: 7 },
//     { key: 14, text: "14 days", value: 14 },
//   ];

  

//   return (
//     <div>
//       <Segment className="snow-conditions-segment" style={{borderRadius: '0px', background: 'rgb(34, 40, 49)', marginTop: '100px'}}>
//         <div style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
//         <h2 style={{fontFamily: 'Anta', color: 'white', marginBottom: '0px'}}>Check</h2>
//         <h2 style={{fontFamily: 'Anta', color: 'white', marginTop: '0px'}}>Snow Conditions</h2>
//         <p style={{fontFamily: 'Anta', color: 'white', textAlign: 'center', marginBlock: '20px'}}>Search a location to see temeratures and conditions and use the wax key to wax accordingly</p>
//         </div>
//         <div style={{display: 'flex', justifyContent: 'center'}}>
//         <Segment style={{width: '500px', textAlign: 'center'}}>
//           <h2>Recommended Wax Key</h2>
//           <h5 style={{background: 'rgb(251 238 71)'}}>Swix HS 10</h5>
//           <h5 style={{background: 'rgb(228 70 59)'}}>Swix HS 8</h5>
//           <h5 style={{background: 'rgb(186 110 158)'}}>Swix HS 7</h5>
//           <h5 style={{background: 'rgb(111 172 206)'}}>Swix HS 6</h5>
//           <h5 style={{background: 'rgb(117 173 115)'}}>Swix HS 5</h5>

//         </Segment>
//         </div>
        
    
//         {/* Search bar */}
//         <div style={{display: "flex", flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
//         {/* <Input
//           placeholder="Enter location..."
//           value={""}
//           style={{fontFamily: 'Anta', marginBottom: '10px'}}
//           onChange={(e) => setLocation(e.target.value)}
//           action={{
//             icon: "search",
//             onClick: handleSearch,
//           }}
//         /> */}
//         <MapContainer onLocationClick={handleLocationClick}/>
//         {/* Days limit selector */}
//         <div>
//         <Dropdown
//         placeholder="Select days limit"
//         options={daysLimitOptions}
//         value={daysLimit}
//         onChange={(e, { value }) => setDaysLimit(value)}
//         selection
//         style={{fontFamily: 'Anta', marginTop: '10px'}}
//       />
//       </div>
//         </div>
       
//         {snowData && snowData.days && temperatureDifferenceData && (
//           // <div style={{display: 'flex', alignItems: 'center'}}>
//           //   <WeatherCard data={snowData}/>
//           // </div>
          
//           <div className="weather-cards-container" style={{ overflow: "auto", height: '250px', marginTop: '20px', scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
//             {snowData.days.slice(0, daysLimit).map((dayData, index) => {
//               // Convert the timestamp to a Date object
//               const timestamp = new Date(dayData.datetime);
//               // Get the day of the week
//               const dayOfWeek = `${timestamp.toLocaleDateString(undefined, { weekday: "long" })} ${timestamp.getDate()}/${timestamp.getMonth() + 1}`;



//               let weatherIcon;
//               switch (dayData.icon) {
//                 case 'clear-day':
//                   weatherIcon = <FaSun style={{ fontSize: '5em' }} />;
//                   break;
//                 case 'partly-cloudy-day':
//                   weatherIcon = <FaCloudSun style={{ fontSize: '5em' }} />;
//                   break;
//                 case 'cloudy':
//                   weatherIcon = <FaCloud style={{ fontSize: '5em' }} />;
//                   break;
//                 case 'rain':
//                   weatherIcon = <FaCloudRain style={{ fontSize: '5em' }} />;
//                   break;
//                 case 'snow':
//                   weatherIcon = <FaSnowflake style={{ fontSize: '5em' }} />;
//                   break;
//                 case 'wind':
//                   weatherIcon = <FaWind style={{ fontSize: '5em' }} />;
//                   break;
//                 default:
//                   weatherIcon = null;
//               }
//               const getTemperatureColor = (temperature) => {
//                 if (temperature >= 35) {
//                   return "rgb(251 238 71)"; // Red for high temperatures
//                 } else if (temperature >= 25) {
//                   return "rgb(228 70 59)"; // Orange for warm temperatures
//                 } else if (temperature >= 18) {
//                   return "rgb(186 110 158)"; // Orange for mild temperatures
//                 } else if (temperature >= 10) {
//                   return "rgb(111 172 206)"; // Yellow for cool temperatures
//                 } else if (temperature >= 3) {
//                   return "rgb(117 173 115)"; // Blue for cold temperatures
//                 } else {
//                   return "rgb(117 173 115)"; // Light blue for very cold temperatures
//                 }
//               };
//               const temperatureColor = getTemperatureColor(dayData.temp || dayData.tempmax || dayData.tempmin);
//               return (
//                 <div key={index} style={{display: 'flex', fontFamily: 'Anta', justifyContent: 'center'}}>
//                   {/* Render snow condition data for each day */}
//                   <Segment style={{borderRadius: '10px', bordertop: '20px', width: '325px', marginBottom: '20px', marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
//                   <div>
//                   <p>Location: {snowData.address}</p>
//                   <p>{dayOfWeek}</p>
                  
//                   {/* <p>Conditions: {dayData.conditions}</p> */}
                  
//                   <p style={{ backgroundColor: temperatureColor }}>High: {dayData.tempmax} F</p>
//                   <p style={{ backgroundColor: temperatureColor }}>Avg: {dayData.temp} F</p>
//                   <p style={{ backgroundColor: temperatureColor }}>Low: {dayData.tempmin} F</p>
//                   </div>
                  
//                   <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
//                   {weatherIcon || dayData.icon}
//                   </div>

//                   <div>
//                     <h3>Temperature Difference Chart</h3>
//                     <Bar
//                       data={temperatureDifferenceData}
//                       options={{
//                         scales: {
//                           y: {
//                             type: 'linear',
//                             beginAtZero: true
//                           }
//                         }
//                       }}
//                     />
//                   </div>
                  
//                   </Segment>
                  
                  
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </Segment>
//     </div>
//   );
// };

// export default SnowReport;

import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`

  
  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      try{
      
        const response = await axios.get(url)
        setData(response.data)
        console.log(response.data)
      
      } 
      catch 
      {
      
        window.location.reload()
      
      } 
      finally 
      {
      
        setLocation('')
      
      }
    }
  }
  return (

    //user types in possible location, api searches based on coordinates
    //displays temperature and "What feels like" temperature
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

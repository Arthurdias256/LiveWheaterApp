import sunny from '../assets/images/sunny.png'
import { useState } from 'react'

const WheatherApp = () => {

    const [data, setData] = useState(null)
    const [location, setLocation] = useState('')

    const getCoordinates = async(cityName) => {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`;


        const response = await fetch(url)

        const data = await response.json()

        if(!data.results ||  data.results.length == 0){
            throw new Error('Cidade não encontrada')
        }

        const city = data.results[0]

        return{
            latitude: city.latitude,
            longitude: city.longitude,
            name: city.name,
            country: city.country
        }
    }

    const handleInputChanges = (e) => {
        setLocation(e.target.value)

    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search(location)
        }
    }

    const search = async (cityName) => {
        console.log('Searching for:', cityName)
        try{
            //1. buscar as cordenadas 
            const Coordinates = await getCoordinates(cityName)

            //2. pegar a latitude 
            const { latitude, longitude } = Coordinates

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code
            &timezone=auto`. replace(/s/g,'')
            //4. buscar clima
            const response = await fetch(url)

            const data = await response.json()

            //5. salvar os dados obtidos pela api no estado data
            setData({
                ...data.current,
                city: Coordinates.name,
                country: Coordinates.country,
                Wheathertype: data.type,
                WheatherDescription: data.description
            })


            console.log('Clima')
            console.log(data)
        } catch (error){
            console.log(error.message)
        }
    }

    return (
        <div className="container">
            <div className="weather-app">
                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">London</div>
                    </div>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={handleInputChanges}
                            onKeyDown={handleKeyDown}
                        />
                        <i
                            className="fa-solid fa-magnifying-glass"
                            onClick={() => search(location)}
                        ></i>
                    </div>
                </div>

                <div className="weather">
                    <img src={sunny} alt="Clear sky" />
                    <div className="weather-type">Clear</div>
                    <div className="temp">28°</div>
                </div>

                <div className="weather-date">
                    <p>Sat, 15 Ago</p>
                </div>

                <div className="weather-data">
                    <div className="humidity">
                        <div className="data-name">Humidity</div>
                        <i className="fa-solid fa-droplet"></i>
                        <div className="data">35%</div>
                    </div>

                    <div className="wind">
                        <div className="data-name">Wind</div>
                        <i className="fa-solid fa-wind"></i>
                        <div className="data">3 km/h</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WheatherApp

import sunny from '../assets/images/sunny.png'
import cloudy from '../assets/images/cloudy.png'
import rainy from '../assets/images/rainy.png'
import snowy from '../assets/images/snowy.png'
import { useState } from 'react'

const WheatherApp = () => {

    const [data, setData] = useState(null)
    const [location, setLocation] = useState('')

    const weatherImages = {
        sunny,
        cloudy,
        rainy,
        snowy
    }

    const getCoordinates = async (cityName) => {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`

        const response = await fetch(url)

        const result = await response.json()

        if (!result.results || result.results.length === 0) {
            throw new Error('Cidade não encontrada')
        }

        const city = result.results[0]

        return {
            latitude: city.latitude,
            longitude: city.longitude,
            name: city.name,
            country: city.country
        }
    }

    const getWeather = async (latitude, longitude) => {

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`

        const response = await fetch(url)

        const result = await response.json()

        return result.current
    }

    const handleInputChanges = (e) => {
        setLocation(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search(location)
        }
    }

    const search = async (city) => {

        const normalizedCity = city.trim()

        if (!normalizedCity) {
            return
        }

        try {

            const coordinates = await getCoordinates(normalizedCity)

            if (!coordinates) {
                console.log('City not found')
                return
            }

            const currentWeather = await getWeather(
                coordinates.latitude,
                coordinates.longitude
            )

            setData({
                city: coordinates.name,
                country: coordinates.country,
                temperature: currentWeather.temperature_2m,
                humidity: currentWeather.relative_humidity_2m,
                windSpeed: currentWeather.wind_speed_10m,
                weatherCode: currentWeather.weather_code,
                time: currentWeather.time
            })

        } catch (error) {
            console.error(error)
        }
    }

    const getWeatherInfo = (weatherCode) => {

        if (weatherCode === 0) {
            return {
                type: 'sunny',
                description: 'Clear'
            }
        }

        if (weatherCode === 1 || weatherCode === 2) {
            return {
                type: 'cloudy',
                description: 'Partly cloudy'
            }
        }

        if (weatherCode === 3) {
            return {
                type: 'cloudy',
                description: 'Cloudy'
            }
        }

        if (weatherCode === 45 || weatherCode === 48) {
            return {
                type: 'cloudy',
                description: 'Fog'
            }
        }

        if (weatherCode >= 51 && weatherCode <= 57) {
            return {
                type: 'rainy',
                description: 'Drizzle'
            }
        }

        if (weatherCode >= 61 && weatherCode <= 67) {
            return {
                type: 'rainy',
                description: 'Rain'
            }
        }

        if (weatherCode >= 71 && weatherCode <= 77) {
            return {
                type: 'snowy',
                description: 'Snow'
            }
        }

        if (weatherCode >= 80 && weatherCode <= 82) {
            return {
                type: 'rainy',
                description: 'Rain showers'
            }
        }

        if (weatherCode >= 95 && weatherCode <= 99) {
            return {
                type: 'rainy',
                description: 'Thunderstorm'
            }
        }

        return {
            type: 'sunny',
            description: 'Unknown'
        }
    }

    const formatDate = (dateTime) => {

        if (!dateTime) {
            return ''
        }

        const date = new Date(dateTime)

        return new Intl.DateTimeFormat('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        }).format(date)
    }

    const weatherInfo = data
        ? getWeatherInfo(data.weatherCode)
        : null

    const weatherImage = weatherInfo
        ? weatherImages[weatherInfo.type]
        : sunny

    return (
        <div className="container">

            <div className="weather-app">

                <div className="search">

                    <div className="search-top">

                        <i className="fa-solid fa-location-dot"></i>

                        <div className="location">
                            {data ? data.city : 'Search a city'}
                        </div>

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

                    <img
                        src={weatherImage}
                        alt={weatherInfo?.description || 'Weather'}
                    />

                    <div className="weather-type">
                        {weatherInfo
                            ? weatherInfo.description
                            : '--'}
                    </div>

                    <div className="temp">
                        {data
                            ? `${Math.round(data.temperature)}°`
                            : '--'}
                    </div>

                </div>

                <div className="weather-date">

                    <p>
                        {data
                            ? formatDate(data.time)
                            : ''}
                    </p>

                </div>

                <div className="weather-data">

                    <div className="humidity">

                        <div className="data-name">
                            Humidity
                        </div>

                        <i className="fa-solid fa-droplet"></i>

                        <div className="data">
                            {data
                                ? `${data.humidity}%`
                                : '--'}
                        </div>

                    </div>

                    <div className="wind">

                        <div className="data-name">
                            Wind
                        </div>

                        <i className="fa-solid fa-wind"></i>

                        <div className="data">
                            {data
                                ? `${data.windSpeed} km/h`
                                : '--'}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default WheatherApp

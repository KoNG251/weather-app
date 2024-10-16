'use client'
import Image from 'next/image';
import { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Rubik } from '@next/font/google';
import axios from "axios";
import sunnyClear from '../public/Clear/sun.png';
import nightClear from '../public/Clear/night.png';
import Breezy from '../public/Breezy/breezy.png';
import sunnyCloudy from '../public/Cloudy/sun.png';
import nightCloudy from '../public/Cloudy/night.png';
import Cold from '../public/Cold/temperature.png';
import Fog from '../public/Fog/fog.png';
import Hot from '../public/Hot/temperature.png';
import Mist from '../public/Mist/mist.png';
import Overcast from '../public/Overcast/sun.png';
import sunnyPartlyCloudy from '../public/Partly Cloudy/sun.png';
import nightPartlyCloudy from '../public/Partly Cloudy/night.png';
import Rain from '../public/Rain/heavy-rain.png';
import Sand from '../public/Sand/sand.png';
import Snow from '../public/Snow/snow.png';
import Thunderstorm from '../public/Thunder/thunderstorm.png';
import Windy from '../public/Windy/windy.png';

const rubik = Rubik({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export default function Home() {

  const [city, setCity] = useState<string>("bangkok");
  const [data, setData] = useState<weatherData>();
  const [icon, setIcon] = useState<string>();

  interface weatherData {
    current: {
      cloud: number,
      condition: {
        icon: string,
        text: string
      },
      dewpoint_c: number,
      dewpoint_f: number,
      feelslike_c: number,
      feelslike_f: number,
      gust_kp: number,
      gust_mph: number,
      heatindex_c: number,
      heatindex_f: number,
      humidity: number,
      is_day: number,
      last_updated: string,
      last_updated_epoch: number,
      precip_in: number,
      precip_mm: number,
      pressure_in: number,
      pressure_mb: number,
      temp_c: number,
      temp_f: number,
      uv: number,
      vis_km: number,
      vis_miles: number,
      wind_degree: number,
      wind_dir: string,
      wind_kph: number,
      wind_mph: number,
      windchill_c: number,
      windchill_f: number
    },
    location: {
      country: string,
      lat: number,
      localtime: string,
      localtime_epoch: number,
      lon: number,
      name: string,
    }
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleData()
    }
  }

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    const day = new Date(date).toLocaleDateString('en-US', options);
    return day; // Return the formatted day
  };

  const formatTime = (date: string) => {
    const time = new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return time;
  };

  const handleData = () => {

    const key: string | undefined = process.env.NEXT_PUBLIC_API_KEY

    if (!key) {
      console.error('API key is missing');
      return;
    }

    const apiRequest = axios.get(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`);

    Promise.all([apiRequest])
      .then(([apiResponse]) => {
        console.log(apiResponse.data)

        const makeData = apiResponse.data;
        const text: string = makeData?.current.condition.text;
        const is_day: number = makeData?.current.is_day;

        if (text == "Clear" || text == "Partly Sunny" || text == "Sunny") {
          if (is_day === 1) {
            setIcon(sunnyClear);
          } else {
            setIcon(nightClear);
          }
        } else if (text == "Partly cloudy") {
          if (is_day === 1) {
            setIcon(sunnyPartlyCloudy);
          } else {
            setIcon(nightPartlyCloudy);
          }
        } else if (text == "Cloudy") {
          if (is_day === 1) {
            setIcon(sunnyCloudy);
          } else {
            setIcon(nightCloudy);
          }
        } else if (text == "Overcast") {
          setIcon(Overcast);
        } else if (text == "Mist") {
          setIcon (Mist);
        } else if(text == "Patchy Rain" || text == "Light Rain" || text == "Moderate Rain" || text == "Heavy Rain" || text == "Showers") {
          setIcon (Rain);
        } else if (text == "Thunderstorms"){
          setIcon(Thunderstorm);
        } else if (text == "Snow" || text == "Sleet" || text == "Ice Pellets" || text == "Blowing Snow"){
          setIcon(Snow);
        } else if (text == "Fog" || text == "Haze" || text == "Dust" || text == "Ash"){
          setIcon(Fog);
        } else if (text == "Sand") {
          setIcon(Sand);
        } else if (text == "Squalls" || text == "Breezy"){
          setIcon(Breezy);
        } else if (text == "Hot"){
          setIcon(Hot);
        } else if (text == "Cold"){
          setIcon(Cold)
        } else if (text == "Windy"){
          setIcon(Windy)
        }

        setData(apiResponse.data);
      })

  }

  // when render
  useEffect(() => {
    handleData()
  }, [handleData])

  return (
    <div className={`${rubik.className} h-screen`}>
      <div className="grid w-full min-h-screen place-items-center">
        <div className="mx-auto bg-white p-3 shadow-2xl rounded-xl">
          <div className="w-full">
            <TextField
              label="Search for places.."
              variant="standard"
              className="w-full"
              size="small"
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleSubmit}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search onClick={handleData} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {icon && (
              <Image src={icon} alt="" className="w-[20rem] my-4 mx-auto" />
            )}
            <h1 className="text-3xl lg:text-5xl font-bold my-4 text-center">
              {data?.location.name},
            </h1>
            <h1 className="text-3xl lg:text-5xl font-bold my-4 text-center">
              {data?.location.country}
            </h1>
            <h2 className="text-3xl lg:text-5xl font-semibold my-4 text-center">
              {data?.current.temp_c}°C
            </h2>
            <p className="text-2xl text-slate-300 font-bold text-center">
              <span className="text-black">{formatDate(data?.location.localtime)},</span> {formatTime(data?.location.localtime)}
            </p>
            <hr className="my-4" />
            <p className="text-lg font-semibold text-center">{data?.current.condition.text}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

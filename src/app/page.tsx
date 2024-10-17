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

  const handleData = async () => {
    const key: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

    if (!key) {
      console.error('API key is missing');
      return;
    }

    try {
      const apiResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`);
      const makeData = apiResponse.data;
      const text: string = makeData?.current.condition.text;
      const is_day: number = makeData?.current.is_day;

      if (text === "Clear" || text === "Partly Sunny" || text === "Sunny") {
        setIcon(is_day === 1 ? sunnyClear.src : nightClear.src);
      } else if (text === "Partly cloudy") {
        setIcon(is_day === 1 ? sunnyPartlyCloudy.src : nightPartlyCloudy.src);
      } else if (text === "Cloudy") {
        setIcon(is_day === 1 ? sunnyCloudy.src : nightCloudy.src);
      } else if (text === "Overcast") {
        setIcon(Overcast.src);
      } else if (text === "Mist") {
        setIcon(Mist.src);
      } else if (["Patchy Rain", "Light Rain", "Moderate Rain", "Heavy Rain", "Showers"].includes(text)) {
        setIcon(Rain.src);
      } else if (text === "Thunderstorms") {
        setIcon(Thunderstorm.src);
      } else if (["Snow", "Sleet", "Ice Pellets", "Blowing Snow"].includes(text)) {
        setIcon(Snow.src);
      } else if (["Fog", "Haze", "Dust", "Ash"].includes(text)) {
        setIcon(Fog.src);
      } else if (text === "Sand") {
        setIcon(Sand.src);
      } else if (["Squalls", "Breezy"].includes(text)) {
        setIcon(Breezy.src);
      } else if (text === "Hot") {
        setIcon(Hot.src);
      } else if (text === "Cold") {
        setIcon(Cold.src);
      } else if (text === "Windy") {
        setIcon(Windy.src);
      } else {
        setIcon(is_day === 1 ? sunnyClear.src : nightClear.src);
      }

      setData(apiResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // when render
  useEffect(() => {
    handleData()
  }, [])

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
              <span className="text-black">{formatDate(data?.location.localtime ?? '')},</span> {formatTime(data?.location.localtime ?? '')}
            </p>
            <hr className="my-4" />
            <p className="text-lg font-semibold text-center">{data?.current.condition.text}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

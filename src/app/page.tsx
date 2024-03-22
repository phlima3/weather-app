"use client";

import { Loading } from "@/assets/svg/loading";
import { SearchIcon } from "@/assets/svg/search";
import { WeatherResponse } from "@/interfaces/WeatherResponse";
import api from "@/services/api";
import { KelvinToCelcius } from "@/utils/kelvinToCelcius";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const debounce = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return function (...args: any) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export default function Home() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  const getCityWeather = debounce(async (city: string) => {
    setLoading(true);

    await api
      .get(`/weather?q=${city}&appid=${API_KEY}`)
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  useEffect(() => {
    if (city && city.length > 2) {
      getCityWeather(city);
    }
  }, [city]);

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <p className="text-2xl font-medium">Olá CANAC</p>

      <div className="relative w-full flex justify-center items-center flex-col  gap-2">
        <input
          type="text"
          placeholder="Digite o nome da cidade"
          className="p-2 border mt-7 border-gray-300 rounded-md text-black"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <div className="absolute right-32 top-9">
          {loading ? <Loading /> : <SearchIcon />}
        </div>
      </div>

      <div className="mt-6 w-full items-center justify-center">
        <h1 className={`text-2xl font-bold text-center `}>Resultados:</h1>
        {weather && city.length > 2 && (
          <div className="flex justify-center items-center flex-col md:flex-row gap-2">
            <p>{weather.name}</p>
            <p>{KelvinToCelcius(weather.main.temp).toFixed(2)}Cº</p>
            <Image
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              width={50}
              height={50}
              alt={weather.weather[0].description}
            />
          </div>
        )}
      </div>
    </main>
  );
}

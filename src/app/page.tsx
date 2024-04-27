"use client"

import Container from "@/components/Container"
import NavBar from "@/components/NavBar"
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius"
import axios from "axios"
import { format } from "date-fns"
import parseISO from "date-fns/parseISO"
import Image from "next/image"
import { useQuery } from "react-query"

interface WeatherDetail {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  sys: {
    pod: string
  }
  dt_txt: string
}

interface WeatherData {
  cod: string
  message: number
  cnt: number
  list: WeatherDetail[]
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=dhaka&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      )
      return data
    }
  )

  const today = data?.list[0]

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='animate-bounce'>Loading...</p>
      </div>
    )

  return (
    <div className='flex flex-col gap-4 bg-gray-100 min-h-screen'>
      <NavBar />
      <main className='px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        <section>
          <div>
            <h2 className='flex gap-1 text-2xl items-end'>
              <p>{format(parseISO(today?.dt_txt ?? ""), "EEEE")}</p>
              <p className='text-lg'>
                ({format(parseISO(today?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <Container className=' gap-10 px-6 items-center'>
              <div className='flex flex-col px-4'>
                <span className='text-5xl'>
                  {convertKelvinToCelsius(today?.main.temp ?? 0)}°
                </span>
                <p className='text-xs space-x-1 whitespace-nowrap'>
                  <span> Feels Like </span>
                  <span>
                    {convertKelvinToCelsius(today?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className='text-xs space-x-2'>
                  <span>
                    {convertKelvinToCelsius(today?.main.temp_min ?? 0)}
                    °↓{" "}
                  </span>
                  <span>
                    {" "}
                    {convertKelvinToCelsius(today?.main.temp_max ?? 0)}
                    °↑
                  </span>
                </p>
              </div>
            </Container>
          </div>
        </section>
        <section></section>
      </main>
    </div>
  )
}

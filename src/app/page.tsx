"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCountryIndex, setCurrentCountryIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:7565/availableCountries"
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNextCountry = () => {
    setCurrentCountryIndex((prevIndex) =>
      prevIndex < data.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreviousCountry = () => {
    setCurrentCountryIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : data.length - 1
    );
  };

  const handleCountryClick = (countryCode: string) => {
    router.push(`/info?countryCode=${countryCode}`);
  };

  return (
    <main className="flex flex-col items-center flex-1 bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center text-black mb-8">
        Explore the World
      </h1>

      <div className="w-full max-w-lg mb-8">
        <select
          onChange={(e) => setCurrentCountryIndex(Number(e.target.value))}
          value={currentCountryIndex}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="" disabled>
            Select a country
          </option>
          {data.map((country, index) => (
            <option key={country.countryCode} value={index}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="w-full max-w-lg bg-white shadow-sm p-6 rounded-lg flex justify-center items-center">
          <p className="text-lg text-black">Loading...</p>
        </div>
      )}

      {error && (
        <div className="w-full max-w-lg bg-red-50 border border-red-200 text-red-600 p-4 mb-6 rounded-md">
          <p className="text-lg text-black">{error}</p>
        </div>
      )}

      <div className="w-full max-w-lg bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg h-fit">
        {data.length > 0 && (
          <div className="w-full flex flex-col items-center justify-center p-6 overflow-auto">
            <h2
              className="text-2xl font-semibold text-black mb-2 cursor-pointer"
              onClick={() =>
                handleCountryClick(data[currentCountryIndex].countryCode)
              }
            >
              {data[currentCountryIndex].name}
            </h2>
            <p className="text-lg text-black mb-4">
              Country Code: {data[currentCountryIndex].countryCode}
            </p>
            <div className="flex justify-between w-full">
              <button
                onClick={handlePreviousCountry}
                className="px-6 py-2 bg-gray-100 text-black rounded-lg shadow-sm hover:bg-gray-200 transition-all"
              >
                Previous
              </button>
              <button
                onClick={handleNextCountry}
                className="px-6 py-2 bg-gray-100 text-black rounded-lg shadow-sm hover:bg-gray-200 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {data.length === 0 && !loading && (
          <p className="text-center text-black p-6">No countries available</p>
        )}
      </div>
    </main>
  );
}

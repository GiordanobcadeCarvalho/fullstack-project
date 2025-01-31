import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import PopulationChart from "./PopulationChart";

export default function Info() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("countryCode");
  const [countryInfo, setCountryInfo] = useState<any>(null);
  const [flagData, setFlagData] = useState<any>(null);
  const [populationData, setPopulationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryCode) return;

    const fetchFlag = async () => {
      try {
        setLoading(true);
        const flagsResponse = await fetch(
          "http://localhost:7565/countriesFlag",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ countryCode }),
          }
        );

        if (!flagsResponse.ok) {
          throw new Error(`Error fetching flags: ${flagsResponse.statusText}`);
        }

        const flagsResult = await flagsResponse.json();
        setFlagData(flagsResult.data.flag || null);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    const fetchPopulation = async () => {
      try {
        setLoading(true);
        const populationResponse = await fetch(
          "http://localhost:7565/countriesPopulation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ countryCode }),
          }
        );

        if (!populationResponse.ok) {
          throw new Error(
            `Error fetching population: ${populationResponse.statusText}`
          );
        }

        const populationResult = await populationResponse.json();
        console.log(populationResult);
        setPopulationData(populationResult.data.populationCounts || []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCountryInfo = async () => {
      try {
        setLoading(true);
        const countryInfoResponse = await fetch(
          `http://localhost:7565/countryInfoUa?countryCode=${countryCode}`
        );

        if (!countryInfoResponse.ok) {
          throw new Error(
            `Error fetching country info: ${countryInfoResponse.statusText}`
          );
        }

        const countryInfoResult = await countryInfoResponse.json();
        setCountryInfo(countryInfoResult);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlag();
    fetchCountryInfo();
    fetchPopulation();
  }, [countryCode]);

  const handleBorderClick = (borderCode: string) => {
    router.push(`/info?countryCode=${borderCode}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg bg-white shadow-sm p-6 rounded-lg flex justify-center items-center">
        <p className="text-lg text-black">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-lg bg-red-50 border border-red-200 text-red-600 p-4 mb-6 rounded-md">
        <p className="text-lg text-black">{error}</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl w-full mx-auto flex flex-col items-center bg-gray-100 p-8 gap-4">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">
        Country Information
      </h1>

      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full max-w-[320px] h-full p-6 flex flex-col items-center">
          <div className="w-full mb-6">
            {flagData ? (
              <Image
                src={flagData}
                alt="Country Flag"
                className="rounded-lg object-contain shadow-md"
                width={300}
                height={200}
              />
            ) : (
              <div className="w-full h-[200px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-600">
                No Flag
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {countryInfo?.commonName || "Country Name"}
            </h2>
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Country Code:</span>{" "}
              {countryInfo?.countryCode || "N/A"}
            </p>
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Official Name:</span>{" "}
              {countryInfo?.officialName || "N/A"}
            </p>
          </div>
        </div>

        <div className="w-full flex-1 p-6 space-y-6">
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Region:</span>{" "}
            {countryInfo?.region || "N/A"}
          </p>

          <div className="text-lg text-gray-600">
            <strong>Borders:</strong>
            {countryInfo?.borders?.length > 0 ? (
              <div className="mt-2">
                <select
                  onChange={(e) => handleBorderClick(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-600"
                >
                  <option value="">Select a Border</option>
                  {countryInfo.borders.map((border: any, index: number) => (
                    <option key={index} value={border.countryCode}>
                      {border.commonName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>No borders available</p>
            )}
          </div>

          {populationData?.length > 0 && (
            <div className="max-w-[1024px] w-full h-auto">
              <PopulationChart populationCounts={populationData} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

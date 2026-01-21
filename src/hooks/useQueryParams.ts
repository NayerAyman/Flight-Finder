import { useSearchParams } from "react-router-dom";

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  cabin?: string;
  direct?: boolean;
}

export function useQueryParams() {
  const [params, setParams] = useSearchParams();

  const get = (key: string, defaultValue = "") => {
    return params.get(key) ?? defaultValue;
  };

  const getArray = (key: string): string[] => {
    const value = params.get(key);
    return value ? value.split(",") : [];
  };

  const set = (key: string, value: string | number | boolean | string[] | undefined | null) => {
    const next = new URLSearchParams(params);

    if (
      value == null ||
      value === "" ||
      value === false ||
      (Array.isArray(value) && value.length === 0)
    ) {
      next.delete(key);
    } else {
      next.set(
        key,
        Array.isArray(value) ? value.join(",") : String(value)
      );
    }

    setParams(next);
  };

  const getSearchParams = (): SearchParams => ({
    origin: get("origin", ""),
    destination: get("destination", ""),
    departureDate: get("departureDate", ""),
    returnDate: get("returnDate", ""),
    adults: Number(get("adults", "1")),
    children: Number(get("children", "0")),
    cabin: get("cabin", "ECONOMY"),
    direct: get("direct", "false") === "true",
  });

  const setSearchParams = (p: Partial<SearchParams>) => {
    Object.entries(p).forEach(([key, value]) => set(key, value));
  };

  return { get, getArray, set, getSearchParams, setSearchParams };
}
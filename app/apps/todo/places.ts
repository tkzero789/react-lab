/* Place search, reverse lookup, browser position, and recent locations for the todo location fields */

import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  keepPreviousData,
  queryOptions,
  skipToken,
  useQuery,
} from "@tanstack/react-query"
import { Todo } from "./types"

/* Photon is a free OpenStreetMap geocoder. It needs no API key, but its public server asks for fair use. */
const PHOTON_URL = "https://photon.komoot.io"
const MAX_RESULTS = 8
const MAX_RECENT = 6
export const MIN_SEARCH_LENGTH = 2

export type Coordinates = NonNullable<Todo["coordinates"]>

/* The location text and the pin that a todo saves */
export type LocationValue = {
  location: string
  coordinates: Coordinates | null
}

export type PlaceSuggestion = Coordinates & {
  id: string
  name: string
  detail: string
  /* The text that the todo saves */
  value: string
}

type PhotonProperties = {
  osm_type: string
  osm_id: number
  name?: string
  housenumber?: string
  street?: string
  city?: string
  district?: string
  locality?: string
  state?: string
}

type PhotonResponse = {
  features: {
    geometry: { coordinates: [longitude: number, latitude: number] }
    properties: PhotonProperties
  }[]
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/* One decimal is about 11 km. That is enough to rank near places, and Photon does not get the exact position. */
const roundForSearch = (point: Coordinates) => ({
  latitude: round(point.latitude, 1),
  longitude: round(point.longitude, 1),
})

/* Four decimals is about 11 m. A small drag then uses the cached address. */
const roundForAddress = (point: Coordinates) => ({
  latitude: round(point.latitude, 4),
  longitude: round(point.longitude, 4),
})

function toSuggestion(
  place: PhotonProperties,
  [longitude, latitude]: [number, number]
): PlaceSuggestion | null {
  const street = [place.housenumber, place.street].filter(Boolean).join(" ")
  const name = place.name ?? street
  if (!name) return null

  const streetDetail = street !== name ? street : undefined
  const area = place.city ?? place.district ?? place.locality
  return {
    id: `${place.osm_type}${place.osm_id}`,
    name,
    detail: [streetDetail, area, place.state].filter(Boolean).join(", "),
    value: [name, streetDetail, area].filter(Boolean).join(", "),
    latitude,
    longitude,
  }
}

async function fetchPhoton(
  path: string,
  params: Record<string, string | number>
) {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  )
  const response = await fetch(`${PHOTON_URL}${path}?${query}`)
  if (!response.ok) throw new Error(`Place search error ${response.status}`)

  const data = (await response.json()) as PhotonResponse
  const places = data.features.flatMap(({ properties, geometry }) => {
    const place = toSuggestion(properties, geometry.coordinates)
    return place ? [place] : []
  })
  /* OpenStreetMap often maps one store as a point and as a building, so Photon returns it twice */
  return places.filter(
    (place, index) =>
      places.findIndex((other) => other.value === place.value) === index
  )
}

function searchPlaces(term: string, near: Coordinates | null) {
  return fetchPhoton("/api", {
    q: term,
    limit: MAX_RESULTS,
    lang: "en",
    ...(near ? { lat: near.latitude, lon: near.longitude } : {}),
  })
}

async function findAddress(point: Coordinates) {
  const [place] = await fetchPhoton("/reverse", {
    lat: point.latitude,
    lon: point.longitude,
    lang: "en",
    limit: 1,
  })
  return place ?? null
}

function readPosition(options: PositionOptions) {
  return new Promise<Coordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      reject,
      options
    )
  })
}

/* Read a cached fix only when the user already allows it, so nothing prompts before a user action */
async function getLastPosition(): Promise<Coordinates | null> {
  const permission = await navigator.permissions
    ?.query({ name: "geolocation" })
    .catch(() => null)
  if (permission?.state !== "granted") return null
  return readPosition({ maximumAge: Infinity, timeout: 3000 }).catch(() => null)
}

export const placeQueries = {
  lastPosition: () =>
    queryOptions({
      queryKey: ["todo", "last-position"],
      queryFn: getLastPosition,
      staleTime: 15 * 60_000,
    }),
  /* Undefined near means the position check has not finished */
  search: (term: string, near: Coordinates | null | undefined) => {
    const point = near ? roundForSearch(near) : near
    return queryOptions({
      queryKey: [
        "todo",
        "place-search",
        term,
        point?.latitude,
        point?.longitude,
      ],
      queryFn:
        term.length >= MIN_SEARCH_LENGTH && point !== undefined
          ? () => searchPlaces(term, point)
          : skipToken,
      staleTime: Infinity,
      placeholderData: keepPreviousData,
    })
  },
  address: (near: Coordinates | null) => {
    const point = near ? roundForAddress(near) : null
    return queryOptions({
      queryKey: ["todo", "place-address", point?.latitude, point?.longitude],
      queryFn: point ? () => findAddress(point) : skipToken,
      staleTime: Infinity,
    })
  },
}

/* Undefined near means the position check has not finished */
export function usePlaceSearch(
  query: string,
  near: Coordinates | null | undefined
) {
  const term = useDebouncedValue(query, 300)
  const search = useQuery(placeQueries.search(term, near))

  return {
    places: search.data,
    isError: search.isError,
    /* The debounce and the position check delay the request. Show the spinner, not an empty result. */
    isLoading:
      !search.data &&
      (term !== query || near === undefined || search.isFetching),
  }
}

const POSITION_ERRORS: Record<number, string> = {
  1: "Location access is blocked. Allow it in the site settings of your browser.",
  2: "Your position is not available",
  3: "Finding your position took too long",
}

/* Call it only from a user action, so the browser prompt has context */
export async function getCurrentPosition() {
  try {
    return await readPosition({ enableHighAccuracy: true, timeout: 10_000 })
  } catch (error) {
    const code = (error as GeolocationPositionError).code
    throw new Error(POSITION_ERRORS[code] ?? "Your position is not available")
  }
}

/* Google Maps also finds a place from coordinates in this form */
export function formatCoordinates({ latitude, longitude }: Coordinates) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}

/* Newest first, without duplicates */
export function recentLocations(todos: Todo[]): LocationValue[] {
  const seen = new Set<string>()
  return [...todos]
    .sort((a, b) => b._creationTime - a._creationTime)
    .flatMap((todo) => {
      const location = todo.location.trim()
      if (!location || seen.has(location)) return []
      seen.add(location)
      return [{ location, coordinates: todo.coordinates ?? null }]
    })
    .slice(0, MAX_RECENT)
}

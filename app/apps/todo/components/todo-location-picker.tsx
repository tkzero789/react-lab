"use client"

/* Map body and footer of the location dialog. A click places the pin, and a drag moves it. */

import "maplibre-gl/dist/maplibre-gl.css"
import {
  Map as MapView,
  Marker,
  type MapLayerMouseEvent,
  type MapRef,
  type MarkerDragEvent,
  type ViewStateChangeEvent,
} from "@vis.gl/react-maplibre"
import { useMutation, useQuery } from "@tanstack/react-query"
import { setWorkerUrl } from "maplibre-gl"
import {
  ClockIcon,
  LocateFixedIcon,
  MapPinIcon,
  MinusIcon,
  PenLineIcon,
  PlusIcon,
  SearchIcon,
  type LucideIcon,
} from "lucide-react"
import React from "react"
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/ui/autocomplete"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DialogFooter } from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme/theme-provider"
import { todoQueries } from "@/lib/query-options"
import { toast } from "@/lib/toast"
import {
  formatCoordinates,
  getCurrentPosition,
  MIN_SEARCH_LENGTH,
  placeQueries,
  recentLocations,
  usePlaceSearch,
  type Coordinates,
  type LocationValue,
  type PlaceSuggestion,
} from "../places"

/* MapLibre looks for its worker next to its own module. The bundler moves that module, so give the URL of the emitted worker file. */
setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href
)

/* OpenFreeMap serves OpenStreetMap tiles with no API key. The tile.openstreetmap.org policy does not allow app use. */
const MAP_STYLES = {
  light: "https://tiles.openfreemap.org/styles/liberty",
  dark: "https://tiles.openfreemap.org/styles/dark",
}
const STREET_ZOOM = 16
/* Below this zoom, one click covers too much ground to name one place */
const MIN_PICK_ZOOM = 12
const WORLD_VIEW = { longitude: 0, latitude: 20, zoom: 1 }

type SearchItem = {
  id: string
  icon: LucideIcon
  title: string
  detail?: string
  value: LocationValue
  /* An item with a place moves the pin. An item without one saves its text at once. */
  place: PlaceSuggestion | null
}

type SearchGroup = {
  id: string
  label?: string
  items: SearchItem[]
}

type Props = {
  initial: LocationValue
  /* The last known position of the user, for a todo without a pin */
  start: Coordinates | null
  onPick: (value: LocationValue) => void
}

export default function TodoLocationPicker({ initial, start, onPick }: Props) {
  const { resolvedTheme } = useTheme()
  const mapRef = React.useRef<MapRef>(null)
  const searchRef = React.useRef<HTMLDivElement>(null)

  const [view, setView] = React.useState<{
    center: Coordinates
    zoom: number
  } | null>(null)
  const [pin, setPin] = React.useState(initial.coordinates)
  /* A saved or searched place keeps its own name, because the address at the point can name a neighbor */
  const [chosen, setChosen] = React.useState<PlaceSuggestion | null>(
    initial.coordinates
      ? {
          id: "initial",
          name: initial.location,
          detail: "",
          value: initial.location,
          ...initial.coordinates,
        }
      : null
  )
  const address = useQuery(placeQueries.address(chosen ? null : pin))

  const [text, setText] = React.useState("")
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const query = text.trim()
  /* Rank the results near the part of the map that is in view */
  const search = usePlaceSearch(
    query,
    view?.center ?? initial.coordinates ?? start
  )
  const { data: recent = [] } = useQuery({
    ...todoQueries.list(),
    select: recentLocations,
  })

  const groups: SearchGroup[] = (
    query
      ? [
          {
            id: "typed",
            items: [
              {
                id: "typed",
                icon: PenLineIcon,
                title: `Use “${query}”`,
                detail: "Save the text as you typed it",
                value: { location: query, coordinates: null },
                place: null,
              },
            ],
          },
          {
            id: "places",
            label: "Suggestions",
            items:
              query.length >= MIN_SEARCH_LENGTH
                ? (search.places ?? []).map((place) => ({
                    id: place.id,
                    icon: MapPinIcon,
                    title: place.name,
                    detail: place.detail,
                    value: {
                      location: place.value,
                      coordinates: {
                        latitude: place.latitude,
                        longitude: place.longitude,
                      },
                    },
                    place,
                  }))
                : [],
          },
        ]
      : [
          {
            id: "recent",
            label: "Recent",
            items: recent.map((item) => ({
              id: item.location,
              icon: ClockIcon,
              title: item.location,
              value: item,
              place: item.coordinates
                ? {
                    id: item.location,
                    name: item.location,
                    detail: "",
                    value: item.location,
                    ...item.coordinates,
                  }
                : null,
            })),
          },
        ]
  ).filter((group) => group.items.length > 0)

  const locate = useMutation({
    mutationFn: getCurrentPosition,
    onSuccess: (position) => placePin(position),
    onError: (error) => toast.error(error.message),
  })

  function flyTo({ latitude, longitude }: Coordinates, zoom: number) {
    mapRef.current?.flyTo({ center: [longitude, latitude], zoom })
  }

  function placePin(
    { latitude, longitude }: Coordinates,
    place: PlaceSuggestion | null = null
  ) {
    /* A PlaceSuggestion also fits Coordinates, but the Convex validator rejects its extra fields */
    const point = { latitude, longitude }
    setPin(point)
    setChosen(place)
    flyTo(point, Math.max(mapRef.current?.getZoom() ?? 0, STREET_ZOOM))
  }

  function chooseItem(item: SearchItem) {
    setText("")
    if (item.place) placePin(item.place, item.place)
    else onPick(item.value)
  }

  function onMapClick(event: MapLayerMouseEvent) {
    const point = { latitude: event.lngLat.lat, longitude: event.lngLat.lng }
    if (event.target.getZoom() < MIN_PICK_ZOOM) {
      flyTo(point, MIN_PICK_ZOOM + 3)
      return
    }
    setPin(point)
    setChosen(null)
  }

  function onMarkerDragEnd(event: MarkerDragEvent) {
    setPin({ latitude: event.lngLat.lat, longitude: event.lngLat.lng })
    setChosen(null)
  }

  function onMoveEnd(event: ViewStateChangeEvent) {
    const { latitude, longitude, zoom } = event.viewState
    setView({ center: { latitude, longitude }, zoom })
  }

  const startPoint = initial.coordinates ?? start
  const initialViewState = startPoint
    ? { ...startPoint, zoom: STREET_ZOOM }
    : WORLD_VIEW

  const place: PlaceSuggestion | null =
    chosen ??
    (pin && !address.isPending
      ? (address.data ?? {
          id: "pin",
          name: "Dropped pin",
          detail: formatCoordinates(pin),
          value: formatCoordinates(pin),
          ...pin,
        })
      : null)
  const zoom = view?.zoom ?? initialViewState.zoom
  const isZoomedOut = zoom < MIN_PICK_ZOOM

  function submit() {
    if (place && pin) onPick({ location: place.value, coordinates: pin })
  }

  return (
    <>
      <div
        className="relative min-h-0 flex-1 overflow-hidden border-t"
        onKeyDown={(e) => {
          /* Enter on the focused map confirms the pin. Enter on a button keeps its own action. */
          if (e.key === "Enter" && e.target === mapRef.current?.getCanvas()) {
            e.preventDefault()
            submit()
          }
        }}
      >
        <MapView
          ref={mapRef}
          initialViewState={initialViewState}
          mapStyle={
            resolvedTheme === "dark" ? MAP_STYLES.dark : MAP_STYLES.light
          }
          attributionControl={false}
          /* A double click fires two clicks, so it moves the pin before it zooms. The buttons and the wheel zoom. */
          doubleClickZoom={false}
          /* Rotation and tilt do not help to place a pin, and a tilted map hides the street names */
          dragRotate={false}
          pitchWithRotate={false}
          touchPitch={false}
          cursor={isZoomedOut ? "zoom-in" : "crosshair"}
          onClick={onMapClick}
          onMoveEnd={onMoveEnd}
        >
          {pin ? (
            <Marker
              longitude={pin.longitude}
              latitude={pin.latitude}
              anchor="bottom"
              draggable
              onDragEnd={onMarkerDragEnd}
            >
              <MapPinIcon
                aria-hidden
                className="size-10 cursor-grab fill-brand text-background drop-shadow-sm"
              />
            </Marker>
          ) : null}
        </MapView>

        <div className="absolute inset-x-3 top-3 sm:right-auto sm:w-80">
          <Autocomplete
            items={groups}
            value={text}
            onValueChange={(next, { reason }) => {
              /* The item click handles the item. Do not copy its title into the search. */
              if (reason !== "item-press") setText(next)
            }}
            open={isSearchOpen && groups.length > 0}
            onOpenChange={setIsSearchOpen}
            itemToStringValue={(item: SearchItem) => item.title}
            filter={null}
            openOnInputClick
          >
            <InputGroup
              ref={searchRef}
              className="bg-background shadow-md ring-1 ring-border"
            >
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <AutocompleteInput
                autoFocus
                aria-label="Search or type a place"
                placeholder="Search or type a place"
              />
            </InputGroup>
            <AutocompleteContent anchor={searchRef}>
              <AutocompleteList>
                {(group: SearchGroup) => (
                  <AutocompleteGroup key={group.id} items={group.items}>
                    {group.label ? (
                      <AutocompleteLabel>{group.label}</AutocompleteLabel>
                    ) : null}
                    <AutocompleteCollection>
                      {(item: SearchItem) => (
                        <AutocompleteItem
                          key={item.id}
                          value={item}
                          onClick={() => chooseItem(item)}
                        >
                          <item.icon />
                          <ItemText title={item.title} detail={item.detail} />
                        </AutocompleteItem>
                      )}
                    </AutocompleteCollection>
                  </AutocompleteGroup>
                )}
              </AutocompleteList>
              <AutocompleteStatus>
                {query.length < MIN_SEARCH_LENGTH ? null : search.isLoading ? (
                  <>
                    <Spinner />
                    Searching…
                  </>
                ) : search.isError ? (
                  "Search is not available. Check your connection."
                ) : search.places?.length === 0 ? (
                  "No places found. Use the text you typed instead."
                ) : null}
              </AutocompleteStatus>
            </AutocompleteContent>
          </Autocomplete>
        </div>

        <div className="absolute right-3 bottom-3 flex flex-col items-end gap-2">
          <MapButton
            label="My location"
            disabled={locate.isPending}
            onClick={() => locate.mutate()}
          >
            {locate.isPending ? <Spinner /> : <LocateFixedIcon />}
          </MapButton>
          <ButtonGroup orientation="vertical">
            <MapButton label="Zoom in" onClick={() => mapRef.current?.zoomIn()}>
              <PlusIcon />
            </MapButton>
            <MapButton
              label="Zoom out"
              onClick={() => mapRef.current?.zoomOut()}
            >
              <MinusIcon />
            </MapButton>
          </ButtonGroup>
        </div>

        {/* The OpenStreetMap license requires visible attribution */}
        <div className="absolute bottom-2 left-2 flex gap-1.5 rounded-xs bg-background px-1.5 py-0.5 text-xs text-muted-foreground">
          <Attribution href="https://openfreemap.org">OpenFreeMap</Attribution>
          <Attribution href="https://www.openmaptiles.org">
            © OpenMapTiles
          </Attribution>
          <Attribution href="https://www.openstreetmap.org/copyright">
            © OpenStreetMap
          </Attribution>
        </div>
      </div>

      <DialogFooter className="flex-wrap items-center justify-end border-t">
        <div
          aria-live="polite"
          className="flex min-h-10 w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1"
        >
          {place ? (
            <>
              <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
              <ItemText title={place.name} detail={place.detail} />
            </>
          ) : pin ? (
            <div className="flex w-full flex-col gap-2">
              <span className="text-muted-foreground">
                Finding the address…
              </span>
              <Skeleton className="h-3 w-3/5 rounded-full" />
            </div>
          ) : (
            <span className="text-muted-foreground">
              {isZoomedOut
                ? "Click the map to zoom in, or search for a place"
                : "Click the map to place the pin"}
            </span>
          )}
        </div>
        {initial.location ? (
          <Button
            variant="ghost-destructive"
            onClick={() => onPick({ location: "", coordinates: null })}
          >
            Remove
          </Button>
        ) : null}
        <Button disabled={!place} onClick={submit}>
          Use this location
        </Button>
      </DialogFooter>
    </>
  )
}

function ItemText({ title, detail }: { title: string; detail?: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="truncate">{title}</span>
      {detail ? (
        <span className="truncate text-xs text-muted-foreground">{detail}</span>
      ) : null}
    </span>
  )
}

function MapButton({
  label,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={label}
            className="shadow-md"
            {...props}
          />
        }
      />
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  )
}

function Attribution({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hover:text-foreground active:text-foreground"
    >
      {children}
    </a>
  )
}

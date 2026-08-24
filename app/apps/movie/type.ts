/**
 * Types for the vsmov.com API (https://vsmov.com/api).
 *
 * Every object below lists its fields in the exact order the API returns them.
 * The published docs at /api-document still say "Đang cập nhật..." for the
 * parameter and response sections, so these shapes were derived from live
 * responses.
 */

/**
 * A URL string — except the API occasionally serialises a missing image as an
 * empty object instead of null. Run it through `imageUrl()` to narrow it.
 */
export type MovieImage = string | Record<string, never>

/** Allows the documented values to autocomplete without closing the union. */
type Open<T extends string> = T | (string & {})

/** `single` for films, `series` for anything with episodes. */
export type MovieType = Open<"single" | "series">

/** Publication state of a title. */
export type MovieStatus = Open<"completed" | "ongoing" | "trailer">

// ---------------------------------------------------------------------------
// Shared sub-objects
// ---------------------------------------------------------------------------

/** Note `vote_average` arrives as a string ("7.2"), not a number. */
export type MovieTmdb = {
  type: Open<"movie" | "tv">
  id: string
  season: number | null
  vote_average: string
  vote_count: number
}

export type MovieImdb = {
  id: string | null
}

export type MovieTimestamp = {
  time: string
}

/** Genres and countries embedded in a movie use `id`, not `_id`. */
export type MovieTaxonomyRef = {
  id: number
  name: string
  slug: string
}

// ---------------------------------------------------------------------------
// List endpoints
// ---------------------------------------------------------------------------

/**
 * The item shape shared by every list endpoint — `/danh-sach/{slug}`,
 * `/the-loai/{slug}`, `/quoc-gia/{slug}`, `/nam/{slug}` and `/tim-kiem`.
 *
 * These ten fields are all a list returns. There is no `type`, `quality`,
 * `time`, `episode_current` or `category` here; those live on the detail
 * endpoint only.
 */
export type MovieListItem = {
  tmdb: MovieTmdb
  imdb: MovieImdb
  modified: MovieTimestamp
  _id: number
  name: string
  origin_name: string
  slug: string
  poster_url: MovieImage
  thumb_url: MovieImage
  year: number
}

/** `totalItemsPerPage` comes back as a string whenever `limit` is supplied. */
export type MoviePagination = {
  totalItems: number
  totalItemsPerPage: number | string
  currentPage: number
  totalPages: number
}

/** `pathImage` is only present on `/danh-sach/phim-moi-cap-nhat`. */
export type MovieListResponse = {
  status: boolean
  items: MovieListItem[]
  pathImage?: string
  pagination: MoviePagination
}

// ---------------------------------------------------------------------------
// Detail endpoint — /api/phim/{slug}
// ---------------------------------------------------------------------------

export type MovieDetail = {
  tmdb: MovieTmdb
  imdb: MovieImdb
  created: MovieTimestamp
  modified: MovieTimestamp
  _id: number
  name: string
  origin_name: string
  slug: string
  content: string
  type: MovieType
  status: MovieStatus
  poster_url: MovieImage
  thumb_url: MovieImage
  trailer_url: string | null
  /** Runtime in minutes, as a string ("86"). */
  time: string
  episode_current: string
  episode_total: string | null
  quality: string
  lang: string
  notify: string | null
  showtimes: string | null
  year: number
  keywords: string[]
  view: number
  chieurap: boolean
  sub_docquyen: boolean
  actor: string[]
  director: string[]
  category: MovieTaxonomyRef[]
  country: MovieTaxonomyRef[]
}

/** One playable source. The old `link_m3u8` field is no longer returned. */
export type MovieEpisodeSource = {
  name: string
  slug: string
  filename: string
  link_embed: string
}

export type MovieEpisodeServer = {
  server_name: string
  server_data: MovieEpisodeSource[]
}

export type MovieDetailResponse = {
  status: boolean
  msg: string
  movie: MovieDetail
  episodes: MovieEpisodeServer[]
}

// ---------------------------------------------------------------------------
// Taxonomy endpoints — /api/the-loai, /api/quoc-gia, /api/nam, /api/dien-vien
// ---------------------------------------------------------------------------

/** `/api/nam` returns `_id` as a string ("2050"); the others use a number. */
export type MovieTaxonomyItem = {
  _id: number | string
  name: string
  slug: string
}

export type MovieCastMember = {
  _id: number
  name: string
  slug: string
  thumb_url: string | null
}

/**
 * Taxonomy endpoints use a different envelope from the list endpoints:
 * `{ status: "success", message, data: { items } }`.
 */
export type MovieTaxonomyResponse<T = MovieTaxonomyItem> = {
  status: string
  message: string
  data: {
    items: T[]
  }
}

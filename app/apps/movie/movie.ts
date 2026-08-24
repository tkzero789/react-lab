import type {
  MovieCastMember,
  MovieDetailResponse,
  MovieImage,
  MovieListResponse,
  MovieTaxonomyItem,
  MovieTaxonomyResponse,
  MovieTmdb,
  MovieType,
} from "./type"

export const MOVIE_API = "https://vsmov.com/api"

/**
 * The browse tabs, and the endpoint behind each one.
 *
 * Single source of truth for the `[type]` route segment, the nav and the menu.
 * Only `phim-moi-cap-nhat`, `phim-moi`, `phim-le`, `phim-bo`, `phim-chieu-rap`
 * and `subteam` exist under `/danh-sach/`; animation is a genre, so it comes
 * from `/the-loai/hoat-hinh` instead.
 */
export const MOVIE_BROWSE = [
  { segment: "single", title: "Single", path: "danh-sach/phim-le" },
  { segment: "series", title: "Series", path: "danh-sach/phim-bo" },
  { segment: "animation", title: "Animation", path: "the-loai/hoat-hinh" },
  { segment: "cinema", title: "Cinema", path: "danh-sach/phim-chieu-rap" },
] as const

export type MovieBrowseSegment = (typeof MOVIE_BROWSE)[number]["segment"]

export function getBrowseTab(segment: string | undefined) {
  return MOVIE_BROWSE.find((tab) => tab.segment === segment)
}

/**
 * Poster and thumbnail URLs are absolute, so there is no CDN origin to join.
 * The only wrinkle is that a missing image serialises as `{}` rather than null.
 */
export function imageUrl(value: MovieImage | null | undefined) {
  return typeof value === "string" && value.length > 0 ? value : null
}

/**
 * List items carry no `type` field, so the route segment has to come from
 * somewhere else: the browse tab the item was listed under when we know it,
 * and TMDB's own kind ("movie" / "tv") otherwise.
 */
export function movieTypeSegment(
  type: MovieType | undefined,
  tmdb?: Pick<MovieTmdb, "type">
): MovieBrowseSegment {
  if (type === "series") return "series"
  if (type === "single") return "single"
  return tmdb?.type === "tv" ? "series" : "single"
}

/** "Tập 12" → "12"; "Hoàn Tất (40/40)" → "40"; "Full"/unknown → null. */
export function getTotalEpisodes(episodeCurrent: string | undefined) {
  const completed = episodeCurrent?.match(/\(\s*\d+\s*\/\s*(\d+)\s*\)/)
  if (completed) return completed[1]
  return episodeCurrent?.match(/\d+/)?.[0] ?? null
}

/** Server names arrive with embedded newlines and padding ("Vietsub\r\n    #1"). */
export function cleanServerName(name: string) {
  return name.replace(/\s+/g, " ").trim()
}

/** `vote_average` is a string, and "0.0" means "not rated" rather than zero. */
export function movieRating(tmdb: Pick<MovieTmdb, "vote_average"> | undefined) {
  const rating = Number(tmdb?.vote_average)
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : null
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${MOVIE_API}/${path}`, {
    ...init,
    headers: { accept: "application/json", ...init?.headers },
  })
  if (!response.ok) {
    throw new Error(`vsmov responded ${response.status} for /${path}`)
  }
  return (await response.json()) as T
}

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value))
  }
  const search = query.toString()
  return search ? `${path}?${search}` : path
}

export type MovieListParams = {
  page?: number
  limit?: number
  year?: number
  country?: string
  type?: string
  status?: string
}

/** Newest updates — powers the home banner. */
export function fetchLatestMovies(
  params: MovieListParams = {},
  init?: RequestInit
) {
  return request<MovieListResponse>(
    withQuery("danh-sach/phim-moi-cap-nhat", { page: 1, ...params }),
    init
  )
}

/**
 * Any list endpoint. `path` is a `MOVIE_BROWSE` path such as
 * "danh-sach/phim-le" or "the-loai/hoat-hinh" — both return the same envelope.
 */
export function fetchMovieList(
  path: string,
  params: MovieListParams = {},
  init?: RequestInit
) {
  return request<MovieListResponse>(withQuery(path, params), init)
}

export function fetchMovieDetail(slug: string, init?: RequestInit) {
  return request<MovieDetailResponse>(`phim/${slug}`, init)
}

export function searchMovies(
  keyword: string,
  params: MovieListParams = {},
  init?: RequestInit
) {
  return request<MovieListResponse>(
    withQuery("tim-kiem", { keyword, ...params }),
    init
  )
}

async function fetchTaxonomy(path: string, init?: RequestInit) {
  const data = await request<MovieTaxonomyResponse>(path, init)
  return data.data.items
}

export function fetchCategories(init?: RequestInit): Promise<MovieTaxonomyItem[]> {
  return fetchTaxonomy("the-loai", init)
}

export function fetchCountries(init?: RequestInit): Promise<MovieTaxonomyItem[]> {
  return fetchTaxonomy("quoc-gia", init)
}

export function fetchYears(init?: RequestInit): Promise<MovieTaxonomyItem[]> {
  return fetchTaxonomy("nam", init)
}

/**
 * The full cast index. Be careful: this endpoint ignores `page`, `limit` and
 * `keyword`, and always returns every actor — roughly 22MB. Never call it from
 * a client component; fetch it on the server and cache it.
 */
export async function fetchCast(init?: RequestInit) {
  const data = await request<MovieTaxonomyResponse<MovieCastMember>>(
    "dien-vien",
    init
  )
  return data.data.items
}

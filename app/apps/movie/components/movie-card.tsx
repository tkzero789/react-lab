import Image from "next/image"
import Link from "next/link"
import { StarIcon } from "lucide-react"

import { pathClient } from "@/lib/path-client"
import { imageUrl, movieRating, movieTypeSegment } from "../movie"
import type { MovieBrowseSegment } from "../movie"
import type { MovieListItem } from "../type"

type Props = {
  movie: MovieListItem
  /**
   * The route segment this list was browsed under. List items carry no `type`
   * field, so without it the segment falls back to TMDB's kind.
   */
  segment?: MovieBrowseSegment
}

export default function MovieCard({ movie, segment }: Props) {
  const poster = imageUrl(movie.poster_url) ?? imageUrl(movie.thumb_url)
  const rating = movieRating(movie.tmdb)
  const href = pathClient(
    `/apps/movie/${segment ?? movieTypeSegment(undefined, movie.tmdb)}/${movie.slug}`
  )

  return (
    <Link href={href} title={movie.name} className="group">
      <div className="relative h-64 overflow-hidden rounded-xl bg-muted min-[425px]:h-80 sm:h-72 lg:h-88">
        {poster ? (
          <Image
            src={poster}
            alt={movie.name}
            fill
            sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 50vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          />
        ) : null}
        <div className="absolute right-2 bottom-2 left-2 flex flex-col gap-1 rounded-xl bg-secondary/50 p-2 text-secondary-foreground backdrop-blur-xs dark:bg-muted/50 dark:text-foreground">
          {/* Name */}
          <div className="truncate text-sm font-medium lg:text-lg">
            {movie.name}
          </div>
          {movie.origin_name ? (
            <div className="truncate text-xs opacity-80 lg:text-sm">
              {movie.origin_name}
            </div>
          ) : null}
          {/* Additional details */}
          <div className="flex items-center gap-2">
            <div className="text-sm lg:text-base">{movie.year}</div>
            {rating ? (
              <>
                <div className="-translate-y-px">|</div>
                <div className="flex items-center gap-1 text-sm lg:text-base">
                  <StarIcon className="size-3.5 fill-current" />
                  {rating}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

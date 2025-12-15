import React from "react";

type Props = {
  source: string;
};

export default function EpisodeVideo({ source }: Props) {
  return (
    <iframe
      src={source}
      width="100%"
      height="800px"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      className="h-[400px] rounded-xl lg:h-[800px]"
    ></iframe>
  );
}

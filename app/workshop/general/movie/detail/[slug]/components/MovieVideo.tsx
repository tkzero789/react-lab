import React from "react";

type Props = {
  source: string;
};

export default function MovieVideo({ source }: Props) {
  return (
    <iframe
      src={source}
      width="100%"
      height="800px"
      frameBorder="0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      className="rounded-xl"
    ></iframe>
  );
}

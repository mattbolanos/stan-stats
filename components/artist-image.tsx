import { SelectedArtist } from "@/lib/types";
import Image from "next/image";

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export const ArtistImage = ({ artist }: { artist: SelectedArtist }) => {
  return (
    <Image
      src={artist.image}
      alt={artist.name}
      width={90}
      height={90}
      placeholder="blur"
      blurDataURL={rgbDataURL(23, 23, 23)}
      className="max-w-[90px] max-h-[90px] min-w-[90px] min-h-[90px] rounded-md border-gray-700 border-x border-y"
    />
  );
};

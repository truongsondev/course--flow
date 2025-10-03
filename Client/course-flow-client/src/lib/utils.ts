import authenService from "@/services/authen.service";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ImageKit from "imagekit-javascript";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createObjectURL = (file: File | string | undefined) => {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  return file;
};

export const uploadFileToCloud = async (
  file: File | string | undefined,
  typeFile: string
) => {
  if (!file) return;

  const authToken = await authenService.getSignedUrl();

  const ik = new ImageKit({
    publicKey: "public_bMW1GgqTUywDdbi7kL18vJuEjQw=",
    urlEndpoint: "https://ik.imagekit.io/mox5qz4rl",
  });

  const authData = authToken?.data.data;

  try {
    const result = await ik.upload({
      file,
      fileName: typeof file === "string" ? "file" : file.name,
      signature: authData.signature,
      expire: authData.expire,
      token: authData.token,
      folder: `/courses/${typeFile}`,
    });

    return result;
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
};

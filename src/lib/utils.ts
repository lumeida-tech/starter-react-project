import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { redirect, useNavigate } from '@tanstack/react-router'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export type Area = { x: number; y: number; width: number; height: number }

export function copyContent(content: any) {
  navigator.clipboard.writeText(content)
  toast.success("Copié !")
}

export interface CustomHookProps {
  state: any,
  handlers: any,
  mutations: any ,
  ref: any,
  form: any
}

/**
 * Convert a FormData object to an object
 * @param formData - The FormData object to convert
 * @returns The converted object
 */
export function formDataToObject(formData: FormData) {
  const object: any = {};
  for (const [key, value] of formData.entries()) {
    object[key] = value;
  }
  return object;
}

/**
 * Convert an object to a FormData object
 * @param object - The object to convert
 * @returns The converted FormData object
 */
export function objectToFormData(object: Record<string, any>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(object)) {
    formData.append(key, value);
  }
  return formData;
}

/**
 * Open a new window
 * @param url - The URL to open
 */
export const openWindow = (url: string) => {
  const navigate = useNavigate();
  const width = 500;
  const height = 600;
  const allowedOrigin = import.meta.env.VITE_APP_URL;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    url,
    "_blank",
    `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars=yes,status=1`
  );

  const messageHandler = (event: MessageEvent) => {
    if (event.origin !== allowedOrigin) return;
    
    window.removeEventListener("message", messageHandler); // clean up
    
    if(window.location.pathname.split('/')[3] === 'account') {
      //return navigate({to: `/cart/facturation`});
    }

    if(window.location.pathname.split('/')[4] === 'account') {
      //return navigate({to: `/checkout/${window.location.pathname.split('/')[3]}/facturation`});
    }
    
    navigateTo("customer/dashboard");
  };

  // Listen for message from popup
  window.addEventListener("message", messageHandler, { once: true }); // once ensures it's removed after firing
};

// Helper function to create a cropped image blob
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Needed for canvas Tainted check
    image.src = url;
  });

/**
 * Get a cropped image
 * @param imageSrc - The source image URL
 * @param pixelCrop - The pixel crop area
 * @param outputWidth - The output width
 * @param outputHeight - The output height
 * @returns The cropped image blob
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width,
  outputHeight: number = pixelCrop.height,
  quality: number = 0.92,
  filename: string = "cropped-image.jpg" // Nom de fichier avec extension
): Promise<File | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Impossible d'obtenir le contexte 2D du canvas");
      return null;
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Fond blanc pour JPEG
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    // Créer un File au lieu d'un Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Convertir le Blob en File avec un nom et extension
            const file = new File([blob], filename, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(file);
          } else {
            console.error("Échec de la création du blob");
            reject(new Error("Impossible de créer le blob"));
          }
        },
        "image/jpeg",
        quality
      );
    });
  } catch (error) {
    console.error("Erreur dans getCroppedImg:", error);
    return null;
  }
}

export async function authMiddleware(gard: 'auth' | 'panel') {
  const response =  await fetch('/api/auth/info', {
    credentials: 'include',
  }).catch(() => null) 

  switch (gard) {
    case 'auth':
      if (response?.status === 200) {
        throw redirect({
          to: '/$lang/customer/dashboard',
          params: { lang: 'fr' }, // Langue par défaut
        })
      }
      break;
    case 'panel':
      if (response?.status === 401) {
        throw redirect({
          to: '/$lang/sign-in',
          params: { lang: 'fr' }, // Langue par défaut
        })
      }
      break;
    default:
      break;
  }
}

export function navigateTo(path: string, params?: any) {
  const lang = localStorage.getItem('preferred-lang') || 'fr';
  const navigate = useNavigate();
  return navigate({ to: `/$lang/${path}`, params: { lang, ...params } });
}

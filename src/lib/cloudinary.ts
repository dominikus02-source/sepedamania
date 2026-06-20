import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  image: string,
  folder: string = 'sepedamania'
): Promise<string> {
  const result = await cloudinary.uploader.upload(image, {
    folder,
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  });
  return result.secure_url;
}

export async function uploadImages(
  images: string[],
  folder?: string
): Promise<string[]> {
  const uploads = images.map((img) => uploadImage(img, folder));
  return Promise.all(uploads);
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

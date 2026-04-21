import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function extensionFromMimeType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadImageFile({
  file,
  schoolId,
  folder
}: {
  file: File | null;
  schoolId: string;
  folder: "images" | "news" | "ppdb";
}) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP files are allowed.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Maximum upload size is 5MB.");
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${schoolId}/${folder}/${randomUUID()}.${extensionFromMimeType(file.type)}`;
  const supabase = createAdminClient();

  const { error } = await supabase.storage.from("images").upload(filePath, fileBuffer, {
    contentType: file.type,
    upsert: true,
    cacheControl: "3600"
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("images").getPublicUrl(filePath);

  return publicUrl;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { WEBSITE_SETTING_FIELDS } from "@/lib/data";
import { uploadImageFile } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";
import { requireTenant } from "@/lib/tenant";
import {
  gallerySchema,
  loginSchema,
  newsSchema,
  paymentSchema,
  ppdbSchema,
  studentSchema,
  websiteSettingsSchema
} from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const supabase = createClient();
  const payload = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  const { error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createNewsAction(formData: FormData) {
  await requireAuth(["super_admin", "admin"]);
  const supabase = createClient();
  const tenant = await requireTenant();
  const payload = newsSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content")
  });
  const coverUrl = await uploadImageFile({
    file: formData.get("cover_image") as File | null,
    schoolId: tenant.id,
    folder: "news"
  });

  const { error } = await supabase.from("news").insert({
    school_id: tenant.id,
    ...payload,
    cover_url: coverUrl,
    published_at: new Date().toISOString()
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/news");
}

export async function createStudentAction(formData: FormData) {
  await requireAuth(["super_admin", "admin", "teacher"]);
  const supabase = createClient();
  const tenant = await requireTenant();
  const payload = studentSchema.parse({
    nis: formData.get("nis"),
    full_name: formData.get("full_name"),
    grade: formData.get("grade"),
    class_name: formData.get("class_name"),
    guardian_name: formData.get("guardian_name"),
    guardian_phone: formData.get("guardian_phone")
  });

  const { error } = await supabase.from("students").insert({
    school_id: tenant.id,
    ...payload,
    status: "active"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/students");
}

export async function createPPDBAction(formData: FormData) {
  const supabase = createClient();
  const tenant = await requireTenant();
  const payload = ppdbSchema.parse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    previous_school: formData.get("previous_school")
  });
  const documentUrl = await uploadImageFile({
    file: formData.get("document") as File | null,
    schoolId: tenant.id,
    folder: "ppdb"
  });

  const registrationNo = `PPDB-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const { error } = await supabase.from("ppdb").insert({
    school_id: tenant.id,
    ...payload,
    registration_no: registrationNo,
    status: "pending",
    document_url: documentUrl
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/ppdb");
}

export async function createPaymentAction(formData: FormData) {
  await requireAuth(["super_admin", "admin"]);
  const supabase = createClient();
  const tenant = await requireTenant();
  const payload = paymentSchema.parse({
    student_id: formData.get("student_id"),
    bill_name: formData.get("bill_name"),
    amount: formData.get("amount"),
    due_date: formData.get("due_date")
  });

  const { error } = await supabase.from("payments").insert({
    school_id: tenant.id,
    ...payload,
    status: "pending",
    payment_method: "midtrans_ready"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/payments");
}

export async function updateWebsiteSettingsAction(formData: FormData) {
  await requireAuth(["super_admin", "admin"]);
  const supabase = createClient();
  const tenant = await requireTenant();

  const payload = websiteSettingsSchema.parse(
    Object.fromEntries(WEBSITE_SETTING_FIELDS.map((key) => [key, String(formData.get(key) ?? "")]))
  );

  const heroBackgroundImage = await uploadImageFile({
    file: formData.get("hero_background_image_file") as File | null,
    schoolId: tenant.id,
    folder: "images"
  });
  const schoolLogoUrl = await uploadImageFile({
    file: formData.get("school_logo_file") as File | null,
    schoolId: tenant.id,
    folder: "images"
  });
  const ogImageUrl = await uploadImageFile({
    file: formData.get("seo_default_og_image_file") as File | null,
    schoolId: tenant.id,
    folder: "images"
  });

  const rows = WEBSITE_SETTING_FIELDS.map((key) => ({
    school_id: tenant.id,
    key,
    value:
      key === "hero_background_image" && heroBackgroundImage
        ? heroBackgroundImage
        : key === "school_logo_url" && schoolLogoUrl
          ? schoolLogoUrl
          : key === "seo_default_og_image" && ogImageUrl
            ? ogImageUrl
            : payload[key]
  }));

  const { error } = await supabase.from("website_settings").upsert(rows, {
    onConflict: "school_id,key"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/news");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/dashboard/settings");
}

export async function createGalleryAction(formData: FormData) {
  await requireAuth(["super_admin", "admin"]);
  const supabase = createClient();
  const tenant = await requireTenant();
  const payload = gallerySchema.parse({
    title: formData.get("title"),
    category: formData.get("category")
  });
  const imageUrl = await uploadImageFile({
    file: formData.get("image") as File | null,
    schoolId: tenant.id,
    folder: "images"
  });

  if (!imageUrl) {
    throw new Error("Image is required.");
  }

  const { error } = await supabase.from("gallery").insert({
    school_id: tenant.id,
    title: payload.title,
    category: payload.category,
    image_url: imageUrl
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/dashboard/settings");
}

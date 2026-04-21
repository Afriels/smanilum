"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireTenant } from "@/lib/tenant";
import {
  loginSchema,
  newsSchema,
  paymentSchema,
  ppdbSchema,
  studentSchema
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
  const supabase = createClient();
  const tenant = await requireTenant();
  const payload = newsSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content")
  });

  const { error } = await supabase.from("news").insert({
    school_id: tenant.id,
    ...payload,
    published_at: new Date().toISOString()
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/news");
}

export async function createStudentAction(formData: FormData) {
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

  const registrationNo = `PPDB-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const { error } = await supabase.from("ppdb").insert({
    school_id: tenant.id,
    ...payload,
    registration_no: registrationNo,
    status: "pending"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/ppdb");
}

export async function createPaymentAction(formData: FormData) {
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

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const newsSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(20)
});

export const studentSchema = z.object({
  nis: z.string().min(3),
  full_name: z.string().min(3),
  grade: z.string().min(1),
  class_name: z.string().min(1),
  guardian_name: z.string().min(3),
  guardian_phone: z.string().min(8)
});

export const ppdbSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8),
  previous_school: z.string().min(2)
});

export const paymentSchema = z.object({
  student_id: z.string().uuid().or(z.string().min(3)),
  bill_name: z.string().min(3),
  amount: z.coerce.number().min(10000),
  due_date: z.string().min(3)
});

import { createClient } from "@/lib/supabase/server";
import { requireTenant } from "@/lib/tenant";
import type {
  ActivityItem,
  DashboardStats,
  GalleryItem,
  NewsItem,
  PaymentItem,
  PPDBItem,
  School,
  StudentItem,
  SubscriptionItem
} from "@/lib/types";

function withFallback<T>(data: T[] | null, fallback: T[]) {
  return data && data.length > 0 ? data : fallback;
}

export async function getPublicData() {
  const supabase = createClient();
  const tenant = await requireTenant();

  const [news, activities, gallery] = await Promise.all([
    supabase
      .from("news")
      .select("*")
      .eq("school_id", tenant.id)
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("activities")
      .select("*")
      .eq("school_id", tenant.id)
      .order("activity_date", { ascending: false })
      .limit(4),
    supabase.from("gallery").select("*").eq("school_id", tenant.id).limit(6)
  ]);

  return {
    tenant,
    news: withFallback<NewsItem>(news.data, demoNews(tenant)),
    activities: withFallback<ActivityItem>(activities.data, demoActivities(tenant)),
    gallery: withFallback<GalleryItem>(gallery.data, demoGallery(tenant))
  };
}

export async function getDashboardData() {
  const supabase = createClient();
  const tenant = await requireTenant();

  const [students, news, ppdb, payments, subscriptions] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", tenant.id),
    supabase.from("news").select("id", { count: "exact", head: true }).eq("school_id", tenant.id),
    supabase
      .from("ppdb")
      .select("id", { count: "exact", head: true })
      .eq("school_id", tenant.id)
      .eq("status", "pending"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("school_id", tenant.id)
      .eq("status", "pending"),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("school_id", tenant.id)
      .order("ends_at", { ascending: false })
      .limit(1)
      .maybeSingle<SubscriptionItem>()
  ]);

  return {
    tenant,
    stats: {
      totalStudents: students.count ?? 124,
      totalNews: news.count ?? 12,
      pendingPPDB: ppdb.count ?? 9,
      pendingPayments: payments.count ?? 18,
      activeSubscription:
        subscriptions.data ??
        ({
          id: "sub-demo",
          school_id: tenant.id,
          plan: "Pro",
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          status: "active"
        } satisfies SubscriptionItem)
    } satisfies DashboardStats
  };
}

export async function getDashboardCollections() {
  const supabase = createClient();
  const tenant = await requireTenant();

  const [news, students, ppdb, payments] = await Promise.all([
    supabase.from("news").select("*").eq("school_id", tenant.id).order("published_at", { ascending: false }),
    supabase.from("students").select("*").eq("school_id", tenant.id).order("created_at", { ascending: false }),
    supabase.from("ppdb").select("*").eq("school_id", tenant.id).order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("school_id", tenant.id).order("due_date", { ascending: true })
  ]);

  return {
    tenant,
    news: withFallback<NewsItem>(news.data, demoNews(tenant)),
    students: withFallback<StudentItem>(students.data, demoStudents(tenant)),
    ppdb: withFallback<PPDBItem>(ppdb.data, demoPPDB(tenant)),
    payments: withFallback<PaymentItem>(payments.data, demoPayments(tenant))
  };
}

export function demoNews(school: School): NewsItem[] {
  return [
    {
      id: "news-1",
      school_id: school.id,
      title: "Peluncuran Sistem Akademik Terintegrasi",
      slug: "peluncuran-sistem-akademik",
      excerpt: "Platform baru untuk mempercepat layanan akademik, PPDB, dan komunikasi sekolah.",
      content: "Sistem sekolah kini mendukung dashboard operasional terpadu untuk staf, guru, dan siswa.",
      cover_url: null,
      published_at: new Date().toISOString()
    },
    {
      id: "news-2",
      school_id: school.id,
      title: "Program Kelas Digital Tahun Ajaran Baru",
      slug: "program-kelas-digital",
      excerpt: "Sekolah memperluas penggunaan perangkat digital dan portal pembelajaran hybrid.",
      content: "Fokus implementasi ada pada literasi digital dan transparansi orang tua.",
      cover_url: null,
      published_at: new Date().toISOString()
    }
  ];
}

export function demoActivities(school: School): ActivityItem[] {
  return [
    {
      id: "activity-1",
      school_id: school.id,
      title: "Open House dan Expo Jurusan",
      description: "Ajang pengenalan program sekolah kepada calon siswa dan orang tua.",
      activity_date: new Date().toISOString(),
      location: "Aula Utama"
    },
    {
      id: "activity-2",
      school_id: school.id,
      title: "Workshop Guru Inovatif",
      description: "Pelatihan strategi pembelajaran berbasis proyek dan AI-assisted planning.",
      activity_date: new Date().toISOString(),
      location: "Lab Komputer"
    }
  ];
}

export function demoGallery(school: School): GalleryItem[] {
  return Array.from({ length: 6 }).map((_, index) => ({
    id: `gallery-${index + 1}`,
    school_id: school.id,
    title: `Kegiatan Sekolah ${index + 1}`,
    image_url: `https://images.unsplash.com/photo-150${index + 1}230946?auto=format&fit=crop&w=900&q=80`,
    category: index % 2 === 0 ? "Akademik" : "Ekstrakurikuler"
  }));
}

export function demoStudents(school: School): StudentItem[] {
  return [
    {
      id: "student-1",
      school_id: school.id,
      nis: "2026001",
      full_name: "Alya Putri Maheswari",
      grade: "10",
      class_name: "X IPA 1",
      guardian_name: "Budi Santoso",
      guardian_phone: "081234567890",
      status: "active"
    },
    {
      id: "student-2",
      school_id: school.id,
      nis: "2026002",
      full_name: "Raka Pratama",
      grade: "11",
      class_name: "XI IPS 2",
      guardian_name: "Sinta Dewi",
      guardian_phone: "081298765432",
      status: "active"
    }
  ];
}

export function demoPPDB(school: School): PPDBItem[] {
  return [
    {
      id: "ppdb-1",
      school_id: school.id,
      registration_no: "PPDB-2026-001",
      full_name: "Nadia Rahma",
      email: "nadia@example.com",
      phone: "081212121212",
      previous_school: "SMP Negeri 1",
      status: "pending",
      document_url: null
    }
  ];
}

export function demoPayments(school: School): PaymentItem[] {
  return [
    {
      id: "payment-1",
      school_id: school.id,
      student_id: "student-1",
      bill_name: "SPP April 2026",
      amount: 450000,
      due_date: new Date().toISOString(),
      status: "pending",
      payment_method: "bank_transfer",
      paid_at: null
    }
  ];
}

import { Suspense } from "react";
import { gardens, tasks, issues, harvests } from "@/lib/data/mock-data";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TaskList from "@/components/dashboard/TaskList";
import IssueList from "@/components/dashboard/IssueList";
import ProductionChart from "@/components/dashboard/ProductionChart";
import GardenQuickAccess from "@/components/dashboard/GardenQuickAccess";

export default function DashboardPage() {
  // Calculate summary data
  const totalGardens = gardens.length;
  const totalLuas = gardens.reduce((sum, g) => sum + g.luas, 0);
  const totalPohon = gardens.reduce((sum, g) => sum + g.jumlahPohon, 0);
  const pendingTasks = tasks.filter((t) => t.status !== "Done").length;

  // Get high priority tasks
  const urgentTasks = tasks
    .filter((t) => t.prioritas === "High" && t.status !== "Done")
    .sort((a, b) => new Date(a.tanggalTarget).getTime() - new Date(b.tanggalTarget).getTime())
    .slice(0, 5);

  // Get active issues
  const activeIssues = issues.filter((i) => i.status === "Open").slice(0, 5);

  // Calculate monthly production (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyProduction = gardens.map((garden) => {
    const gardenHarvests = harvests.filter(
      (h) =>
        h.gardenId === garden.id &&
        new Date(h.tanggal).getMonth() === currentMonth &&
        new Date(h.tanggal).getFullYear() === currentYear
    );
    const total = gardenHarvests.reduce((sum, h) => sum + h.jumlahKg, 0);
    return {
      name: garden.nama.replace("Kebun Sawit ", ""),
      value: total / 1000, // Convert to tons
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview manajemen kebun kelapa sawit Anda
          </p>
        </div>

        {/* Summary Cards */}
        <Suspense fallback={<div>Loading...</div>}>
          <SummaryCards
            totalGardens={totalGardens}
            totalLuas={totalLuas}
            totalPohon={totalPohon}
            pendingTasks={pendingTasks}
          />
        </Suspense>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Task Mendesak */}
          <Suspense fallback={<div>Loading...</div>}>
            <TaskList tasks={urgentTasks} />
          </Suspense>

          {/* Masalah Aktif */}
          <Suspense fallback={<div>Loading...</div>}>
            <IssueList issues={activeIssues} />
          </Suspense>
        </div>

        {/* Produksi Bulan Ini */}
        <div className="mt-8">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductionChart data={monthlyProduction} />
          </Suspense>
        </div>

        {/* Kebun Saya Quick Access */}
        <div className="mt-8">
          <Suspense fallback={<div>Loading...</div>}>
            <GardenQuickAccess gardens={gardens.slice(0, 6)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useParams, useSearchParams } from "next/navigation";
import { gardens, tasks, harvests, issues, maintenances, documentation } from "@/lib/data/mock-data";
import { notFound } from "next/navigation";
import GardenHeader from "@/components/kebun-detail/GardenHeader";
import QuickStats from "@/components/kebun-detail/QuickStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabInformasi from "@/components/kebun-detail/tabs/TabInformasi";
import TabTask from "@/components/kebun-detail/tabs/TabTask";
import TabPanen from "@/components/kebun-detail/tabs/TabPanen";
import TabMasalah from "@/components/kebun-detail/tabs/TabMasalah";
import TabPerawatan from "@/components/kebun-detail/tabs/TabPerawatan";
import TabDokumentasi from "@/components/kebun-detail/tabs/TabDokumentasi";

export default function DetailKebunPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const defaultTab = searchParams.get("tab") || "informasi";

  // Find garden
  const garden = gardens.find((g) => g.id === id);
  if (!garden) {
    notFound();
  }

  // Get related data
  const gardenTasks = tasks.filter((t) => t.gardenId === id);
  const gardenHarvests = harvests.filter((h) => h.gardenId === id);
  const gardenIssues = issues.filter((i) => i.gardenId === id);
  const gardenMaintenances = maintenances.filter((m) => m.gardenId === id);
  const gardenDocumentation = documentation.filter((d) => d.gardenId === id);

  // Calculate quick stats
  const activeTasks = gardenTasks.filter((t) => t.status !== "Done").length;
  const openIssues = gardenIssues.filter((i) => i.status === "Open").length;
  const upcomingMaintenances = gardenMaintenances.filter(
    (m) => m.status === "Dijadwalkan"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Garden Header */}
        <GardenHeader garden={garden} />

        {/* Quick Stats */}
        <QuickStats
          luas={garden.luas}
          jumlahPohon={garden.jumlahPohon}
          activeTasks={activeTasks}
          openIssues={openIssues}
        />

        {/* Tabs */}
        <div className="mt-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto">
              <TabsTrigger value="informasi">Informasi</TabsTrigger>
              <TabsTrigger value="task">Task</TabsTrigger>
              <TabsTrigger value="panen">Panen</TabsTrigger>
              <TabsTrigger value="masalah">Masalah</TabsTrigger>
              <TabsTrigger value="perawatan">Perawatan</TabsTrigger>
              <TabsTrigger value="dokumentasi">Dokumentasi</TabsTrigger>
            </TabsList>

            <TabsContent value="informasi" className="mt-6">
              <TabInformasi
                garden={garden}
                harvests={gardenHarvests}
                tasks={gardenTasks}
                issues={gardenIssues}
              />
            </TabsContent>

            <TabsContent value="task" className="mt-6">
              <TabTask gardenId={id} tasks={gardenTasks} />
            </TabsContent>

            <TabsContent value="panen" className="mt-6">
              <TabPanen gardenId={id} harvests={gardenHarvests} />
            </TabsContent>

            <TabsContent value="masalah" className="mt-6">
              <TabMasalah gardenId={id} issues={gardenIssues} />
            </TabsContent>

            <TabsContent value="perawatan" className="mt-6">
              <TabPerawatan gardenId={id} maintenances={gardenMaintenances} />
            </TabsContent>

            <TabsContent value="dokumentasi" className="mt-6">
              <TabDokumentasi gardenId={id} documentation={gardenDocumentation} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { gardens, harvests, issues, maintenances, documentation, expenses } from "@/lib/data/mock-data";
import { notFound } from "next/navigation";
import GardenHeader from "@/components/kebun-detail/GardenHeader";
import QuickStats from "@/components/kebun-detail/QuickStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabInformasi from "@/components/kebun-detail/tabs/TabInformasi";
import TabPanen from "@/components/kebun-detail/tabs/TabPanen";
import TabMasalah from "@/components/kebun-detail/tabs/TabMasalah";
import TabPerawatan from "@/components/kebun-detail/tabs/TabPerawatan";
import TabDokumentasi from "@/components/kebun-detail/tabs/TabDokumentasi";
import TabPengeluaran from "@/components/kebun-detail/tabs/TabPengeluaran";
import EditGardenModal from "@/components/kebun/EditGardenModal";
import { useGardens } from "@/lib/context/GardensContext";
import { toast } from "sonner";

export default function DetailKebunPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const defaultTab = searchParams.get("tab") || "informasi";
  const { gardens: contextGardens, updateGarden, loading } = useGardens();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentGarden, setCurrentGarden] = useState<any>(null);

  // Find garden by slug or ID - prioritize context gardens, fallback to mock data
  // Support both slug and UUID for backward compatibility
  const garden = contextGardens.find((g) => g.slug === id || g.id === id) ||
                 gardens.find((g) => g.slug === id || g.id === id);
  if (!garden) {
    notFound();
  }

  const handleEditGarden = async (gardenData: any) => {
    try {
      await updateGarden(id, gardenData);
      setIsEditModalOpen(false);
      toast.success("Data kebun berhasil diperbarui!");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui data kebun");
    }
  };

  // Get related data
  const gardenHarvests = harvests.filter((h) => h.gardenId === id);
  const gardenIssues = issues.filter((i) => i.gardenId === id);
  const gardenMaintenances = maintenances.filter((m) => m.gardenId === id);
  const gardenDocumentation = documentation.filter((d) => d.gardenId === id);
  const gardenExpenses = expenses.filter((e) => e.gardenId === id);

  // Calculate quick stats
  const openIssues = gardenIssues.filter((i) => i.status === "Open").length;
  const upcomingMaintenances = gardenMaintenances.filter(
    (m) => m.status === "Dijadwalkan" || m.status === "Terlambat"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Garden Header */}
        <GardenHeader garden={garden} onEdit={() => setIsEditModalOpen(true)} />

        {/* Quick Stats */}
        <QuickStats
          luas={garden.luas}
          jumlahPohon={garden.jumlahPohon}
          upcomingMaintenances={upcomingMaintenances}
          openIssues={openIssues}
        />

        {/* Tabs */}
        <div className="mt-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto">
              <TabsTrigger value="informasi">Informasi</TabsTrigger>
              <TabsTrigger value="panen">Panen</TabsTrigger>
              <TabsTrigger value="masalah">Masalah</TabsTrigger>
              <TabsTrigger value="perawatan">Perawatan</TabsTrigger>
              <TabsTrigger value="dokumentasi">Dokumentasi</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
            </TabsList>

            <TabsContent value="informasi" className="mt-6">
              <TabInformasi
                garden={garden}
                harvests={gardenHarvests}
                issues={gardenIssues}
              />
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

            <TabsContent value="pengeluaran" className="mt-6">
              <TabPengeluaran gardenId={id} expenses={gardenExpenses} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Garden Modal */}
      <EditGardenModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditGarden}
        garden={garden}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Maintenance } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, CheckCircle2 } from "lucide-react";
import { format, isPast, isFuture } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface TabPerawatanProps {
  gardenId: string;
  maintenances: Maintenance[];
}

export default function TabPerawatan({ gardenId, maintenances: initialMaintenances }: TabPerawatanProps) {
  const [maintenances, setMaintenances] = useState<Maintenance[]>(initialMaintenances);

  const sortedMaintenances = [...maintenances].sort(
    (a, b) => new Date(a.tanggalDijadwalkan).getTime() - new Date(b.tanggalDijadwalkan).getTime()
  );

  const dijadwalkan = maintenances.filter((m) => m.status === "Dijadwalkan").length;
  const selesai = maintenances.filter((m) => m.status === "Selesai").length;
  const terlambat = maintenances.filter((m) => m.status === "Terlambat").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "success";
      case "Dijadwalkan":
        return "default";
      case "Terlambat":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleMarkDone = (maintenanceId: string) => {
    setMaintenances((prev) =>
      prev.map((m) =>
        m.id === maintenanceId
          ? {
              ...m,
              status: "Selesai",
              tanggalSelesai: new Date(),
              updatedAt: new Date(),
            }
          : m
      )
    );
    toast.success("Perawatan ditandai selesai!");
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Jadwal Perawatan
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Jadwalkan Perawatan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Dijadwalkan</p>
              <p className="text-3xl font-bold text-blue-600">{dijadwalkan}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Selesai</p>
              <p className="text-3xl font-bold text-green-600">{selesai}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Terlambat</p>
              <p className="text-3xl font-bold text-red-600">{terlambat}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Perawatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMaintenances.map((maintenance, index) => (
              <div
                key={maintenance.id}
                className={`flex gap-4 pb-4 ${
                  index < sortedMaintenances.length - 1 ? "border-b" : ""
                }`}
              >
                {/* Date */}
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {format(new Date(maintenance.tanggalDijadwalkan), "d MMM", { locale: id })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(maintenance.tanggalDijadwalkan), "yyyy", { locale: id })}
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      maintenance.status === "Selesai"
                        ? "bg-green-500"
                        : maintenance.status === "Terlambat"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  {index < sortedMaintenances.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{maintenance.judul}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {maintenance.jenisPerawatan}
                        </Badge>
                        <Badge variant={getStatusColor(maintenance.status)} className="text-xs">
                          {maintenance.status}
                        </Badge>
                        {maintenance.isRecurring && (
                          <Badge variant="secondary" className="text-xs">
                            Berkala
                          </Badge>
                        )}
                      </div>
                    </div>
                    {maintenance.status === "Dijadwalkan" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkDone(maintenance.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Selesai
                      </Button>
                    )}
                  </div>

                  {maintenance.detail && (
                    <p className="text-sm text-gray-600 mb-2">{maintenance.detail}</p>
                  )}

                  {maintenance.penanggungJawab && (
                    <p className="text-xs text-gray-500">
                      Penanggung Jawab: {maintenance.penanggungJawab}
                    </p>
                  )}

                  {maintenance.isRecurring && maintenance.recurringInterval && (
                    <p className="text-xs text-gray-500">
                      Berulang setiap {maintenance.recurringInterval} hari
                    </p>
                  )}

                  {maintenance.tanggalSelesai && (
                    <p className="text-xs text-green-600 mt-1">
                      Selesai: {format(new Date(maintenance.tanggalSelesai), "d MMM yyyy", { locale: id })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

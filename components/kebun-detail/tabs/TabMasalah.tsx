"use client";

import { useState } from "react";
import { Issue } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import Image from "next/image";

interface TabMasalahProps {
  gardenId: string;
  issues: Issue[];
}

export default function TabMasalah({ gardenId, issues: initialIssues }: TabMasalahProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredIssues = issues.filter((issue) =>
    statusFilter === "all" || issue.status === statusFilter
  );

  const openIssues = issues.filter((i) => i.status === "Open").length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved").length;

  const getSeverityColor = (tingkat: string) => {
    switch (tingkat) {
      case "Parah":
        return "destructive";
      case "Sedang":
        return "warning";
      case "Ringan":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleToggleStatus = (issueId: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? {
              ...i,
              status: i.status === "Open" ? "Resolved" : "Open",
              tanggalSelesai: i.status === "Open" ? new Date() : undefined,
              updatedAt: new Date(),
            }
          : i
      )
    );
    toast.success("Status masalah berhasil diubah!");
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Issue Tracking
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Laporkan Masalah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Masalah Terbuka</p>
              <p className="text-3xl font-bold text-red-600">{openIssues}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Terselesaikan</p>
              <p className="text-3xl font-bold text-green-600">{resolvedIssues}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIssues.length === 0 ? (
          <div className="col-span-2">
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                Tidak ada masalah yang sesuai dengan filter
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <Card key={issue.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{issue.judul}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={getSeverityColor(issue.tingkatKeparahan)}>
                        {issue.tingkatKeparahan}
                      </Badge>
                      <Badge variant={issue.status === "Open" ? "destructive" : "success"}>
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{issue.deskripsi}</p>

                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Area Terdampak:</span> {issue.areaTerdampak}
                </div>

                {issue.fotoUrls && issue.fotoUrls.length > 0 && (
                  <div className="mb-3">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={issue.fotoUrls[0]}
                        alt={issue.judul}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {issue.solusi && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-800 mb-1">Solusi:</p>
                    <p className="text-sm text-green-700">{issue.solusi}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>
                    Dilaporkan: {format(new Date(issue.tanggalLapor), "d MMM yyyy", { locale: id })}
                  </span>
                  {issue.tanggalSelesai && (
                    <span>
                      Selesai: {format(new Date(issue.tanggalSelesai), "d MMM yyyy", { locale: id })}
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant={issue.status === "Open" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleToggleStatus(issue.id)}
                >
                  {issue.status === "Open" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Tandai Selesai
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Buka Kembali
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

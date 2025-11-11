"use client";

import { useState } from "react";
import { Harvest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TabPanenProps {
  gardenId: string;
  harvests: Harvest[];
}

export default function TabPanen({ gardenId, harvests }: TabPanenProps) {
  // Calculate summary
  const totalPanen = harvests.reduce((sum, h) => sum + h.jumlahKg, 0);
  const totalNilai = harvests.reduce((sum, h) => sum + h.totalNilai, 0);
  const avgHargaPerKg = harvests.length > 0 ? totalNilai / totalPanen : 0;
  const avgKualitas = harvests.filter((h) => h.kualitas === "Baik Sekali" || h.kualitas === "Baik").length / harvests.length * 100;

  // Chart data (last 6 harvests)
  const chartData = harvests
    .slice(-6)
    .map((h) => ({
      tanggal: format(new Date(h.tanggal), "d MMM", { locale: id }),
      kg: h.jumlahKg,
    }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Panen</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(totalPanen / 1000).toFixed(2)} Ton
            </p>
            <p className="text-xs text-gray-500 mt-1">{harvests.length} kali panen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Nilai</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              Rp {(totalNilai / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Rata-rata Harga</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              Rp {avgHargaPerKg.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">per kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Kualitas Baik</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {avgKualitas.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Grafik Produksi Terakhir
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Panen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: "Kg", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="kg" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Harvest List */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Panen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Jumlah (Kg)</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Harga/Kg</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total Nilai</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Kualitas</th>
                </tr>
              </thead>
              <tbody>
                {harvests.slice(-10).reverse().map((harvest) => (
                  <tr key={harvest.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(harvest.tanggal), "d MMMM yyyy", { locale: id })}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      {harvest.jumlahKg.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      Rp {harvest.hargaPerKg.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-green-600">
                      Rp {(harvest.totalNilai / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          harvest.kualitas === "Baik Sekali"
                            ? "bg-green-100 text-green-800"
                            : harvest.kualitas === "Baik"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {harvest.kualitas}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

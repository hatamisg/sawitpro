"use client";

import { useState } from "react";
import { Documentation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image as ImageIcon, FileText, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

interface TabDokumentasiProps {
  gardenId: string;
  documentation: Documentation[];
}

export default function TabDokumentasi({ gardenId, documentation }: TabDokumentasiProps) {
  const photos = documentation.filter((d) => d.tipe === "foto");
  const documents = documentation.filter((d) => d.tipe === "dokumen");
  const notes = documentation.filter((d) => d.tipe === "catatan");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Dokumentasi Kebun</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Dokumentasi
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ImageIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Foto</p>
              <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Dokumen</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <StickyNote className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Catatan</p>
              <p className="text-2xl font-bold text-gray-900">{notes.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="foto" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="foto">Foto ({photos.length})</TabsTrigger>
          <TabsTrigger value="dokumen">Dokumen ({documents.length})</TabsTrigger>
          <TabsTrigger value="catatan">Catatan ({notes.length})</TabsTrigger>
        </TabsList>

        {/* Foto Tab */}
        <TabsContent value="foto" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {photos.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Belum ada foto</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        {photo.fileUrl && (
                          <Image
                            src={photo.fileUrl}
                            alt={photo.judul}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {photo.judul}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {format(new Date(photo.createdAt), "d MMM yyyy", { locale: id })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dokumen Tab */}
        <TabsContent value="dokumen" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {documents.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Belum ada dokumen</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{doc.judul}</h4>
                        {doc.deskripsi && (
                          <p className="text-sm text-gray-600 truncate">{doc.deskripsi}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {doc.kategori && (
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">
                              {doc.kategori}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {format(new Date(doc.createdAt), "d MMM yyyy", { locale: id })}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Lihat
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catatan Tab */}
        <TabsContent value="catatan" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Belum ada catatan</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{note.judul}</h4>
                        <StickyNote className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      </div>
                      {note.content && (
                        <p className="text-sm text-gray-700 mb-2 line-clamp-4">{note.content}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{format(new Date(note.createdAt), "d MMM yyyy", { locale: id })}</span>
                        {note.kategori && (
                          <span className="px-2 py-1 bg-yellow-100 rounded">{note.kategori}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { contactService } from "@/services/api";
import { UploadCloud, Loader2, CheckCircle2, XCircle, FileText } from "lucide-react";

export default function Uploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        setLoading(true);
        const data = await contactService.getUploads();
        setUploads(data.data.uploads || []);
      } catch (error) {
        console.error("Failed to load uploads:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUploads();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <UploadCloud className="mr-3 text-indigo-500" /> Upload History
          </h1>
          <p className="mt-2 text-gray-400">View the history of your CSV contact uploads and their processing results.</p>
        </div>
      </div>

      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-[var(--color-card-border)] flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Recent Uploads</h2>
          <div className="text-sm text-gray-400 whitespace-nowrap">
            {uploads.length} total uploads
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : uploads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <UploadCloud className="h-12 w-12 mb-4 opacity-20" />
              <p>No upload history found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[var(--color-card-border)]">
              <thead className="bg-[#1f1f23] sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">File URL</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Upload Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Records</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Success Count</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Failed Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-card-border)] bg-[var(--color-card)]">
                {uploads.map((upload) => (
                  <tr 
                    key={upload._id} 
                    className="hover:bg-[#1f1f23] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white flex items-center max-w-xs truncate">
                      <FileText className="h-4 w-4 mr-2 text-indigo-400 shrink-0" />
                      <span className="truncate" title={upload.csvUrl}>{upload.csvUrl}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(upload.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {upload.totalRecords}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        {upload.successCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-1.5" />
                        {upload.failCount}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

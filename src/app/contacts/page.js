"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { contactService } from "@/services/api";
import UploadModal from "@/components/UploadModal";
import { Users, Search, UploadCloud, Loader2, Filter, ArrowDownAZ, ArrowUpZA } from "lucide-react";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextCursor) {
        fetchContacts(false);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, nextCursor]);

  // Use debounce for search and tags
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Only apply search if it's empty or >= 3 chars
      const effectiveSearch = (searchTerm.length > 0 && searchTerm.length < 3) ? "" : searchTerm;
      
      const fetchWithParams = async () => {
        try {
          setLoading(true);
          const data = await contactService.getContacts(20, null, effectiveSearch, tagsFilter, sortOrder);
          setContacts(data.data.contacts);
          setNextCursor(data.data.nextCursor);
        } catch (error) {
          console.error("Failed to load contacts:", error);
        } finally {
          setLoading(false);
          setLoadingMore(false);
        }
      };
      
      fetchWithParams();
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, tagsFilter, sortOrder]);

  const fetchContacts = async (reset = false) => {
    // This is mainly for infinite scrolling (loading more) now
    const effectiveSearch = (searchTerm.length > 0 && searchTerm.length < 3) ? "" : searchTerm;
    
    try {
      if (reset) {
        setLoading(true);
        const data = await contactService.getContacts(20, null, effectiveSearch, tagsFilter, sortOrder);
        setContacts(data.data.contacts);
        setNextCursor(data.data.nextCursor);
      } else {
        setLoadingMore(true);
        const data = await contactService.getContacts(20, nextCursor, effectiveSearch, tagsFilter, sortOrder);
        setContacts((prev) => [...prev, ...data.data.contacts]);
        setNextCursor(data.data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Users className="mr-3 text-indigo-500" /> Contacts Directory
          </h1>
          <p className="mt-2 text-gray-400">Manage your audience. Add new contacts via CSV bulk upload.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors cursor-pointer"
          >
            <UploadCloud className="mr-2 -ml-1 h-5 w-5" />
            Upload CSV
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--color-card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search name, email, phone..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--color-card-border)] rounded-lg leading-5 bg-[#09090b] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full sm:max-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Filter by tags..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--color-card-border)] rounded-lg leading-5 bg-[#09090b] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                value={tagsFilter}
                onChange={(e) => setTagsFilter(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="inline-flex items-center justify-center px-4 py-2 border border-[var(--color-card-border)] rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-[#09090b] hover:bg-white/5 focus:outline-none transition-colors cursor-pointer shrink-0"
              title={`Sort by Date: ${sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}`}
            >
              {sortOrder === 'desc' ? <ArrowDownAZ className="h-5 w-5 mr-2" /> : <ArrowUpZA className="h-5 w-5 mr-2" />}
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>
          <div className="text-sm text-gray-400 hidden lg:block whitespace-nowrap">
            {contacts.length} loaded
          </div>
        </div>

        {/* Data Grid */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Users className="h-12 w-12 mb-4 opacity-20" />
              <p>No contacts found.</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-[var(--color-card-border)]">
                <thead className="bg-[#1f1f23] sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined At</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-card-border)] bg-[var(--color-card)]">
                  {contacts.map((contact, index) => (
                    <tr 
                      key={contact._id} 
                      ref={index === contacts.length - 1 ? lastElementRef : null}
                      className="hover:bg-[#1f1f23] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {contact.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {contact.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {contact.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(contact.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags?.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loadingMore && (
                <div className="p-4 flex justify-center items-center bg-[var(--color-card)]">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { campaignService } from "@/services/api";
import { StartCampaignModal, CreateCampaignModal } from "@/components/CampaignModals";
import { Send, Plus, Loader2, Play } from "lucide-react";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [startModalCampaign, setStartModalCampaign] = useState(null);

  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextCursor) {
        fetchCampaigns(false);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, nextCursor]);

  const fetchCampaigns = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        const data = await campaignService.getCampaigns(20, null);
        setCampaigns(data.data.campaigns);
        setNextCursor(data.data.nextCursor);
      } else {
        setLoadingMore(true);
        const data = await campaignService.getCampaigns(20, nextCursor);
        setCampaigns((prev) => [...prev, ...data.data.campaigns]);
        setNextCursor(data.data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(true);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Send className="mr-3 text-indigo-500" /> Campaigns
          </h1>
          <p className="mt-2 text-gray-400">Create, launch, and track your messaging campaigns.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors cursor-pointer"
          >
            <Plus className="mr-2 -ml-1 h-5 w-5" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Data Grid */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
              <Send className="h-12 w-12 mb-4 opacity-20" />
              <p>No campaigns found.</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-[var(--color-card-border)]">
                <thead className="bg-[#1f1f23]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Audience Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Success</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-card-border)] bg-[var(--color-card)]">
                  {campaigns.map((campaign, index) => {
                    const progress = campaign.totalContacts > 0 ? Math.round((campaign.sentCount / campaign.totalContacts) * 100) : 0;
                    
                    return (
                      <tr 
                        key={campaign._id} 
                        ref={index === campaigns.length - 1 ? lastElementRef : null}
                        className="hover:bg-[#1f1f23] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {campaign.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${campaign.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              campaign.status === 'Running' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                              campaign.status === 'Failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                              'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {campaign.totalContacts ? campaign.totalContacts.toLocaleString() : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-[#09090b] rounded-full h-2 max-w-[100px] border border-[var(--color-card-border)] overflow-hidden">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {(campaign.status === 'Draft' || campaign.status === 'Failed') && (
                            <button
                              onClick={() => setStartModalCampaign(campaign)}
                              className="text-indigo-400 hover:text-indigo-300 flex items-center justify-end w-full cursor-pointer"
                            >
                              <Play className="h-4 w-4 mr-1" /> Launch
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
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

      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => fetchCampaigns(true)}
      />
      
      <StartCampaignModal 
        isOpen={!!startModalCampaign} 
        onClose={() => setStartModalCampaign(null)} 
        campaign={startModalCampaign}
        onSuccess={() => fetchCampaigns(true)}
      />
    </div>
  );
}

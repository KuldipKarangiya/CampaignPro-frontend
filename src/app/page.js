"use client";

import { useEffect, useState } from "react";
import { campaignService } from "@/services/api";
import { BarChart3, CheckCircle2, Clock, XCircle, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await campaignService.getCampaigns(5); // Fetch latest 5
        setCampaigns(data.data.campaigns);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate aggregates from the loaded campaigns
  const totalContacts = campaigns.reduce((acc, c) => acc + (c.totalContacts || 0), 0);
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + (c.failedCount || 0), 0);
  const totalPending = campaigns.reduce((acc, c) => acc + (c.pendingCount || 0), 0);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <LayoutDashboard className="mr-3 text-indigo-500" /> Dashboard Overview
        </h1>
        <p className="mt-2 text-gray-400">High-level metrics from your most recent campaigns.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards */}
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Total Targeted</dt>
                <dd className="text-2xl font-bold text-white">{totalContacts.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Messages Sent</dt>
                <dd className="text-2xl font-bold text-white">{totalSent.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Pending Delivery</dt>
                <dd className="text-2xl font-bold text-white">{totalPending.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-rose-500/10">
              <XCircle className="h-6 w-6 text-rose-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Failed</dt>
                <dd className="text-2xl font-bold text-white">{totalFailed.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-card-border)] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--color-card-border)]">
          <h3 className="text-lg font-medium leading-6 text-white">Recent Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-card-border)]">
            <thead className="bg-[#1f1f23]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Campaign Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Success</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-card-border)]">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No campaigns found. Create one to get started!</td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const progress = campaign.totalContacts > 0 ? Math.round((campaign.sentCount / campaign.totalContacts) * 100) : 0;
                  return (
                    <tr key={campaign._id} className="hover:bg-[#1f1f23] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${campaign.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                            campaign.status === 'Running' ? 'bg-blue-500/10 text-blue-400' : 
                            campaign.status === 'Failed' ? 'bg-rose-500/10 text-rose-400' : 
                            'bg-gray-500/10 text-gray-400'}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-700 rounded-full h-2.5 max-w-[150px]">
                            <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span>{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

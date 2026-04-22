"use client";

import { useState } from "react";
import { campaignService } from "@/services/api";
import { X, Play, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export function CreateCampaignModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !template) return;

    setStatus("loading");
    try {
      await campaignService.createCampaign(name, template);
      setStatus("success");
      setMessage("Campaign created successfully.");
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
        setName("");
        setTemplate("");
      }, 1500);
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Failed to create campaign.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-card-border)]">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Plus className="mr-2 h-5 w-5 text-indigo-400" /> Create Draft Campaign
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name</label>
            <input
              type="text"
              required
              className="w-full bg-[#09090b] border border-[var(--color-card-border)] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Winter Sale 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Message Template</label>
            <textarea
              required
              rows={4}
              className="w-full bg-[#09090b] border border-[var(--color-card-border)] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              placeholder="Hello {name}, we have a special offer for you!"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
            <p className="mt-1 text-xs text-gray-500">Use {"{name}"} or {"{email}"} for personalization.</p>
          </div>

          {status === "error" && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center text-emerald-400 text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2 shrink-0" />
              {message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#18181b] disabled:opacity-50 transition-colors"
            >
              {status === "loading" ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function StartCampaignModal({ isOpen, onClose, campaign, onSuccess }) {
  const [allSelected, setAllSelected] = useState(false);
  const [tags, setTags] = useState("");
  const [dateAfter, setDateAfter] = useState("");
  const [dateBefore, setDateBefore] = useState("");
  
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  if (!isOpen || !campaign) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const payload = {
        all_selected: allSelected,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (dateAfter) payload.created_after = new Date(dateAfter).toISOString();
      if (dateBefore) payload.created_before = new Date(dateBefore).toISOString();

      await campaignService.startCampaign(campaign._id, payload);
      
      setStatus("success");
      setMessage("Campaign launched successfully!");
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
      }, 1500);
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Failed to start campaign.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-card-border)] bg-indigo-900/20">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Play className="mr-2 h-5 w-5 text-indigo-400" /> Launch: {campaign.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-center">
            <input
              id="all_selected"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-[#09090b]"
              checked={allSelected}
              onChange={(e) => setAllSelected(e.target.checked)}
            />
            <label htmlFor="all_selected" className="ml-2 block text-sm text-white">
              Target ALL Contacts
            </label>
          </div>

          {!allSelected && (
            <div className="space-y-4 pt-2 border-t border-[var(--color-card-border)]">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  className="w-full bg-[#09090b] border border-[var(--color-card-border)] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="vip, newsletter"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Created After</label>
                  <input
                    type="date"
                    className="w-full bg-[#09090b] border border-[var(--color-card-border)] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                    value={dateAfter}
                    onChange={(e) => setDateAfter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Created Before</label>
                  <input
                    type="date"
                    className="w-full bg-[#09090b] border border-[var(--color-card-border)] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                    value={dateBefore}
                    onChange={(e) => setDateBefore(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center text-emerald-400 text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2 shrink-0" />
              {message}
            </div>
          )}

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-[var(--color-card-border)] rounded-lg text-sm font-medium text-gray-300 hover:bg-[#27272a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="flex-1 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex justify-center"
            >
              {status === "loading" ? "Launching..." : "Launch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

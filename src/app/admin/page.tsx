"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, FileDown, Eye, X } from "lucide-react";

type Application = {
  id: string;
  legalName: string;
  preferredName?: string | null;
  dob?: string | null;
  gender?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  idType?: string | null;
  idNumber?: string | null;
  emergencyName?: string | null;
  emergencyRelation?: string | null;
  emergencyPhone?: string | null;
  fanClubAffiliation: string | null;
  favoriteMovie: string | null;
  status: string;
  createdAt: string;
  cardHolderName: string;
  accessLevel: string;
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchApplications();
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredApps = applications.filter(app => 
    app.legalName.toLowerCase().includes(search.toLowerCase()) || 
    (app.fanClubAffiliation && app.fanClubAffiliation.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <header className="bg-black text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-playfair tracking-widest font-bold">WME</h1>
          <h2 className="text-sm font-light uppercase tracking-wide">Security Admin Dashboard</h2>
        </div>
        <button className="text-sm uppercase tracking-wider hover:text-gray-300">Sign Out</button>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold font-playfair">Access Card Applications</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search applicants..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-black focus:border-black rounded-sm w-64"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 border-b border-gray-200">Applicant</th>
                <th className="p-4 border-b border-gray-200">Fan Club</th>
                <th className="p-4 border-b border-gray-200">Access Level</th>
                <th className="p-4 border-b border-gray-200">Date Submitted</th>
                <th className="p-4 border-b border-gray-200">Status</th>
                <th className="p-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredApps.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No applications found.</td></tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{app.legalName}</td>
                    <td className="p-4 text-gray-600">{app.fanClubAffiliation || 'None'}</td>
                    <td className="p-4 text-gray-600">{app.accessLevel}</td>
                    <td className="p-4 text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                        app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button onClick={() => setSelectedApp(app)} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleStatusChange(app.id, 'APPROVED')} className="p-1.5 text-green-600 hover:bg-green-100 rounded" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatusChange(app.id, 'REJECTED')} className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {app.status === 'APPROVED' && (
                          <button onClick={() => window.open(`/admin/pdf/${app.id}`, '_blank')} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="Generate PDF">
                            <FileDown className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal for viewing details */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded shadow-2xl relative">
            <div className="sticky top-0 bg-black text-white p-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold tracking-widest uppercase">Applicant Dossier: {selectedApp.id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelectedApp(null)} className="p-1 hover:bg-gray-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div><span className="text-xs text-gray-500 uppercase font-bold">Legal Name</span><p className="font-semibold">{selectedApp.legalName}</p></div>
                <div><span className="text-xs text-gray-500 uppercase font-bold">Preferred Name</span><p className="font-semibold">{selectedApp.preferredName || 'N/A'}</p></div>
                <div><span className="text-xs text-gray-500 uppercase font-bold">Date of Birth</span><p className="font-semibold">{selectedApp.dob || 'N/A'}</p></div>
                <div><span className="text-xs text-gray-500 uppercase font-bold">Gender</span><p className="font-semibold">{selectedApp.gender || 'N/A'}</p></div>
                <div><span className="text-xs text-gray-500 uppercase font-bold">Nationality</span><p className="font-semibold">{selectedApp.nationality || 'N/A'}</p></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div><span className="text-xs text-gray-500 uppercase font-bold">Email</span><p className="font-semibold">{selectedApp.email || 'N/A'}</p></div>
                <div><span className="text-xs text-gray-500 uppercase font-bold">Phone</span><p className="font-semibold">{selectedApp.phone || 'N/A'}</p></div>
                <div className="md:col-span-2"><span className="text-xs text-gray-500 uppercase font-bold">Address</span><p className="font-semibold">{selectedApp.address || 'N/A'}</p></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div><span className="text-xs text-gray-500 uppercase font-bold">Gov ID Type</span><p className="font-semibold">{selectedApp.idType || 'Passport'}</p></div>
                <div><span className="text-xs text-gray-500 uppercase font-bold">Gov ID Number</span><p className="font-semibold text-red-600 tracking-wider">{selectedApp.idNumber || 'N/A'}</p></div>
                <div className="md:col-span-2"><span className="text-xs text-gray-500 uppercase font-bold">Emergency Contact</span><p className="font-semibold">{selectedApp.emergencyName} ({selectedApp.emergencyRelation}) - {selectedApp.emergencyPhone}</p></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div><span className="text-xs text-gray-500 uppercase font-bold">Fan Affiliation</span><p className="font-semibold">{selectedApp.fanClubAffiliation || 'Independent'}</p></div>
                <div><span className="text-xs text-gray-500 uppercase font-bold">Favorite Movie</span><p className="font-semibold">{selectedApp.favoriteMovie || 'Undisclosed'}</p></div>
                <div className="md:col-span-2"><span className="text-xs text-gray-500 uppercase font-bold">Requested Access Level</span><p className="font-semibold bg-gray-100 p-2 inline-block border border-gray-300 mt-1">{selectedApp.accessLevel}</p></div>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 border rounded">
                <span className={`px-3 py-1 font-bold rounded-full uppercase tracking-wider text-sm ${
                  selectedApp.status === 'APPROVED' ? 'bg-green-200 text-green-900' :
                  selectedApp.status === 'REJECTED' ? 'bg-red-200 text-red-900' :
                  'bg-yellow-200 text-yellow-900'
                }`}>
                  STATUS: {selectedApp.status}
                </span>
                
                <div className="flex gap-3">
                  <button onClick={() => window.open(`/admin/pdf/${selectedApp.id}`, '_blank')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700">
                    <FileDown className="w-4 h-4" /> View PDF
                  </button>
                  {selectedApp.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusChange(selectedApp.id, 'REJECTED')} className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-bold hover:bg-red-200 border border-red-300">Reject</button>
                      <button onClick={() => handleStatusChange(selectedApp.id, 'APPROVED')} className="bg-green-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-green-700">Approve</button>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

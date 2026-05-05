'use client';

import { useEffect, useState } from 'react';
import { Case, Clinic } from '@/types';

export default function AdminPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then(setCases);
    
    fetch('/facilities.json')
      .then((res) => res.json())
      .then(setClinics);
  }, []);

  const getClinicName = (clinicId: string) => {
    return clinics.find((c) => c.id === clinicId)?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - All Cases</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Clinic</th>
              <th className="px-4 py-2 text-left">Disease</th>
              <th className="px-4 py-2 text-left">County Code</th>
              <th className="px-4 py-2 text-left">Case ID</th>
              <th className="px-4 py-2 text-left">Reported At</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr key={caseItem.id} className="border-t">
                <td className="px-4 py-2">{caseItem.id}</td>
                <td className="px-4 py-2">{getClinicName(caseItem.clinicId)}</td>
                <td className="px-4 py-2">{caseItem.disease}</td>
                <td className="px-4 py-2">{caseItem.countyCode}</td>
                <td className="px-4 py-2">{caseItem.caseId}</td>
                <td className="px-4 py-2">{new Date(caseItem.reportedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {cases.length === 0 && (
          <p className="p-4 text-center text-gray-500">No cases reported yet.</p>
        )}
      </div>
    </div>
  );
}
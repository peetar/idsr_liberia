'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clinic } from '@/types';

export default function LoginPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/facilities.json')
      .then(res => res.json())
      .then(setClinics);
  }, []);

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    localStorage.setItem('selectedClinic', JSON.stringify(clinic));
    router.push('/clinic');
  };

  useEffect(() => {
    // Check if already logged in
    const stored = localStorage.getItem('selectedClinic');
    if (stored) {
      router.push('/clinic');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Your Health Facility</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredClinics.slice(0, 50).map((clinic) => (  // Limit to 50 for performance
            <div
              key={clinic.id}
              onClick={() => handleSelectClinic(clinic)}
              className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            >
              <div className="font-medium">{clinic.name}</div>
              <div className="text-sm text-gray-600">{clinic.county}</div>
            </div>
          ))}
        </div>
        {filteredClinics.length > 50 && (
          <p className="text-sm text-gray-500 mt-2">Showing first 50 results. Refine search for more.</p>
        )}
        {filteredClinics.length === 0 && searchTerm && (
          <p className="text-center text-gray-500 mt-4">No facilities found</p>
        )}
      </div>
    </div>
  );
}
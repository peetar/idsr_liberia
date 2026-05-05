'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { diseases, Clinic } from '@/types';

export default function ClinicPage() {
  const [selectedDisease, setSelectedDisease] = useState('');
  const [message, setMessage] = useState('');
  const [idsrId, setIdsrId] = useState('');
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('selectedClinic');
    if (stored) {
      setClinic(JSON.parse(stored));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisease || !clinic) {
      setMessage('Please select a disease');
      return;
    }

    const response = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clinicId: clinic.id,
        disease: selectedDisease,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      setIdsrId(result.idsrId || '');
      setMessage(`Case reported successfully: ${result.idsrId}`);
      setSelectedDisease('');
    } else {
      setMessage('Error reporting case');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('selectedClinic');
    router.push('/');
  };

  if (!clinic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Report New Case</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Logout
          </button>
        </div>
        <p className="mb-4">Facility: {clinic.name} ({clinic.county})</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Disease</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select disease</option>
              {diseases.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit New Case
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {idsrId && (
          <p className="mt-2 text-center text-gray-700">Submitted IDSR case: {idsrId}</p>
        )}
      </div>
    </div>
  );
}
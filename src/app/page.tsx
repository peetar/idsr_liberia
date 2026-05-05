import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">IDSR Liberia Prototype</h1>
        <div className="space-y-4">
          <Link href="/login" className="block w-full bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600">
            Clinic Login
          </Link>
          <Link href="/admin" className="block w-full bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

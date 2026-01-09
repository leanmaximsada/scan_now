'use client';

import Image from 'next/image';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const salesData = [
  { month: 'Jan', sales: 1200 },
  { month: 'Feb', sales: 1400 },
  { month: 'Mar', sales: 1800 },
  { month: 'Apr', sales: 2300 },
  { month: 'May', sales: 2800 },
  { month: 'Jun', sales: 3800 },
  { month: 'Jul', sales: 3400 },
  { month: 'Aug', sales: 2900 },
  { month: 'Sep', sales: 2500 },
  { month: 'Oct', sales: 2200 },
  { month: 'Nov', sales: 2000 },
  { month: 'Dec', sales: 2100 },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-6 py-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
          <span className="font-semibold text-lg">Scan Now</span>
        </div>

        <nav className="flex flex-col gap-4 text-sm text-gray-600">
          <a className="font-medium text-blue-600">Home</a>
          <a>AddMenu</a>
          <a>Order</a>
        </nav>

        <div className="mt-auto text-sm text-gray-500">Setting</div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Sale" value="$2000" />
          <StatCard title="Order" value="126" />
          <StatCard title="Revenue" value="$1200" />
        </div>

        {/* Chart + Top selling */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Sales Overview</h2>
              <span className="text-sm text-gray-500">Monthly</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-sm text-green-600 mt-3">
              +17% vs last month
            </p>
          </div>

          {/* Top selling item */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Top selling item</h2>

            <TopItem img="/logo/food1.png" name="Kuy Thiev" sale={126} />
            <TopItem img="/logo/food2.png" name="Bay mon" sale={56} />
            <TopItem img="/logo/food3.png" name="Nom" sale={120} />
            <TopItem img="/logo/food4.png" name="Food 4" sale={90} />
          </div>
        </div>

        {/* Order Overall */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Order Overall</h2>
          <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded">
            more detail
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

function TopItem({
  img,
  name,
  sale,
}: {
  img: string;
  name: string;
  sale: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Image src={img} alt={name} width={48} height={48} className="rounded-lg" />
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{sale} sale</p>
        <div className="h-2 bg-gray-200 rounded mt-1">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${Math.min(sale, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

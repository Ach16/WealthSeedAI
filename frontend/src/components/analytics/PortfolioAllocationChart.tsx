import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { usePortfolioStore } from '../../stores/portfolioStore';

const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'];

export function PortfolioAllocationChart() {
  const { holdings, summary } = usePortfolioStore();

  if (!summary) return null;

  // Aggregate holdings by asset type
  const typeMap: Record<string, number> = { 'Cash': summary.cash_balance };
  
  holdings.forEach(h => {
    typeMap[h.asset_type] = (typeMap[h.asset_type] || 0) + h.market_value;
  });

  const data = Object.keys(typeMap).map(key => ({
    name: key,
    value: typeMap[key]
  })).filter(d => d.value > 0);

  return (
    <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Asset Allocation</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ChartDataItem } from '../types';

interface PatentChartProps {
    data: ChartDataItem[];
}

const COLORS = ['#818cf8', '#a78bfa', '#c084fc', '#f472b6', '#fb7185', '#fdba74'];

export const PatentChart: React.FC<PatentChartProps> = ({ data }) => {
    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-indigo-300">Data Visualization</h3>
            <div className="w-full h-72 bg-gray-900/50 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="name" tick={{ fill: '#d1d5db' }} />
                        <YAxis tick={{ fill: '#d1d5db' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #4b5563',
                                color: '#e5e7eb',
                            }}
                            cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }}
                        />
                        <Bar dataKey="value" name="Value" fill="#8884d8" barSize={30}>
                             {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

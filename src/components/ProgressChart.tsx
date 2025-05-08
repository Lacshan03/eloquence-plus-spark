
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProgressChartProps {
  data: {
    date: string;
    score: number;
    fluidity?: number;
    vocabulary?: number;
    grammar?: number;
  }[];
  height?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, height = 300 }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#718096" />
          <YAxis stroke="#718096" domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
              border: 'none' 
            }} 
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#1A365D" 
            strokeWidth={2}
            activeDot={{ r: 6 }} 
            name="Score global"
          />
          {data[0]?.fluidity !== undefined && (
            <Line 
              type="monotone" 
              dataKey="fluidity" 
              stroke="#38B2AC" 
              strokeWidth={2} 
              name="Fluidité"
            />
          )}
          {data[0]?.vocabulary !== undefined && (
            <Line 
              type="monotone" 
              dataKey="vocabulary" 
              stroke="#ED8936" 
              strokeWidth={2} 
              name="Vocabulaire"
            />
          )}
          {data[0]?.grammar !== undefined && (
            <Line 
              type="monotone" 
              dataKey="grammar" 
              stroke="#9F7AEA" 
              strokeWidth={2} 
              name="Grammaire"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;

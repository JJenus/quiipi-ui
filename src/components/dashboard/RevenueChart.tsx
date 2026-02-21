// src/components/dashboard/RevenueChart.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartDataPoint } from '@/services/dashboard.service';
import { formatCurrency } from '@/utils/dateUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RevenueChartProps {
  data: ChartDataPoint[] | undefined;
}

type ChartType = 'line' | 'bar' | 'area';
type TimeRange = '6m' | '1y' | '2y';

export const RevenueChart: React.FC<RevenueChartProps> = ({ data = [] }) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');
  const [showComparison, setShowComparison] = useState(false);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No revenue data available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add invoices to see revenue trends
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate metrics
  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);
  const averageRevenue = totalRevenue / data.length;
  const maxRevenue = Math.max(...data.map(item => item.value));
  const minRevenue = Math.min(...data.map(item => item.value));
  
  // Calculate trend
  const lastMonth = data[data.length - 1]?.value || 0;
  const previousMonth = data[data.length - 2]?.value || 0;
  const trend = previousMonth ? ((lastMonth - previousMonth) / previousMonth) * 100 : 0;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            {showComparison && (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={false}
              />
            )}
          </ComposedChart>
        );

      case 'area':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
            {showComparison && (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
          </ComposedChart>
        );

      default: // line chart
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            {showComparison && (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
              <Badge 
                variant={trend >= 0 ? 'default' : 'destructive'}
                className={cn(
                  "gap-1",
                  trend >= 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                )}
              >
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                {Math.abs(trend).toFixed(1)}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={chartType === 'line' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'area' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setChartType('area')}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>

            {/* Time Range Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={timeRange === '6m' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setTimeRange('6m')}
              >
                6M
              </Button>
              <Button
                variant={timeRange === '1y' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setTimeRange('1y')}
              >
                1Y
              </Button>
              <Button
                variant={timeRange === '2y' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setTimeRange('2y')}
              >
                2Y
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-sm font-medium">{formatCurrency(averageRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Highest</p>
            <p className="text-sm font-medium">{formatCurrency(maxRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Lowest</p>
            <p className="text-sm font-medium">{formatCurrency(minRevenue)}</p>
          </div>
        </div>

        {/* Comparison Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "mt-2 h-7 text-xs",
            showComparison && "bg-primary/10 text-primary"
          )}
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Show'} Year-over-Year Comparison
        </Button>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
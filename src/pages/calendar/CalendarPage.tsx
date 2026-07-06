import React from 'react';
import { BarChart3, TrendingUp, Sparkles, Users, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const metrics = [
  {
    title: 'Active Opportunities',
    value: '24',
    change: '+8% vs last month',
    icon: <Sparkles size={20} className="text-primary-600" />,
    bg: 'bg-primary-100',
  },
  {
    title: 'Engagement Rate',
    value: '82%',
    change: '+5% this week',
    icon: <TrendingUp size={20} className="text-secondary-600" />,
    bg: 'bg-secondary-100',
  },
  {
    title: 'Investor Connections',
    value: '136',
    change: '+12 new this month',
    icon: <Users size={20} className="text-accent-600" />,
    bg: 'bg-accent-100',
  },
  {
    title: 'Pipeline Value',
    value: '$4.8M',
    change: '+14% this quarter',
    icon: <DollarSign size={20} className="text-success-600" />,
    bg: 'bg-success-100',
  },
];

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Monitor performance, engagement, and opportunities in one place.</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardBody>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bg}`}>
                  {metric.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Growth Overview</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary-100 p-2 text-primary-600">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Momentum</p>
                    <p className="text-sm text-gray-500">Strong upward trend</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-success-600">+18%</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary-100 p-2 text-secondary-600">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Lead Quality</p>
                    <p className="text-sm text-gray-500">High-intent conversations</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary-600">Excellent</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Recommended Actions</h2>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="rounded-lg border border-gray-200 p-3">Follow up with the top 5 investors who viewed your profile this week.</li>
              <li className="rounded-lg border border-gray-200 p-3">Share the latest funding milestone with your warm network.</li>
              <li className="rounded-lg border border-gray-200 p-3">Review your document checklist to stay ready for the next round.</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

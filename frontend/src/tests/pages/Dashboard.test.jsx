import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';

// Mock the hooks
vi.mock('../../hooks/useReports', () => ({
  useDashboardSummary: () => ({
    data: {
      data: {
        todayRevenue: 1500,
        todaySales: 25,
        avgOrderValue: 60,
        activeProducts: 150,
        revenueChange: 12.5,
        salesChange: 8.2,
      },
    },
    isLoading: false,
  }),
  useLowStock: () => ({
    data: { data: [] },
    isLoading: false,
  }),
  useTopProducts: () => ({
    data: { data: [] },
    isLoading: false,
  }),
}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('DashboardPage', () => {
  it('renders dashboard stats', () => {
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText("Today's Revenue")).toBeInTheDocument();
    expect(screen.getByText("Today's Sales")).toBeInTheDocument();
    expect(screen.getByText('Avg. Order Value')).toBeInTheDocument();
    expect(screen.getByText('Active Products')).toBeInTheDocument();
  });

  it('renders top products section', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Top Products')).toBeInTheDocument();
  });

  it('renders low stock alert section', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Low Stock Alert')).toBeInTheDocument();
  });
});

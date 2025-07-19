'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, BarChart3, Plus, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0
  });

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || user?.role !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, isLoggedIn, user, router]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      fetchStats();
    }
  }, [isLoggedIn, user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch properties count
      const propertiesResponse = await fetch('/api/admin/properties?limit=1', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (propertiesResponse.ok) {
        const data = await propertiesResponse.json();
        setStats(prev => ({ ...prev, totalProperties: data.data?.pagination?.total || 0 }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between sm:items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/admin/properties/new">
                <Button className="bg-rose-500 hover:bg-rose-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  Manage all properties, view analytics, and handle listings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Link href="/admin/properties">
                    <Button className="w-full justify-start" variant="outline">
                      <Building2 className="w-4 h-4 mr-2" />
                      View All Properties
                    </Button>
                  </Link>
                  <Link href="/admin/properties/new">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Property
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts, roles, and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  Track bookings, handle cancellations, and manage reservations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Booking management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system settings, integrations, and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    General Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

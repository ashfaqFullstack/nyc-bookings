'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Property {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminProperties() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || user?.role !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, isLoggedIn, user, router]);

  const fetchProperties = useCallback(async (page = 1) => {
    console.log(`Fetching admin properties for page ${page}...`);
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      console.log('Admin token exists:', !!token);
      if (!token) return;

      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const url = `/api/admin/properties?${searchParams}`;
      console.log('Admin properties fetch URL:', url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Admin properties response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Admin properties data received:', data);
        setProperties(data.data?.properties || []);
        setPagination(data.data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
        console.log('Properties set:', data.data?.properties?.length || 0);
      } else {
        const errorData = await response.json();
        console.error('Admin properties error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pagination.limit]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      fetchProperties(pagination.page);
    }
  }, [isLoggedIn, user, fetchProperties, pagination.page]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchProperties(newPage);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/properties?id=${propertyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500" />
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
          <div className="flex justify-between flex-col md:flex-row md:items-center py-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <Link className='hidden md:block' href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div >
                <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
                <p className="text-gray-600">Manage all property listings</p>
              </div>
            </div>
            <div className='mt-4 flex justify-between flex-wrap gap-4'  >
             <Link className='block md:hidden' href="/admin">
                <Button variant="outline" >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/admin/properties/new">
                <Button className="bg-rose-500 hover:bg-rose-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Properties
            </CardTitle>
            <CardDescription>
              Manage all property listings in your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto" />
                <p className="mt-4 text-gray-600">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No properties found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={property.images[0] || '/placeholder.jpg'}
                            alt={property.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {property.title}
                              </h3>
                              <p className="text-gray-600">{property.location}</p>
                              <p className="text-sm text-gray-500">{property.neighborhood}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={property.isActive ? "default" : "secondary"}>
                                {property.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">
                                ${property.price}/night
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{property.bedrooms} bed</span>
                              <span>{property.bathrooms} bath</span>
                              <span>{property.guests} guests</span>
                              <span>★ {property.rating} ({property.reviewCount})</span>
                            </div>
                            <div className="flex items-center mt-1 md:mt-0 space-x-2">
                              <Button size="sm" variant="outline" onClick={() => router.push(`/admin/properties/${property.id}`)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteProperty(property.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pagination.page - 1);
                        }}
                        className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <PaginationItem key={`page-${i + 1}`}>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i + 1);
                          }}
                          isActive={pagination.page === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pagination.page + 1);
                        }}
                        className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

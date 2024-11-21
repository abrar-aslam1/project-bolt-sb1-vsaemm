import { supabase } from './supabase';

export async function getVendors(params: {
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const offset = ((params.page || 1) - 1) * (params.limit || 10);
  let query = supabase.from('vendors').select('*', { count: 'exact' });

  if (params.category && params.category !== "All Categories") {
    query = query.eq('category', params.category);
  }

  if (params.location) {
    query = query.ilike('location', `%${params.location}%`);
  }

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`);
  }

  const { data: vendors, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + (params.limit || 10) - 1);

  if (error) throw error;

  return {
    vendors: vendors || [],
    pagination: {
      currentPage: params.page || 1,
      totalPages: Math.ceil((count || 0) / (params.limit || 10)),
      totalItems: count || 0,
    },
  };
}

export async function getVendor(id: string) {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return vendor;
}

export async function getLocations(query: string = '') {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .or(`city.ilike.%${query}%,state_name.ilike.%${query}%`)
    .limit(10);

  if (error) throw error;
  return locations || [];
}

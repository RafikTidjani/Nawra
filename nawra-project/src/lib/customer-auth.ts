// src/lib/customer-auth.ts
// Customer authentication using Supabase Auth

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface CustomerProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shippingCost: number;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  items: CustomerOrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
  };
}

export interface CustomerOrderItem {
  id: string;
  productId?: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  quantity: number;
  total: number;
}

// Sign up a new customer
export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) throw error;

  // Create customer profile
  if (data.user) {
    const { error: profileError } = await supabaseClient
      .from('customers')
      .insert({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
      });

    if (profileError) {
      console.error('Error creating customer profile:', profileError);
    }

    // Link any existing guest orders with this email to the new account
    await linkGuestOrders(data.user.id, email);
  }

  return data;
}

// Link guest orders to a customer account
async function linkGuestOrders(customerId: string, email: string) {
  try {
    // Find orders with this email that don't have a customer_id
    const { error } = await supabaseClient
      .from('orders')
      .update({ customer_id: customerId })
      .eq('shipping_email', email)
      .is('customer_id', null);

    if (error) {
      console.error('Error linking guest orders:', error);
    }
  } catch (err) {
    console.error('Error linking guest orders:', err);
  }
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

// Get current session
export async function getSession() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Get current user
export async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) return null;
  return data.user;
}

// Get customer profile
export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabaseClient
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    createdAt: data.created_at,
  };
}

// Update customer profile
export async function updateCustomerProfile(updates: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabaseClient
    .from('customers')
    .update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      phone: updates.phone,
    })
    .eq('id', user.id);

  if (error) throw error;
}

// Get customer addresses
export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('addresses')
    .select('*')
    .eq('customer_id', user.id)
    .order('is_default', { ascending: false });

  if (error || !data) return [];

  return data.map((addr) => ({
    id: addr.id,
    label: addr.label,
    firstName: addr.first_name,
    lastName: addr.last_name,
    address: addr.address,
    address2: addr.address2,
    city: addr.city,
    zip: addr.zip,
    country: addr.country,
    phone: addr.phone,
    isDefault: addr.is_default,
  }));
}

// Add new address
export async function addAddress(address: Omit<CustomerAddress, 'id'>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // If this is the default address, unset other defaults
  if (address.isDefault) {
    await supabaseClient
      .from('addresses')
      .update({ is_default: false })
      .eq('customer_id', user.id);
  }

  const { data, error } = await supabaseClient
    .from('addresses')
    .insert({
      customer_id: user.id,
      label: address.label,
      first_name: address.firstName,
      last_name: address.lastName,
      address: address.address,
      address2: address.address2,
      city: address.city,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
      is_default: address.isDefault,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete address
export async function deleteAddress(addressId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabaseClient
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('customer_id', user.id);

  if (error) throw error;
}

// Get customer orders
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    total: parseFloat(order.total),
    subtotal: parseFloat(order.subtotal),
    shippingCost: parseFloat(order.shipping_cost || 0),
    createdAt: order.created_at,
    paidAt: order.paid_at,
    shippedAt: order.shipped_at,
    deliveredAt: order.delivered_at,
    trackingNumber: order.tracking_number,
    trackingCarrier: order.tracking_carrier,
    shippingAddress: {
      firstName: order.shipping_first_name,
      lastName: order.shipping_last_name,
      address: order.shipping_address,
      address2: order.shipping_address2,
      city: order.shipping_city,
      zip: order.shipping_zip,
      country: order.shipping_country,
      phone: order.shipping_phone,
      email: order.shipping_email,
    },
    items: (order.order_items || []).map((item: {
      id: string;
      product_id?: string;
      product_name: string;
      product_price: string | number;
      product_image?: string;
      quantity: number;
      total: string | number;
    }) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productPrice: parseFloat(String(item.product_price)),
      productImage: item.product_image,
      quantity: item.quantity,
      total: parseFloat(String(item.total)),
    })),
  }));
}

// Get single order
export async function getCustomerOrder(orderId: string): Promise<CustomerOrder | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabaseClient
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .eq('customer_id', user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    orderNumber: data.order_number,
    status: data.status,
    total: parseFloat(data.total),
    subtotal: parseFloat(data.subtotal),
    shippingCost: parseFloat(data.shipping_cost || 0),
    createdAt: data.created_at,
    paidAt: data.paid_at,
    shippedAt: data.shipped_at,
    deliveredAt: data.delivered_at,
    trackingNumber: data.tracking_number,
    trackingCarrier: data.tracking_carrier,
    shippingAddress: {
      firstName: data.shipping_first_name,
      lastName: data.shipping_last_name,
      address: data.shipping_address,
      address2: data.shipping_address2,
      city: data.shipping_city,
      zip: data.shipping_zip,
      country: data.shipping_country,
      phone: data.shipping_phone,
      email: data.shipping_email,
    },
    items: (data.order_items || []).map((item: {
      id: string;
      product_id?: string;
      product_name: string;
      product_price: string | number;
      product_image?: string;
      quantity: number;
      total: string | number;
    }) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productPrice: parseFloat(String(item.product_price)),
      productImage: item.product_image,
      quantity: item.quantity,
      total: parseFloat(String(item.total)),
    })),
  };
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

// Reset password (send email)
export async function resetPassword(email: string) {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/account/reset-password`,
  });

  if (error) throw error;
}

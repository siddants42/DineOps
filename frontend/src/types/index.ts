export type UserRole = "Admin" | "Manager" | "Staff"

export interface AuthUser {
  id: number
  email: string
  name: string
  full_name?: string
  role?: UserRole
  role_name?: UserRole | null
  role_id?: number | null
  is_active?: boolean
  created_at?: string
}

export interface UserRecord extends AuthUser {
  role_name?: UserRole | null
}

export interface RoleRecord {
  id: number
  name: UserRole
  description?: string | null
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

/* ---------------- DASHBOARD ---------------- */

export interface DashboardData {
  total_products: number
  total_customers: number
  total_orders: number
  total_sales: number
  pending_orders: number
}

export interface DashboardAnalytics {
  today_sales: number
  inventory_value: number
  pending_payments: number
  low_stock_items: number
  completed_orders: number
}

/* ---------------- CUSTOMERS ---------------- */

export interface Customer {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  created_at?: string
  updated_at?: string
}

/* ---------------- SUPPLIERS ---------------- */

export interface Supplier {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  created_at?: string
  updated_at?: string
}

/* ---------------- CATEGORIES ---------------- */

export interface Category {
  id: number
  name: string
  description?: string | null
  is_active?: boolean
  created_at?: string
}

/* ---------------- PRODUCTS ---------------- */

export interface Product {
  id: number
  name: string
  description?: string | null
  price: number
  category_id?: number | null
  category_name?: string | null
  sku?: string | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

/* ---------------- INVENTORY ---------------- */

export interface Inventory {
  id: number
  product_id: number
  product_name?: string
  quantity: number
  minimum_stock: number
  updated_at?: string
}

/* ---------------- SALES ORDERS ---------------- */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled"

export interface SalesOrder {
  id: number
  customer_id?: number | null
  customer_name?: string | null
  status: OrderStatus
  total_amount: number
  created_at?: string
  updated_at?: string
}

/* ---------------- PURCHASE ORDERS ---------------- */

export type PurchaseOrderStatus =
  | "pending"
  | "approved"
  | "received"
  | "cancelled"

export interface PurchaseOrder {
  id: number
  supplier_id?: number | null
  supplier_name?: string | null
  status: PurchaseOrderStatus
  total_amount: number
  created_at?: string
  updated_at?: string
}

/* ---------------- INVOICES ---------------- */

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "cancelled"
  | "overdue"

export interface Invoice {
  id: number
  customer_id?: number | null
  customer_name?: string | null
  sales_order_id?: number | null
  invoice_number?: string
  subtotal?: number
  tax?: number
  discount?: number
  total_amount: number
  status: InvoiceStatus
  created_at?: string
  due_date?: string
}

/* ---------------- PAYMENTS ---------------- */

export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"

export interface Payment {
  id: number
  invoice_id?: number | null
  amount: number
  method?: string | null
  status: PaymentStatus
  transaction_id?: string | null
  created_at?: string
}

/* ---------------- NOTIFICATIONS ---------------- */

export type NotificationType =
  | "order"
  | "payment"
  | "inventory"
  | "invoice"
  | "system"

export interface Notification {
  id: number
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at?: string
}

/* ---------------- AUDIT LOGS ---------------- */

export interface AuditLog {
  id: number
  user_id?: number | null
  user_name?: string | null
  action: string
  entity_type: string
  entity_id?: number | null
  description?: string | null
  created_at?: string
}

/* ---------------- API ---------------- */

export interface ApiErrorResponse {
  detail?: string
}

/* ---------------- NAVIGATION ---------------- */

export interface NavItem {
  name: string
  path: string
  roles?: UserRole[]
  icon?: string
}
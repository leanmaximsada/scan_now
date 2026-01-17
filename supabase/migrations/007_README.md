# Migration 007: Menu and Orders Tables

This migration creates the complete database structure for the menu and ordering system based on the UI requirements.

## What This Migration Creates

### 1. **categories** table
Stores menu item categories (Food, Drink, Dessert, etc.)
- `id`: UUID primary key
- `name`: Category name (e.g., "Food", "Drink")
- `slug`: URL-friendly identifier (e.g., "food", "drink")
- `icon`: Optional icon/emoji
- Default categories are automatically inserted

### 2. **menu_items** table
Stores restaurant menu items/dishes
- `id`: UUID primary key
- `user_id`: References restaurant owner (auth.users)
- `name`: Dish name
- `description`: Dish description
- `price`: Price in USD (DECIMAL)
- `category_id`: References categories table
- `image_url`: URL to dish image
- `status`: 'available' or 'unavailable'
- `preparation_time`: Time in minutes
- `is_featured`: Boolean for "recommended" items
- Indexed on user_id, category_id, and status

### 3. **restaurant_tables** table
Stores restaurant table information for QR codes
- `id`: UUID primary key
- `user_id`: References restaurant owner
- `table_number`: Table identifier (e.g., "01", "Table 5")
- `qr_code_data`: QR code identifier/data
- `qr_code_url`: URL to QR code image
- `is_active`: Whether table is active
- Unique constraint on (user_id, table_number)

### 4. **orders** table
Stores customer orders
- `id`: UUID primary key
- `user_id`: References restaurant owner
- `table_id`: References restaurant_tables (optional)
- `table_number`: Denormalized for quick access
- `customer_name`: Optional customer name
- `order_number`: Display number (e.g., "#table-01-001")
- `status`: 'pending', 'preparing', 'completed', 'cancelled'
- `total_amount`: Order total (auto-calculated from order_items)
- `notes`: Special instructions
- `completed_at`: Timestamp when order was completed
- Indexed on user_id, table_id, status, and created_at

### 5. **order_items** table
Junction table for items in each order
- `id`: UUID primary key
- `order_id`: References orders
- `menu_item_id`: References menu_items
- `quantity`: Number of items
- `price_at_order`: Price at time of order (for historical accuracy)
- `subtotal`: quantity * price_at_order
- `special_instructions`: Item-specific notes
- Indexed on order_id and menu_item_id

## Key Features

### Automatic Calculations
- **Order Total**: Automatically calculated from order_items when items are added/updated/deleted
- **Order Number**: Helper function `generate_order_number()` available (should be called from app code)
- **Updated Timestamps**: All tables with `updated_at` automatically update on row changes

### Row Level Security (RLS)

#### Menu Items
- ✅ Restaurant owners can manage their own menu items (CRUD)
- ✅ Public can view available menu items (for QR code menu display)
- ✅ Restaurant owners can see all their items (including unavailable)

#### Restaurant Tables
- ✅ Restaurant owners can manage their own tables (CRUD)
- ✅ Public can view active tables (for QR code scanning)

#### Orders
- ✅ Restaurant owners can view and update orders for their restaurant
- ✅ Anyone can create orders (allows anonymous QR code ordering)
- ⚠️ **Important**: When creating orders, the `user_id` must be set by your application code

#### Order Items
- ✅ Restaurant owners can view order items for their restaurant orders
- ✅ Anyone can insert order items (for order creation)
- ✅ Restaurant owners can update order items

## Usage Examples

### Creating a Menu Item
```sql
INSERT INTO menu_items (user_id, name, description, price, category_id, status)
VALUES (
  'user-uuid-here',
  'Cheeseburger',
  'Classic cheeseburger with cheddar',
  12.99,
  (SELECT id FROM categories WHERE slug = 'food'),
  'available'
);
```

### Creating an Order (from QR code scan)
```sql
INSERT INTO orders (user_id, table_number, order_number, status)
VALUES (
  'restaurant-user-uuid',
  '01',
  '#table-01-001',
  'pending'
);
```

### Adding Items to Order
```sql
INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order, subtotal)
VALUES (
  'order-uuid',
  'menu-item-uuid',
  2,
  12.99,
  25.98  -- quantity * price_at_order
);
-- Order total will be automatically updated!
```

### Updating Order Status (Kitchen Staff)
```sql
UPDATE orders
SET status = 'completed', completed_at = NOW()
WHERE id = 'order-uuid' AND user_id = 'restaurant-user-uuid';
```

## Running This Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `007_create_menu_and_orders_tables.sql`
4. Click **Run** (or press CTRL + Enter)
5. Verify tables were created by checking the Table Editor

## Notes

- All tables include `created_at` and `updated_at` timestamps
- Foreign key constraints ensure data integrity
- Check constraints validate data (e.g., price >= 0, status values)
- Indexes are created for common query patterns
- RLS policies allow anonymous order creation (for QR code scanning) while protecting restaurant data

## Next Steps

After running this migration:
1. Your application can start creating menu items
2. Generate QR codes that link to your menu pages
3. Customers can scan QR codes and place orders
4. Kitchen staff can view and update order statuses in the dashboard

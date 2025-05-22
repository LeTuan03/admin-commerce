// Mock data for the admin dashboard

// Dashboard data
export const mockDashboardData = {
  stats: {
    totalRevenue: 125680.45,
    revenueChange: 12.5,
    totalOrders: 1548,
    ordersChange: 8.2,
    totalProducts: 386,
    productsChange: 3.7,
    totalCustomers: 2845,
    customersChange: 15.3,
  },
  salesChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [4500, 5200, 4800, 5800, 6000, 5500, 6500, 7200, 6800, 7800, 8500, 9200],
  },
  categoryDistribution: {
    labels: ['Electronics', 'Clothing', 'Home & Garden', 'Toys', 'Sports'],
    data: [35, 25, 20, 10, 10],
  },
  recentOrders: [
    { id: '1842', date: 'Apr 15, 2025', status: 'Completed', total: 235.89 },
    { id: '1841', date: 'Apr 14, 2025', status: 'Processing', total: 125.99 },
    { id: '1840', date: 'Apr 14, 2025', status: 'Pending', total: 358.45 },
    { id: '1839', date: 'Apr 13, 2025', status: 'Cancelled', total: 49.99 },
    { id: '1838', date: 'Apr 12, 2025', status: 'Completed', total: 195.20 },
  ],
  lowStockProducts: [
    { id: 1, name: 'Bluetooth Headphones', price: 99.99, stock: 3, image: 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 2, name: 'Smart Watch', price: 149.99, stock: 5, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 3, name: 'Portable Speaker', price: 79.99, stock: 2, image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 4, name: 'Digital Camera', price: 499.99, stock: 4, image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ],
};

// Products data
export const mockProducts = [
  { id: 1, name: 'Wireless Bluetooth Headphones', sku: 'SKU-001234', price: 129.99, stock: 45, category: 'Electronics', status: 'Active', image: 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, name: 'Smart Watch Series 5', sku: 'SKU-001235', price: 199.99, stock: 32, category: 'Electronics', status: 'Active', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 3, name: 'Portable Bluetooth Speaker', sku: 'SKU-001236', price: 79.99, stock: 2, category: 'Electronics', status: 'Active', image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 4, name: 'Digital Camera 4K', sku: 'SKU-001237', price: 499.99, stock: 4, category: 'Electronics', status: 'Active', image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 5, name: 'Men\'s Running Shoes', sku: 'SKU-001238', price: 89.99, stock: 25, category: 'Clothing', status: 'Active', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 6, name: 'Women\'s Yoga Pants', sku: 'SKU-001239', price: 49.99, stock: 38, category: 'Clothing', status: 'Active', image: 'https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 7, name: 'Air Purifier', sku: 'SKU-001240', price: 179.99, stock: 12, category: 'Home & Garden', status: 'Active', image: 'https://images.pexels.com/photos/5824883/pexels-photo-5824883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 8, name: 'Robot Vacuum Cleaner', sku: 'SKU-001241', price: 249.99, stock: 8, category: 'Home & Garden', status: 'Active', image: 'https://images.pexels.com/photos/4108282/pexels-photo-4108282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 9, name: 'Wooden Coffee Table', sku: 'SKU-001242', price: 329.99, stock: 5, category: 'Home & Garden', status: 'Active', image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 10, name: 'Smartphone Stand', sku: 'SKU-001243', price: 19.99, stock: 0, category: 'Electronics', status: 'Out of Stock', image: 'https://images.pexels.com/photos/4526459/pexels-photo-4526459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 11, name: 'Ceramic Dinner Set', sku: 'SKU-001244', price: 89.99, stock: 15, category: 'Home & Garden', status: 'Active', image: 'https://images.pexels.com/photos/6270663/pexels-photo-6270663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 12, name: 'Premium Backpack', sku: 'SKU-001245', price: 79.99, stock: 22, category: 'Accessories', status: 'Active', image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

// Orders data
export const mockOrders = [
  { 
    id: '1842', 
    customerName: 'John Smith', 
    email: 'john.smith@example.com',
    date: '2025-04-15T14:48:00', 
    status: 'Completed', 
    total: 235.89,
    paymentMethod: 'Credit Card',
    items: [
      { id: 1, name: 'Wireless Bluetooth Headphones', price: 129.99, quantity: 1 },
      { id: 5, name: 'Men\'s Running Shoes', price: 89.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'United States'
    }
  },
  { 
    id: '1841', 
    customerName: 'Emma Johnson', 
    email: 'emma.johnson@example.com',
    date: '2025-04-14T09:23:00', 
    status: 'Processing', 
    total: 125.99,
    paymentMethod: 'PayPal',
    items: [
      { id: 6, name: 'Women\'s Yoga Pants', price: 49.99, quantity: 1 },
      { id: 11, name: 'Ceramic Dinner Set', price: 89.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States'
    }
  },
  { 
    id: '1840', 
    customerName: 'Michael Brown', 
    email: 'michael.brown@example.com',
    date: '2025-04-14T08:15:00', 
    status: 'Pending', 
    total: 358.45,
    paymentMethod: 'Credit Card',
    items: [
      { id: 4, name: 'Digital Camera 4K', price: 499.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60007',
      country: 'United States'
    }
  },
  { 
    id: '1839', 
    customerName: 'Sophia Rodriguez', 
    email: 'sophia.rodriguez@example.com',
    date: '2025-04-13T16:40:00', 
    status: 'Cancelled', 
    total: 49.99,
    paymentMethod: 'Credit Card',
    items: [
      { id: 6, name: 'Women\'s Yoga Pants', price: 49.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '101 Maple Dr',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'United States'
    }
  },
  { 
    id: '1838', 
    customerName: 'William Lee', 
    email: 'william.lee@example.com',
    date: '2025-04-12T11:20:00', 
    status: 'Delivered', 
    total: 195.20,
    paymentMethod: 'PayPal',
    items: [
      { id: 7, name: 'Air Purifier', price: 179.99, quantity: 1 },
      { id: 10, name: 'Smartphone Stand', price: 19.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '222 Cedar Ln',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States'
    }
  },
  { 
    id: '1837', 
    customerName: 'Olivia Davis', 
    email: 'olivia.davis@example.com',
    date: '2025-04-11T13:15:00', 
    status: 'Delivered', 
    total: 249.99,
    paymentMethod: 'Credit Card',
    items: [
      { id: 8, name: 'Robot Vacuum Cleaner', price: 249.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '333 Elm St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  },
  { 
    id: '1836', 
    customerName: 'James Wilson', 
    email: 'james.wilson@example.com',
    date: '2025-04-10T09:45:00', 
    status: 'Delivered', 
    total: 409.98,
    paymentMethod: 'Credit Card',
    items: [
      { id: 2, name: 'Smart Watch Series 5', price: 199.99, quantity: 1 },
      { id: 9, name: 'Wooden Coffee Table', price: 329.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '444 Birch Rd',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'United States'
    }
  },
  { 
    id: '1835', 
    customerName: 'Ava Martinez', 
    email: 'ava.martinez@example.com',
    date: '2025-04-09T15:30:00', 
    status: 'Delivered', 
    total: 79.99,
    paymentMethod: 'PayPal',
    items: [
      { id: 3, name: 'Portable Bluetooth Speaker', price: 79.99, quantity: 1 },
    ],
    shippingAddress: {
      address: '555 Walnut Ave',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'United States'
    }
  },
];

// Categories data
export const mockCategories = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', productCount: 56, status: 'Active' },
  { id: 2, name: 'Clothing', description: 'Apparel and fashion items', productCount: 84, status: 'Active' },
  { id: 3, name: 'Home & Garden', description: 'Home decor and garden supplies', productCount: 45, status: 'Active' },
  { id: 4, name: 'Toys', description: 'Children\'s toys and games', productCount: 32, status: 'Active' },
  { id: 5, name: 'Sports', description: 'Sports equipment and accessories', productCount: 28, status: 'Active' },
  { id: 6, name: 'Beauty', description: 'Beauty and personal care products', productCount: 37, status: 'Active' },
  { id: 7, name: 'Books', description: 'Books and educational materials', productCount: 51, status: 'Active' },
  { id: 8, name: 'Furniture', description: 'Furniture and home furnishings', productCount: 23, status: 'Active' },
  { id: 9, name: 'Accessories', description: 'Fashion accessories', productCount: 30, status: 'Active' },
];

// Attributes data
export const mockAttributes = [
  { id: 1, name: 'Color', description: 'Product color options', valueType: 'Text', status: 'Active' },
  { id: 2, name: 'Size', description: 'Product size options', valueType: 'Text', status: 'Active' },
  { id: 3, name: 'Weight', description: 'Product weight in kg', valueType: 'Number', status: 'Active' },
  { id: 4, name: 'Material', description: 'Product material composition', valueType: 'Text', status: 'Active' },
  { id: 5, name: 'Connectivity', description: 'Connectivity options', valueType: 'Text', status: 'Active' },
  { id: 6, name: 'Battery Life', description: 'Battery life in hours', valueType: 'Number', status: 'Active' },
  { id: 7, name: 'Resolution', description: 'Display resolution', valueType: 'Text', status: 'Active' },
  { id: 8, name: 'Storage', description: 'Storage capacity', valueType: 'Text', status: 'Active' },
  { id: 9, name: 'Waterproof', description: 'Is the product waterproof', valueType: 'Boolean', status: 'Active' },
];

// Product Attributes data
export const mockProductAttributes = [
  { 
    id: 1, 
    productName: 'Wireless Bluetooth Headphones',
    productId: 1,
    attributes: [
      { id: 1, name: 'Color', value: 'Black' },
      { id: 5, name: 'Connectivity', value: 'Bluetooth 5.0' },
      { id: 6, name: 'Battery Life', value: '20' },
    ]
  },
  { 
    id: 2, 
    productName: 'Smart Watch Series 5',
    productId: 2,
    attributes: [
      { id: 1, name: 'Color', value: 'Silver' },
      { id: 5, name: 'Connectivity', value: 'Bluetooth 5.0, WiFi' },
      { id: 6, name: 'Battery Life', value: '18' },
      { id: 9, name: 'Waterproof', value: 'true' },
    ]
  },
  { 
    id: 3, 
    productName: 'Portable Bluetooth Speaker',
    productId: 3,
    attributes: [
      { id: 1, name: 'Color', value: 'Red' },
      { id: 5, name: 'Connectivity', value: 'Bluetooth 4.2' },
      { id: 6, name: 'Battery Life', value: '12' },
      { id: 9, name: 'Waterproof', value: 'true' },
    ]
  },
  { 
    id: 4, 
    productName: 'Digital Camera 4K',
    productId: 4,
    attributes: [
      { id: 1, name: 'Color', value: 'Black' },
      { id: 7, name: 'Resolution', value: '4K Ultra HD' },
      { id: 8, name: 'Storage', value: 'SD Card up to 128GB' },
    ]
  },
  { 
    id: 5, 
    productName: 'Men\'s Running Shoes',
    productId: 5,
    attributes: [
      { id: 1, name: 'Color', value: 'Blue/White' },
      { id: 2, name: 'Size', value: '9, 10, 11, 12' },
      { id: 4, name: 'Material', value: 'Synthetic mesh, rubber sole' },
    ]
  },
];
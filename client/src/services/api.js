import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fallback Mock Data in case server is not running
const mockCategories = [
  { id: 1, name: 'Cà Phê Phin Truyền Thống', slug: 'ca-phe-phin', description: 'Đậm đà hương vị cà phê Việt Nam truyền thống', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', sort_order: 1 },
  { id: 2, name: 'Espresso & Ý', slug: 'espresso-y', description: 'Hương vị cà phê Ý nguyên bản tinh tế', image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop', sort_order: 2 },
  { id: 3, name: 'Trà & Trà Sữa Premium', slug: 'tra-tra-sua', description: 'Trà tươi thơm lừng thanh mát kết hợp trái cây và sữa', image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', sort_order: 3 },
  { id: 4, name: 'Bánh Ngọt Editorial', slug: 'banh-ngot', description: 'Bánh ngọt tươi làm mới mỗi ngày', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop', sort_order: 4 }
];

const mockProducts = [
  { id: 1, category_id: 1, name: 'Cà Phê Sữa Đá Khang', slug: 'ca-phe-sua-da-khang', description: 'Cà phê phin nguyên chất kết hợp sữa đặc béo ngậy chuẩn vị Sài Gòn', price: 39000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', is_featured: 1, is_available: 1 },
  { id: 2, category_id: 1, name: 'Cà Phê Đen Đô Mộc', slug: 'ca-phe-den-do-moc', description: 'Cà phê Robusta Đắc Lắc đậm vị đắng thanh quyến rũ', price: 35000, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', is_featured: 0, is_available: 1 },
  { id: 3, category_id: 1, name: 'Bạc Xỉu Sài Gòn Premium', slug: 'bac-xiu-sai-gon', description: 'Nhiều sữa ít cà phê, béo mịn dịu ngọt thơm nồng', price: 42000, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop', is_featured: 1, is_available: 1 },
  { id: 4, category_id: 2, name: 'Flat White Roasted', slug: 'flat-white-roasted', description: 'Espresso đôi hòa quyện cùng lớp sữa mịn mượt chuẩn phong cách Úc', price: 55000, image_url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop', is_featured: 1, is_available: 1 },
  { id: 5, category_id: 2, name: 'Cappuccino Vanilla', slug: 'cappuccino-vanilla', description: 'Espresso đậm đà phủ bọt sữa mịn màng thoảng hương vani', price: 52000, image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop', is_featured: 0, is_available: 1 },
  { id: 6, category_id: 2, name: 'Salted Cream Cold Brew', slug: 'salted-cream-cold-brew', description: 'Cà phê ủ lạnh 16 tiếng phủ kem muối biển béo mặn độc đáo', price: 58000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', is_featured: 1, is_available: 1 },
  { id: 7, category_id: 3, name: 'Trà Đào Cam Sả Tươi', slug: 'tra-dao-cam-sa', description: 'Trà đen thanh mát kết hợp đào miếng giòn ngọt, cam tươi và sả thơm', price: 49000, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', is_featured: 1, is_available: 1 },
  { id: 8, category_id: 3, name: 'Trà Oolong Vải Hoa Lài', slug: 'tra-oolong-vai', description: 'Trà Oolong thượng hạng kết hợp hương hoa lài dịu nhẹ và quả vải tươi', price: 52000, image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', is_featured: 0, is_available: 1 },
  { id: 9, category_id: 4, name: 'Croissant Bơ Pháp', slug: 'croissant-bo-phap', description: 'Bánh sừng bò ngàn lớp thơm lừng mùi bơ Pháp cao cấp', price: 38000, image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop', is_featured: 1, is_available: 1 },
  { id: 10, category_id: 4, name: 'Tiramisu Cà Phê Espresso', slug: 'tiramisu-espresso', description: 'Bánh Tiramisu Ý truyền thống mềm mịn đẫm vị cà phê đậm đà', price: 45000, image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop', is_featured: 0, is_available: 1 }
];

const mockTables = [
  { id: 1, table_number: 'A1', seating_capacity: 2, status: 'available' },
  { id: 2, table_number: 'A2', seating_capacity: 2, status: 'available' },
  { id: 3, table_number: 'A3', seating_capacity: 4, status: 'occupied' },
  { id: 4, table_number: 'A4', seating_capacity: 4, status: 'available' },
  { id: 5, table_number: 'A5', seating_capacity: 6, status: 'reserved' },
  { id: 6, table_number: 'B1', seating_capacity: 2, status: 'available' },
  { id: 7, table_number: 'B2', seating_capacity: 4, status: 'available' },
  { id: 8, table_number: 'B3', seating_capacity: 4, status: 'available' }
];

let mockOrders = [
  {
    id: 1,
    order_code: 'KC-1001',
    order_type: 'table',
    table_number: 'A1',
    customer_name: 'Anh Hoàng',
    customer_phone: '0901234567',
    delivery_address: null,
    total_amount: 81000,
    payment_method: 'cash',
    status: 'preparing',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      { id: 1, product_name: 'Cà Phê Sữa Đá Khang', price: 39000, quantity: 1, options: 'Đá 100%, Đường 70%', subtotal: 39000 },
      { id: 2, product_name: 'Bạc Xỉu Sài Gòn Premium', price: 42000, quantity: 1, options: 'Ít đá, Ít ngọt', subtotal: 42000 }
    ]
  },
  {
    id: 2,
    order_code: 'KC-1002',
    order_type: 'delivery',
    table_number: null,
    customer_name: 'Chị Mai',
    customer_phone: '0987654321',
    delivery_address: '123 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
    total_amount: 104000,
    payment_method: 'transfer',
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      { id: 3, product_name: 'Trà Đào Cam Sả Tươi', price: 49000, quantity: 2, options: 'Đá 100%', subtotal: 98000 }
    ]
  }
];

export const getCategories = async () => {
  try {
    const res = await api.get('/categories');
    return res.data;
  } catch (err) {
    console.warn('API getCategories error, using mock:', err.message);
    return mockCategories;
  }
};

export const getProducts = async (categoryId = null, featured = false) => {
  try {
    let url = '/products?';
    if (categoryId) url += `category_id=${categoryId}&`;
    if (featured) url += 'featured=1';
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.warn('API getProducts error, using mock:', err.message);
    let list = [...mockProducts];
    if (categoryId) list = list.filter(p => p.category_id === Number(categoryId));
    if (featured) list = list.filter(p => p.is_featured === 1);
    return list;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    return mockProducts.find(p => p.id === Number(id)) || null;
  }
};

export const getTables = async () => {
  try {
    const res = await api.get('/tables');
    return res.data;
  } catch (err) {
    return mockTables;
  }
};

export const createOrder = async (orderData) => {
  try {
    const res = await api.post('/orders', orderData);
    return res.data;
  } catch (err) {
    const newOrder = {
      id: Date.now(),
      order_code: 'KC-' + Math.floor(1000 + Math.random() * 9000),
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString(),
      items: orderData.items || []
    };
    mockOrders.unshift(newOrder);
    return newOrder;
  }
};

export const getOrders = async (status = null) => {
  try {
    const url = status ? `/orders?status=${status}` : '/orders';
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    if (status) return mockOrders.filter(o => o.status === status);
    return mockOrders;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  } catch (err) {
    const item = mockOrders.find(o => o.id === Number(id));
    if (item) item.status = status;
    return item;
  }
};

export const updateTableStatus = async (id, status) => {
  try {
    const res = await api.put(`/tables/${id}`, { status });
    return res.data;
  } catch (err) {
    const item = mockTables.find(t => t.id === Number(id));
    if (item) item.status = status;
    return item;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const res = await api.post('/categories', categoryData);
    return res.data;
  } catch (err) {
    const newCategory = {
      id: Date.now(),
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      sort_order: categoryData.sort_order || mockCategories.length + 1,
      ...categoryData
    };
    mockCategories.push(newCategory);
    return newCategory;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const res = await api.put(`/categories/${id}`, categoryData);
    return res.data;
  } catch (err) {
    const idx = mockCategories.findIndex(c => c.id === Number(id));
    if (idx !== -1) {
      mockCategories[idx] = { ...mockCategories[idx], ...categoryData };
      return mockCategories[idx];
    }
    return { id: Number(id), ...categoryData };
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  } catch (err) {
    const idx = mockCategories.findIndex(c => c.id === Number(id));
    if (idx !== -1) mockCategories.splice(idx, 1);
    return { success: true };
  }
};

export const createProduct = async (productData) => {
  try {
    const res = await api.post('/products', productData);
    return res.data;
  } catch (err) {
    const newProduct = {
      id: Date.now(),
      category_id: Number(productData.category_id),
      slug: productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(productData.price),
      is_featured: productData.is_featured ? 1 : 0,
      is_available: productData.is_available ? 1 : 0,
      ...productData
    };
    mockProducts.unshift(newProduct);
    return newProduct;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  } catch (err) {
    const idx = mockProducts.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      mockProducts[idx] = {
        ...mockProducts[idx],
        ...productData,
        category_id: Number(productData.category_id),
        price: Number(productData.price),
        is_featured: productData.is_featured ? 1 : 0,
        is_available: productData.is_available ? 1 : 0
      };
      return mockProducts[idx];
    }
    return { id: Number(id), ...productData };
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (err) {
    const idx = mockProducts.findIndex(p => p.id === Number(id));
    if (idx !== -1) mockProducts.splice(idx, 1);
    return { success: true };
  }
};

export default api;

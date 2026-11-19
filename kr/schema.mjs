// Учебная база «Интернет-магазин» — общая для КР-2, КР-3 и КР-4 (печатается в каждом варианте)
export const SHOP = `customer   (id PK, full_name NOT NULL, email UNIQUE NOT NULL, city, phone)
product    (id PK, name NOT NULL, category NOT NULL, price numeric(10,2) CHECK (price > 0),
            stock integer NOT NULL CHECK (stock >= 0))
orders     (id PK, customer_id NOT NULL FK → customer, created date NOT NULL DEFAULT current_date,
            status varchar(12) NOT NULL DEFAULT 'new', delivered date)
order_item (order_id FK → orders ON DELETE CASCADE, product_id FK → product,
            qty integer CHECK (qty > 0), price numeric(10,2) NOT NULL, PK (order_id, product_id))
-- city, phone и delivered могут быть пусты (NULL); delivered пуст, пока заказ не доставлен`;

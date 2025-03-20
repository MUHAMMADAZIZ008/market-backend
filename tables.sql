CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.Social_profiles (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  platform VARCHAR(500),
  platform_user VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS public."User" (
  id INTEGER NOT NULL PRIMARY KEY,
  name CHARACTER VARYING,
  email CHARACTER VARYING NOT NULL UNIQUE,
  password CHARACTER VARYING NOT NULL,
  role VARCHAR,
  avatar CHARACTER VARYING,
  username VARCHAR(500) NOT NULL,
  birth_of_date DATE,
  phone_number VARCHAR(500),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS public_user_pkey ON public."User" (id);
CREATE INDEX IF NOT EXISTS public_idx_user_account_id ON public."User" (avatar);

CREATE TABLE IF NOT EXISTS public.Categories (
  id INTEGER NOT NULL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  tag VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.Addresses (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  title CHARACTER VARYING NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  address_line_1 CHARACTER VARYING,
  address_line_2 CHARACTER VARYING,
  country CHARACTER VARYING,
  city CHARACTER VARYING,
  postal_code VARCHAR(500) DEFAULT true,
  phone_number VARCHAR(500),
  landmark VARCHAR(500)
);

CREATE UNIQUE INDEX IF NOT EXISTS public_account_pkey ON public.Addresses (id);

CREATE TABLE IF NOT EXISTS public.Cart (
  id INTEGER NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  total REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.Wishlist (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  product_id INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.Reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  product_id INTEGER NOT NULL UNIQUE,
  rating SMALLINT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.Products (
  id INTEGER NOT NULL PRIMARY KEY,
  category_id INTEGER,
  title VARCHAR(500) NOT NULL,
  picture VARCHAR(500),
  summary VARCHAR(500),
  description TEXT,
  price REAL NOT NULL,
  discount_type VARCHAR,
  discount_value REAL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON COLUMN public.Products.price IS 'sumda';

CREATE TABLE IF NOT EXISTS public.Orders (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  cart_id INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.Cart_item (
  id SERIAL NOT NULL PRIMARY KEY,
  cart_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);


ALTER TABLE public.Addresses ADD CONSTRAINT Addresses_user_id_fk FOREIGN KEY (user_id) REFERENCES public."User" (id);
ALTER TABLE public.Cart_item ADD CONSTRAINT Cart_item_cart_id_fk FOREIGN KEY (cart_id) REFERENCES public.Cart (id);
ALTER TABLE public.Cart_item ADD CONSTRAINT Cart_item_product_id_fk FOREIGN KEY (product_id) REFERENCES public.Products (id);
ALTER TABLE public.Cart ADD CONSTRAINT Cart_user_id_fk FOREIGN KEY (user_id) REFERENCES public."User" (id);
ALTER TABLE public.Orders ADD CONSTRAINT Orders_cart_id_fk FOREIGN KEY (cart_id) REFERENCES public.Cart (id);
ALTER TABLE public.Orders ADD CONSTRAINT Orders_user_id_fk FOREIGN KEY (user_id) REFERENCES public."User" (id);
ALTER TABLE public.Products ADD CONSTRAINT Products_category_id_fk FOREIGN KEY (category_id) REFERENCES public.Categories (id);
ALTER TABLE public.Reviews ADD CONSTRAINT Reviews_product_id_fk FOREIGN KEY (product_id) REFERENCES public.Products (id);
ALTER TABLE public.Reviews ADD CONSTRAINT Reviews_user_id_fk FOREIGN KEY (user_id) REFERENCES public."User" (id);
ALTER TABLE public.Social_profiles ADD CONSTRAINT Social_profiles_user_id_fk FOREIGN KEY (user_id) REFERENCES public."User" (id);
ALTER TABLE public.Wishlist ADD CONSTRAINT Wishlist_product_id_fk FOREIGN KEY (product_id) REFERENCES public.Products (id);
ALTER TABLE public.Wishlist ADD CONSTRAINT Wishlist_user_id_fk FOREIGN KEY (user_id) REFERENCES public."User" (id);

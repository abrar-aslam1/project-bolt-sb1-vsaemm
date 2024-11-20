import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  description: text('description'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  vendorId: text('vendor_id').references(() => vendors.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  userName: text('user_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

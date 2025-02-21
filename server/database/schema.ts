import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    avatar: text('avatar'),
    createdAt: integer('created_at', {mode: 'timestamp'}).notNull(),
    updatedAt: integer('updated_at', {mode: 'timestamp'}).notNull()
})

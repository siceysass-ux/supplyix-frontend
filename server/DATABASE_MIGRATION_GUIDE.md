# Database Migration Guide

## ⚠️ IMPORTANT: Preventing Data Loss

When making database schema changes, **NEVER** use `prisma migrate reset` in production or when you want to keep existing data!

## 🔄 Safe Migration Process

### 1. Making Schema Changes

When you update `prisma/schema.prisma`:

```bash
# Create a new migration (does NOT delete data)
npx prisma migrate dev --name describe_your_change

# This will:
# ✅ Create a new migration file
# ✅ Apply changes to database
# ✅ Keep existing data
# ✅ Automatically run seed if needed
```

### 2. If Migration Fails

If you get errors about incompatible changes:

```bash
# Option A: Create migration without applying (for review)
npx prisma migrate dev --create-only --name your_change

# Option B: Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
# This will automatically run the seed script after reset
```

## 🌱 Seeding the Database

The seed script (`prisma/seed.ts`) automatically runs after:
- `prisma migrate reset`
- `prisma migrate dev` (if configured)

To manually run seed:

```bash
npx prisma db seed
```

### What Gets Seeded:

- **Admin User**: `admin@supplyix.com` / `12345678`
- **Test User 1**: `user@supplyix.com` / `12345678`
- **Test User 2**: `mehmet@supplyix.com` / `12345678`
- **Demo Requests**: 4 sample requests (Danışmanlık & Tedarik)

## 📋 Common Commands

```bash
# View database in browser
npx prisma studio

# Check migration status
npx prisma migrate status

# Generate Prisma Client (after schema changes)
npx prisma generate

# Create migration without applying
npx prisma migrate dev --create-only

# Apply pending migrations
npx prisma migrate deploy
```

## 🔧 Development Workflow

1. **Update Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: `npx prisma migrate dev --name your_change`
3. **Verify**: Check that data is preserved
4. **Commit**: Commit both schema and migration files

## 🚨 Emergency: Data Recovery

If you accidentally deleted data:

1. **Stop the server immediately**
2. **Check if you have a backup** (SQLite file: `prisma/dev.db`)
3. **Restore from backup** or run seed script
4. **For production**: Always have automated backups!

## 📝 Adding New Seed Data

Edit `prisma/seed.ts` to add more demo data:

```typescript
// Add new users, products, requests, etc.
const newUser = await prisma.user.upsert({
    where: { email: 'new@example.com' },
    update: {},
    create: {
        // ... user data
    }
});
```

## ✅ Best Practices

1. **Always commit migrations** to version control
2. **Test migrations** in development first
3. **Use descriptive migration names**
4. **Keep seed script updated** with essential data
5. **Backup production database** before migrations
6. **Never use `migrate reset`** in production

## 🔗 Useful Links

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Seeding Docs](https://www.prisma.io/docs/guides/database/seed-database)
- [Migration Troubleshooting](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/troubleshooting-development)

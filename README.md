# Prisma Type Generator

Automatically generate types with your [Prisma](https://github.com/prisma/prisma) model names.
Very usefull for the Frontend.

This does **NOT** generate types for the models itself!

# Usage

### Installation

Install the package.

```shell
$ pnpm add @jakob30061/prisma-type-generator
```

or

```shell
$ npm install @jakob30061/prisma-type-generator
```

### Add the generator

Add the generator to your schema.

```prisma
generator enumTypes {
  provider = "prisma-type-generator"
  output = "../shared/types/generated" // Specify an output directory (optional, default is ./types)
}
```

Run `npx prisma generate` and a new file named `prisma.ts` will be created inside the output directory specified above.

# Example

**schema.prisma**

```prisma
generator client {
  provider        = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator enumTypes {
  provider = "prisma-type-generator"
  output = "../shared/types/generated"
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  role      Role     @default(VIEWER)
  badges    Badge[]  @relation("UserBadges")
  posts     Post[]

  createdAt DateTime @default(now())
}


model Badge {
  id     Int   @id @default(autoincrement())
  type   BadgeType
  userId Int
  user   User  @relation(fields: [userId], references: [id], name: "UserBadges")
}

enum BadgeType {
  GOLD
  SILVER
  BRONZE
}

.... More Models
```

**prisma.ts**

```typescript
export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum BadgeType {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
}
```
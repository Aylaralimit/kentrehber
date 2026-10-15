-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('free', 'basic', 'pro', 'elite');

-- CreateEnum
CREATE TYPE "ModerationLevel" AS ENUM ('standard', 'strict', 'paranoid');

-- CreateTable
CREATE TABLE "verticals" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_adult" BOOLEAN NOT NULL DEFAULT false,
    "allowed_categories" JSONB NOT NULL,
    "required_fields" JSONB NOT NULL,
    "moderation_level" "ModerationLevel" NOT NULL DEFAULT 'strict',
    "payment_required" BOOLEAN NOT NULL DEFAULT false,
    "default_tier" "Tier" NOT NULL DEFAULT 'free',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "policy_reviewed_at" TIMESTAMPTZ(3),
    "policy_reviewed_by" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "verticals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "vertical_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "city_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verticals_slug_key" ON "verticals"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_vertical_id_slug_key" ON "categories"("vertical_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "districts_city_id_slug_key" ON "districts"("city_id", "slug");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_vertical_id_fkey" FOREIGN KEY ("vertical_id") REFERENCES "verticals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

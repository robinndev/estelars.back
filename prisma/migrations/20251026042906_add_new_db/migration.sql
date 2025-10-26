-- CreateEnum
CREATE TYPE "SiteState" AS ENUM ('draft', 'paid', 'canceled');

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "couple_name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "music" TEXT,
    "plan_id" TEXT NOT NULL,
    "plan_price" DOUBLE PRECISION NOT NULL,
    "state" "SiteState" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email_address" TEXT NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_public_key_key" ON "Site"("public_key");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

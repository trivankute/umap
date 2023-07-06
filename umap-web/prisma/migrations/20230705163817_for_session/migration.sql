-- CreateTable
CREATE TABLE "tilepage" (
    "key" VARCHAR(320) NOT NULL,
    "tileset_id" VARCHAR(320),
    "page_z" SMALLINT,
    "page_x" INTEGER,
    "page_y" INTEGER,
    "creation_time_minutes" INTEGER,
    "frequency_of_use" DOUBLE PRECISION,
    "last_access_time_minutes" INTEGER,
    "fill_factor" DOUBLE PRECISION,
    "num_hits" DECIMAL(64,0),

    CONSTRAINT "tilepage_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "tileset" (
    "key" VARCHAR(320) NOT NULL,
    "layer_name" VARCHAR(128),
    "gridset_id" VARCHAR(32),
    "blob_format" VARCHAR(64),
    "parameters_id" VARCHAR(41),
    "bytes" DECIMAL(21,0) NOT NULL DEFAULT 0,

    CONSTRAINT "tileset_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "session_key" VARCHAR(100) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "zoom" DOUBLE PRECISION,
    "updated_date" DATE NOT NULL,
    "expires" TEXT,

    CONSTRAINT "user_sessions_pk" PRIMARY KEY ("session_key")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tilepage_frequency" ON "tilepage"("frequency_of_use" DESC);

-- CreateIndex
CREATE INDEX "tilepage_last_access" ON "tilepage"("last_access_time_minutes" DESC);

-- CreateIndex
CREATE INDEX "tilepage_tileset" ON "tilepage"("tileset_id", "fill_factor");

-- CreateIndex
CREATE INDEX "tileset_layer" ON "tileset"("layer_name");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- AddForeignKey
ALTER TABLE "tilepage" ADD CONSTRAINT "tilepage_tileset_id_fkey" FOREIGN KEY ("tileset_id") REFERENCES "tileset"("key") ON DELETE CASCADE ON UPDATE NO ACTION;

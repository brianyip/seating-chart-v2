-- Seating Chart Application Schema
-- Works with Better Auth user management

-- Events table
CREATE TABLE IF NOT EXISTS "event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "venue" TEXT NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft' CHECK ("status" IN ('draft', 'published', 'archived')),
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Seating charts table
CREATE TABLE IF NOT EXISTS "seating_chart" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "event_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "layout_data" JSONB NOT NULL, -- Stores the chart layout configuration
    "rows" INTEGER NOT NULL,
    "seats_per_row" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE
);

-- Tables within the seating chart
CREATE TABLE IF NOT EXISTS "table" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "seating_chart_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position_x" FLOAT NOT NULL, -- X coordinate in the chart
    "position_y" FLOAT NOT NULL, -- Y coordinate in the chart
    "shape" TEXT NOT NULL DEFAULT 'round' CHECK ("shape" IN ('round', 'square', 'rectangle')),
    "capacity" INTEGER NOT NULL DEFAULT 8,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("seating_chart_id") REFERENCES "seating_chart"("id") ON DELETE CASCADE
);

-- Guests table
CREATE TABLE IF NOT EXISTS "guest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "event_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dietary_restrictions" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE
);

-- Table assignments
CREATE TABLE IF NOT EXISTS "table_assignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "table_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "seat_number" INTEGER, -- Optional seat number at the table
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("table_id") REFERENCES "table"("id") ON DELETE CASCADE,
    FOREIGN KEY ("guest_id") REFERENCES "guest"("id") ON DELETE CASCADE,
    UNIQUE ("table_id", "seat_number") -- Prevent duplicate seat assignments
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "event_owner_id_idx" ON "event"("owner_id");
CREATE INDEX IF NOT EXISTS "event_date_idx" ON "event"("date");
CREATE INDEX IF NOT EXISTS "seating_chart_event_id_idx" ON "seating_chart"("event_id");
CREATE INDEX IF NOT EXISTS "table_seating_chart_id_idx" ON "table"("seating_chart_id");
CREATE INDEX IF NOT EXISTS "guest_event_id_idx" ON "guest"("event_id");
CREATE INDEX IF NOT EXISTS "guest_email_idx" ON "guest"("email");
CREATE INDEX IF NOT EXISTS "table_assignment_table_id_idx" ON "table_assignment"("table_id");
CREATE INDEX IF NOT EXISTS "table_assignment_guest_id_idx" ON "table_assignment"("guest_id");

-- Add some useful constraints
ALTER TABLE "guest" ADD CONSTRAINT "guest_unique_per_event" UNIQUE ("event_id", "email");
ALTER TABLE "table_assignment" ADD CONSTRAINT "guest_single_assignment" UNIQUE ("guest_id"); 
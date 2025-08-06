-- Add best_use_case column to templates table
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS best_use_case TEXT;
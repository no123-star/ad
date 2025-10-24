/*
  # Add image support to messages table

  1. Changes
    - Add `image_url` column to store image URLs or base64 data
    - Add `message_type` column to differentiate between text, image, and image-to-image messages
    
  2. Notes
    - Existing data will have NULL for new columns, which is acceptable
    - message_type will default to 'text' for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE messages ADD COLUMN image_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'image-to-image'));
  END IF;
END $$;

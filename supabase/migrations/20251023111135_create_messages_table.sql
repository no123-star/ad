/*
  # Create messages table for R.O.N.I chat system

  1. New Tables
    - `messages`
      - `id` (text, primary key) - Unique message identifier
      - `role` (text) - Either 'user' or 'assistant'
      - `content` (text) - The message content
      - `timestamp` (timestamptz) - When the message was created
      - `created_at` (timestamptz) - Database timestamp

  2. Security
    - Enable RLS on `messages` table
    - Add policy for anyone to read messages (public chat interface)
    - Add policy for anyone to insert messages (public chat interface)

  Note: This is a demo app with public access. In production, you would
  restrict these policies to authenticated users only.
*/

CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  WITH CHECK (true);

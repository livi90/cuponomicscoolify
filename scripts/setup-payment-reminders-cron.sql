-- This script sets up a cron job to automatically generate and send payment reminders
-- Note: This requires the pg_cron extension to be enabled in your PostgreSQL database

-- Enable pg_cron extension (run as superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule monthly reminder generation (1st day of each month at 9:00 AM)
-- SELECT cron.schedule('generate-monthly-reminders', '0 9 1 * *', 'SELECT generate_monthly_payment_reminders();');

-- Schedule daily reminder sending (every day at 10:00 AM)
-- SELECT cron.schedule('send-payment-reminders', '0 10 * * *', 'SELECT send_pending_payment_reminders();');

-- Create stored procedures for cron jobs
CREATE OR REPLACE FUNCTION generate_monthly_payment_reminders()
RETURNS void AS $$
BEGIN
  -- This would call your API endpoint or execute the logic directly
  -- For now, we'll just log that the function was called
  INSERT INTO system_logs (message, created_at) 
  VALUES ('Monthly payment reminders generation triggered', NOW());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION send_pending_payment_reminders()
RETURNS void AS $$
BEGIN
  -- This would call your API endpoint or execute the logic directly
  -- For now, we'll just log that the function was called
  INSERT INTO system_logs (message, created_at) 
  VALUES ('Payment reminders sending triggered', NOW());
END;
$$ LANGUAGE plpgsql;

-- Create system logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

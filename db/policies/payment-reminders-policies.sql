-- Enable RLS on payment_reminders table
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

-- Policy for merchants to view their own payment reminders
CREATE POLICY "Merchants can view their own payment reminders" ON payment_reminders
  FOR SELECT USING (
    auth.uid() = merchant_id
  );

-- Policy for admins to manage all payment reminders
CREATE POLICY "Admins can manage all payment reminders" ON payment_reminders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy for system to insert payment reminders
CREATE POLICY "System can insert payment reminders" ON payment_reminders
  FOR INSERT WITH CHECK (true);

-- Policy for system to update payment reminders
CREATE POLICY "System can update payment reminders" ON payment_reminders
  FOR UPDATE USING (true);

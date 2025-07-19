-- Create payment reminders table
CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commission_amount DECIMAL(10,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'paid', 'overdue', 'cancelled')),
  reminder_count INTEGER DEFAULT 0,
  last_reminder_sent TIMESTAMP WITH TIME ZONE,
  payment_method TEXT DEFAULT 'paypal' CHECK (payment_method IN ('paypal', 'stripe', 'bank_transfer')),
  merchant_email TEXT NOT NULL,
  merchant_name TEXT,
  invoice_number TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_reminders_merchant_id ON payment_reminders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_status ON payment_reminders(status);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_due_date ON payment_reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_created_at ON payment_reminders(created_at);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_payment_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_reminders_updated_at
  BEFORE UPDATE ON payment_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_reminders_updated_at();

-- Generate invoice numbers automatically
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number = 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_sequence')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_sequence START 1;

CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON payment_reminders
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_number();

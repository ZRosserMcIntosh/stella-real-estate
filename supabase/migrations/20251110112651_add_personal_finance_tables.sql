-- Add personal finance tables for Rosser & Stella budget tracking

-- Personal expenses table
CREATE TABLE IF NOT EXISTS personal_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  amount FLOAT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  person TEXT NOT NULL CHECK (person IN ('Rosser', 'Stella')),
  usd_amount FLOAT,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal income table
CREATE TABLE IF NOT EXISTS personal_income (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  brl_amount FLOAT NOT NULL,
  usd_amount FLOAT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  person TEXT NOT NULL CHECK (person IN ('Rosser', 'Stella')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_personal_expenses_person ON personal_expenses(person);
CREATE INDEX IF NOT EXISTS idx_personal_expenses_status ON personal_expenses(status);
CREATE INDEX IF NOT EXISTS idx_personal_expenses_date ON personal_expenses(date);
CREATE INDEX IF NOT EXISTS idx_personal_income_person ON personal_income(person);
CREATE INDEX IF NOT EXISTS idx_personal_income_date ON personal_income(date);

-- Add RLS policies (everyone can access their own data)
ALTER TABLE personal_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_income ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to see all personal finance data (since this is for Rosser & Stella)
CREATE POLICY "Allow authenticated users to view personal expenses" ON personal_expenses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert personal expenses" ON personal_expenses
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update personal expenses" ON personal_expenses
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete personal expenses" ON personal_expenses
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view personal income" ON personal_income
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert personal income" ON personal_income
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update personal income" ON personal_income
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete personal income" ON personal_income
  FOR DELETE TO authenticated USING (true);

-- Add updated_at trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personal_expenses_updated_at BEFORE UPDATE ON personal_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_income_updated_at BEFORE UPDATE ON personal_income
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

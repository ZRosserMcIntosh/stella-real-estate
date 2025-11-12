-- Seed data for personal finance tables

-- Insert sample expenses
INSERT INTO personal_expenses (date, amount, description, status, person, usd_amount) VALUES 
  ('2025-10-20', 3500.00, 'Rent at ZYZ', 'paid', 'Stella', NULL),
  ('2025-11-20', 3000.00, 'Architect/Designer', 'pending', 'Stella', 545),
  ('2025-10-10', 212.00, 'TIM Cellular', 'paid', 'Stella', NULL),
  ('2025-11-11', 1000.00, 'Vallini Lawyer', 'paid', 'Rosser', NULL),
  ('2025-11-10', 1180.00, 'Credit Card', 'pending', 'Stella', NULL),
  ('2025-11-10', 1000.00, 'Law School', 'pending', 'Stella', NULL),
  ('2025-12-18', 1800.00, 'Monthly Apartment Loan', 'pending', 'Stella', 691),
  ('2025-12-18', 18000.00, 'Stella Balloon Payment', 'pending', 'Stella', 1273)
ON CONFLICT DO NOTHING;

-- Insert sample income
INSERT INTO personal_income (date, brl_amount, usd_amount, description, category, person) VALUES
  ('2025-11-01', 1650.00, 300.00, 'Stella', 'Salary', 'Stella'),
  ('2025-11-05', 7700.00, 1400.00, 'Rosser', 'Salary', 'Rosser'),
  ('2025-11-10', 1375.00, 250.00, 'Rosser', 'Bonus', 'Rosser'),
  ('2025-11-10', 2117.50, 385.00, 'Rosser', 'Itaú Pending', 'Rosser'),
  ('2025-11-10', 300.00, 56.29, 'Rosser', 'Other', 'Rosser')
ON CONFLICT DO NOTHING;
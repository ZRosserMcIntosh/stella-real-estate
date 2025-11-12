/**
 * Utility to fix corrupted USD amounts in the database
 * Run this once to recalculate all USD amounts based on BRL amounts
 */

import { createClient } from '@supabase/supabase-js'
import { getUsdToBrlRate } from './currencyUtils'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function fixExpenseUsdAmounts() {
  try {
    // Get current exchange rate
    const rate = await getUsdToBrlRate()
    console.log('Using exchange rate:', rate)

    // Fetch all expenses
    const { data: expenses, error: fetchError } = await supabase
      .from('personal_expenses')
      .select('*')

    if (fetchError) throw fetchError

    console.log(`Found ${expenses?.length || 0} expenses to check`)

    let fixedCount = 0
    
    // Update each expense with correct USD amount
    for (const expense of expenses || []) {
      const brlAmount = expense.amount
      const correctUsdAmount = brlAmount / rate
      
      // Check if current USD amount is way off (more than 2x or less than 0.5x the correct value)
      const currentUsd = expense.usd_amount || 0
      const isCorrupted = currentUsd > (correctUsdAmount * 2) || currentUsd < (correctUsdAmount * 0.5)
      
      if (isCorrupted || !expense.usd_amount) {
        console.log(`Fixing expense ${expense.id}: R$${brlAmount} -> $${correctUsdAmount.toFixed(2)} (was $${currentUsd})`)
        
        const { error: updateError } = await supabase
          .from('personal_expenses')
          .update({ usd_amount: correctUsdAmount })
          .eq('id', expense.id)
        
        if (updateError) {
          console.error(`Failed to update expense ${expense.id}:`, updateError)
        } else {
          fixedCount++
        }
      }
    }

    console.log(`✅ Fixed ${fixedCount} expenses`)
    return { success: true, fixed: fixedCount }
  } catch (error) {
    console.error('Error fixing expense USD amounts:', error)
    return { success: false, error }
  }
}

export async function fixIncomeUsdAmounts() {
  try {
    // Get current exchange rate
    const rate = await getUsdToBrlRate()
    console.log('Using exchange rate:', rate)

    // Fetch all income
    const { data: incomes, error: fetchError } = await supabase
      .from('personal_income')
      .select('*')

    if (fetchError) throw fetchError

    console.log(`Found ${incomes?.length || 0} income entries to check`)

    let fixedCount = 0
    
    // Update each income with correct USD amount
    for (const income of incomes || []) {
      const brlAmount = income.brl_amount
      const correctUsdAmount = brlAmount / rate
      
      // Check if current USD amount is way off
      const currentUsd = income.usd_amount || 0
      const isCorrupted = currentUsd > (correctUsdAmount * 2) || currentUsd < (correctUsdAmount * 0.5)
      
      if (isCorrupted || !income.usd_amount) {
        console.log(`Fixing income ${income.id}: R$${brlAmount} -> $${correctUsdAmount.toFixed(2)} (was $${currentUsd})`)
        
        const { error: updateError } = await supabase
          .from('personal_income')
          .update({ usd_amount: correctUsdAmount })
          .eq('id', income.id)
        
        if (updateError) {
          console.error(`Failed to update income ${income.id}:`, updateError)
        } else {
          fixedCount++
        }
      }
    }

    console.log(`✅ Fixed ${fixedCount} income entries`)
    return { success: true, fixed: fixedCount }
  } catch (error) {
    console.error('Error fixing income USD amounts:', error)
    return { success: false, error }
  }
}

// Run both fix functions
export async function fixAllCurrencyData() {
  console.log('🔧 Starting currency data fix...')
  const expenseResult = await fixExpenseUsdAmounts()
  const incomeResult = await fixIncomeUsdAmounts()
  
  console.log('✅ Currency data fix complete!')
  return {
    expenses: expenseResult,
    income: incomeResult
  }
}

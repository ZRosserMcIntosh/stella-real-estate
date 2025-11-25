import React, { useState, useEffect } from 'react'
import { Plus, DollarSign, Receipt, TrendingUp, Calendar, User, CheckCircle, Clock, AlertCircle, Edit2, Trash2, History, X, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { getUsdToBrlRate, convertUsdToBrl, convertBrlToUsd, formatCurrencyInput, parseCurrency } from '../../utils/currencyUtils'
import { fixAllCurrencyData } from '../../utils/fixCurrencyData'
import { useTranslation } from 'react-i18next'

type ExpenseStatus = 'paid' | 'pending' | 'overdue'
type Person = 'Rosser' | 'Stella'

interface ExpenseItem {
  id: string
  date: string
  amount: number
  description: string
  status: ExpenseStatus
  person: Person
  usd_amount?: number
  category?: string
  created_at?: string
  updated_at?: string
}

interface IncomeItem {
  id: string
  date: string
  brl_amount: number
  usd_amount: number
  description: string
  category?: string
  person: Person
  created_at?: string
  updated_at?: string
}

export default function RosserStella() {
  const { t, i18n } = useTranslation()
  
  // Password protection - must be at the top before any conditional returns
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // All other state hooks must be declared before any conditional returns
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'income' | 'history'>('overview')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showEditExpense, setShowEditExpense] = useState(false)
  const [showEditIncome, setShowEditIncome] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [income, setIncome] = useState<IncomeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number>(5.0) // USD to BRL rate

  // Form state for adding/editing expense
  const [expenseDate, setExpenseDate] = useState('')
  const [expenseBRL, setExpenseBRL] = useState('')
  const [expenseUSD, setExpenseUSD] = useState('')
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expensePerson, setExpensePerson] = useState<Person>('Rosser')
  const [expenseStatus, setExpenseStatus] = useState<ExpenseStatus>('pending')
  const [expenseCategory, setExpenseCategory] = useState('')

  // Form state for adding/editing income
  const [incomeDate, setIncomeDate] = useState('')
  const [incomeBRL, setIncomeBRL] = useState('')
  const [incomeUSD, setIncomeUSD] = useState('')
  const [incomeDescription, setIncomeDescription] = useState('')
  const [incomePerson, setIncomePerson] = useState<Person>('Rosser')
  const [incomeCategory, setIncomeCategory] = useState('')
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === '777') {
      setIsAuthenticated(true)
      setPasswordError(false)
      // Store in sessionStorage so user doesn't need to re-enter during session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('rosser_stella_auth', 'true')
      }
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }
  
  // Check if already authenticated in this session
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined' && sessionStorage.getItem('rosser_stella_auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])
  
  // Show loading state during hydration to prevent mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    )
  }
  
  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md p-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Rosser & Stella Admin
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Enter password to access
              </p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setPasswordError(false)
                  }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    passwordError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors`}
                  autoFocus
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Access
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
  
  // Load exchange rate on mount
  useEffect(() => {
    const fetchRate = async () => {
      const rate = await getUsdToBrlRate()
      setExchangeRate(rate)
    }
    fetchRate()
  }, [])

  // Load data from database
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('personal_expenses')
        .select('*')
        .order('date', { ascending: false })
      
      if (expensesError) throw expensesError
      
      // Load income
      const { data: incomeData, error: incomeError } = await supabase
        .from('personal_income')
        .select('*')
        .order('date', { ascending: false })
      
      if (incomeError) throw incomeError
      
      setExpenses(expensesData || [])
      setIncome(incomeData || [])
      setError(null)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data')
      // Fallback to sample data for development
      setExpenses([
        { id: '1', date: '2025-10-20', amount: 3500.00, description: 'Rent at ZYZ', status: 'paid', person: 'Stella' },
        { id: '2', date: '2025-11-20', amount: 3000.00, description: 'Architect/Designer', status: 'pending', person: 'Stella', usd_amount: 545 },
        { id: '3', date: '2025-10-10', amount: 212.00, description: 'TIM Cellular', status: 'paid', person: 'Stella' },
        { id: '4', date: '2025-11-11', amount: 1000.00, description: 'Vallini Lawyer', status: 'paid', person: 'Rosser' },
        { id: '5', date: '2025-11-10', amount: 1180.00, description: 'Credit Card', status: 'pending', person: 'Stella' },
        { id: '6', date: '2025-11-10', amount: 1000.00, description: 'Law School', status: 'pending', person: 'Stella' },
        { id: '7', date: '2025-12-18', amount: 1800.00, description: 'Monthly Apartment Loan', status: 'pending', person: 'Stella', usd_amount: 691 },
        { id: '8', date: '2025-12-18', amount: 18000.00, description: 'Stella Balloon Payment', status: 'pending', person: 'Stella', usd_amount: 1273 },
      ])
      setIncome([
        { id: '1', date: '2025-11-01', brl_amount: 1650.00, usd_amount: 300.00, description: 'Stella', category: 'Salary', person: 'Stella' },
        { id: '2', date: '2025-11-05', brl_amount: 7700.00, usd_amount: 1400.00, description: 'Rosser', category: 'Salary', person: 'Rosser' },
        { id: '3', date: '2025-11-10', brl_amount: 1375.00, usd_amount: 250.00, description: 'Rosser', category: 'Bonus', person: 'Rosser' },
        { id: '4', date: '2025-11-10', brl_amount: 2117.50, usd_amount: 385.00, description: 'Rosser', category: 'Itaú Pending', person: 'Rosser' },
        { id: '5', date: '2025-11-10', brl_amount: 300.00, usd_amount: 56.29, description: 'Rosser', category: 'Other', person: 'Rosser' },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to parse date string as local date (not UTC)
  // This prevents timezone shifts that can change the displayed date
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  // Helper functions for date calculations
  const getDaysUntilDue = (dateStr: string) => {
    const date = parseLocalDate(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset to start of day for accurate comparison
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDueDateStatus = (dateStr: string, status: ExpenseStatus) => {
    if (status === 'paid') return 'paid'
    
    const daysUntil = getDaysUntilDue(dateStr)
    if (daysUntil < 0) return 'overdue'
    if (daysUntil <= 7) return 'due-soon'
    return 'future'
  }

  const formatDueDateInfo = (dateStr: string, status: ExpenseStatus) => {
    if (status === 'paid') return t('budget.dueInfo.paid')
    
    const daysUntil = getDaysUntilDue(dateStr)
    if (daysUntil < 0) return t('budget.dueInfo.overdue', { days: Math.abs(daysUntil) })
    if (daysUntil === 0) return t('budget.dueInfo.dueToday')
    if (daysUntil === 1) return t('budget.dueInfo.dueTomorrow')
    if (daysUntil <= 7) return t('budget.dueInfo.dueInDays', { days: daysUntil })
    return t('budget.dueInfo.daysAway', { days: daysUntil })
  }

  // Helper to check if a month is in the future
  const isMonthInFuture = (monthKey: string): boolean => {
    const today = new Date()
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US'
    const currentMonthKey = today.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
    
    // Parse the month key to compare dates
    const monthDate = new Date(monthKey + ' 1') // Add day to make it parseable
    const currentDate = new Date(currentMonthKey + ' 1')
    
    return monthDate > currentDate
  }

  // Helper to get current locale
  const getLocale = () => i18n.language === 'pt' ? 'pt-BR' : 'en-US'

  // Sort expenses by date (soonest first) and group by month
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const sortedIncome = [...income].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group expenses by month with smart filtering based on month status
  const expensesByMonth = (() => {
    // First group all expenses
    const grouped = sortedExpenses.reduce((acc, expense) => {
      const monthKey = parseLocalDate(expense.date).toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' })
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(expense)
      return acc
    }, {} as Record<string, ExpenseItem[]>)
    
    // Filter based on whether month is future or current/past
    return Object.entries(grouped).reduce((acc, [month, expenses]) => {
      if (isMonthInFuture(month)) {
        // Future months: show all expenses (paid and unpaid)
        acc[month] = expenses
      } else {
        // Current/past months: only show month if there are pending or overdue expenses
        const hasUnpaidExpense = expenses.some(e => e.status === 'pending' || e.status === 'overdue')
        if (hasUnpaidExpense) {
          // Show ALL expenses from this month (so you can see context of paid vs unpaid)
          acc[month] = expenses
        }
      }
      return acc
    }, {} as Record<string, ExpenseItem[]>)
  })()

  // Group income by month - only include months that have pending or overdue expenses
  const incomeByMonth = (() => {
    // First group all income
    const grouped = sortedIncome.reduce((acc, income) => {
      const monthKey = parseLocalDate(income.date).toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' })
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(income)
      return acc
    }, {} as Record<string, IncomeItem[]>)
    
    // Filter to match expense month visibility rules
    return Object.entries(grouped).reduce((acc, [month, incomes]) => {
      if (isMonthInFuture(month)) {
        // Future months: show all income
        acc[month] = incomes
      } else {
        // Current/past months: only show if month has pending/overdue expenses
        const monthExpenses = expenses.filter(e => {
          const expenseMonth = parseLocalDate(e.date).toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' })
          return expenseMonth === month
        })
        const hasUnpaidExpense = monthExpenses.some(e => e.status === 'pending' || e.status === 'overdue')
        if (hasUnpaidExpense) {
          acc[month] = incomes
        }
      }
      return acc
    }, {} as Record<string, IncomeItem[]>)
  })()

  // Combine expenses and income by month for overview
  type CombinedItem = (ExpenseItem & { type: 'expense' }) | (IncomeItem & { type: 'income' })
  
  // For Overview: Smart filtering based on month status
  const activeItemsByMonth = (() => {
    // First group all items by month
    const grouped = [...expenses.map(e => ({ ...e, type: 'expense' as const })), ...income.map(i => ({ ...i, type: 'income' as const }))]
      .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime())
      .reduce((acc, item) => {
        const monthKey = parseLocalDate(item.date).toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' })
        if (!acc[monthKey]) acc[monthKey] = []
        acc[monthKey].push(item)
        return acc
      }, {} as Record<string, CombinedItem[]>)
    
    // Apply smart filtering based on whether month is future or current/past
    return Object.entries(grouped).reduce((acc, [month, items]) => {
      const monthExpenses = items.filter(i => i.type === 'expense') as (ExpenseItem & { type: 'expense' })[]
      
      if (isMonthInFuture(month)) {
        // Future months: show all items
        acc[month] = items
      } else {
        // Current/past months: only show if there are pending/overdue expenses
        const hasUnpaidExpense = monthExpenses.some(e => e.status === 'pending' || e.status === 'overdue')
        if (hasUnpaidExpense) {
          // Show all items from this month (paid and unpaid expenses, plus income)
          acc[month] = items
        }
      }
      return acc
    }, {} as Record<string, CombinedItem[]>)
  })()

  // For History: Only show months where ALL expenses are paid (historical data)
  const historicalItemsByMonth = (() => {
    const grouped = [...expenses.map(e => ({ ...e, type: 'expense' as const })), ...income.map(i => ({ ...i, type: 'income' as const }))]
      .sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime()) // Most recent first for history
      .reduce((acc, item) => {
        const monthKey = parseLocalDate(item.date).toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' })
        if (!acc[monthKey]) acc[monthKey] = []
        acc[monthKey].push(item)
        return acc
      }, {} as Record<string, CombinedItem[]>)
    
    // Only include months where all expenses are paid
    return Object.entries(grouped).reduce((acc, [month, items]) => {
      const monthExpenses = items.filter(i => i.type === 'expense') as (ExpenseItem & { type: 'expense' })[]
      const allPaid = monthExpenses.length === 0 || monthExpenses.every(e => e.status === 'paid')
      if (allPaid && items.length > 0) {
        acc[month] = items
      }
      return acc
    }, {} as Record<string, CombinedItem[]>)
  })()

  // Helper to get sorted month keys (soonest first for overview, most recent first for history)
  const getSortedMonthKeys = (monthsObj: Record<string, any>, ascending = true) => {
    return Object.keys(monthsObj).sort((a, b) => {
      const dateA = new Date(a)
      const dateB = new Date(b)
      return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    })
  }

  const totalExpensesBRL = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalIncomesBRL = income.reduce((sum, inc) => sum + inc.brl_amount, 0)
  const netBRL = totalIncomesBRL - totalExpensesBRL

  // Currency conversion handlers for expense form
  const handleExpenseBRLChange = (formattedValue: string) => {
    setExpenseBRL(formattedValue)
    const brlValue = parseCurrency(formattedValue)
    if (brlValue !== null) {
      const usdValue = convertBrlToUsd(brlValue, exchangeRate)
      setExpenseUSD(formatCurrencyInput(String(usdValue * 100), 'USD'))
    } else {
      setExpenseUSD('')
    }
  }

  const handleExpenseUSDChange = (formattedValue: string) => {
    setExpenseUSD(formattedValue)
    const usdValue = parseCurrency(formattedValue)
    if (usdValue !== null) {
      const brlValue = convertUsdToBrl(usdValue, exchangeRate)
      setExpenseBRL(formatCurrencyInput(String(brlValue * 100), 'BRL'))
    } else {
      setExpenseBRL('')
    }
  }

  // Currency conversion handlers for income form
  const handleIncomeBRLChange = (formattedValue: string) => {
    setIncomeBRL(formattedValue)
    const brlValue = parseCurrency(formattedValue)
    if (brlValue !== null) {
      const usdValue = convertBrlToUsd(brlValue, exchangeRate)
      setIncomeUSD(formatCurrencyInput(String(usdValue * 100), 'USD'))
    } else {
      setIncomeUSD('')
    }
  }

  const handleIncomeUSDChange = (formattedValue: string) => {
    setIncomeUSD(formattedValue)
    const usdValue = parseCurrency(formattedValue)
    if (usdValue !== null) {
      const brlValue = convertUsdToBrl(usdValue, exchangeRate)
      setIncomeBRL(formatCurrencyInput(String(brlValue * 100), 'BRL'))
    } else {
      setIncomeBRL('')
    }
  }

  // Reset form handlers
  const resetExpenseForm = () => {
    setExpenseDate('')
    setExpenseBRL('')
    setExpenseUSD('')
    setExpenseDescription('')
    setExpensePerson('Rosser')
    setExpenseStatus('pending')
    setExpenseCategory('')
  }

  const resetIncomeForm = () => {
    setIncomeDate('')
    setIncomeBRL('')
    setIncomeUSD('')
    setIncomeDescription('')
    setIncomePerson('Rosser')
    setIncomeCategory('')
  }

  // Calculate overdue and due soon items
  const overdueExpenses = expenses.filter(exp => getDueDateStatus(exp.date, exp.status) === 'overdue')
  const dueSoonExpenses = expenses.filter(exp => getDueDateStatus(exp.date, exp.status) === 'due-soon')

  // Add functions for CRUD operations
  const handleAddExpense = async () => {
    const brlAmount = parseCurrency(expenseBRL)
    const usdAmount = parseCurrency(expenseUSD)
    
    if (!expenseDate || !brlAmount || !expenseDescription) {
      alert('Please fill in date, amount, and description')
      return
    }

    try {
      const { data, error } = await supabase
        .from('personal_expenses')
        .insert([{
          date: expenseDate,
          amount: brlAmount,
          usd_amount: usdAmount,
          description: expenseDescription,
          status: expenseStatus,
          person: expensePerson,
          category: expenseCategory || null
        }])
        .select()
      
      if (error) throw error
      
      setExpenses(prev => [data[0], ...prev])
      setShowAddExpense(false)
      resetExpenseForm()
    } catch (err) {
      console.error('Error adding expense:', err)
      alert('Failed to add expense')
    }
  }

  const handleAddIncome = async () => {
    const brlAmount = parseCurrency(incomeBRL)
    const usdAmount = parseCurrency(incomeUSD)
    
    if (!incomeDate || !brlAmount || !incomeDescription) {
      alert('Please fill in date, amount, and description')
      return
    }

    try {
      const { data, error } = await supabase
        .from('personal_income')
        .insert([{
          date: incomeDate,
          brl_amount: brlAmount,
          usd_amount: usdAmount || 0,
          description: incomeDescription,
          person: incomePerson,
          category: incomeCategory || null
        }])
        .select()
      
      if (error) throw error
      
      setIncome(prev => [data[0], ...prev])
      setShowAddIncome(false)
      resetIncomeForm()
    } catch (err) {
      console.error('Error adding income:', err)
      alert('Failed to add income')
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personal_expenses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setExpenses(prev => prev.filter(exp => exp.id !== id))
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }

  const deleteIncome = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personal_income')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setIncome(prev => prev.filter(inc => inc.id !== id))
    } catch (err) {
      console.error('Error deleting income:', err)
    }
  }

  // Toggle expense status between pending and paid
  const toggleExpenseStatus = async (id: string, currentStatus: ExpenseStatus) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'pending' : 'paid'
      
      const { error } = await supabase
        .from('personal_expenses')
        .update({ status: newStatus })
        .eq('id', id)
      
      if (error) throw error
      
      setExpenses(prev => prev.map(exp => 
        exp.id === id ? { ...exp, status: newStatus } : exp
      ))
    } catch (err) {
      console.error('Error updating expense status:', err)
    }
  }

  // Open edit expense modal with pre-filled data
  const openEditExpense = (expense: ExpenseItem) => {
    setEditingExpenseId(expense.id)
    setExpenseDate(expense.date)
    setExpenseBRL(formatCurrencyInput(String(expense.amount * 100), 'BRL'))
    setExpenseUSD(formatCurrencyInput(String((expense.usd_amount || 0) * 100), 'USD'))
    setExpenseDescription(expense.description)
    setExpensePerson(expense.person)
    setExpenseStatus(expense.status)
    setExpenseCategory(expense.category || '')
    setShowEditExpense(true)
  }

  // Open edit income modal with pre-filled data
  const openEditIncome = (incomeItem: IncomeItem) => {
    setEditingIncomeId(incomeItem.id)
    setIncomeDate(incomeItem.date)
    setIncomeBRL(formatCurrencyInput(String(incomeItem.brl_amount * 100), 'BRL'))
    setIncomeUSD(formatCurrencyInput(String(incomeItem.usd_amount * 100), 'USD'))
    setIncomeDescription(incomeItem.description)
    setIncomePerson(incomeItem.person)
    setIncomeCategory(incomeItem.category || '')
    setShowEditIncome(true)
  }

  // Handle update expense
  const handleUpdateExpense = async () => {
    if (!editingExpenseId) return
    
    const brlAmount = parseCurrency(expenseBRL)
    const usdAmount = parseCurrency(expenseUSD)
    
    if (!expenseDate || !brlAmount || !expenseDescription) {
      alert('Please fill in date, amount, and description')
      return
    }

    try {
      const { data, error } = await supabase
        .from('personal_expenses')
        .update({
          date: expenseDate,
          amount: brlAmount,
          usd_amount: usdAmount,
          description: expenseDescription,
          status: expenseStatus,
          person: expensePerson,
          category: expenseCategory || null
        })
        .eq('id', editingExpenseId)
        .select()
      
      if (error) throw error
      
      setExpenses(prev => prev.map(exp => exp.id === editingExpenseId ? data[0] : exp))
      setShowEditExpense(false)
      setEditingExpenseId(null)
      resetExpenseForm()
    } catch (err) {
      console.error('Error updating expense:', err)
      alert('Failed to update expense')
    }
  }

  // Handle update income
  const handleUpdateIncome = async () => {
    if (!editingIncomeId) return
    
    const brlAmount = parseCurrency(incomeBRL)
    const usdAmount = parseCurrency(incomeUSD)
    
    if (!incomeDate || !brlAmount || !incomeDescription) {
      alert('Please fill in date, amount, and description')
      return
    }

    try {
      const { data, error } = await supabase
        .from('personal_income')
        .update({
          date: incomeDate,
          brl_amount: brlAmount,
          usd_amount: usdAmount || 0,
          description: incomeDescription,
          person: incomePerson,
          category: incomeCategory || null
        })
        .eq('id', editingIncomeId)
        .select()
      
      if (error) throw error
      
      setIncome(prev => prev.map(inc => inc.id === editingIncomeId ? data[0] : inc))
      setShowEditIncome(false)
      setEditingIncomeId(null)
      resetIncomeForm()
    } catch (err) {
      console.error('Error updating income:', err)
      alert('Failed to update income')
    }
  }

  const getStatusIcon = (status: ExpenseStatus) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: ExpenseStatus) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'overdue': return 'text-red-400 bg-red-400/10 border-red-400/20'
    }
  }

  const getDueDateColor = (dateStr: string, status: ExpenseStatus) => {
    const dueDateStatus = getDueDateStatus(dateStr, status)
    switch (dueDateStatus) {
      case 'paid': return 'text-green-400'
      case 'overdue': return 'text-red-400 font-semibold'
      case 'due-soon': return 'text-orange-400 font-medium'
      case 'future': return 'text-slate-400'
      default: return 'text-slate-400'
    }
  }

  const getPersonColor = (person: Person) => {
    return person === 'Stella' ? 'text-pink-400 bg-pink-400/10 border-pink-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  }

  // Fix corrupted USD values
  const handleFixCurrencyData = async () => {
    if (!confirm('This will recalculate all USD amounts based on current BRL values and exchange rate. Continue?')) {
      return
    }
    
    setLoading(true)
    try {
      const result = await fixAllCurrencyData()
      alert(`Fixed ${result.expenses.fixed} expenses and ${result.income.fixed} income entries!`)
      await loadData() // Reload data to show fixed values
    } catch (error) {
      console.error('Error fixing currency data:', error)
      alert('Failed to fix currency data. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">{t('budget.title')}</h1>
          <p className="text-slate-400">
            {t('budget.subtitle')}
          </p>
        </div>
        <button
          onClick={handleFixCurrencyData}
          className="inline-flex items-center px-3 py-2 border border-yellow-600/50 text-sm font-medium rounded-lg text-yellow-400 bg-yellow-600/10 hover:bg-yellow-600/20 transition-colors"
          title={t('budget.actions.fixUsdValues')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('budget.actions.fixUsdValues')}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-slate-800/50">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: t('budget.tabs.overview'), icon: TrendingUp },
            { key: 'expenses', label: t('budget.tabs.expenses'), icon: Receipt },
            { key: 'income', label: t('budget.tabs.income'), icon: DollarSign },
            { key: 'history', label: t('budget.tabs.history'), icon: History },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Icon className={`mr-2 h-5 w-5 ${activeTab === key ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/40 border border-red-800/50 rounded-xl p-4 mb-6">
          <p className="text-red-200">{error} - Using sample data for now</p>
          <button 
            onClick={loadData}
            className="mt-2 text-sm text-red-300 hover:text-red-100 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Overview Tab */}
      {!loading && activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Receipt className="h-8 w-8 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Total Expenses</dt>
                    <dd className="text-lg font-medium text-slate-100">R${totalExpensesBRL.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Total Income</dt>
                    <dd className="text-lg font-medium text-slate-100">R${totalIncomesBRL.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Stella Expenses Paid</dt>
                    <dd className="text-lg font-medium text-blue-400">
                      R${expenses.filter(e => e.status === 'paid' && e.person === 'Stella').reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </dd>
                    <div className="text-xs text-slate-400 mt-1">
                      ${expenses.filter(e => e.status === 'paid' && e.person === 'Stella').reduce((sum, e) => sum + (e.usd_amount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Overdue</dt>
                    <dd className="text-lg font-medium text-red-400">
                      {overdueExpenses.length} items
                    </dd>
                    <div className="text-xs text-slate-400 mt-1">
                      {dueSoonExpenses.length} due soon
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown - Combined Income and Expenses */}
          <div className="space-y-6">
            {getSortedMonthKeys(activeItemsByMonth, true).map((month) => {
              const items = activeItemsByMonth[month]
              const monthExpenses = items.filter(item => item.type === 'expense') as (ExpenseItem & { type: 'expense' })[]
              const monthIncome = items.filter(item => item.type === 'income') as (IncomeItem & { type: 'income' })[]
              const monthExpenseTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
              const monthIncomeTotal = monthIncome.reduce((sum, inc) => sum + inc.brl_amount, 0)
              const monthNet = monthIncomeTotal - monthExpenseTotal
              
              return (
                <div key={month} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/60 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200">
                          {month}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {monthExpenses.length} expense{monthExpenses.length !== 1 ? 's' : ''} · {monthIncome.length} income entr{monthIncome.length !== 1 ? 'ies' : 'y'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${monthNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {monthNet >= 0 ? '+' : ''}R${monthNet.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Net for month</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-800">
                    {items.map((item) => (
                      <div key={item.id} className="px-6 py-4 hover:bg-slate-800/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            {item.type === 'expense' ? (
                              <Receipt className="h-5 w-5 text-red-400 flex-shrink-0" />
                            ) : (
                              <DollarSign className="h-5 w-5 text-green-400 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-200">{item.description}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPersonColor(item.person)}`}>
                                  {item.person}
                                </span>
                                {item.type === 'expense' && (
                                  <button
                                    onClick={() => toggleExpenseStatus(item.id, item.status)}
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border hover:opacity-80 transition-opacity ${getStatusColor(item.status)}`}
                                    title="Click to toggle status"
                                  >
                                    {getStatusIcon(item.status)}
                                    <span className="ml-1 capitalize">{item.status}</span>
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-slate-500">
                                  {parseLocalDate(item.date).toLocaleDateString(getLocale(), { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric'
                                  })}
                                </p>
                                {item.type === 'expense' && item.status !== 'paid' && (
                                  <p className={`text-xs ${getDueDateColor(item.date, item.status)}`}>
                                    {formatDueDateInfo(item.date, item.status)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              {item.type === 'expense' ? (
                                <>
                                  <p className="text-sm font-semibold text-red-400">-R${item.amount.toLocaleString()}</p>
                                  <p className="text-xs text-slate-500">-${(item.usd_amount || 0).toLocaleString()}</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm font-semibold text-green-400">+R${item.brl_amount.toLocaleString()}</p>
                                  <p className="text-xs text-slate-500">+${item.usd_amount.toLocaleString()}</p>
                                </>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => item.type === 'expense' ? openEditExpense(item) : openEditIncome(item)}
                                className="hover:text-slate-200 text-slate-400"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => item.type === 'expense' ? deleteExpense(item.id) : deleteIncome(item.id)}
                                className="hover:text-red-400 text-slate-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {!loading && activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-200">Expenses</h2>
            <button
              onClick={() => setShowAddExpense(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </button>
          </div>

          <div className="space-y-6">
            {getSortedMonthKeys(expensesByMonth, true).map((month) => {
              const monthExpenses = expensesByMonth[month]
              return (
              <div key={month} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
                <div className="bg-slate-800/60 px-6 py-3">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                    {month}
                    <span className="ml-2 text-xs text-slate-400">
                      ({monthExpenses.length} expense{monthExpenses.length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                </div>
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-800/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Due Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {monthExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {parseLocalDate(expense.date).toLocaleDateString(getLocale(), {
                            weekday: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-200">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                          R${expense.amount.toLocaleString()}
                          <div className="text-xs text-slate-500">${(expense.usd_amount || 0).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPersonColor(expense.person)}`}>
                            {expense.person}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleExpenseStatus(expense.id, expense.status)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border hover:opacity-80 transition-opacity ${getStatusColor(expense.status)}`}
                            title="Click to toggle status"
                          >
                            {getStatusIcon(expense.status)}
                            <span className="ml-1 capitalize">{expense.status}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span className={getDueDateColor(expense.date, expense.status)}>
                            {formatDueDateInfo(expense.date, expense.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openEditExpense(expense)}
                              className="hover:text-slate-200"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteExpense(expense.id)}
                              className="hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Income Tab */}
      {!loading && activeTab === 'income' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-200">Income</h2>
            <button
              onClick={() => setShowAddIncome(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </button>
          </div>

          <div className="space-y-6">
            {getSortedMonthKeys(incomeByMonth, true).map((month) => {
              const monthIncome = incomeByMonth[month]
              return (
              <div key={month} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
                <div className="bg-slate-800/60 px-6 py-3">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                    {month}
                    <span className="ml-2 text-xs text-slate-400">
                      ({monthIncome.length} income entr{monthIncome.length !== 1 ? 'ies' : 'y'})
                    </span>
                  </h3>
                </div>
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-800/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">BRL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">USD</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {monthIncome.map((incomeItem) => (
                      <tr key={incomeItem.id} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {parseLocalDate(incomeItem.date).toLocaleDateString(getLocale(), {
                            weekday: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-200">{incomeItem.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                          R${incomeItem.brl_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                          ${incomeItem.usd_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPersonColor(incomeItem.person)}`}>
                            {incomeItem.person}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {incomeItem.category || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openEditIncome(incomeItem)}
                              className="hover:text-slate-200"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteIncome(incomeItem.id)}
                              className="hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {/* History Tab */}
      {!loading && activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-200">{t('budget.history.title')}</h2>
              <p className="text-sm text-slate-400 mt-1">{t('budget.history.subtitle')}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddExpense(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Historical Expense
              </button>
              <button
                onClick={() => setShowAddIncome(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Historical Income
              </button>
            </div>
          </div>

          {/* All-Time Totals Card */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">{t('budget.history.summary')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-2">{t('budget.history.billsPaid')} - {t('budget.stella')}</p>
                <p className="text-2xl font-bold text-blue-400">
                  R${expenses.filter(e => e.status === 'paid' && e.person === 'Stella').reduce((sum, e) => sum + e.amount, 0).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ${expenses.filter(e => e.status === 'paid' && e.person === 'Stella').reduce((sum, e) => sum + (e.usd_amount || 0), 0).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-2">{t('budget.history.billsPaid')} - {t('budget.rosser')}</p>
                <p className="text-2xl font-bold text-purple-400">
                  R${expenses.filter(e => e.status === 'paid' && e.person === 'Rosser').reduce((sum, e) => sum + e.amount, 0).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ${expenses.filter(e => e.status === 'paid' && e.person === 'Rosser').reduce((sum, e) => sum + (e.usd_amount || 0), 0).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Historical Monthly Breakdown */}
          <div className="space-y-6">
            {getSortedMonthKeys(historicalItemsByMonth, false).map((month) => {
              const items = historicalItemsByMonth[month]
              const monthExpenses = items.filter(item => item.type === 'expense') as (ExpenseItem & { type: 'expense' })[]
              const monthIncome = items.filter(item => item.type === 'income') as (IncomeItem & { type: 'income' })[]
              const stellaExpenses = monthExpenses.filter(e => e.person === 'Stella').reduce((sum, e) => sum + e.amount, 0)
              const rosserExpenses = monthExpenses.filter(e => e.person === 'Rosser').reduce((sum, e) => sum + e.amount, 0)
              const totalExpenses = stellaExpenses + rosserExpenses
              
              return (
                <div key={month} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/60 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200">
                          {month}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {monthExpenses.length} expense{monthExpenses.length !== 1 ? 's' : ''} paid · {monthIncome.length} income entr{monthIncome.length !== 1 ? 'ies' : 'y'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Bills Paid</p>
                        <div className="flex items-center justify-end gap-3">
                          {stellaExpenses > 0 && (
                            <p className="text-sm">
                              <span className="text-xs text-slate-500">Stella: </span>
                              <span className="text-blue-400 font-semibold">R${stellaExpenses.toLocaleString()}</span>
                            </p>
                          )}
                          {rosserExpenses > 0 && (
                            <p className="text-sm">
                              <span className="text-xs text-slate-500">Rosser: </span>
                              <span className="text-purple-400 font-semibold">R${rosserExpenses.toLocaleString()}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-800">
                    {items.map((item) => (
                      <div key={item.id} className="px-6 py-4 hover:bg-slate-800/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            {item.type === 'expense' ? (
                              <Receipt className="h-5 w-5 text-red-400 flex-shrink-0" />
                            ) : (
                              <DollarSign className="h-5 w-5 text-green-400 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-200">{item.description}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPersonColor(item.person)}`}>
                                  {item.person}
                                </span>
                                {item.type === 'expense' && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border text-green-400 bg-green-400/10 border-green-400/20">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Paid
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {parseLocalDate(item.date).toLocaleDateString(getLocale(), { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              {item.type === 'expense' ? (
                                <>
                                  <p className="text-sm font-semibold text-red-400">-R${item.amount.toLocaleString()}</p>
                                  <p className="text-xs text-slate-500">-${(item.usd_amount || 0).toLocaleString()}</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm font-semibold text-green-400">+R${item.brl_amount.toLocaleString()}</p>
                                  <p className="text-xs text-slate-500">+${item.usd_amount.toLocaleString()}</p>
                                </>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => item.type === 'expense' ? openEditExpense(item) : openEditIncome(item)}
                                className="hover:text-slate-200 text-slate-400"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => item.type === 'expense' ? deleteExpense(item.id) : deleteIncome(item.id)}
                                className="hover:text-red-400 text-slate-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {Object.keys(historicalItemsByMonth).length === 0 && (
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-12 text-center">
              <History className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No History Yet</h3>
              <p className="text-slate-400 mb-6">
                Months will appear here once all expenses are marked as paid.
              </p>
              <p className="text-sm text-slate-500">
                Or add historical payments using the buttons above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-semibold text-slate-200">Add Expense</h3>
              <button onClick={() => { setShowAddExpense(false); resetExpenseForm(); }} className="text-slate-400 hover:text-slate-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (BRL)</label>
                  <input
                    type="text"
                    value={expenseBRL}
                    onChange={(e) => handleExpenseBRLChange(formatCurrencyInput(e.target.value, 'BRL'))}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
                  <input
                    type="text"
                    value={expenseUSD}
                    onChange={(e) => handleExpenseUSDChange(formatCurrencyInput(e.target.value, 'USD'))}
                    placeholder="$ 0.00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="e.g., Rent, Groceries, etc."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Person</label>
                  <select
                    value={expensePerson}
                    onChange={(e) => setExpensePerson(e.target.value as Person)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Rosser">Rosser</option>
                    <option value="Stella">Stella</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={expenseStatus}
                    onChange={(e) => setExpenseStatus(e.target.value as ExpenseStatus)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category (Optional)</label>
                <input
                  type="text"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  placeholder="e.g., Housing, Food, Transport"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                💡 Enter amount in either BRL or USD - the other will auto-calculate using current exchange rate (1 USD ≈ {exchangeRate.toFixed(2)} BRL)
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
              <button
                onClick={() => { setShowAddExpense(false); resetExpenseForm(); }}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showAddIncome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-semibold text-slate-200">Add Income</h3>
              <button onClick={() => { setShowAddIncome(false); resetIncomeForm(); }} className="text-slate-400 hover:text-slate-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (BRL)</label>
                  <input
                    type="text"
                    value={incomeBRL}
                    onChange={(e) => handleIncomeBRLChange(formatCurrencyInput(e.target.value, 'BRL'))}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
                  <input
                    type="text"
                    value={incomeUSD}
                    onChange={(e) => handleIncomeUSDChange(formatCurrencyInput(e.target.value, 'USD'))}
                    placeholder="$ 0.00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  placeholder="e.g., Salary, Bonus, etc."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Person</label>
                  <select
                    value={incomePerson}
                    onChange={(e) => setIncomePerson(e.target.value as Person)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Rosser">Rosser</option>
                    <option value="Stella">Stella</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category (Optional)</label>
                  <input
                    type="text"
                    value={incomeCategory}
                    onChange={(e) => setIncomeCategory(e.target.value)}
                    placeholder="e.g., Salary, Bonus"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                💡 Enter amount in either BRL or USD - the other will auto-calculate using current exchange rate (1 USD ≈ {exchangeRate.toFixed(2)} BRL)
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
              <button
                onClick={() => { setShowAddIncome(false); resetIncomeForm(); }}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIncome}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Add Income
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-semibold text-slate-200">Edit Expense</h3>
              <button onClick={() => { setShowEditExpense(false); setEditingExpenseId(null); resetExpenseForm(); }} className="text-slate-400 hover:text-slate-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (BRL)</label>
                  <input
                    type="text"
                    value={expenseBRL}
                    onChange={(e) => handleExpenseBRLChange(formatCurrencyInput(e.target.value, 'BRL'))}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
                  <input
                    type="text"
                    value={expenseUSD}
                    onChange={(e) => handleExpenseUSDChange(formatCurrencyInput(e.target.value, 'USD'))}
                    placeholder="$ 0.00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="e.g., Rent, Groceries, etc."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Person</label>
                  <select
                    value={expensePerson}
                    onChange={(e) => setExpensePerson(e.target.value as Person)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Rosser">Rosser</option>
                    <option value="Stella">Stella</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={expenseStatus}
                    onChange={(e) => setExpenseStatus(e.target.value as ExpenseStatus)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category (Optional)</label>
                <input
                  type="text"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  placeholder="e.g., Housing, Food, Transport"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                💡 Enter amount in either BRL or USD - the other will auto-calculate using current exchange rate (1 USD ≈ {exchangeRate.toFixed(2)} BRL)
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
              <button
                onClick={() => { setShowEditExpense(false); setEditingExpenseId(null); resetExpenseForm(); }}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateExpense}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Update Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Income Modal */}
      {showEditIncome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-semibold text-slate-200">Edit Income</h3>
              <button onClick={() => { setShowEditIncome(false); setEditingIncomeId(null); resetIncomeForm(); }} className="text-slate-400 hover:text-slate-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (BRL)</label>
                  <input
                    type="text"
                    value={incomeBRL}
                    onChange={(e) => handleIncomeBRLChange(formatCurrencyInput(e.target.value, 'BRL'))}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
                  <input
                    type="text"
                    value={incomeUSD}
                    onChange={(e) => handleIncomeUSDChange(formatCurrencyInput(e.target.value, 'USD'))}
                    placeholder="$ 0.00"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  placeholder="e.g., Salary, Bonus, etc."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Person</label>
                  <select
                    value={incomePerson}
                    onChange={(e) => setIncomePerson(e.target.value as Person)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Rosser">Rosser</option>
                    <option value="Stella">Stella</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category (Optional)</label>
                  <input
                    type="text"
                    value={incomeCategory}
                    onChange={(e) => setIncomeCategory(e.target.value)}
                    placeholder="e.g., Salary, Bonus"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                💡 Enter amount in either BRL or USD - the other will auto-calculate using current exchange rate (1 USD ≈ {exchangeRate.toFixed(2)} BRL)
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
              <button
                onClick={() => { setShowEditIncome(false); setEditingIncomeId(null); resetIncomeForm(); }}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateIncome}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Update Income
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

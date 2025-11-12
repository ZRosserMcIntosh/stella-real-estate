// API endpoint for personal income
import { supabase } from '../../src/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('personal_income')
      .insert([body])
      .select()
    
    if (error) throw error
    
    return Response.json(data[0])
  } catch (error) {
    console.error('Error creating income:', error)
    return Response.json({ error: 'Failed to create income' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('personal_income')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching income:', error)
    return Response.json({ error: 'Failed to fetch income' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const { data, error } = await supabase
      .from('personal_income')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating income:', error)
    return Response.json({ error: 'Failed to update income' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('personal_income')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting income:', error)
    return Response.json({ error: 'Failed to delete income' }, { status: 500 })
  }
}

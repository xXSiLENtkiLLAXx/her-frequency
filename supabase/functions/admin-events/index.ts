import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Simple admin key for developer access - in production, use proper auth
const ADMIN_KEY = 'herfrequency-admin-2026'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Use service role to bypass RLS for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, adminKey, ...params } = await req.json()

    // Validate admin key
    if (adminKey !== ADMIN_KEY) {
      console.error('Invalid admin key attempt')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Admin action: ${action}`, params)

    switch (action) {
      case 'get_registrations': {
        const { eventId } = params
        
        let query = supabase
          .from('event_registrations')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (eventId && eventId !== 'all') {
          query = query.eq('event_id', parseInt(eventId))
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error('Error fetching registrations:', error)
          throw error
        }
        
        console.log(`Fetched ${data?.length || 0} registrations`)
        return new Response(
          JSON.stringify({ registrations: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get_event_settings': {
        const { data, error } = await supabase
          .from('event_settings')
          .select('*')
          .order('event_id', { ascending: true })
        
        if (error) {
          console.error('Error fetching event settings:', error)
          throw error
        }
        
        console.log(`Fetched ${data?.length || 0} event settings`)
        return new Response(
          JSON.stringify({ settings: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update_total_spots': {
        const { eventId, totalSpots } = params
        
        // Validate inputs
        if (!eventId || typeof totalSpots !== 'number' || totalSpots < 0 || totalSpots > 1000) {
          return new Response(
            JSON.stringify({ error: 'Invalid event ID or spots value' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const { data, error } = await supabase
          .from('event_settings')
          .update({ total_spots: totalSpots })
          .eq('event_id', eventId)
          .select()
          .single()
        
        if (error) {
          console.error('Error updating total spots:', error)
          throw error
        }
        
        console.log(`Updated event ${eventId} to ${totalSpots} spots`)
        return new Response(
          JSON.stringify({ success: true, setting: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'add_event': {
        const { eventId, eventName, totalSpots } = params
        
        // Validate inputs
        if (!eventId || !eventName || typeof totalSpots !== 'number') {
          return new Response(
            JSON.stringify({ error: 'Invalid event data' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const { data, error } = await supabase
          .from('event_settings')
          .insert({
            event_id: eventId,
            event_name: eventName.trim().slice(0, 100),
            total_spots: Math.min(Math.max(totalSpots, 1), 1000)
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error adding event:', error)
          throw error
        }
        
        console.log(`Added new event: ${eventName}`)
        return new Response(
          JSON.stringify({ success: true, setting: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    console.error('Admin function error:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
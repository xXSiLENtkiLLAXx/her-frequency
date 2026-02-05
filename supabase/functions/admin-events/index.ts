import { createClient } from 'npm:@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://her-frequency.lovable.app',
  'https://id-preview--75508879-0b3f-4010-8e00-d7db1a2bfe1c.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
]

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || '')
    ? origin
    : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin || ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Reject requests from non-allowed origins
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.error('Origin not allowed:', origin)
    return new Response(
      JSON.stringify({ error: 'Origin not allowed' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create client with service role for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Get authorization header for user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No auth header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's JWT to verify their identity
    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: {
        headers: { Authorization: authHeader }
      }
    })

    // Get the user from the JWT
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      console.error('Invalid or expired token:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Authenticated user: ${user.email}`)

    // Check if user has admin role using service role client
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    })

    if (roleError) {
      console.error('Error checking admin role:', roleError)
      return new Response(
        JSON.stringify({ error: 'Error verifying permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isAdmin) {
      console.error('User is not an admin:', user.email)
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Admin access granted for: ${user.email}`)

    const { action, ...params } = await req.json()

    console.log(`Admin action: ${action}`, params)

    switch (action) {
      case 'get_registrations': {
        const { eventId } = params
        
        let query = supabaseAdmin
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
        const { data, error } = await supabaseAdmin
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
        
        const { data, error } = await supabaseAdmin
          .from('event_settings')
          .update({ total_spots: totalSpots })
          .eq('event_id', eventId)
          .select()
          .single()
        
        if (error) {
          console.error('Error updating total spots:', error)
          throw error
        }
        
        console.log(`Updated event ${eventId} to ${totalSpots} spots by ${user.email}`)
        return new Response(
          JSON.stringify({ success: true, setting: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update_reserved_spots': {
        const { eventId, reservedSpots } = params
        
        // Validate inputs
        if (!eventId || typeof reservedSpots !== 'number' || reservedSpots < 0 || reservedSpots > 1000) {
          return new Response(
            JSON.stringify({ error: 'Invalid event ID or reserved spots value' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const { data, error } = await supabaseAdmin
          .from('event_settings')
          .update({ reserved_spots: reservedSpots })
          .eq('event_id', eventId)
          .select()
          .single()
        
        if (error) {
          console.error('Error updating reserved spots:', error)
          throw error
        }
        
        console.log(`Updated event ${eventId} reserved spots to ${reservedSpots} by ${user.email}`)
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
        
        const { data, error } = await supabaseAdmin
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
        
        console.log(`Added new event: ${eventName} by ${user.email}`)
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
      { status: 500, headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' } }
    )
  }
})

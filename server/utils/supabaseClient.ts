import { createClient } from '@supabase/supabase-js';

const config = useRuntimeConfig();

export const supabaseAdmin = () =>
	createClient(config.supabaseUrl, config.supabaseServiceKey);

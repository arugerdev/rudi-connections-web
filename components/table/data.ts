import { createClient } from "@/utils/supabase/client";

export const columns = [
   { name: 'Nombre', uid: 'name' },
   { name: 'IP Pública', uid: 'public_ip' },
   { name: 'Estado', uid: 'status' },
   { name: 'Acciones', uid: 'actions' },
];

export const getDevices = async () => {
   const supabase = createClient()
   const { data: user } = await supabase.auth.getUser()
   return await supabase.from('devices').select('*').eq('owned_by', user.user?.id).order('status', { ascending: true })
}

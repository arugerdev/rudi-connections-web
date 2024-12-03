import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { dispositivo_id, ip_publica } = req.body;

    if (!dispositivo_id || !ip_publica) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const { error } = await supabase
        .from('dispositivos')
        .update({ ip_publica, updated_at: new Date() })
        .eq('id', dispositivo_id);

    if (error) {
        return res.status(500).json({ error: 'Error al actualizar la IP' });
    }

    res.status(200).json({ message: 'IP actualizada correctamente' });
}

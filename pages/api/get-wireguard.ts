import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string;
    result?: string | undefined;
    error?: PostgrestError;
}
// import { getSupabaseClient } from '../../utils/supabase'; // Asegúrate de configurar Supabase correctamente.
import { createClient, PostgrestError } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest,
    res: NextApiResponse<ResponseData>) {
    // Verifica que la solicitud sea un GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Recupera los parámetros necesarios del query o body
    const { deviceKey } = req.query;

    if (!deviceKey) {
        return res.status(400).json({ message: 'Falta el deviceKey' });
    }

    // Consulta a Supabase para obtener la información del dispositivo
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data, error } = await supabase
        .from('devices')
        .select('public_ip, private_key, public_key, preshared_key, dns, name')
        .eq('key', deviceKey)
        .single();

    if (error || !data) {
        return res.status(500).json({ message: 'Error al obtener los datos del dispositivo', error });
    }

    // Datos del dispositivo desde Supabase
    const { public_ip, private_key, public_key, preshared_key, dns, name } = data;

    // Generación del archivo de configuración de WireGuard
    const wireguardConfig = `
[Interface]
Address = 10.7.0.2/24
DNS = ${dns}
PrivateKey = ${private_key}

[Peer]
PublicKey = ${public_key}
PresharedKey = ${preshared_key}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${public_ip}:51820
PersistentKeepalive = 25
  `;

    // Define el nombre del archivo
    const fileName = `${name}.conf`;

    // Establecer encabezados para la descarga del archivo
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send({ message: 'OK', result: wireguardConfig });
}
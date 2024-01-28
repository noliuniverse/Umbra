import { supabase } from '@/utils/supabaseClient'


export async function fetchObjekts(page, userid, batchSize) {

    function checkValues(VALUE1, VALUE2, VALUE3) {
        return (VALUE1 >= VALUE2 && VALUE1 <= VALUE3)
    }
    // 1*2 = 2, 2*2>>4-1 = 3
    var startNumber = (page-1)*batchSize;
        var endNumber = ((page)*batchSize)-1;
           //.range(startNumber, endNumber) 
    const { data:datas, error:errors } = await supabase
    .from('objektcollection')
    .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id)')
    .eq('user_uuid', userid.toString())
    .order('created_at', { ascending: false })
    .range(startNumber, endNumber)
    
    return datas
    
}
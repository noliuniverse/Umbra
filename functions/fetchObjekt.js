import { supabase } from '@/utils/supabaseClient'


export async function fetchObjekts(page, userid) {

    function checkValues(VALUE1, VALUE2, VALUE3) {
        return VALUE1 >= VALUE3 + VALUE2;
    }
    
    
    const batchSize = 30;
    var startNumber = (page-1)*batchSize;
    var endNumber = ((page)*batchSize)-1;
        
        const { data:datas1, error:errors1 } = await supabase
        .from('objektcollection')
        .select('id, serial, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id)')
        .eq('user_uuid', userid.toString())
        
        if (checkValues(endNumber,batchSize, datas1.length) ) {
            return null
        }
        else{
            if (startNumber+batchSize > datas1.length) {
                endNumber = datas1.length-1;
            }
            const { data:datas, error:errors } = await supabase
        .from('objektcollection')
        .select('id, serial, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id)')
        .eq('user_uuid', userid.toString())
        .range(startNumber, endNumber)
        if (errors) {
        }
        if (datas) {
            return datas;
        }}


    
}
import { supabase } from '@/utils/supabaseClient'

export async function fetchObjekts(page, userid, batchSize, collection, searchParams) {

    
        


    // 1*2 = 2, 2*2>>4-1 = 3
    var startNumber = (page-1)*batchSize;
        var endNumber = ((page)*batchSize)-1;
           //.range(startNumber, endNumber)
    if (collection == true)  {
        var asc = false;
        var row = 'created_at'

            
                if (searchParams.get('sort')){
                    if (searchParams.get('sort') == "oldest"){
                        asc = true;
                        row = 'created_at'
                    }
                    if (searchParams.get('sort') == "newest"){
                        asc = false;
                        row = 'created_at'
                    }
                    if (searchParams.get('sort') == "serial"){
                        asc = true;
                        row = 'serial';
                    }
                }
        
        // divider
        const { data:datas, error:errors } = await supabase
    .from('objektcollection')
    .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink)')
    .eq('user_uuid', userid.toString())
    .order(row, { ascending: asc })
    .range(startNumber, endNumber)
    try {return datas}
    catch {return []}
    } else {
        var asc = true;
            if (searchParams.get('sort')){
                if (searchParams.get('sort') == "oldest"){
                    asc = false;
                }
                if (searchParams.get('sort') == "newest"){
                    asc = true;
                }
                
            }
            
        // divider
        const { data:datas, error:errors } = await supabase
    .from('objektdata')
    .select('member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink')
    .eq('eventhost', userid.toString())
    .order('uuid', { ascending: asc })
    .range(startNumber, endNumber)
    try {return datas}
    catch {return []}
    }
    
    
    
}
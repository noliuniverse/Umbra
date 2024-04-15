import { supabase } from '@/utils/supabaseClient'

export async function fetchObjekts(page, userid, batchSize, collection, searchParams) {

    
        


    // 1*2 = 2, 2*2>>4-1 = 3
    var startNumber = (page-1)*batchSize;
        var endNumber = ((page)*batchSize)-1;
           //.range(startNumber, endNumber)
    if (collection == true)  {
        var asc = false;
        var row = 'created_at'
        var group = null;
        var idol = null;
        if (searchParams.get('group')){
            group = searchParams.get('group');
            
        }
        if (searchParams.get('idol')){
            idol = searchParams.get('idol');
            
        }
            
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
    .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink, type)')
    .eq('user_uuid', userid.toString())
    .order(row, { ascending: asc })
    .range(startNumber, endNumber)
    try {if (group != null){
        const { data:datas2, error:errors2 } = await supabase
        .from('objektcollection')
        .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink, type)')
        .eq('user_uuid', user.id.toString())
        .order(row, { ascending: asc })
        var datass = Object.values(datas2).filter(item => item.objektdata.artist.includes(group));
        if (idol != null) {
            datass = Object.values(datass).filter(item => item.objektdata.member.includes(idol));
        }
        datass = datass.splice(startNumber, endNumber)
            return datass
        
    }
    else {

            return datas
    }}
    catch (err) {console.log(err);return []}
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
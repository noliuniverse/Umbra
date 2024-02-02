import { supabase } from '@/utils/supabaseClient'
import { useSearchParams } from 'next/navigation'


export async function fetchObjekts(page, userid, batchSize) {
    const searchParams = useSearchParams();
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
    .order(row, { ascending: asc })
    .range(startNumber, endNumber)
    
    return datas
    
}
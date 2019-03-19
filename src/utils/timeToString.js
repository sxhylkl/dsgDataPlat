/**
 * Created by suge on 2018/11/23
 */
export function timeToString(sec){
    if(sec<60){
        return(sec+'秒')
    }
    if(sec>=60&&sec<3600){
        return(parseInt(sec/60)+'分' + sec%60+'秒')
    }
    if(sec>=3600){
        return(parseInt(sec/3600 )+"时" +parseInt((sec%3600)/60) +'分' +(sec%3600)%60 +'秒')
    }
}

//把参数格式处理为FormData格式
export function handleParams(obj){
    let params=new FormData(obj)
    for(let key in obj){
        params.append(key,obj[key])
    }
    return params
}

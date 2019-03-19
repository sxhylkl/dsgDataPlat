export const dataResp = (data,resp)=>{
  if(data.code===0){
    resp()
  }
  else{
    this.$message({
      type:'error',
      message:data.msg
    })
  }
}
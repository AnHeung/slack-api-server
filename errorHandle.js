exports.errMsg = (msg)=>{
    return {err: true , msg:msg}
}

exports.successMsg = (msg)=>{
    return {err:false , msg :msg}
}

exports.successAndFetchData = (msg, data)=>{
    return {err:false , msg :msg, data:data}
}


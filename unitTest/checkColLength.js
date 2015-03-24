function checkColLength(colVal,colLen){
	if(colLen){
        colVal+='';
        var lenSplit=(colLen+'').split('.');//将colLen转化成文字数组['3','2']
        var valSplit=colVal.split('.');//将colVal转化成文字数组
        //总长度(整数+小数)
        var allLen=0;
        for(var i in lenSplit)
            allLen+=parseInt(lenSplit[i]);
        //数字格式
        if(lenSplit.length===2){
            //数字超长
            if(valSplit[0].length>lenSplit[0] || (valSplit[1] && valSplit[1].length>lenSplit[1]))
                return errNumLength.replace('/i',lenSplit[0]).replace('/f',lenSplit[1]);
            //去掉.号
            colVal=colVal.replace('.','');
        }
        //计算colVal的总长度
        var valLen= 0,chBytes=_chBytes;
        //----按字节算长度的话，遍历每个值
        if(isByte){
            for(var j= 0,l=colVal.length;j<l;j++){
                if(colVal.charCodeAt(j)>256)
                    valLen+=chBytes;
                else
                    valLen+=1;
            }
        }
        //----非字节算长度
        else {
            chBytes=1;
            valLen = colVal.length;
        }
        //超出总长度(colLen)
        if(valLen>allLen){
            if(lenSplit.length===1)
                return errCharLength.replace('/a',colLen).replace('/c',chBytes);
            else
                return errNumLength.replace('/i',lenSplit[0]).replace('/f',lenSplit[1]);
        }
    }
}
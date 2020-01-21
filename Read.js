const load = () => {//读入数据部分..............................................................................
var sumofPrv = new Array();
for(var i=0;i<70;i++) sumofPrv[i]=0.0;//初始化总计数组 必须！！！
var nameofPrv = new Array();
var len;
var dataset = d3.json("./gdp.json")
    .then(data=>{
        var prvdata = {};
        len=parseInt(data[data.length-1]["Prvcnm_id"]/10000);//省份编码数量
        for (var i=0;i<data.length;i++) {//等价于 i in data
            var sum=0;//临时变量存储累加和
            for(j in data[i]){
                if(j.indexOf("Gdp") != -1)//Gdp数据以Gdp开头
                    if(data[i][j]>0)//排除空数据
                        sum += Math.floor(data[i][j]*100)/100;//控制精度
                sum = Math.floor(sum*100)/100;
            }//累计月份和
            var x = Math.floor(data[i]["Prvcnm_id"]/10000);//当前省份编码
            if(!prvdata.hasOwnProperty(x)) prvdata[x]= new Array();
            prvdata[x].push(sum);
            sumofPrv[ x ] = Math.floor((sumofPrv[ x ] + sum)*100)/100;//按省份累计年份和
            nameofPrv[ x ] = data[i]["Prvcnm"];//存储省份
        }//遍历每一组数据
        //console.log(prvdata);
        var Name = new Array();var Gdpsum = new Array();var ktoi = new Array();
        var k=0;
        for (var i=0;i<=len;i++){
            if(sumofPrv[ i ] >0){//省份编码非连续
                //document.getElementById("demo").innerHTML += nameofPrv[ i ] + " " + sumofPrv[ i ] + "<br>";//输出到p.demo标签
                Name[k]=nameofPrv[ i ];
                Gdpsum[k]=sumofPrv[ i ];
                ktoi[k]=i;
            k++;
        }}//k=0为中国 max k=30
        //数据读入处理完毕.......................................................................
        //数组切换衔接
        var dataset = new Array();var nameset = new Array();
        for(var i=0;i<k-1;i++){
            dataset[i]=Gdpsum[i+1];
            nameset[i]=Name[i+1];
        }//去除中国
        drawColumn(dataset,nameset,ktoi,prvdata);
        drawPie(dataset);
        //绘图结束..................................................................................
        console.log(data);
    })
    .catch(err=>{
        console.error(err);
    });
    //返回错误
};
const del = () =>{
    var svg = d3.select("svg").selectAll("g").remove();
    var svg = d3.select("#pie").selectAll("g").remove();
};

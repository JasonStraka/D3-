const drawColumn = (dataset,nameset,ktoi,prvdata) => {
    var marge = {top:60,bottom:100,left:60,right:60}
    var svg = d3.select("svg");//得到SVG画布
    var width = svg.attr("width");//得到画布的宽
    var height = svg.attr("height");//得到画布的长
    var g = svg.append("g")
        .attr("transform","translate("+marge.left+","+marge.top+")");//左上角边缘
    //坐标轴绘制.............................................................................
    var xScale = d3.scaleBand()//坐标轴x,根据输入的domain的长度,等分rangeRound域//随数据数量改变宽度
        .domain(d3.range(dataset.length))
        .rangeRound([0,width-marge.left-marge.right]);
        //作为对应函数xScale(domain)=rangeRound
    var xAxis = d3.axisBottom(xScale)//定义一个下方axis
    var yScale = d3.scaleLinear()
        .domain([0,d3.max(dataset)])
        .range([height-marge.top-marge.bottom,0]);//注意倒序y
    var yAxis = d3.axisLeft(yScale);//定义一个左侧axis
    
    g.append("g")//x轴的显示
        .attr("transform","translate("+0+","+(height-marge.top-marge.bottom)+")")
        .call(xAxis)//为xAxis添加g
        //以下实现文字旋转 以文字的起点开始旋转
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(45 -10 10)")
        //以下 以文字的最后一个字为基准旋转
        // .selectAll("text")  
        // .style("text-anchor", "end")
        // .attr("dx", "-.8em")
        // .attr("dy", ".15em")
        // .attr("transform", "rotate(-65)")
        //以上
        .text((d,i)=>{
            return nameset[i];
        })//x轴文本
        .attr("fill","BlueViolet")
        .style("font-size", "14px");

    g.append("g")//y轴
        .attr("transform","translate(0,0)")
        .call(yAxis)
        .selectAll("text")//选择文本
        .attr("fill","silver")
        .text(d=>{
            return Math.floor(d/10000)+"万";
        })
        .style("font-size", "15px");
        
    //绘制矩形和文字.........................................................................
    var gs = g.selectAll(".rect")
        .data(dataset)
        .enter()//选择未对应数据
        .append("g")
        .on("click",(d,i)=>{delPie();drawPie(prvdata[ktoi[i+1]],nameset);});//点击绘画饼图 先删后画防止重叠
    
    //绘制矩形
    var rectPadding = 10;//矩形之间的间隙
    gs.append("rect")
        .attr("x",(d,i)=>xScale(i)+rectPadding/2)	
        .attr("y",d=>{
            var min = yScale.domain()[0];
            return yScale(min);
        })
        .attr("width",i=>{
            return xScale.step()-rectPadding;
        })
        .attr("height",0)
        .attr("fill","aqua")
        .transition()
        .duration(1000)
        .delay((d,i)=>{
            return i*200;
        })
        //.ease(d3.easeElasticInOut)
        .attr("y",d=>{
            return yScale(d);
        })
        .attr("height",d=>{
            return height-marge.top-marge.bottom-yScale(d);
        })
        .attr("rx","10px")
        .attr("ry","10px")//圆角
        .attr("fill", (d, i) => d3.interpolateSinebow(1.0 - i * 1.0 / dataset.length) );
    //绘制上浮文字
    gs.append("text")
        .attr("x",(d,i)=>{
            return xScale(i)+rectPadding/2;
        })
        .attr("y",d=>{
            var min = yScale.domain()[0];
            return yScale(min);
        })
        .attr("text-anchor","middle")//属性text-anchor有三个值：start、middle、end,这里用middle表示文字中心位于起始位置上
        .attr("dx",i=>{
            return (xScale.step()-rectPadding)/2;
        })
        .attr("dy","-0.5em")//其中dx,dy表示相对(x,y)平移的大小，所以文本会从(x+dx,y+dy)位置开始显示 em单位表示的是当前文字所占一行的高度
        .text(d=>{
            return parseInt(d/10000)+" 万";//d;
        })
        .attr("fill","white")
        .transition()
        .duration(1000)
        .delay(function(d,i){
            return i*200;
        })
        //.ease(d3.easeElasticInOut)
        .attr("y",d=>{
            return yScale(d);
        })
        .attr("fill","olive")
        .attr("font-size","16px");//.style("font-size", "14px")
}

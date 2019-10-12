function graph1(){
    function getData() {
        return Math.random();
        }
         Plotly.plot('chart1',
         [{y:[getData()],
         type:'line'}]);	

         var cnt = 0;
        setInterval(function(){
        Plotly.extendTraces('chart1',{ y:[[getData()]]}, [0]);
        cnt++;
        if(cnt > 500) {
           Plotly.relayout('chart1',{
                 xaxis: {
                     range: [cnt-500,cnt]
                  }
              });
        }
       },15);
        $(".buttongraph1").hide();
}

function graph2(){
    function getData() {
        return Math.random();
        }
         Plotly.plot('chart2',
         [{y:[getData()],
         type:'line'}]);	

         var cnt = 0;
        setInterval(function(){
        Plotly.extendTraces('chart2',{ y:[[getData()]]}, [0]);
        cnt++;
          
        if(cnt > 500) {
           Plotly.relayout('chart2',{
                 xaxis: {
                     range: [cnt-500,cnt]
                  }
              });
        }
       },15);
       $(".buttongraph2").hide();
       
}

function graph3(){
    function getData() {
        return Math.random();
        }
         Plotly.plot('chart3',
         [{y:[getData()],
         type:'line'}]);	

         var cnt = 0;
        setInterval(function(){
        Plotly.extendTraces('chart3',{ y:[[getData()]]}, [0]);
        cnt++;
          
        if(cnt > 500) {
           Plotly.relayout('chart3',{
                 xaxis: {
                     range: [cnt-500,cnt]
                  }
              });
        }
       },15);
        $(".buttongraph3").hide();
    }
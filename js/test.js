$(document).ready(function () {
    //遍历数组
    let arr=['a','b','c','d','e'];
    let mapArr=['1','2','3'];
    arr.forEach(function (item,i) {
        console.log(item);
    });
    $.each(arr,function (i,item) {//参数位置和forEach相反
        console.log(item);
    });
    for(let i=0;i<arr.length;i++){
        console.log(arr[i]);
    };
    arr.map(function (item,i) {//map优点1：比forEach快
        console.log(item)
    });
    let newArr=mapArr.map(
        //num => num * 2
        function (num) {
            return num * 2
        }
    ).filter(function (num) {//map优点2：map返回新数组，可以进行链式操作
        return num > 5
    });
    console.log(newArr)
});



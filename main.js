let body = new ELEM(document.body);
let canvas = body.add("canvas").e;
let w = 500;
let h = 500;
canvas.width = w;
canvas.height = h;

let ctx = canvas.getContext("2d");

let imgdata = ctx.getImageData(0,0,w,h);
let data = imgdata.data;

let rng = PRNG_SEEDINT(10);
let points = [];
for(let i = 0; i < 5; i++){
    points.push([rng()*w,rng()*h]);
}

let calcdist = function(p1,p2){
    let sum = 0;
    for(let i = 0; i < p1.length; i++){
        let d = p1[i]-p2[i];
        sum += d*d;
    }
    return Math.sqrt(sum);
};

let getSumDist = function(point,points){
    let sum = 0;
    for(let i = 0; i < points.length; i++){
        let p = points[i];
        sum += calcdist(point,p);
    }
    return sum;
}

//draw out the field
for(let y = 0; y < h; y++){
    for(let x = 0; x < w; x++){
        let idx = 4*(y*w+x);
        //calculate the sum of distance
        let v = getSumDist([x,y],points)/
                points.length/
                calcdist([0,0],[w,h]);//less than diag(wh)
        //v will be 0 to 1
        let cv = Math.floor(Math.floor(v*50)/50*256);
        data[idx+0] = cv;
        data[idx+1] = cv;
        data[idx+2] = cv;
        data[idx+3] = 255;
    }
}

ctx.putImageData(imgdata,0,0);

ctx.strokeStyle = "#0f0"
for(let i = 0; i < points.length; i++){
    let p = points[i];
    ctx.beginPath();
    ctx.arc(p[0],p[1],2,0,6.28);
    ctx.closePath();
    ctx.stroke();
}


//place the mean (red)
let newarr = function(n){
    let arr = [];
    for(let i = 0; i < n; i++){
        arr.push(0);
    }
    return arr;
};

let calcMean = function(points){
    let sum = newarr(points[0].length);
    for(let i = 0; i < points.length; i++){
        let p = points[i];
        for(let j = 0; j < p.length; j++){
            sum[j] += p[j];
        }
    }
    let avg = sum;
    for(let i = 0; i < avg.length; i++){
        avg[i] /= points.length;
    }
    return avg;
};

let mean = calcMean(points);
console.log(mean);
ctx.strokeStyle = "#f00";
ctx.beginPath();
ctx.arc(mean[0],mean[1],2,0,6.28);
ctx.closePath();
ctx.stroke();



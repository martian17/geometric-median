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
};

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

let normalizedDifference = function(v1,v2){
    let sum = 0;
    let diff = [];
    for(let i = 0; i < v1.length; i++){
        let d = v2[i]-v1[i];
        diff[i] = d;
        sum += d*d;
    }
    let dd = Math.sqrt(sum);
    if(dd === 0)return newarr(diff.length);
    for(let i = 0; i < diff.length; i++){
        diff[i] /= dd;
    }
    return diff;
};


let magn = function(vec){
    let sum = 0;
    for(let i = 0; i < vec.length; i++){
        sum += vec[i]*vec[i];
    }
    return Math.sqrt(sum);
};

let dotProduct = function(v1,v2){
    let p = 0;
    for(let i = 0; i < v1.length; i++){
        p += v1[i]*v2[i];
    }
    return p;
};

let cosineSimilarity = function(a,b){
    let mab = magn(a)*magn(b);
    if(mab === 0){
        return 1;
    }
    return dotProduct(a,b)/mab;
};

let veccpy = function(v){
    let arr = [];
    for(let i = 0; i < v.length; i++){
        arr.push(v[i]);
    }
    return arr;
};

class Showdown extends ELEM{
    constructor(w,h){
        super("canvas");
        let canvas = this.e;
        let ctx = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;
        this.canvas = canvas;
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        
        let points = [];
        let that = this;
        this.on("click",(e)=>{
            points.push([e.clientX,e.clientY]);
            that.visualize(points);
        });
    }
    plotPoint(p){
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(p[0],p[1],2,0,6.28);
        ctx.closePath();
        ctx.stroke();
    }
    visualize(points){
        let {canvas,ctx,w,h} = this;
        let imgdata = ctx.getImageData(0,0,w,h);
        let data = imgdata.data;
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
            this.plotPoint(points[i]);
        }


        //place the mean (red)

        let mean = calcMean(points);
        
        
        //attempts top calculate the geometric median
        let r = w/5;
        let pv0 = [0,0];
        let m0 = veccpy(mean);
        for(let ii = 0; ii < 10; ii++){
            ctx.strokeStyle = "#f00";
            this.plotPoint(mean);
            
            let pullVector = [0,0];
            for(let i = 0; i < points.length; i++){
                let p = points[i];
                let diff = normalizedDifference(mean,p);
                pullVector[0] += diff[0];
                pullVector[1] += diff[1];
            }
            pullVector[0] /= points.length;
            pullVector[1] /= points.length;
            ctx.strokeStyle = "#0ff";
            
            if(cosineSimilarity(pv0,pullVector) < 0){
                r/=2;
                mean = m0;
                ii--;
                continue;
            }
            pv0 = pullVector;
            
            console.log(pullVector);
            ctx.beginPath();
            ctx.moveTo(mean[0],mean[1]);
            ctx.lineTo(mean[0]+pullVector[0]*r,mean[1]+pullVector[1]*r);
            ctx.stroke();
            mean[0] += pullVector[0]*r;
            mean[1] += pullVector[1]*r;
            
        }
    }
};


let main = function(){
    let body = new ELEM(document.body);
    let show = body.add(new Showdown(500,500));
};

main();

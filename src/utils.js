export function generateRandomNodes (n) {
    const {clientWidth: width, clientHeight: height} = document.querySelector('svg');
    const xAreas = Math.floor((n + 1) / 2), yAreas = 2;
    const xUnit = width / xAreas , yUnit = height / yAreas;
    let newNodes = Array(n);
    for(let i = 0, k = 0; i < yAreas ; ++i) {
        for(let j = 0; j < xAreas && k < n; ++j, ++k) {
            let xStart = j * xUnit;
            let xEnd = (j + 1) * xUnit;
            if(j  === 0)
                xStart += this.unit(0.3);
            if(j === xAreas - 1) 
                xEnd -= this.unit(0.3);
            else {
                xStart += this.unit(0.20);
                xEnd -= this.unit(0.20);
            }

            let yStart = i * yUnit;
            let yEnd = (i + 1) * yUnit;
            if(i === 0) {
                yStart += this.unit(0.3)
                yEnd -= this.unit(0.3);
            }
            else 
                yEnd -= this.unit(0.3);
                
            const x = randInt(xStart, xEnd), y = randInt(yStart, yEnd);
            newNodes[k] = [x / this.props.vw, y / this.props.vh];
        }
    }
    randomShuffle(newNodes);
    return newNodes;
}

export function generateRandomEdges (n) {
    let edges = [], chance;
    if(n <= 5)
        chance = 0.65;
    else if(n <= 10)
        chance = 0.475;
    else if(n <= 15)
        chance = 0.275;
    else
        chance = 0.225;
    console.log(chance, 'chances')
    for(let i = 0; i < n; ++i) 
        for(let j = i + 1; j < n; ++j) 
            if(Math.random() < chance )
                edges.push(`${i + 1} ${j + 1}`);
    
    console.log(edges);
    return edges;
}

export function randomShuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


export function randInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function emptyMatrix () {
    return Array(50).fill(0).map(() => Array(50).fill(0));
}

export function isNumber (str){
    return /^\d+$/.test(str);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function dist(x1, x2, y1, y2){
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function closestNode(x, y) {
    let bestNode = -1, minDisance = Infinity;
    this.props.nodes.forEach((coords, i) => {
        let distance = (coords[0] * this.props.vw - x) ** 2 + (coords[1] * this.props.vh - y) ** 2;
        if(distance < minDisance && distance < this.unit(0.7) ** 2) {
            minDisance = distance;
            bestNode = i;
        }
    });
    return bestNode;
}

export function getOffset(e, main) {
    const boundingRect = main.getBoundingClientRect();
    return [e.clientX - boundingRect.left, e.clientY - boundingRect.top].map(x => Math.ceil(x));
}
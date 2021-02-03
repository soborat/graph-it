// function newAction(type) {
//     class Action {
//         constructor(type, payload) {
//             this.type = type;
//             if(typeof payload !== 'undefined')
//                 this.paylaod = payload;
//         }
//         toString() {
//             return this.type;
//         }
//     }
//     class ActionCreator {
//         constructor() {
//             this.x = function(payload){return new Action(type, payload)};
//         }
//         toString() {
//             return 'asdd';
//         }
//     }
//     return new ActionCreator();
// };

// v = newAction('dog')
// console.log(v.toString());


// Function.prototype.toString = () => {
//     return 'asd';
// };
// f = () => {
//     return  () => {}
// }
// console.log(f() + '')

// function newAction(type) {
//     function Action(type, payload) {
//         this.type = type;
//         if(typeof payload !== 'undefined')
//             this.payload = payload;
//     }
//     Function.prototype.toString = function(){return this.type};
//     return function(payload) {this.type = type;}
// }

// v = new newAction();
// console.log(v+'')

// type = 55
// Function.prototype.toString = function(){return 's'};
// v = function(payload) {this.type = type;return function() {}}
// console.log(v + '')

function newAction(type) {
    function Action(type, payload) {
        this.type = type;
        if(typeof payload !== 'undefined')
            this.payload = payload;
    }
    function ret(payload) {
        return new Action(type, payload);
    }
    Function.prototype.toString = () => type;
    return ret;
}
v = newAction('dog');
d = v('cat')
console.log(v + '', d.payload)

// function Action(type, payload) {
//     this.type = type;
//     if(typeof payload !== 'undefined')
//         this.payload = payload;
// }
// d = new Action(1, 2);
// console.log(d)
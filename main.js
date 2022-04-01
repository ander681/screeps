//MAIN

//IMPORTS
var roleWorker = require('r.worker');
var roleWorkerV2 = require('r.worker.v2');
var deactivated = [''];

//stats
console.log('START');
//Game.map.visual.text("Target", new RoomPosition(anchor.x,anchor.y+1,Game.spawns['S1'].room.name), {color: '#FF0000', fontSize: 16});
console.log("#gcl level = " + Game.gcl.level + " " + Game.gcl.progress + "/" + Game.gcl.progressTotal); 
console.log("bucket = " + Game.cpu.bucket);
//drawRoadDiagonal(31,26,28,29){

//assign memory for spawn
Game.spawns['S1'].memory = {memory: {ambition: 0}}; //Create a new empty memory object for this source

//quick road builder
/*
var ix;
for (ix = 22; ix > 18; ix--){
    Game.rooms['W8N3'].createConstructionSite(33, ix, STRUCTURE_ROAD);
}
*/

module.exports.loop = function () {

    //filter
    var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    var v2workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    
    //spawn creeps
    if (workers.length < 12) {
        var newName = 'WV2'+ Game.time;
        //console.log('spawning harvester: ' + newName);
        Game.spawns['S1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'worker', task: 0, node: 0}});
    }
    //else {
        var anchor = Game.spawns['S1'].pos
        console.log("x=" + anchor.x);
        console.log("name=" + Game.spawns['S1'].room.name);
        //Game.createFlag(anchor, ["mark1"], ['#FF0000'], ['#FF0000'])
        //Game.flags.Flag1.setPosition(anchor);
        //Game.rooms['W8N3'].createConstructionSite(33, ix, STRUCTURE_EXTENSION);
    //}

    /*
    if (v2workers.length < 0) {
        var newName = 'WV2'+ Game.time;
        //console.log('spawning harvester: ' + newName);
        Game.spawns['S1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'v2worker', task: 0, node: 0, home: Game.spawns['S1'].room}, dest: 0});
    }
    */
    
    //find targets in need of energy
    var targets = Game.spawns['S1'].room.find(FIND_STRUCTURES, {
    filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    
    //call role script
    services = 4 * targets.length;
    for(var name in Game.creeps) {
        if (services == 0) {
            targets = [];
        }
        var creep = Game.creeps[name];
        if (deactivated.includes(creep.memory.role)) {
            continue;
        }
        else {
            if(creep.memory.role == 'worker') {
                roleWorker.run(creep, targets, 1);
            }
            if(creep.memory.role == 'v2worker') {
                roleWorker.run(creep, newRole);
            }
        }
        
        //decrement services needed
        services--;
    }
}

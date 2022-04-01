
var roleWorkerV2 = {
    run: function(creep, targets, range) {
        
        //find resource nodes
        var sources = creep.room.find(FIND_SOURCES);
        
        //find constructions sites
        var sites = _.sortBy(creep.room.find(FIND_CONSTRUCTION_SITES), s => creep.pos.getRangeTo(s));
        
        //harvest
        if (creep.memory.task != 0 && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.node = randRange(0, sources.length);
            creep.memory.task = 0;
        }
        //recharge structures
        else if (creep.store.getFreeCapacity() == 0 && targets.length != 0) {
            creep.memory.task = 1;
        }
        //build constructions sites
        else if (creep.store.getFreeCapacity() == 0 && sites.length != 0) {
            creep.memory.task = 2;
        }
        //upgrade controler
        else if (creep.store.getFreeCapacity() == 0) {
        //else {
            creep.memory.task = 3;
        }
        //safety check for controller downgrade
        if (creep.store.getFreeCapacity() == 0 && creep.room.controller.ticksToDowngrade < CONTROLLER_DOWNGRADE[creep.room.controller.level]/2) {
            creep.memory.task = 3;
        }
        
        creep.say(creep.memory.task);
        //creep.say(sites.length);
        //creep.say(creep.store[RESOURCE_ENERGY])
        switch(creep.memory.task) {
            
            case 0:
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[creep.memory.node]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.node], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            break;
            case 1:
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#b5ff78'}});
                    }
                }
                else {
                    creep.memory.task = 0;
                }
            break;
            case 2:
                if(sites.length > 0) {
                    if(creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sites[0], {visualizePathStyle: {stroke: '#45c5ff '}});
                    }
                }
                else {
                    creep.memory.task = 0;
                }
            break;
            case 3:
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#a964e2'}});
                }
            }
        }
    };

function randRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = roleWorkerV2;
/*
Base class for all entity types. Defines the base behavior and properties
that every entity should have. An entity has a state queue. holds the 
states of the entities in different times
*/
class Entity {
    constructor(mediator, x, y) {
        this.id = this.guid();
        this.x = x;
        this.y = y;
        this.mediator = mediator;
        this.stateQueue = [];
    }

    /*
    Add a state to the entity's queue
    */
    addState(state) {
        this.stateQueue.push(state);
    }

    /*
    Remove this entity by setting the removed state and delegating
    to the mediator.
    */
   removeSelf() {
    this.removed = true;
    this.mediator.removeEntity(this);
    }

    /*
    Dequeue a state from the entity's queue
    */
    dequeueState() {
        if (this.stateQueue.length == 0) return;

        this.currentState = this.stateQueue.shift();
        return this.currentState;
    }

    /*
    Return true if the state's queue has any updates
    */
    hasStateUpdates() {
        return this.stateQueue.length > 0;
    }

    /*
    Generate a 16 characters ID for the entity
    */
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
}

module.exports = Entity;
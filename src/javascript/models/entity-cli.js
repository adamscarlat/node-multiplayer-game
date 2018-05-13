class Entity {
    constructor(args) {
        this.id = args.id;
        this.x = args.x;
        this.y = args.y;
    }

    updateState(state) {
        this.x = state.x;
        this.y = state.y;
    }
}


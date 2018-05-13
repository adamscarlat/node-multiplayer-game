var entityFactory = function() {

    var createNewEntity = function(type, state) {
        switch (type) {
            case 'player':
                return new Player(state);
                break;
            case 'bullet':
                return new Bullet(state);
            default:
                break;
        }
    }

    return {
        createNewEntity: createNewEntity
    }
}();

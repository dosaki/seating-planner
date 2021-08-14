class Table {
    constructor(size, shape){
        this.shape = shape;
        this.size = size;
        this.spaces = [];
    }

    add(person) {
        if(this.spaces.length >= this.size){
            return;
        }
        this.spaces.push(person);
    }

    remove(person){
        this.spaces = this.spaces.filter(p => p !== person);
    }

    checkCompatibility() {
        
    }
}
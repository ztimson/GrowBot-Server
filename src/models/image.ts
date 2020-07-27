import * as fs from 'fs';

export class Image {
    constructor(private image) {}

    save(path: string) {
        return fs.writeFileSync(path, this.image)
    }

    toString() {
        return this.image;
    }

    valueOf() {
        return this.image;
    }
}

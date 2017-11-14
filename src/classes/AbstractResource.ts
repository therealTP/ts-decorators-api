import { v4 as uuid } from 'uuid';

export abstract class AbstractResource {
    // private id: string;
    id: string;

    contstructor() {}

/*    public setId(id: string) {
        this.id = id;
    }*/

    public generateUUID() {
        this.id = uuid();
    }
}
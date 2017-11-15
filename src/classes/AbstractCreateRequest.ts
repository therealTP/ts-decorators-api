import { v4 as uuid } from 'uuid';

export abstract class AbstractCreateRequest {
    id: string;

    contstructor() {}

    public generateUUID() {
        this.id = uuid();
    }
}
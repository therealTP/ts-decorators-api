/**
 * This class is the ONLY place UUIDs should be generated
 * UUID will be generated on insantiation of extended class
 * Any "create" request class will extend it
 */

import { v4 as uuid } from 'uuid';

export abstract class AbstractCreateRequest {
    id: string;

    constructor() {
        this.id = uuid();
    }
}
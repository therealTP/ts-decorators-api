/**
 * Base controller class to standardize configuration
 */
import { IControllerConfig } from './../interfaces/ControllerConfig';

export class AbstractController<DaoType> {
    /**
     * resourceLabel: used in customizing responses & errors
     * dao: standard access to corresponding dao for controller
     */
    protected resourceLabel: string;
    protected dao: DaoType;

    constructor(config: IControllerConfig<DaoType>) {
        this.resourceLabel = config.resourceLabel;
        this.dao = config.dao;
    }
}

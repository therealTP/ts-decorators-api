/**
 * Base controller class to standardize configuration
 */
export class AbstractController<DaoType> {
    /**
     * @param dao: standard access to corresponding dao for controller
     */
    protected dao: DaoType;

    constructor(dao: DaoType) {
        this.dao = dao;
    }
}

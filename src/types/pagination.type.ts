export class Pagination {
    offset: number;
    limit: number;

    constructor(offset: number = 1, limit: number = 10,) {
        this.offset = offset;
        this.limit = limit;
    }
}

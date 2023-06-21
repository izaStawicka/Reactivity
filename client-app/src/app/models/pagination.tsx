export interface Pagination{
    pageNumber: number,
    totalPages: number,
    itemsNumber: number,
    pageSize: number
}

export class PaginatedResult<T>{
    data: T;
    pagination: Pagination;

    constructor(data:T, pagination: Pagination){
        this.data = data;
        this.pagination = pagination;
    }
}

export class PagingParams{
    pageNumber: number;
    pageSize: number;

    constructor(pageNumber=1, pageSize=2){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
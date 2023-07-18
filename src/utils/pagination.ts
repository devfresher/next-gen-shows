import { CustomLabels } from "mongoose"

export const paginationLabel: CustomLabels = {
	totalDocs: "totalItems",
	docs: "data",
	limit: "perPage",
	page: "currentPage",
	hasNextPage: false,
	hasPrevPage: false,
	nextPage: false,
	prevPage: false,
	totalPages: "pageCount",
	pagingCounter: false,
	meta: "paging",
}

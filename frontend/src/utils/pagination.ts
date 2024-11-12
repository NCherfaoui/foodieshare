export interface PaginationOptions {
    page: number;
    limit: number;
  }
  
  export const paginateResults = <T>(items: T[], options: PaginationOptions) => {
    const { page = 1, limit = 10 } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    return {
      items: items.slice(startIndex, endIndex),
      total: items.length,
      currentPage: page,
      totalPages: Math.ceil(items.length / limit),
      hasNext: endIndex < items.length,
      hasPrev: startIndex > 0
    };
  };
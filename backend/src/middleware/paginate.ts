import { Request, Response, NextFunction } from 'express';

interface PaginationQuery {
  page?: string;
  limit?: string;
}

export const paginationMiddleware = (
  req: Request & { pagination?: { limit: number; offset: number; page: number } },
  res: Response,
  next: NextFunction
) => {
  const { page = '1', limit = '10' } = req.query as PaginationQuery;
  
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  
  // Validation
  if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pagination parameters'
    });
  }

  const offset = (pageNumber - 1) * limitNumber;

  req.pagination = {
    page: pageNumber,
    limit: limitNumber,
    offset
  };

  next();
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const paginateResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  return {
    data,
    pagination: {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  };
};

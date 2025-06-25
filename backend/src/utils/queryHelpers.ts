import { Op, WhereOptions } from 'sequelize';

import { AllowedSearch, QueryParams, QueryParamsId } from '../types/types.js';

export const pictureQueryOptions = (
  query: QueryParams,
): {
  where: WhereOptions;
  order: Array<[string, 'DESC']>;
} => {
  const where: WhereOptions = query.search
    ? { [Op.or]: [{ type: { [Op.eq]: query.search } }] }
    : {};
  let order: Array<[string, 'DESC']>;

  if (query.search === AllowedSearch.Monthly) {
    order = [['monthYear', 'DESC']];
  } else {
    order = [
      ['type', 'DESC'],
      ['uploadedAt', 'DESC'],
    ];
  }

  return { where, order };
};

export const queryByIdOptions = (query?: QueryParamsId): WhereOptions => {
  if (query && query.search && !isNaN(Number(query.search))) {
    return { [Op.or]: [{ pictureId: Number(query.search) }] };
  }
  return {};
};

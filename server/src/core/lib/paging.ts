
/**
 * @desc 分页
 * @desc default page: 1, pageSize: 15
 * */

export const paging = (page = 1, pageSize= 15 ) => ({
  page: Number((page - 1) * pageSize),
  pageSize: Number(pageSize)
});

export default paging;

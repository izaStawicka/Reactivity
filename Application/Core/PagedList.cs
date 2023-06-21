using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items ,int pageNumber, int totalCount, int pageSize)
        {
            PageNumber = pageNumber;
            TotalCount = totalCount;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(totalCount/(double)pageSize);
            AddRange(items);
        }

        public int PageNumber { get; set; }
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize){
            var totalCount = await source.CountAsync();
            var items = await source.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items, pageNumber, totalCount, pageSize);
        }
    }
}
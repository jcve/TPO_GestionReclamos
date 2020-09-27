using GestionReclamos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace GestionReclamos.Application.Common.Interfaces
{
    public interface IGestionReclamosDbContext
    {
        DbSet<T> Set<T>() where T : class;
        public DbSet<Estado> Estado { get; set; }
        Task<int> SaveChangesAsync<T>(CancellationToken token);
        Task<int> SaveChangesAsync<T>();
        int SaveChanges<T>();
    }
}

using GestionReclamos.Application.Common.Interfaces;
using GestionReclamos.Domain.Common;
using GestionReclamos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GestionReclamos.Infrastructure.Persistence
{
    public class GestionReclamosDbContext : DbContext, IGestionReclamosDbContext
    {
        public GestionReclamosDbContext(DbContextOptions options)
            : base(options)
        {

        }


        public DbSet<Estado> Estado { get; set; }
        public DbSet<Log> Log { get; set; }
        public DbSet<ReclamoAuto> ReclamoAuto { get; set; }
        public DbSet<ReclamoPasaje> ReclamoPasaje { get; set; }
        public DbSet<Usuario> Usuario { get; set; }        

        public async Task<int> SaveChangesAsync<T>(CancellationToken cancellationToken = new CancellationToken())
        {            
            int result = await base.SaveChangesAsync(cancellationToken);

            return result;
        }
        public async Task<int> SaveChangesAsync<T>()
        {
            int result = await base.SaveChangesAsync();

            return result;
        }


        public int SaveChanges<T>()
        {
            int result = base.SaveChanges();

            return result;
        }
    }
}

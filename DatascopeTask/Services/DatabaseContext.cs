using DatascopeTask.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatascopeTask.Services
{
    public class DatabaseContext : DbContext
    {
        public DbSet<GameDetails> GamesList { get; set; }
        public DbSet<UserDetails> UsersList { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }
    }
}
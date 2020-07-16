using DatascopeTask.Models;
using DatascopeTask.Services;
using DatascopeTask.Tests.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace DatascopeTask.Tests
{
    public class IntegrationTest
    {
        public readonly HttpClient client;
        public LoginTestService loginService;

        private LoginDetails LoginDetails = new LoginDetails()
        {
            Username = "Testerman",
            Password = "!IloveTesting123"
        };

        public IntegrationTest()
        {
            //Ensure we create a new instance of the API but dont use our real database
            var appFactory = new WebApplicationFactory<Startup>().WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    //Use an in memory database so we don't affect our live one.
                    var serviceProvider = new ServiceCollection()
                       .AddEntityFrameworkInMemoryDatabase()
                       .BuildServiceProvider();

                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<DatabaseContext>));

                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }

                    services.AddDbContext<DatabaseContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDatabase").UseInternalServiceProvider(serviceProvider); ;
                    });

                    var sp = services.BuildServiceProvider();
                });
            });
            client = appFactory.CreateClient();
            loginService = new LoginTestService(client);
        }

        public async Task Authorize()
        {
            var response = await loginService.RegisterUser(LoginDetails);
            var result = await loginService.Login(LoginDetails);

            var token = await result.Content.ReadAsStringAsync();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }
    }
}
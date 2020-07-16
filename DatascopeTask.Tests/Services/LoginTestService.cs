using DatascopeTask.Models;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DatascopeTask.Tests.Services
{
    public class LoginTestService
    {
        private string baseUrl = "/login";
        private HttpClient client;

        public LoginTestService(HttpClient client) => this.client = client;

        public async Task<HttpResponseMessage> RegisterUser(LoginDetails user)
        {
            var json = JsonConvert.SerializeObject(user);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            return await client.PostAsync($"{baseUrl}/register", content);
        }

        public async Task<HttpResponseMessage> Login(LoginDetails user)
        {
            var json = JsonConvert.SerializeObject(user);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            return await client.PostAsync($"{baseUrl}", content);
        }
    }
}
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
    public class GamesListTestService
    {
        private string baseUrl = "gameslist";
        private HttpClient client;

        public GamesListTestService(HttpClient client) => this.client = client;

        public async Task<List<GameDetails>> GetGameList()
        {
            var response = await client.GetAsync(baseUrl);
            Assert.True(response.StatusCode == HttpStatusCode.OK);
            return JsonConvert.DeserializeObject<List<GameDetails>>(await response.Content.ReadAsStringAsync());
        }

        public async Task<HttpResponseMessage> AddOrUpdateGame(GameDetails game)
        {
            var json = JsonConvert.SerializeObject(game);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            return await client.PostAsync(baseUrl, content);
        }

        public async Task<HttpResponseMessage> GetGame(GameDetails game)
        {
            var json = JsonConvert.SerializeObject(game);
            var baseAddress = $"{client.BaseAddress}{baseUrl}/game";

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(baseAddress),
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            return await client.SendAsync(request);
        }

        public async Task<HttpResponseMessage> RemoveGame(GameDetails game)
        {
            var json = JsonConvert.SerializeObject(game);

            var baseAddress = $"{client.BaseAddress}{baseUrl}";
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Delete,
                RequestUri = new Uri(baseAddress),
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            return await client.SendAsync(request);
        }
    }
}
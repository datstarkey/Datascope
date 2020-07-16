using DatascopeTask.Models;
using DatascopeTask.Services;
using DatascopeTask.Tests.Services;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DatascopeTask.Tests
{
    [TestFixture]
    public class GamesListControllerTests : IntegrationTest
    {
        private GamesListTestService gamesListService;

        private GameDetails fakeGame = new GameDetails()
        {
            Name = "Fake Game",
            Description = "Fake description",
            Rating = 6,
            ReleaseDate = DateTime.Now
        };

        public GamesListControllerTests()
        {
            gamesListService = new GamesListTestService(client);
        }

        [OneTimeSetUp]
        public async Task Setup()
        {
            await Authorize();
        }

        [Test, Order(1)]
        public async Task GetEmptyGameList()
        {
            //New database should have no entries
            var list = await gamesListService.GetGameList();
            Assert.IsEmpty(list);
        }

        [Test, Order(2)]
        public async Task AddGame()
        {
            var response = await gamesListService.AddOrUpdateGame(fakeGame);
            Assert.True(response.StatusCode == HttpStatusCode.OK);
        }

        [Test, Order(3)]
        public async Task GetNewGameList()
        {
            //check we have an entry in our list
            var list = await gamesListService.GetGameList();
            Assert.IsNotEmpty(list);
        }

        [Test, Order(4)]
        public async Task GetAddedGame()
        {
            await AddGame();
            var response = await gamesListService.GetGame(fakeGame);
            Assert.True(response.StatusCode == HttpStatusCode.OK);
            var responseGame = JsonConvert.DeserializeObject<GameDetails>(await response.Content.ReadAsStringAsync());

            //Assert all are equal apart from id, as we didnt supply id to find the game.
            Assert.AreEqual(fakeGame.Name, responseGame.Name);
            Assert.AreEqual(fakeGame.Description, responseGame.Description);
            Assert.AreEqual(fakeGame.Rating, responseGame.Rating);
            Assert.AreEqual(fakeGame.ReleaseDate, responseGame.ReleaseDate);

            //check it updated the game correctly and didnt add a duplicate
            var list = await gamesListService.GetGameList();
            Assert.IsTrue(list.Count == 1);
        }

        [Test, Order(5)]
        public async Task RemoveGame()
        {
            //Find the game then remove it from the database
            var getGameResponse = await gamesListService.GetGame(fakeGame);
            var game = JsonConvert.DeserializeObject<GameDetails>(await getGameResponse.Content.ReadAsStringAsync());

            var response = await gamesListService.RemoveGame(game);
            Assert.True(response.StatusCode == HttpStatusCode.OK);
        }

        //check our databse is now empty again.
        [Test, Order(6)]
        public async Task CheckListIsEmptyAgain() => await GetEmptyGameList();
    }
}
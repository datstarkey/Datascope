using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DatascopeTask.Models
{
    public class GameDetails
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }

        private int rating;

        public int Rating
        {
            get { return rating; }
            set
            {
                //Ensure our ratings are between 1-10
                if (value > 0 && value < 11)
                    rating = value;
            }
        }
    }
}
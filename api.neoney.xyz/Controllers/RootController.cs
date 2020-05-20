using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace api.neoney.xyz.Controllers
{
    [ApiController]
    [Route("/")]
    public class RootController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            IDictionary result = new Dictionary<string, dynamic>();
            result.Add("version", Global.Version);
            result.Add("public", true);
            result.Add("private", false);
            return Ok(result);
        }

        [HttpGet("version")]
        public string Version()
        {
            return Global.Version;
        }
    }
}
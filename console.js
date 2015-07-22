var Repl = require("repl");

var repl = Repl.start("project> ");

repl.context.db = require("./models");
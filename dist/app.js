"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express3 = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));

// src/routes/contact.route.ts
var import_express = require("express");

// src/models/contact.model.ts
var import_mongoose = require("mongoose");
var ContactSchema = new import_mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});
var Contact = (0, import_mongoose.model)("Contacts", ContactSchema);
var contact_model_default = Contact;

// src/controllers/contact.controller.ts
var ContactsController = class {
  getAllContacts(req, res) {
    return __async(this, null, function* () {
      try {
        console.log("llega");
        const contacts = yield contact_model_default.find();
        res.status(200).json(contacts);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }
  getTest(req, res) {
    return __async(this, null, function* () {
      try {
        res.status(200).json("hey");
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }
};
var contact_controller_default = ContactsController;

// src/routes/contact.route.ts
var contactsRouter = (0, import_express.Router)();
var controller = new contact_controller_default();
contactsRouter.get("/", controller.getAllContacts);
contactsRouter.get("/test", controller.getTest);
var contact_route_default = contactsRouter;

// src/config/database.ts
var import_mongoose2 = require("mongoose");
var connectDB = () => __async(void 0, null, function* () {
  const mongoURI = process.env.MONGODB_URI;
  if (mongoURI === void 0) {
    console.log("mongo uri undefined");
    return;
  }
  try {
    yield (0, import_mongoose2.connect)(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected.");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});
var database_default = connectDB;

// src/app.ts
var import_dotenv = __toESM(require("dotenv"));
var import_compression = __toESM(require("compression"));

// src/routes/login.route.ts
var import_express2 = require("express");

// src/controllers/login.controller.ts
var LoginController = class {
  login(req, res) {
    return __async(this, null, function* () {
      try {
        console.log(req);
        res.status(200).json();
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }
};
var login_controller_default = LoginController;

// src/routes/login.route.ts
var loginRouter = (0, import_express2.Router)();
var controller2 = new login_controller_default();
loginRouter.post("/", controller2.login);
var login_route_default = loginRouter;

// src/app.ts
import_dotenv.default.config();
var App = class {
  constructor() {
    this.app = (0, import_express3.default)();
    this.app.use((0, import_compression.default)());
    database_default();
    this.config();
    this.routes();
  }
  config() {
    this.app.use(import_body_parser.default.json());
    this.app.use(import_body_parser.default.urlencoded({ extended: false }));
  }
  routes() {
    this.app.use("/", (req, res) => {
      res.status(200).send();
    });
    this.app.use("/api/v1/contacts", contact_route_default);
    this.app.use("/api/v1/login", login_route_default);
  }
  start() {
    const port = process.env.PORT || 3e3;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
};
var app_default = new App().start();

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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

// src/controllers/contact.controller.ts
var contact_controller_exports = {};
__export(contact_controller_exports, {
  default: () => contact_controller_default
});
module.exports = __toCommonJS(contact_controller_exports);

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
        const contacts = yield contact_model_default.find();
        res.status(200).json(contacts);
        const responseSize = res.get("Content-Length");
        console.log("Response size (uncompressed):", responseSize, "bytes");
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }
};
var contact_controller_default = ContactsController;
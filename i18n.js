'use strict';

var I18n = require('./lib/i18n');
var magico = require('magico');

// Overwrite the original interpolate function
// This function interpolates the all variables in the given message.
// Enhanced with magico support
I18n.interpolate = function(message, options) {
  options = this.prepareOptions(options);
  var matches = message.match(this.placeholder)
    , placeholder
    , value
    , name
    , regex;

  if (!matches) {
    return message;
  }

  while (matches.length) {
    placeholder = matches.shift();
    name = placeholder.replace(this.placeholder, '$1');

    // get value by name: support dot path like -> `person.gender`
    value = magico.get(options, name);
    if (this.isSet(value)) {
      value = value.toString().replace(/\$/gm, '_#$#_');
    } else if (name in options) {
      value = this.nullPlaceholder(placeholder, message, options);
    } else {
      value = this.missingPlaceholder(placeholder, message, options);
    }

    regex = new RegExp(placeholder.replace(/\{/gm, '\\{').replace(/\}/gm, '\\}'));
    message = message.replace(regex, value);
  }

  return message.replace(/_#\$#_/g, '$');
};

module.exports = I18n;

const Handlebars = require('handlebars');

Handlebars.registerHelper('attireCond', function(list, item, options) {
  if(list && list.includes(item)) {
    return options.fn(this);
  }
  return options.inverse(this);
});
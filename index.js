var Botkit = require('botkit');

var token = process.env.SLACK_TOKEN;

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
});

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode');
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  });
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode');
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.replyWithTyping(message, "Hey gozaaahs");
});

controller.hears(['hey', 'hoi', 'hallo'], ['direct_message','direct_mention','mention'], function (bot, message) {

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name) {
      bot.replyWithTyping(message, 'Hey '+ user.name);
    } else {
      bot.replyWithTyping(message, 'Hey gozâh');
    }
  });

  bot.replyWithTyping(message, 'Alles lekkâh?');

});

function replyWithRustagh(bot, message){
  var text = "Hey! Rustââââgh!";
  bot.reply(message, {
    attachments: [{
      "fallback": text,
      "text": text,
      "image_url": "http://i.makeagif.com/media/9-14-2015/_NQtSL.gif"
    }]
  });
}

controller.hears(['Je lijkt wel een tomaat', 'Rooie'],['direct_message','direct_mention','mention'],function(bot,message) {
  replyWithRustagh(bot,message);
});

controller.hears(['Je ziet er niet uit'],['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,"Moej een tuintje op je buik ofzo?");
});

var sayings = [
    'Ze kunne beitâh je zaag afpikke dan je pik afzage',
    'Spreke is zilvâh zwège is gâhd',
    'Ff wachten.. komp een telex ut darmstad',
    'Ik zeg heulemaal niks.. Geef mein un bakkie pleur en un kanoh. Dan pratuh we verder.',
    'Volgend weekend lekkur lam, gek!!',
    'Mot je een aai voáh je braedmoluh?!',
    'Ut záh mén un baut hacheluh',
    'Wie ut klènuh niet eert, is de mènuh niet weerd',
    'Wie de poes nie scheert, is dâh beurt nie weert',
    'Je ken een paar luppe voâh je gok krège, leiphànnes'
];

function getRandomSaying(sayings){
  return sayings[Math.floor(Math.random()*sayings.length)];
}

controller.hears(['Zeg iets', 'Wat ben je stil', 'Spreek'],['direct_message','direct_mention','mention'],function(bot,message) {
  var saying = getRandomSaying(sayings);
  bot.reply(message, saying);
});


controller.hears(['Wie wint het EK?', 'Denk jij dat Portugal wint?'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message, 'FC Den Haag 4 evâh!!');
});




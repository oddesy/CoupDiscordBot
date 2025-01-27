const fs = require('fs');

// Import libraries
const Discord = require('discord.js');
const client = new Discord.Client();

// Event listeners when a user connected to the server.
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


// Event listens when a user sends a message in the chat.
client.on('message', msg => {

  // We check the message and if the user wrote "ping," the bot replies with "pong"
  if (msg.content === 'ping') {
    msg.reply('pong');
  }

  // Adds players into the game.
  else if (msg.content === '!play') {
    if (game_started === true) {
      msg.reply('The game has already started. You cannot join.');
    } else {
      const Added = add_players(msg.author)
      if (Added === 0) {
        msg.reply('Added to the game!');
      } else if (Added === 1) {
        msg.reply('You are already in the game.');
      } else if (Added === 2) {
        msg.reply('No more room left in this game. A maximum of six players are allowed.');
      }
    }
  }

  // Displays all of the players in the current game.
  else if (msg.content === '!players') {
    var str = 'These are the players:';
    var x;

    for (x of players) {
      str = str.concat(" ", `${x.id}`)
    }

    msg.channel.send(str);
  }

  // Tells the user about the server
  else if (msg.content === '!server') {
    try {
      msg.channel.send(`Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}\nDate created: ${msg.guild.createdAt}\nServer region: ${msg.guild.region}`);
    }
    catch (err) {
      msg.reply('You are not writing this message in the server, thus I can provide you no information about the server.');
    }
  }

  // Tells the user what commands the bot responds to.
  else if (msg.content === '!commands' || msg.content === '!help') {
    try {
      msg.channel.send('These are all of the commands that the bot responds to: \nping, !play, !players, !server, !startgame, !commands, !help, !losecard1, !losecard2, !discard1, !discard2, !discard3, !discard4, !endgame, !coup, !income, !foreignaid, !ducalincome, !assassinate, !exchangecards, !challenge, !block, !challengetheblock, !nextturn.');
    }
    catch (err) {
      msg.reply('');
    }
  }

  // If the game has been started...
  if (game_started === true) {


    // the person who lost the challenge needs to lose a card before anything else happens
    if (lost_card === false) {

      // Discards the user's card1 because of in-game effects (losing challenge or assassinations)
      if (msg.content === '!losecard1') {
        var id_of_player_losing_card = msg.author;

        var i = 0;
        var index_of_player_losing_card;

        for (x of players) {
          if (id_of_player_losing_card === x.id) {
            index_of_player_losing_card = i;
          }
          i += 1;
        }

        var str = ''
        str = str.concat(`${id_of_player_losing_card}`, ' lost their first card, which was a ', players[index_of_player_losing_card].card1, '.');
        msg.reply(str);
        players[index_of_player_losing_card].card1 = 'null';

        lost_card = true;

        var attachment1;

        if (players[index_of_player_losing_card].card2 === 'duke') {
          attachment1 = 'https://imgur.com/rBQtnrj';
        } else if (players[index_of_player_losing_card].card2 === 'captain') {
          attachment1 = 'https://imgur.com/PqUjn06';
        } else if (players[index_of_player_losing_card].card2 === 'contessa') {
          attachment1 = 'https://imgur.com/s8MtKv8';
        } else if (players[index_of_player_losing_card].card2 === 'assassin') {
          attachment1 = 'https://imgur.com/4gv1FBq';
        } else if (players[index_of_player_losing_card].card2 === 'ambassador') {
          attachment1 = 'https://imgur.com/8Y4sYAU';
        }

        var str = '';
        str = str.concat('You still have your second card: ', attachment1);
        users_turn.send(str);
      }

      // Discards the user's card2 because of in-game effects (losing challenge or assassinations)
      else if (msg.content === '!losecard2') {
        var id_of_player_losing_card = msg.author;

        var i = 0;
        var index_of_player_losing_card;

        for (x of players) {
          if (id_of_player_losing_card === x.id) {
            index_of_player_losing_card = i;
          }
          i += 1;
        }


        var str = ''
        str = str.concat(`${id_of_player_losing_card}`, ' lost their second card, which was a ', players[index_of_player_losing_card].card2, '.');
        msg.reply(str);
        players[index_of_player_losing_card].card2 = 'null';

        lost_card = true;

        var attachment1;

        if (players[index_of_player_losing_card].card1 === 'duke') {
          attachment1 = 'https://imgur.com/rBQtnrj';
        } else if (players[index_of_player_losing_card].card1 === 'captain') {
          attachment1 = 'https://imgur.com/PqUjn06';
        } else if (players[index_of_player_losing_card].card1 === 'contessa') {
          attachment1 = 'https://imgur.com/s8MtKv8';
        } else if (players[index_of_player_losing_card].card1 === 'assassin') {
          attachment1 = 'https://imgur.com/4gv1FBq';
        } else if (players[index_of_player_losing_card].card1 === 'ambassador') {
          attachment1 = 'https://imgur.com/8Y4sYAU';
        }

        var str = '';
        str = str.concat('You still have your first card: ', attachment1);
        users_turn.send(str);
      }
    }

    else if (discarded_cards === false) {

      // Discards the user's card1 because of discarding two cards from the ambassador
      if (msg.content === '!discard1') {
        var id_of_player_losing_card = msg.author;

        var i = 0;
        var index_of_player_losing_card;

        for (x of players) {
          if (id_of_player_losing_card === x.id) {
            index_of_player_losing_card = i;
          }
          i += 1;
        }

        var str = ''

        if (players[index_of_player_losing_card].card1 === 'null') {
          str = str.concat('You can\'t discard this card because you don\'t have a card in this slot.')
          msg.reply(str);
        }

        else {
          deck.push(players[index_of_player_losing_card].card1);

          str = str.concat(`${id_of_player_losing_card}`, ' discarded their first card.');
          msg.reply(str);
          players[index_of_player_losing_card].card1 = 'null';

          number_of_discarded_cards += 1;
        }
      }

      // Discards the user's card2 because of discarding two cards from the ambassador
      else if (msg.content === '!discard2') {
        var id_of_player_losing_card = msg.author;

        var i = 0;
        var index_of_player_losing_card;

        for (x of players) {
          if (id_of_player_losing_card === x.id) {
            index_of_player_losing_card = i;
          }
          i += 1;
        }

        var str = ''

        if (players[index_of_player_losing_card].card2 === 'null') {
          str = str.concat('You can\'t discard this card because you don\'t have a card in this slot.')
          msg.reply(str);
        }

        else {
          deck.push(players[index_of_player_losing_card].card2);

          str = str.concat(`${id_of_player_losing_card}`, ' discarded their second card.');
          msg.reply(str);
          players[index_of_player_losing_card].card2 = 'null';

          number_of_discarded_cards += 1;
        }
      }

      // Discards the user's card3 because of discarding two cards from the ambassador
      else if (msg.content === '!discard3') {
        var id_of_player_losing_card = msg.author;

        var i = 0;
        var index_of_player_losing_card;

        for (x of players) {
          if (id_of_player_losing_card === x.id) {
            index_of_player_losing_card = i;
          }
          i += 1;
        }
        deck.push(card3);

        var str = ''
        str = str.concat(`${id_of_player_losing_card}`, ' discarded their third card.');
        msg.reply(str);
        card3 = 'null';

        number_of_discarded_cards += 1;
      }

      // Discards the user's card2 because of discarding two cards from the ambassador
      else if (msg.content === '!discard4') {
        var id_of_player_losing_card = msg.author;

        var i = 0;
        var index_of_player_losing_card;

        for (x of players) {
          if (id_of_player_losing_card === x.id) {
            index_of_player_losing_card = i;
          }
          i += 1;
        }
        deck.push(card4);

        var str = ''
        str = str.concat(`${id_of_player_losing_card}`, ' discarded their fourth card.');
        msg.reply(str);
        card4 = 'null';

        number_of_discarded_cards += 1;
      }

      // If the user discarded two cards, then reconfigure his or her cards so that they are contained in the player object inside of the players array
      if (number_of_discarded_cards > 1) {

        // Do nothing
        if (players[index_of_player_losing_card].card1 != 'null' && players[index_of_player_losing_card].card2 != 'null') {

        }

        // Reassign cards
        else if (players[index_of_player_losing_card].card1 != 'null' && card3 != 'null') {
          players[index_of_player_losing_card].card2 = card3
        }

        // Reassign cards
        else if (players[index_of_player_losing_card].card1 != 'null' && card4 != 'null') {
          players[index_of_player_losing_card].card2 = card4;
        }

        // Reassign cards
        else if (players[index_of_player_losing_card].card2 != 'null' && card3 != 'null') {
          players[index_of_player_losing_card].card1 = card3;
        }

        // Reassign cards
        else if (players[index_of_player_losing_card].card2 != 'null' && card4 != 'null') {
          players[index_of_player_losing_card].card1 = card4;
        }

        // Reassign cards
        else if (card3 != 'null' && card4 != 'null') {
          players[index_of_player_losing_card].card1 = card3;
          players[index_of_player_losing_card].card2 = card4;
        }

        // Do nothing
        else if (players[index_of_player_losing_card].card1 != 'null') {

        }

        // Do nothing
        else if (players[index_of_player_losing_card].card2 != 'null') {

        }

        // Reassign cards
        else if (card3 != 'null') {
          players[index_of_player_losing_card].card1 = card3
        }

        // Reassign cards
        else if (card4 != 'null') {
          players[index_of_player_losing_card].card1 = card4;
        }

        discarded_cards = true;
        number_of_discarded_cards = 0;

        if (players[index_of_player_losing_card].card1 === 'null') {
          var attachment1;

          if (players[index_of_player_losing_card].card2 === 'duke') {
            attachment1 = 'https://imgur.com/rBQtnrj';
          } else if (players[index_of_player_losing_card].card2 === 'captain') {
            attachment1 = 'https://imgur.com/PqUjn06';
          } else if (players[index_of_player_losing_card].card2 === 'contessa') {
            attachment1 = 'https://imgur.com/s8MtKv8';
          } else if (players[index_of_player_losing_card].card2 === 'assassin') {
            attachment1 = 'https://imgur.com/4gv1FBq';
          } else if (players[index_of_player_losing_card].card2 === 'ambassador') {
            attachment1 = 'https://imgur.com/8Y4sYAU';
          }

          var str = '';
          str = str.concat('This is your new hand: ', attachment1);
          users_turn.send(str);
        }

        else if (players[index_of_player_losing_card].card2 === 'null') {
          var attachment1;

          if (players[index_of_player_losing_card].card1 === 'duke') {
            attachment1 = 'https://imgur.com/rBQtnrj';
          } else if (players[index_of_player_losing_card].card1 === 'captain') {
            attachment1 = 'https://imgur.com/PqUjn06';
          } else if (players[index_of_player_losing_card].card1 === 'contessa') {
            attachment1 = 'https://imgur.com/s8MtKv8';
          } else if (players[index_of_player_losing_card].card1 === 'assassin') {
            attachment1 = 'https://imgur.com/4gv1FBq';
          } else if (players[index_of_player_losing_card].card1 === 'ambassador') {
            attachment1 = 'https://imgur.com/8Y4sYAU';
          }

          var str = '';
          str = str.concat('This is your new hand: ', attachment1);
          users_turn.send(str);
        }

        else {
          var attachment1;
          var attachment2;

          if (players[index_of_player_losing_card].card1 === 'duke') {
            attachment1 = 'https://imgur.com/rBQtnrj';
          } else if (players[index_of_player_losing_card].card1 === 'captain') {
            attachment1 = 'https://imgur.com/PqUjn06';
          } else if (players[index_of_player_losing_card].card1 === 'contessa') {
            attachment1 = 'https://imgur.com/s8MtKv8';
          } else if (players[index_of_player_losing_card].card1 === 'assassin') {
            attachment1 = 'https://imgur.com/4gv1FBq';
          } else if (players[index_of_player_losing_card].card1 === 'ambassador') {
            attachment1 = 'https://imgur.com/8Y4sYAU';
          }

          if (players[index_of_player_losing_card].card2 === 'duke') {
            attachment2 = 'https://imgur.com/rBQtnrj';
          } else if (players[index_of_player_losing_card].card2 === 'captain') {
            attachment2 = 'https://imgur.com/PqUjn06';
          } else if (players[index_of_player_losing_card].card2 === 'contessa') {
            attachment2 = 'https://imgur.com/s8MtKv8';
          } else if (players[index_of_player_losing_card].card2 === 'assassin') {
            attachment2 = 'https://imgur.com/4gv1FBq';
          } else if (players[index_of_player_losing_card].card2 === 'ambassador') {
            attachment2 = 'https://imgur.com/8Y4sYAU';
          }

          var str = '';
          str = str.concat('This is your new hand of cards: ', attachment1, ' ', attachment2);
          users_turn.send(str);
        }
        change_turn();
      }
    }


    // there is no need to have anyone lose a card or discard cards due to the ambassador, continue with the regular program
    else {

      // Sends a status update that shows how many cards each person has and how gold they have.
      if (needs_update === true) {
        var sent_first_message = false;
        for (player of players) {
          try {
            if (sent_first_message === false) {
              msg.channel.send('Game State: \n');
              sent_first_message = true;
            }
            var cards_remaining = 0;

            if (player.card1 != 'null') {
              cards_remaining += 1;
            }

            if (player.card2 != 'null') {
              cards_remaining += 1;
            }
            var str = '';
            str = str.concat(`${player.id}`, ' has ', cards_remaining, ' cards remaining and ', player.gold, ' gold.');
            msg.channel.send(str);
          }

          catch (err) {
            for (i = 0; i < players.length; i++) {
              if (sent_first_message === false) {
                player.id.send('Game State: \n');
                sent_first_message = true;
              }
              var cards_remaining = 0;

              if (players[i].card1 != 'null') {
                cards_remaining += 1;
              }

              if (players[i].card2 != 'null') {
                cards_remaining += 1;
              }
              var str = '';
              str = str.concat(`${players[i].id}`, ' has ', cards_remaining, ' cards remaining and ', players[i].gold, ' gold.');
              player.id.send(str);
            }
          }
        }
        needs_update = false;
      }


      /*
      // Checks how many players are left in the game. If only one player is left ends the game.
      if (players.length < 2) {
        var str = '';
        str = str.concat(`${players[0].id}`, "Has won the game. EZ Clap! You\'re ******* #%^@#@ uninstall now.\nExiting the game now...");
        msg.channel.send(str);

        // Sets the game_started variable to false
        game_started = false;
      }

      */

      // Ends the game.
      if (msg.content === '!endgame') {
        msg.reply('Game over. :(');
        game_started = false;
        players = []
      }


      // If 10 or more coins, must Coup, otherwise they can do all of the normal actions.
      else if (players[index_of_users_turn].gold > 9) {
        var str4 = '';
        str4 = str4.concat(`${users_turn}`, "You must coup someone. Choose carefully...");
        msg.channel.send(str4);

        if (msg.content.slice(0, 5) === '!coup' && msg.author === users_turn) {
          players[index_of_users_turn].gold = players[index_of_users_turn].gold - 7
          const taggedUser = msg.mentions.users.first();
          var i = 0
          for (x of players) {
            if (taggedUser === x.id) {
              players.splice(i, 1);
            }
            i += 1;
          }
          var str3 = '';
          str3 = str3.concat("You couped ", `${taggedUser}`, " and lost 7 gold.");
          msg.reply(str3);
          users_move = 'coup';
          change_turn();
          needs_update = true;
        }

      // If the user whose turn it is doesn't have 10 or more gold, they can do any normal action
      } else {

        // Gives the user one gold and ends their turn.
        if (msg.content === '!income' && msg.author === users_turn) {
          msg.reply('You have taken 1 gold in income.');
          players[index_of_users_turn].gold += 1;
          users_move = 'income';
          change_turn();
          needs_update = true;
        }

        // If the user does not have 10 or more gold and they want to take foreign aid, records that attempted mpve.
        else if (msg.content === '!foreignaid' && msg.author === users_turn) {
          msg.reply('You attempt to take 2 gold in foreign aid.\nDoes anyone want to block this attempt?');

          users_move = 'foreignaid';
        }

        // If the user does not have 10 or more gold and they want to take ducal income, records that attempted mpve.
        else if (msg.content === '!ducalincome' && msg.author === users_turn) {
          msg.reply('You attempt to take 3 gold in ducal income.\nDoes anyone want to challenge this?');

          users_move = 'ducalincome';
        }

        // If the user does not have 10 or more gold and they want to steal, records that attempted mpve.
        else if (msg.content.slice(0, 6) === '!steal' && msg.author === users_turn) {
          const taggedUser = msg.mentions.users.first();
          user_targetted_last_turn = taggedUser;
          var str = '';
          str = str.concat("You attempt to steal from ", `${taggedUser}`)
          msg.reply(str);

          users_move = 'steal';
        }

        // If the user does not have 10 or more gold and they want to assassinate, records that attempted mpve.
        else if (msg.content.slice(0, 12) === '!assassinate' && msg.author === users_turn) {
          if (players[index_of_users_turn].gold > 2) {
            const taggedUser = msg.mentions.users.first();
            user_targetted_last_turn = taggedUser;
            var str2 = '';
            str2 = str2.concat("You attempt to assassinate ", `${taggedUser}`)
            msg.reply(str2);

            users_move = 'assassinate';
          } else {
            msg.reply('You do not have enough money to assassinate anyone.\nChoose another move.');
          }
        }

        // If the user does not have 10 or more gold and they want to exchange cards, records that attempted mpve.
        else if (msg.content === '!exchangecards' && msg.author === users_turn) {
          msg.reply('You attempt to use ambassadorial powers to look at and take two cards from the deck and return two cards to the deck. \nDoes anyone want to challenge this?');

          users_move = 'exchangecards';
        }

        // If the user has between 7 and 9 gold(inclusive), then they coup their selected target.
        else if (msg.content.slice(0, 5) === '!coup' && msg.author === users_turn) {
          if (players[index_of_users_turn].gold > 6) {
            players[index_of_users_turn].gold = players[index_of_users_turn].gold - 7
            const taggedUser = msg.mentions.users.first();
            var i = 0
            for (x of players) {
              if (taggedUser === x.id) {
                players.splice(i, 1);
              }
              i += 1;
            }
            var str3 = str3.concat("You couped ", `${taggedUser}`, " and lost 7 gold.")
            msg.reply(str3);
            users_move = 'coup';
            change_turn();
            needs_update = true;
          } else {
            msg.reply('You do not have enough gold to Coup anyone.\nChoose another move.');
          }
        }
      }


      // Challenges the last move
      if (msg.content === '!challenge' && challenged_yet === false) {
        var str = '';
        userid_of_person_challenging = msg.author;

        var i = 0;

        for (x of players) {
          if (userid_of_person_challenging === x.id) {
            index_of_challenger = i
          }
          i += 1;
        }

        // Deals with someone challenging a duke
        if (users_move === 'ducalincome') {
          if (players[index_of_users_turn].card1 === 'duke' || players[index_of_users_turn].card2 === 'duke') {
            if(players[index_of_challenger].card1 === 'null' || players[index_of_challenger].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_challenger, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenge_successful = false;
          } else {
            if(players[index_of_users_turn].card1 === 'null' || players[index_of_users_turn].card2 === 'null') {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_users_turn, 1);
            } else {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
              change_turn();
            }
            challenge_successful = true;
          }
        }

        // Deals with someone challenging a captain
        else if (users_move === 'steal') {
          if (players[index_of_users_turn].card1 === 'captain' || players[index_of_users_turn].card2 === 'captain') {
            if(players[index_of_challenger].card1 === 'null' || players[index_of_challenger].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_challenger, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenge_successful = false;
          } else {
            if(players[index_of_users_turn].card1 === 'null' || players[index_of_users_turn].card2 === 'null') {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_users_turn, 1);
            } else {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
              change_turn();
            }
            challenge_successful = true;
          }
        }

        // Deals with someone challenging an assassin
        else if (users_move === 'assassinate') {
          if (players[index_of_users_turn].card1 === 'assassin' || players[index_of_users_turn].card2 === 'assassin') {
            if(players[index_of_challenger].card1 === 'null' || players[index_of_challenger].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_challenger, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenge_successful = false;
          } else {
            if(players[index_of_users_turn].card1 === 'null' || players[index_of_users_turn].card2 === 'null') {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_users_turn, 1);
            } else {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
              change_turn();
            }
            challenge_successful = true;
          }
        }

        // Deals with someone challenging an ambassador
        else if (users_move === 'ambassador') {
          if (players[index_of_users_turn].card1 === 'ambassador' || players[index_of_users_turn].card2 === 'ambassador') {
            if(players[index_of_challenger].card1 === 'null' || players[index_of_challenger].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_challenger, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_challenging}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenge_successful = false;
          } else {
            if(players[index_of_users_turn].card1 === 'null' || players[index_of_users_turn].card2 === 'null') {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_users_turn, 1);
            } else {
              str = ''
              str = str.concat(`${users_turn}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
              change_turn();
            }
            challenge_successful = true;
          }
        }
        challenged_yet = true;
        needs_update = true;
      }


      // Blocks the last move
      else if (msg.content === '!block') {
        userid_of_person_blocking = msg.author;
        var str = '';

        var i = 0;

        for (x of players) {
          if (userid_of_person_blocking === x.id) {
            index_of_blocker = i
          }
          i += 1;
        }

        // If the last move was foreign aid...
        if (users_move === 'foreignaid') {
          str = str.concat(`${userid_of_person_blocking}`, " is blocking ", `${players[index_of_users_turn].id}`, 'from taking foreign aid.\nDo you want to challenge this block? If so, type \'!challengetheblock\'.');
          msg.reply(str);
          blocking = true;
        }

        // If the last move was stealing...
        else if (users_move === 'steal') {
          str = str.concat(`${userid_of_person_blocking}`, " is blocking ", `${players[index_of_users_turn].id}`, 'from stealing.\nDo you want to challenge this block? If so, type \'!challengetheblock\'.');
          msg.reply(str);
          blocking = true;
        }

        // If the last move was assassinating...
        else if (users_move === 'assassinate') {
          str = str.concat(`${userid_of_person_blocking}`, " is blocking ", `${players[index_of_users_turn].id}`, 'from assassinating.\nDo you want to challenge this block? If so, type \'!challengetheblock\'.');
          msg.reply(str);
          blocking = true;
        }

        else {
          str = str.concat(`${userid_of_person_blocking}`, 'You cannot block ', users_move, '.')
          msg.reply(str);
        }
      }


      // Deals with someone challenging another persons block
      else if (msg.content === '!challengetheblock' && challenged_the_block_yet === false) {
        userid_of_person_challenging_the_block = msg.author;

        var str = '';
        str = str.concat('You are challenging ', `${userid_of_person_blocking}`, ' who blocked ', `${users_turn}`, ' from taking the following action: ', users_move, '.');
        msg.reply(str);

        var i = 0;

        for (x of players) {
          if (userid_of_person_challenging_the_block === x.id) {
            index_of_user_challenging_the_block = i;
          }
          i += 1;
        }

        // Deals with someone challenging a duke blocking foreign aid
        if (users_move === 'foreignaid') {
          if (players[index_of_blocker].card1 === 'duke' || players[index_of_blocker].card2 === 'duke') {
            if(players[index_of_user_challenging_the_block].card1 === 'null' || players[index_of_user_challenging_the_block].card2 === 'null') {
              str = '';
              str = str.concat(`${userid_of_person_challenging_the_block}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_user_challenging_the_block, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_challenging_the_block}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenging_the_block_successful = false;
          } else {
            if(players[index_of_blocker].card1 === 'null' || players[index_of_blocker].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_blocking}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_blocker, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_blocking}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenging_the_block_successful = true;
          }
        }

        // Deals with someone challenging a captain or ambassador blocking another captain
        else if (users_move === 'steal') {
          if (players[index_of_blocker].card1 === 'captain' || players[index_of_blocker].card2 === 'captain' || players[index_of_blocker].card1 === 'ambassador' || players[index_of_blocker].card2 === 'ambassador') {
            if(players[index_of_user_challenging_the_block].card1 === 'null' || players[index_of_user_challenging_the_block].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_challenging_the_block}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_user_challenging_the_block, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_challenging_the_block}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenging_the_block_successful = false;
          } else {
            if(players[index_of_blocker].card1 === 'null' || players[index_of_blocker].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_blocking}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_blocker, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_blocking}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenging_the_block_successful = true;
          }
        }

        // Deals with someone challenging a contessa blocking an assassin
        else if (users_move === 'assassinate') {
          if (players[index_of_blocker].card1 === 'contessa' || players[index_of_blocker].card2 === 'contessa') {
            if(players[index_of_user_challenging_the_block].card1 === 'null' || players[index_of_user_challenging_the_block].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_challenging_the_block}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_user_challenging_the_block, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_challenging_the_block}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenging_the_block_successful = false;
          } else {
            if(players[index_of_blocker].card1 === 'null' || players[index_of_blocker].card2 === 'null') {
              str = ''
              str = str.concat(`${userid_of_person_blocking}`, 'You lost the challenge and because you only had one card remaining, you lost the game.');
              msg.channel.send(str);
              players.splice(index_of_blocker, 1);
            } else {
              str = ''
              str = str.concat(`${userid_of_person_blocking}`, 'You lost the challenge.\nChoose whether you want to lose card1 or card2.');
              msg.channel.send(str);
              lost_card = false;
            }
            challenging_the_block_successful = true;
          }
        }
        challenged_the_block_yet = true;
        needs_update = true;
      }


      // Resolves all of the challenges and blocks and challenging the blocks...
      if (msg.content === '!nextturn' && msg.author === users_turn) {
        var str = ''

        // If the user's move was foreign aid, it will be resolved...
        if (users_move === 'foreignaid') {

          // If no one blocked the foreign aid, then the player whose turn it is gets two gold.
          if (blocking === false) {
            str = str.concat('No one blocked the foreign aid, so ', `${users_turn}`, ' gets two gold.');
            msg.reply(str);
            foreign_aid();
          }

          // If someone blocked foreign aid and they were challenged and the person who initiated the challenged was successful, then the player whose turn it is gets two gold.
          else if (blocking === true && challenge_successful === true) {
            str = str.concat(`${users_turn}`, ' gets two gold.');
            msg.reply(str);
            foreign_aid();
          }

          // If someone blocked foreign aid and they were challenged and the person who initiated the challenge was not successful, then the player whose turn it is does not get two gold. Instead, they pass the turn.
          else if (blocking === true && challenge_successful === false){
            str = str.concat(`${users_turn}`, ' does not get two gold. Instead, they are blocked and lose their turn.');
            msg.reply(str);
            change_turn();
          }
        }

        // If the user's move was ducal income, it will be resolved...
        else if (users_move === 'ducalincome') {

          // If no one challenged the ducal income, then the player whose turn it is gets three gold.
          if (challenged_yet === false) {
            str = str.concat('No one challenged the ducal income, so ', `${users_turn}`, ' gets three gold.');
            msg.reply(str);
            ducal_income();
          }

          // If someone challenged the ducal income and the person who initiated the challenged was successful, then the player whose turn it is does not get three gold. Instead, they pass the turn.
          else if (challenged_yet === true && challenge_successful === true) {
            str = str.concat(`${users_turn}`, 'Nice bluff OMEGALUL, you lose your turn E^2.');
            msg.reply(str);
            change_turn();
          }

          // If someone challenged the ducal income and the person who initiated the challenged was not successful, then the player whose turn it is gets three gold.
          else if (challenged_yet === true && challenge_successful === false){
            str = str.concat('Actually not bluffing with the duke, that\'s a first! ', `${users_turn}`, ' gets three gold.');
            msg.reply(str);
            ducal_income();
          }
        }

        // If the user's move was steal, it will be resolved...
        else if (users_move === 'steal') {

          // If no one challenged the theft or their challenge was not successful, then it depends on whether or not anyone blocked the theft.
          if (challenged_yet === false || challenge_successful === false) {

            // If no one blocked the theft, then it goes through.
            if (blocking === false) {
              str = str.concat('No one\'s blocking the captain. NICE! Trihard 7.');
              msg.reply(str);
              steal(user_targetted_last_turn);
            }

            // If someone blocked the theft, then it depends on whether or not anyone challenged the blocking of the theft.
            else if (blocking === true) {

              // If no one challenged the block, then the user passes the turn.
              if (challenged_the_block_yet === false) {
                str = str.concat('No one challenged the block, actually afraid OR WHAT? ', `${users_turn}`, ' you lose your turn.');
                msg.reply(str);
                change_turn();
              }

              // If the block was challenged, then it depends on whether or not the challenging the block was successful.
              else if (challenged_the_block_yet === true) {

                // If the challenging the block was successful, then the theft goes through.
                if (challenging_the_block_successful === true) {
                  str = str.concat('Nice block OMEGALUL, get stolen from. AHAHAHHAHAAHHAAHHAHHAH!!!');
                  msg.reply(str);
                  steal(user_targetted_last_turn);
                }

                // If the challenging the block was not successful, then the user passes his/her turn.
                else if (challenging_the_block_successful === false) {
                  str = str.concat('You actually thought you could steal from ', `${user_targetted_last_turn}`, '. Try again, FOOL.');
                  msg.reply(str);
                  change_turn();
                }
              }
            }
          }

          // If someone challenged the theft and their challenge was successful, then the user passes the turn.
          else if (challenge_successful === true) {
            str = str.concat(`${users_turn}`, ' Did you say you had a captain? KEKW. My ass.');
            msg.reply(str);
            change_turn();
          }
        }

        // If the user's move was assassinate, it will be resolved...
        else if (users_move === 'assassinate') {

          // If no one challenged the assassination or their challenge was not successful, then it depends on whether or not anyone blocked the assassination.
          if (challenged_yet === false || challenge_successful === false) {

            // If no one blocked the assassination, then it goes through.
            if (blocking === false) {
              str = str.concat('No one challenged or blocked the assassin. You guys trolling, OR WHAT?');
              msg.reply(str);
              str = '';
              str = str.concat(`${user_targetted_last_turn}`, ' you must lose a card now. Type \'!losecard1\' or \'!losecar2\'.');
              msg.reply(str);
              assassinate(user_targetted_last_turn);
            }

            // If someone blocked the assassination, then it depends on whether or not anyone challenged the blocking of the assassination.
            else if (blocking === true) {

              // If no one challenged the block, then the user passes the turn.
              if (challenged_the_block_yet === false) {
                str = str.concat('No one challenged the contessa... I wonder if ', `${users_turn}`, ' will lose because of that.');
                msg.reply(str);
                players[index_of_users_turn].gold -= 3;
                change_turn();
              }

              // If the block was challenged, then it depends on whether or not the challenging the block was successful.
              else if (challenged_the_block_yet === true) {

                // If the challenging the block was successful, then the assassination goes through.
                if (challenging_the_block_successful === true) {
                  str = str.concat(`${user_targetted_last_turn}`, 'Let\'s be real that ain\'t a contessa old buddy old pal.');
                  msg.reply(str);
                  str = str.concat(`${user_targetted_last_turn}`, ' you must lose a card now. Type \'!losecard1\' or \'!losecar2\'.');
                  msg.reply(str);
                  assassinate(user_targetted_last_turn);
                }

                // If the challenging the block was not successful, then the user passes his/her turn.
                else if (challenging_the_block_successful === false) {
                  str = str.concat(`${users_turn}`, ' Now that\'s what I call a contessa.');
                  msg.reply(str);
                  players[index_of_users_turn].gold -= 3;
                  change_turn();
                }
              }
            }
          }

          // If someone challenged the assassination and their challenge was successful, then the user passes the turn.
          else if (challenge_successful === true) {
            str = str.concat('Finally someone had the balls to challenge that. ', `${users_turn}`, ' obviously didn\'t have an assassin.');
            msg.reply(str);
            players[index_of_users_turn].gold -= 3;
            change_turn();
          }
        }

        // If the user's move was exchangecards, it will be resolved...
        else if (users_move === 'exchangecards') {

          // If no one challenged the exchanging cards, then the player whose turn it is gets to exchange their cards.
          if (challenged_yet === false) {
            str = str.concat('No one challenged the ambassador play, so ', `${users_turn}`, ' draws two new cards and discards two cards.');
            msg.reply(str);
            exchange_cards();
          }

          // If someone challenged the exchanging of cards and the person who initiated the challenged was successful, then the player passes the turn.
          else if (challenged_yet === true && challenge_successful === true) {
            str = str.concat('Nice ambassador buddy. ', `${users_turn}`, ' get baited.');
            msg.reply(str);
            change_turn();
          }

          // If someone challenged the exchanging of cards and the person who initiated the challenged was not successful, then the player exchanges their cards.
          else if (challenged_yet === true && challenge_successful === false){
            str = str.concat('Now you were baited ', `${userid_of_person_challenging}`, '. ', `${users_turn}` ,' draws two new cards and discards two cards.');
            msg.reply(str);
            exchange_cards();
          }
        }

        // Sets all of the important conditional variables back to normal
        challenged_yet = false;
        blocking = false;
        challenged_the_block_yet = false;

        // Gives the players an update on the game state.
        needs_update = true;
      }
    }


  // else if the game has not been started yet
  } else {

    // Starts the game of coup
    if (msg.content === '!startgame') {
      msg.reply('The game has begun!');

      // Creates the deck of cards for the game
      var unshuffled_deck = ['duke', 'assassin', 'captain', 'ambassador', 'contessa', 'duke', 'assassin', 'captain', 'ambassador', 'contessa', 'duke', 'assassin', 'captain', 'ambassador', 'contessa'];

      // Shuffles the deck
      var rand;

      for (i = 0; i < 15; i++) {
        rand = Math.floor(Math.random() * unshuffled_deck.length);
        deck.push(unshuffled_deck[rand]);
        unshuffled_deck.splice(rand, 1);
      }

      // Assigns each player their first card from the deck somewhat randomly
      for (x of players) {
        rand = Math.floor(Math.random() * deck.length);
        x.card1 = deck[rand];
        deck.splice(rand, 1);
      }

      // Assigns each player their second card from the deck somewhat randomly
      for (x of players) {
        rand = Math.floor(Math.random() * deck.length);
        x.card2 = deck[rand];
        deck.splice(rand, 1);
      }

      var str = '';
      var attachment1;
      var attachment2;

      for (player of players) {
        if (player.card1 === 'duke') {
          attachment1 = 'https://imgur.com/rBQtnrj';
        } else if (player.card1 === 'captain') {
          attachment1 = 'https://imgur.com/PqUjn06';
        } else if (player.card1 === 'contessa') {
          attachment1 = 'https://imgur.com/s8MtKv8';
        } else if (player.card1 === 'assassin') {
          attachment1 = 'https://imgur.com/4gv1FBq';
        } else if (player.card1 === 'ambassador') {
          attachment1 = 'https://imgur.com/8Y4sYAU';
        }

        if (player.card2 === 'duke') {
          attachment2 = 'https://imgur.com/rBQtnrj';
        } else if (player.card2 === 'captain') {
          attachment2 = 'https://imgur.com/PqUjn06';
        } else if (player.card2 === 'contessa') {
          attachment2 = 'https://imgur.com/s8MtKv8';
        } else if (player.card2 === 'assassin') {
          attachment2 = 'https://imgur.com/4gv1FBq';
        } else if (player.card2 === 'ambassador') {
          attachment2 = 'https://imgur.com/8Y4sYAU';
        }

        str = str.concat('You drew the following two cards: ', attachment1, ' ', attachment2);
        player.id.send(str);
      }


      // Initializes the variables, users_turn and index_of_users_turn, to tell the bot whose turn it is and where they are in the players array
      users_turn = players[0].id;
      index_of_users_turn = 0;

      // Sets the game_started variable to true
      game_started = true;
    }
  }
});































// Holds the userID of each player
var players = [];

var deck = [];
var game_started = false;

// Holds the userID of the user whose turn it is
var users_turn;
var index_of_users_turn;

var users_move;
var user_targetted_last_turn;

var userid_of_person_blocking = '';
var index_of_blocker;
var blocking = false;

var userid_of_person_challenging;
var index_of_challenger;
var challenge_successful = false;
var challenged_yet = false;

var userid_of_person_challenging_the_block;
var index_of_user_challenging_the_block;
var challenging_the_block_successful = false;
var challenged_the_block_yet = false;

var lost_card = true;

var number_of_discarded_cards = 0;
var discarded_cards = true;
var card3;
var card4;

var needs_update = true;












// Adds players to the players array
function add_players(userID) {

  // If there are less than six players, proceeds to add the user to the players array
  if (players.length < 6) {

    // Checks if the user is already in the players array
    uniqueID = true;
    var x;

    for (x of players) {
      if (userID === x.id) {
        uniqueID = false;
      }
    }

    // If the user isn't in the players array, adds them to the players array.
    if (uniqueID) {
      var player = {id: userID, gold: 2, card1: '', card2: ''};
      players.push(player);
      return 0;
    } else {
      return 1
    }
  } else {
    return 2;
  }
}







// Changes the users_turn variable to be the userID of the next user in the game
function change_turn() {

  // Declares and initializes an iterator variable used in the for loop
  var i = 0

  // Declares a varibale that holds the index of the users_turn variable in the players array
  var index;

  // Loops through the players array to find the userID in the users_turn variable
  for (x of players) {
    if (users_turn === x.id) {
      index = i;
    }
    i += 1;
  }

  // Sets the users_turn variable to the next player in the player array
  if (index === players.length - 1) {
    users_turn = players[0].id;
    index_of_users_turn = 0;
  } else {
    users_turn = players[index + 1].id;
    index_of_users_turn = index + 1;
  }

  // Have the bot tell everyone whose turn it is
}




function foreign_aid() {
  players[index_of_users_turn].gold += 2;
  change_turn();
}

function ducal_income() {
  players[index_of_users_turn].gold += 3;
  change_turn();
}

function steal(userid_stealing_from) {
  var index_of_stealing_from;
  var i = 0;

  for (x of players) {
    if (userid_stealing_from === x.id) {
      index_of_stealing_from = i
    }
    i += 1;
  }

  if (players[index_of_stealing_from].gold > 1) {
    players[index_of_stealing_from].gold -= 2;
    players[index_of_users_turn].gold += 2;
  } else if (players[index_of_stealing_from].gold === 1) {
    players[index_of_stealing_from].gold -= 1;
    players[index_of_users_turn].gold += 1;
  }
  change_turn();
}

function assassinate(userid_being_assassinated) {
  var index_being_assassinated;
  var i = 0;

  for (x of players) {
    if (userid_being_assassinated === x.id) {
      index_being_assassinated = i
    }
    i += 1;
  }

  if (players[index_being_assassinated].card1 === 'null' || players[index_being_assassinated].card2 === 'null') {
    players.splice(index_being_assassinated, 1);
  } else {
    lost_card = false;
  }
  change_turn();
}



function exchange_cards() {

  // Gives the player whose turn it is their first card from the top of the deck
  card3 = deck[0];
  deck.splice(0, 1);

  // Gives the player whose turn it is their second card from the top of the deck
  card4 = deck[0];
  deck.splice(0, 1);

  var attachment1;
  var attachment2;

  if (card3 === 'duke') {
    attachment1 = 'https://imgur.com/rBQtnrj';
  } else if (card3 === 'captain') {
    attachment1 = 'https://imgur.com/PqUjn06';
  } else if (card3 === 'contessa') {
    attachment1 = 'https://imgur.com/s8MtKv8';
  } else if (card3 === 'assassin') {
    attachment1 = 'https://imgur.com/4gv1FBq';
  } else if (card3 === 'ambassador') {
    attachment1 = 'https://imgur.com/8Y4sYAU';
  }

  if (card4 === 'duke') {
    attachment2 = 'https://imgur.com/rBQtnrj';
  } else if (card4 === 'captain') {
    attachment2 = 'https://imgur.com/PqUjn06';
  } else if (card4 === 'contessa') {
    attachment2 = 'https://imgur.com/s8MtKv8';
  } else if (card4 === 'assassin') {
    attachment2 = 'https://imgur.com/4gv1FBq';
  } else if (card4 === 'ambassador') {
    attachment2 = 'https://imgur.com/8Y4sYAU';
  }

  var str = '';
  str = str.concat('Using ambassadorial powers you drew the following two cards from the deck: ', attachment1, ' ', attachment2);
  users_turn.send(str);

  discarded_cards = false;
}





// Gets the token from auth.json to connect to the Discord server
const { prefix, token } = require('./auth.json');

// Initialize bot by connecting to the server using the token
client.login(token);

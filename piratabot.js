(function () {

  /*window.onerror = function() {
  var room = JSON.parse(localStorage.getItem("pirataBotRoom"));
  window.location = 'https://plug.dj' + room.name;
  };*/

  API.getWaitListPosition = function(id){
    if(typeof id === 'undefined' || id === null){
      id = API.getUser().id;
    }
    var wl = API.getWaitList();
    for(var i = 0; i < wl.length; i++){
      if(wl[i].id === id){
        return i;
      }
    }
    return -1;
  };

  var kill = function () {
    clearInterval(pirataBot.room.autodisableInterval);
    clearInterval(pirataBot.room.afkInterval);
    pirataBot.status = false;
  };

  // This socket server is used solely for statistical and troubleshooting purposes.
  // This server may not always be up, but will be used to get live data at any given time.

  var socket = function () {
    function loadSocket() {
      SockJS.prototype.msg = function(a){this.send(JSON.stringify(a))};
      sock = new SockJS('https://socket-bnzi.c9.io/pirataBot');
      sock.onopen = function() {
        console.log('Connected to socket!');
        sendToSocket();
      };
      sock.onclose = function() {
        console.log('Disconnected from socket, reconnecting every minute ..');
        var reconnect = setTimeout(function(){ loadSocket() }, 60 * 1000);
      };
      sock.onmessage = function(broadcast) {
        var rawBroadcast = broadcast.data;
        var broadcastMessage = rawBroadcast.replace(/["\\]+/g, '');
        API.chatLog(broadcastMessage);
        console.log(broadcastMessage);
      };
    }
    if (typeof SockJS == 'undefined') {
      $.getScript('https://cdn.jsdelivr.net/sockjs/0.3.4/sockjs.min.js', loadSocket);
    } else loadSocket();
  }

  var sendToSocket = function () {
    var pirataBotSettings = pirataBot.settings;
    var pirataBotRoom = pirataBot.room;
    var pirataBotInfo = {
      time: Date.now(),
      version: pirataBot.version
    };
    var data = {users:API.getUsers(),userinfo:API.getUser(),room:location.pathname,pirataBotSettings:pirataBotSettings,pirataBotRoom:pirataBotRoom,pirataBotInfo:pirataBotInfo};
    return sock.msg(data);
  };

  var storeToStorage = function () {
    localStorage.setItem("pirataBotsettings", JSON.stringify(pirataBot.settings));
    localStorage.setItem("pirataBotRoom", JSON.stringify(pirataBot.room));
    var pirataBotStorageInfo = {
      time: Date.now(),
      stored: true,
      version: pirataBot.version
    };
    localStorage.setItem("pirataBotStorageInfo", JSON.stringify(pirataBotStorageInfo));

  };

  var subChat = function (chat, obj) {
    if (typeof chat === "undefined") {
      API.chatLog("There is a chat text missing.");
      console.log("There is a chat text missing.");
      return "[Error] No text message found.";

      // TODO: Get missing chat messages from source.
    }
    var lit = '%%';
    for (var prop in obj) {
      chat = chat.replace(lit + prop.toUpperCase() + lit, obj[prop]);
    }
    return chat;
  };

  var loadChat = function (cb) {
    if (!cb) cb = function () {
    };
    $.get("https://rawgit.com/Yemasthui/pirataBot/master/lang/langIndex.json", function (json) {
      var link = pirataBot.chatLink;
      if (json !== null && typeof json !== "undefined") {
        langIndex = json;
        link = langIndex[pirataBot.settings.language.toLowerCase()];
        if (pirataBot.settings.chatLink !== pirataBot.chatLink) {
          link = pirataBot.settings.chatLink;
        }
        else {
          if (typeof link === "undefined") {
            link = pirataBot.chatLink;
          }
        }
        $.get(link, function (json) {
          if (json !== null && typeof json !== "undefined") {
            if (typeof json === "string") json = JSON.parse(json);
            pirataBot.chat = json;
            cb();
          }
        });
      }
      else {
        $.get(pirataBot.chatLink, function (json) {
          if (json !== null && typeof json !== "undefined") {
            if (typeof json === "string") json = JSON.parse(json);
            pirataBot.chat = json;
            cb();
          }
        });
      }
    });
  };

  var retrieveSettings = function () {
    var settings = JSON.parse(localStorage.getItem("pirataBotsettings"));
    if (settings !== null) {
      for (var prop in settings) {
        pirataBot.settings[prop] = settings[prop];
      }
    }
  };

  var retrieveFromStorage = function () {
    var info = localStorage.getItem("pirataBotStorageInfo");
    if (info === null) API.chatLog(pirataBot.chat.nodatafound);
    else {
      var settings = JSON.parse(localStorage.getItem("pirataBotsettings"));
      var room = JSON.parse(localStorage.getItem("pirataBotRoom"));
      var elapsed = Date.now() - JSON.parse(info).time;
      if ((elapsed < 1 * 60 * 60 * 1000)) {
        API.chatLog(pirataBot.chat.retrievingdata);
        for (var prop in settings) {
          pirataBot.settings[prop] = settings[prop];
        }
        pirataBot.room.users = room.users;
        pirataBot.room.afkList = room.afkList;
        pirataBot.room.historyList = room.historyList;
        pirataBot.room.mutedUsers = room.mutedUsers;
        //pirataBot.room.autoskip = room.autoskip;
        pirataBot.room.roomstats = room.roomstats;
        pirataBot.room.messages = room.messages;
        pirataBot.room.queue = room.queue;
        pirataBot.room.newBlacklisted = room.newBlacklisted;
        API.chatLog(pirataBot.chat.datarestored);
      }
    }
    var json_sett = null;
    var roominfo = document.getElementById("room-settings");
    info = roominfo.textContent;
    var ref_bot = "@pirataBot=";
    var ind_ref = info.indexOf(ref_bot);
    if (ind_ref > 0) {
      var link = info.substring(ind_ref + ref_bot.length, info.length);
      var ind_space = null;
      if (link.indexOf(" ") < link.indexOf("\n")) ind_space = link.indexOf(" ");
      else ind_space = link.indexOf("\n");
      link = link.substring(0, ind_space);
      $.get(link, function (json) {
        if (json !== null && typeof json !== "undefined") {
          json_sett = JSON.parse(json);
          for (var prop in json_sett) {
            pirataBot.settings[prop] = json_sett[prop];
          }
        }
      });
    }

  };

  String.prototype.splitBetween = function (a, b) {
    var self = this;
    self = this.split(a);
    for (var i = 0; i < self.length; i++) {
      self[i] = self[i].split(b);
    }
    var arr = [];
    for (var i = 0; i < self.length; i++) {
      if (Array.isArray(self[i])) {
        for (var j = 0; j < self[i].length; j++) {
          arr.push(self[i][j]);
        }
      }
      else arr.push(self[i]);
    }
    return arr;
  };

  String.prototype.startsWith = function(str) {
    return this.substring(0, str.length) === str;
  };

  var linkFixer = function (msg) {
    var parts = msg.splitBetween('<a href="', '<\/a>');
    for (var i = 1; i < parts.length; i = i + 2) {
      var link = parts[i].split('"')[0];
      parts[i] = link;
    }
    var m = '';
    for (var i = 0; i < parts.length; i++) {
      m += parts[i];
    }
    return m;
  };

  var decodeEntities = function (s) {
    var str, temp = document.createElement('p');
    temp.innerHTML = s;
    str = temp.textContent || temp.innerText;
    temp = null;
    return str;
  };

  var botCreator = "Matthew (Yemasthui)";
  var botMaintainer = "Benzi (Quoona)"
  var botCreatorIDs = ["3851534", "4105209"];

  var pirataBot = {
    version: "2.8.9",
    status: false,
    name: "pirataBot",
    loggedInID: null,
    scriptLink: "https://rawgit.com/Yemasthui/pirataBot/master/pirataBot.js",
    cmdLink: "http://git.io/245Ppg",
    chatLink: "https://rawgit.com/Yemasthui/pirataBot/master/lang/en.json",
    chat: null,
    loadChat: loadChat,
    retrieveSettings: retrieveSettings,
    retrieveFromStorage: retrieveFromStorage,
    settings: {
      botName: "piratabot",
      language: "portuguese",
      chatLink: "https://rawgit.com/Yemasthui/pirataBot/master/lang/en.json",
      roomLock: false, // Requires an extension to re-load the script
      startupCap: 1, // 1-200
      startupVolume: 0, // 0-100
      startupEmoji: false, // true or false
      autowoot: true,
      autoskip: false,
      smartSkip: true,
      cmdDeletion: true,
      maximumAfk: 120,
      afkRemoval: true,
      maximumDc: 60,
      bouncerPlus: true,
      blacklistEnabled: true,
      lockdownEnabled: false,
      lockGuard: false,
      maximumLocktime: 10,
      cycleGuard: true,
      maximumCycletime: 10,
      voteSkip: false,
      voteSkipLimit: 10,
      historySkip: false,
      timeGuard: true,
      maximumSongLength: 10,
      autodisable: true,
      commandCooldown: 30,
      usercommandsEnabled: true,
      skipPosition: 3,
      skipReasons: [
        ["theme", "This song does not fit the room theme. "],
        ["op", "This song is on the OP list. "],
        ["history", "This song is in the history. "],
        ["mix", "You played a mix, which is against the rules. "],
        ["sound", "The song you played had bad sound quality or no sound. "],
        ["nsfw", "The song you contained was NSFW (image or sound). "],
        ["unavailable", "The song you played was not available for some users. "]
      ],
      afkpositionCheck: 15,
      afkRankCheck: "ambassador",
      motdEnabled: false,
      motdInterval: 5,
      motd: "Temporary Message of the Day",
      filterChat: true,
      etaRestriction: false,
      welcome: true,
      opLink: null,
      rulesLink: null,
      themeLink: null,
      fbLink: null,
      youtubeLink: null,
      website: null,
      intervalMessages: [],
      messageInterval: 5,
      songstats: true,
      commandLiteral: "!",
      blacklists: {
        NSFW: "https://rawgit.com/Yemasthui/pirataBot-customization/master/blacklists/NSFWlist.json",
        OP: "https://rawgit.com/Yemasthui/pirataBot-customization/master/blacklists/OPlist.json",
        BANNED: "https://rawgit.com/Yemasthui/pirataBot-customization/master/blacklists/BANNEDlist.json"
      }
    },
    room: {
      name: null,
      users: [],
      afkList: [],
      mutedUsers: [],
      bannedUsers: [],
      skippable: true,
      usercommand: true,
      allcommand: true,
      afkInterval: null,
      //autoskip: false,
      autoskipTimer: null,
      autodisableInterval: null,
      autodisableFunc: function () {
        if (pirataBot.status && pirataBot.settings.autodisable) {
          API.sendChat('!afkdisable');
          API.sendChat('!joindisable');
        }
      },
      queueing: 0,
      queueable: true,
      currentDJID: null,
      historyList: [],
      cycleTimer: setTimeout(function () {
      }, 1),
      roomstats: {
        accountName: null,
        totalWoots: 0,
        totalCurates: 0,
        totalMehs: 0,
        launchTime: null,
        songCount: 0,
        chatmessages: 0
      },
      messages: {
        from: [],
        to: [],
        message: []
      },
      queue: {
        id: [],
        position: []
      },
      blacklists: {

      },
      newBlacklisted: [],
      newBlacklistedSongFunction: null,
      roulette: {
        rouletteStatus: false,
        participants: [],
        countdown: null,
        startRoulette: function () {
          pirataBot.room.roulette.rouletteStatus = true;
          pirataBot.room.roulette.countdown = setTimeout(function () {
            pirataBot.room.roulette.endRoulette();
          }, 60 * 1000);
          API.sendChat(pirataBot.chat.isopen);
        },
        endRoulette: function () {
          pirataBot.room.roulette.rouletteStatus = false;
          var ind = Math.floor(Math.random() * pirataBot.room.roulette.participants.length);
          var winner = pirataBot.room.roulette.participants[ind];
          pirataBot.room.roulette.participants = [];
          var pos = Math.floor((Math.random() * API.getWaitList().length) + 1);
          var user = pirataBot.userUtilities.lookupUser(winner);
          var name = user.username;
          API.sendChat(subChat(pirataBot.chat.winnerpicked, {name: name, position: pos}));
          setTimeout(function (winner, pos) {
            pirataBot.userUtilities.moveUser(winner, pos, false);
          }, 1 * 1000, winner, pos);
        }
      }
    },
    User: function (id, name) {
      this.id = id;
      this.username = name;
      this.jointime = Date.now();
      this.lastActivity = Date.now();
      this.votes = {
        woot: 0,
        meh: 0,
        curate: 0
      };
      this.lastEta = null;
      this.afkWarningCount = 0;
      this.afkCountdown = null;
      this.inRoom = true;
      this.isMuted = false;
      this.lastDC = {
        time: null,
        position: null,
        songCount: 0
      };
      this.lastKnownPosition = null;
    },
    userUtilities: {
      getJointime: function (user) {
        return user.jointime;
      },
      getUser: function (user) {
        return API.getUser(user.id);
      },
      updatePosition: function (user, newPos) {
        user.lastKnownPosition = newPos;
      },
      updateDC: function (user) {
        user.lastDC.time = Date.now();
        user.lastDC.position = user.lastKnownPosition;
        user.lastDC.songCount = pirataBot.room.roomstats.songCount;
      },
      setLastActivity: function (user) {
        user.lastActivity = Date.now();
        user.afkWarningCount = 0;
        clearTimeout(user.afkCountdown);
      },
      getLastActivity: function (user) {
        return user.lastActivity;
      },
      getWarningCount: function (user) {
        return user.afkWarningCount;
      },
      setWarningCount: function (user, value) {
        user.afkWarningCount = value;
      },
      lookupUser: function (id) {
        for (var i = 0; i < pirataBot.room.users.length; i++) {
          if (pirataBot.room.users[i].id === id) {
            return pirataBot.room.users[i];
          }
        }
        return false;
      },
      lookupUserName: function (name) {
        for (var i = 0; i < pirataBot.room.users.length; i++) {
          var match = pirataBot.room.users[i].username.trim() == name.trim();
          if (match) {
            return pirataBot.room.users[i];
          }
        }
        return false;
      },
      voteRatio: function (id) {
        var user = pirataBot.userUtilities.lookupUser(id);
        var votes = user.votes;
        if (votes.meh === 0) votes.ratio = 1;
        else votes.ratio = (votes.woot / votes.meh).toFixed(2);
        return votes;

      },
      getPermission: function (obj) { //1 requests
        var u;
        if (typeof obj === "object") u = obj;
        else u = API.getUser(obj);
        for (var i = 0; i < botCreatorIDs.length; i++) {
          if (botCreatorIDs[i].indexOf(u.id) > -1) return 10;
        }
        if (u.gRole < 2) return u.role;
        else {
          switch (u.gRole) {
            case 2:
            return 7;
            case 3:
            return 8;
            case 4:
            return 9;
            case 5:
            return 10;
          }
        }
        return 0;
      },
      moveUser: function (id, pos, priority) {
        var user = pirataBot.userUtilities.lookupUser(id);
        var wlist = API.getWaitList();
        if (API.getWaitListPosition(id) === -1) {
          if (wlist.length < 50) {
            API.moderateAddDJ(id);
            if (pos !== 0) setTimeout(function (id, pos) {
              API.moderateMoveDJ(id, pos);
            }, 1250, id, pos);
          }
          else {
            var alreadyQueued = -1;
            for (var i = 0; i < pirataBot.room.queue.id.length; i++) {
              if (pirataBot.room.queue.id[i] === id) alreadyQueued = i;
            }
            if (alreadyQueued !== -1) {
              pirataBot.room.queue.position[alreadyQueued] = pos;
              return API.sendChat(subChat(pirataBot.chat.alreadyadding, {position: pirataBot.room.queue.position[alreadyQueued]}));
            }
            pirataBot.roomUtilities.booth.lockBooth();
            if (priority) {
              pirataBot.room.queue.id.unshift(id);
              pirataBot.room.queue.position.unshift(pos);
            }
            else {
              pirataBot.room.queue.id.push(id);
              pirataBot.room.queue.position.push(pos);
            }
            var name = user.username;
            return API.sendChat(subChat(pirataBot.chat.adding, {name: name, position: pirataBot.room.queue.position.length}));
          }
        }
        else API.moderateMoveDJ(id, pos);
      },
      dclookup: function (id) {
        var user = pirataBot.userUtilities.lookupUser(id);
        if (typeof user === 'boolean') return pirataBot.chat.usernotfound;
        var name = user.username;
        if (user.lastDC.time === null) return subChat(pirataBot.chat.notdisconnected, {name: name});
        var dc = user.lastDC.time;
        var pos = user.lastDC.position;
        if (pos === null) return pirataBot.chat.noposition;
        var timeDc = Date.now() - dc;
        var validDC = false;
        if (pirataBot.settings.maximumDc * 60 * 1000 > timeDc) {
          validDC = true;
        }
        var time = pirataBot.roomUtilities.msToStr(timeDc);
        if (!validDC) return (subChat(pirataBot.chat.toolongago, {name: pirataBot.userUtilities.getUser(user).username, time: time}));
        var songsPassed = pirataBot.room.roomstats.songCount - user.lastDC.songCount;
        var afksRemoved = 0;
        var afkList = pirataBot.room.afkList;
        for (var i = 0; i < afkList.length; i++) {
          var timeAfk = afkList[i][1];
          var posAfk = afkList[i][2];
          if (dc < timeAfk && posAfk < pos) {
            afksRemoved++;
          }
        }
        var newPosition = user.lastDC.position - songsPassed - afksRemoved;
        if (newPosition <= 0) return subChat(pirataBot.chat.notdisconnected, {name: name});
        var msg = subChat(pirataBot.chat.valid, {name: pirataBot.userUtilities.getUser(user).username, time: time, position: newPosition});
        pirataBot.userUtilities.moveUser(user.id, newPosition, true);
        return msg;
      }
    },

    roomUtilities: {
      rankToNumber: function (rankString) {
        var rankInt = null;
        switch (rankString) {
          case "admin":
          rankInt = 10;
          break;
          case "ambassador":
          rankInt = 7;
          break;
          case "host":
          rankInt = 5;
          break;
          case "cohost":
          rankInt = 4;
          break;
          case "manager":
          rankInt = 3;
          break;
          case "bouncer":
          rankInt = 2;
          break;
          case "residentdj":
          rankInt = 1;
          break;
          case "user":
          rankInt = 0;
          break;
        }
        return rankInt;
      },
      msToStr: function (msTime) {
        var ms, msg, timeAway;
        msg = '';
        timeAway = {
          'days': 0,
          'hours': 0,
          'minutes': 0,
          'seconds': 0
        };
        ms = {
          'day': 24 * 60 * 60 * 1000,
          'hour': 60 * 60 * 1000,
          'minute': 60 * 1000,
          'second': 1000
        };
        if (msTime > ms.day) {
          timeAway.days = Math.floor(msTime / ms.day);
          msTime = msTime % ms.day;
        }
        if (msTime > ms.hour) {
          timeAway.hours = Math.floor(msTime / ms.hour);
          msTime = msTime % ms.hour;
        }
        if (msTime > ms.minute) {
          timeAway.minutes = Math.floor(msTime / ms.minute);
          msTime = msTime % ms.minute;
        }
        if (msTime > ms.second) {
          timeAway.seconds = Math.floor(msTime / ms.second);
        }
        if (timeAway.days !== 0) {
          msg += timeAway.days.toString() + 'd';
        }
        if (timeAway.hours !== 0) {
          msg += timeAway.hours.toString() + 'h';
        }
        if (timeAway.minutes !== 0) {
          msg += timeAway.minutes.toString() + 'm';
        }
        if (timeAway.minutes < 1 && timeAway.hours < 1 && timeAway.days < 1) {
          msg += timeAway.seconds.toString() + 's';
        }
        if (msg !== '') {
          return msg;
        } else {
          return false;
        }
      },
      booth: {
        lockTimer: setTimeout(function () {
        }, 1000),
        locked: false,
        lockBooth: function () {
          API.moderateLockWaitList(!pirataBot.roomUtilities.booth.locked);
          pirataBot.roomUtilities.booth.locked = false;
          if (pirataBot.settings.lockGuard) {
            pirataBot.roomUtilities.booth.lockTimer = setTimeout(function () {
              API.moderateLockWaitList(pirataBot.roomUtilities.booth.locked);
            }, pirataBot.settings.maximumLocktime * 60 * 1000);
          }
        },
        unlockBooth: function () {
          API.moderateLockWaitList(pirataBot.roomUtilities.booth.locked);
          clearTimeout(pirataBot.roomUtilities.booth.lockTimer);
        }
      },
      afkCheck: function () {
        if (!pirataBot.status || !pirataBot.settings.afkRemoval) return void (0);
        var rank = pirataBot.roomUtilities.rankToNumber(pirataBot.settings.afkRankCheck);
        var djlist = API.getWaitList();
        var lastPos = Math.min(djlist.length, pirataBot.settings.afkpositionCheck);
        if (lastPos - 1 > djlist.length) return void (0);
        for (var i = 0; i < lastPos; i++) {
          if (typeof djlist[i] !== 'undefined') {
            var id = djlist[i].id;
            var user = pirataBot.userUtilities.lookupUser(id);
            if (typeof user !== 'boolean') {
              var plugUser = pirataBot.userUtilities.getUser(user);
              if (rank !== null && pirataBot.userUtilities.getPermission(plugUser) <= rank) {
                var name = plugUser.username;
                var lastActive = pirataBot.userUtilities.getLastActivity(user);
                var inactivity = Date.now() - lastActive;
                var time = pirataBot.roomUtilities.msToStr(inactivity);
                var warncount = user.afkWarningCount;
                if (inactivity > pirataBot.settings.maximumAfk * 60 * 1000) {
                  if (warncount === 0) {
                    API.sendChat(subChat(pirataBot.chat.warning1, {name: name, time: time}));
                    user.afkWarningCount = 3;
                    user.afkCountdown = setTimeout(function (userToChange) {
                      userToChange.afkWarningCount = 1;
                    }, 90 * 1000, user);
                  }
                  else if (warncount === 1) {
                    API.sendChat(subChat(pirataBot.chat.warning2, {name: name}));
                    user.afkWarningCount = 3;
                    user.afkCountdown = setTimeout(function (userToChange) {
                      userToChange.afkWarningCount = 2;
                    }, 30 * 1000, user);
                  }
                  else if (warncount === 2) {
                    var pos = API.getWaitListPosition(id);
                    if (pos !== -1) {
                      pos++;
                      pirataBot.room.afkList.push([id, Date.now(), pos]);
                      user.lastDC = {

                        time: null,
                        position: null,
                        songCount: 0
                      };
                      API.moderateRemoveDJ(id);
                      API.sendChat(subChat(pirataBot.chat.afkremove, {name: name, time: time, position: pos, maximumafk: pirataBot.settings.maximumAfk}));
                    }
                    user.afkWarningCount = 0;
                  }
                }
              }
            }
          }
        }
      },
      smartSkip: function (reason) {
        var dj = API.getDJ();
        var id = dj.id;
        var waitlistlength = API.getWaitList().length;
        var locked = false;
        pirataBot.room.queueable = false;

        if (waitlistlength == 50) {
          pirataBot.roomUtilities.booth.lockBooth();
          locked = true;
        }
        setTimeout(function (id) {
          API.moderateForceSkip();
          setTimeout(function () {
            if (typeof reason !== 'undefined') {
              API.sendChat(reason);
            }
          }, 500);
          pirataBot.room.skippable = false;
          setTimeout(function () {
            pirataBot.room.skippable = true
          }, 5 * 1000);
          setTimeout(function (id) {
            pirataBot.userUtilities.moveUser(id, pirataBot.settings.skipPosition, false);
            pirataBot.room.queueable = true;
            if (locked) {
              setTimeout(function () {
                pirataBot.roomUtilities.booth.unlockBooth();
              }, 1000);
            }
          }, 1500, id);
        }, 1000, id);
      },
      changeDJCycle: function () {
        var toggle = $(".cycle-toggle");
        if (toggle.hasClass("disabled")) {
          toggle.click();
          if (pirataBot.settings.cycleGuard) {
            pirataBot.room.cycleTimer = setTimeout(function () {
              if (toggle.hasClass("enabled")) toggle.click();
            }, pirataBot.settings.cycleMaxTime * 60 * 1000);
          }
        }
        else {
          toggle.click();
          clearTimeout(pirataBot.room.cycleTimer);
        }

        // TODO: Use API.moderateDJCycle(true/false)
      },
      intervalMessage: function () {
        var interval;
        if (pirataBot.settings.motdEnabled) interval = pirataBot.settings.motdInterval;
        else interval = pirataBot.settings.messageInterval;
        if ((pirataBot.room.roomstats.songCount % interval) === 0 && pirataBot.status) {
          var msg;
          if (pirataBot.settings.motdEnabled) {
            msg = pirataBot.settings.motd;
          }
          else {
            if (pirataBot.settings.intervalMessages.length === 0) return void (0);
            var messageNumber = pirataBot.room.roomstats.songCount % pirataBot.settings.intervalMessages.length;
            msg = pirataBot.settings.intervalMessages[messageNumber];
          }
          API.sendChat('/me ' + msg);
        }
      },
      updateBlacklists: function () {
        for (var bl in pirataBot.settings.blacklists) {
          pirataBot.room.blacklists[bl] = [];
          if (typeof pirataBot.settings.blacklists[bl] === 'function') {
            pirataBot.room.blacklists[bl] = pirataBot.settings.blacklists();
          }
          else if (typeof pirataBot.settings.blacklists[bl] === 'string') {
            if (pirataBot.settings.blacklists[bl] === '') {
              continue;
            }
            try {
              (function (l) {
                $.get(pirataBot.settings.blacklists[l], function (data) {
                  if (typeof data === 'string') {
                    data = JSON.parse(data);
                  }
                  var list = [];
                  for (var prop in data) {
                    if (typeof data[prop].mid !== 'undefined') {
                      list.push(data[prop].mid);
                    }
                  }
                  pirataBot.room.blacklists[l] = list;
                })
              })(bl);
            }
            catch (e) {
              API.chatLog('Error setting' + bl + 'blacklist.');
              console.log('Error setting' + bl + 'blacklist.');
              console.log(e);
            }
          }
        }
      },
      logNewBlacklistedSongs: function () {
        if (typeof console.table !== 'undefined') {
          console.table(pirataBot.room.newBlacklisted);
        }
        else {
          console.log(pirataBot.room.newBlacklisted);
        }
      },
      exportNewBlacklistedSongs: function () {
        var list = {};
        for (var i = 0; i < pirataBot.room.newBlacklisted.length; i++) {
          var track = pirataBot.room.newBlacklisted[i];
          list[track.list] = [];
          list[track.list].push({
            title: track.title,
            author: track.author,
            mid: track.mid
          });
        }
        return list;
      }
    },
    eventChat: function (chat) {
      chat.message = linkFixer(chat.message);
      chat.message = decodeEntities(chat.message);
      chat.message = chat.message.trim();
      for (var i = 0; i < pirataBot.room.users.length; i++) {
        if (pirataBot.room.users[i].id === chat.uid) {
          pirataBot.userUtilities.setLastActivity(pirataBot.room.users[i]);
          if (pirataBot.room.users[i].username !== chat.un) {
            pirataBot.room.users[i].username = chat.un;
          }
        }
      }
      if (pirataBot.chatUtilities.chatFilter(chat)) return void (0);
      if (!pirataBot.chatUtilities.commandCheck(chat))
      pirataBot.chatUtilities.action(chat);
    },
    eventUserjoin: function (user) {
      var known = false;
      var index = null;
      for (var i = 0; i < pirataBot.room.users.length; i++) {
        if (pirataBot.room.users[i].id === user.id) {
          known = true;
          index = i;
        }
      }
      var greet = true;
      var welcomeback = null;
      if (known) {
        pirataBot.room.users[index].inRoom = true;
        var u = pirataBot.userUtilities.lookupUser(user.id);
        var jt = u.jointime;
        var t = Date.now() - jt;
        if (t < 10 * 1000) greet = false;
        else welcomeback = true;
      }
      else {
        pirataBot.room.users.push(new pirataBot.User(user.id, user.username));
        welcomeback = false;
      }
      for (var j = 0; j < pirataBot.room.users.length; j++) {
        if (pirataBot.userUtilities.getUser(pirataBot.room.users[j]).id === user.id) {
          pirataBot.userUtilities.setLastActivity(pirataBot.room.users[j]);
          pirataBot.room.users[j].jointime = Date.now();
        }

      }
      if (pirataBot.settings.welcome && greet) {
        welcomeback ?
        setTimeout(function (user) {
          API.sendChat(subChat(pirataBot.chat.welcomeback, {name: user.username}));
        }, 1 * 1000, user)
        :
        setTimeout(function (user) {
          API.sendChat(subChat(pirataBot.chat.welcome, {name: user.username}));
        }, 1 * 1000, user);
      }
    },
    eventUserleave: function (user) {
      var lastDJ = API.getHistory()[0].user.id;
      for (var i = 0; i < pirataBot.room.users.length; i++) {
        if (pirataBot.room.users[i].id === user.id) {
          pirataBot.userUtilities.updateDC(pirataBot.room.users[i]);
          pirataBot.room.users[i].inRoom = false;
          if (lastDJ == user.id){
            var user = pirataBot.userUtilities.lookupUser(pirataBot.room.users[i].id);
            pirataBot.userUtilities.updatePosition(user, 0);
            user.lastDC.time = null;
            user.lastDC.position = user.lastKnownPosition;
          }
        }
      }
    },
    eventVoteupdate: function (obj) {
      for (var i = 0; i < pirataBot.room.users.length; i++) {
        if (pirataBot.room.users[i].id === obj.user.id) {
          if (obj.vote === 1) {
            pirataBot.room.users[i].votes.woot++;
          }
          else {
            pirataBot.room.users[i].votes.meh++;
          }
        }
      }

      var mehs = API.getScore().negative;
      var woots = API.getScore().positive;
      var dj = API.getDJ();
      var timeLeft = API.getTimeRemaining();
      var timeElapsed = API.getTimeElapsed();

      if (pirataBot.settings.voteSkip) {
        if ((mehs - woots) >= (pirataBot.settings.voteSkipLimit)) {
          API.sendChat(subChat(pirataBot.chat.voteskipexceededlimit, {name: dj.username, limit: pirataBot.settings.voteSkipLimit}));
          if (pirataBot.settings.smartSkip && timeLeft > timeElapsed){
            pirataBot.roomUtilities.smartSkip();
          }
          else {
            API.moderateForceSkip();
          }
        }
      }

    },
    eventCurateupdate: function (obj) {
      for (var i = 0; i < pirataBot.room.users.length; i++) {
        if (pirataBot.room.users[i].id === obj.user.id) {
          pirataBot.room.users[i].votes.curate++;
        }
      }
    },
    eventDjadvance: function (obj) {
      if (pirataBot.settings.autowoot) {
        $("#woot").click(); // autowoot
      }

      var user = pirataBot.userUtilities.lookupUser(obj.dj.id)
      for(var i = 0; i < pirataBot.room.users.length; i++){
        if(pirataBot.room.users[i].id === user.id){
          pirataBot.room.users[i].lastDC = {
            time: null,
            position: null,
            songCount: 0
          };
        }
      }

      var lastplay = obj.lastPlay;
      if (typeof lastplay === 'undefined') return;
      if (pirataBot.settings.songstats) {
        if (typeof pirataBot.chat.songstatistics === "undefined") {
          API.sendChat("/me " + lastplay.media.author + " - " + lastplay.media.title + ": " + lastplay.score.positive + "W/" + lastplay.score.grabs + "G/" + lastplay.score.negative + "M.")
        }
        else {
          API.sendChat(subChat(pirataBot.chat.songstatistics, {artist: lastplay.media.author, title: lastplay.media.title, woots: lastplay.score.positive, grabs: lastplay.score.grabs, mehs: lastplay.score.negative}))
        }
      }
      pirataBot.room.roomstats.totalWoots += lastplay.score.positive;
      pirataBot.room.roomstats.totalMehs += lastplay.score.negative;
      pirataBot.room.roomstats.totalCurates += lastplay.score.grabs;
      pirataBot.room.roomstats.songCount++;
      pirataBot.roomUtilities.intervalMessage();
      pirataBot.room.currentDJID = obj.dj.id;

      var blacklistSkip = setTimeout(function () {
        var mid = obj.media.format + ':' + obj.media.cid;
        for (var bl in pirataBot.room.blacklists) {
          if (pirataBot.settings.blacklistEnabled) {
            if (pirataBot.room.blacklists[bl].indexOf(mid) > -1) {
              API.sendChat(subChat(pirataBot.chat.isblacklisted, {blacklist: bl}));
              if (pirataBot.settings.smartSkip){
                return pirataBot.roomUtilities.smartSkip();
              }
              else {
                return API.moderateForceSkip();
              }
            }
          }
        }
      }, 2000);
      var newMedia = obj.media;
      var timeLimitSkip = setTimeout(function () {
        if (pirataBot.settings.timeGuard && newMedia.duration > pirataBot.settings.maximumSongLength * 60 && !pirataBot.room.roomevent) {
          var name = obj.dj.username;
          API.sendChat(subChat(pirataBot.chat.timelimit, {name: name, maxlength: pirataBot.settings.maximumSongLength}));
          if (pirataBot.settings.smartSkip){
            return pirataBot.roomUtilities.smartSkip();
          }
          else {
            return API.moderateForceSkip();
          }
        }
      }, 2000);
      var format = obj.media.format;
      var cid = obj.media.cid;
      var naSkip = setTimeout(function () {
        if (format == 1){
          $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + cid + '&key=AIzaSyDcfWu9cGaDnTjPKhg_dy9mUh6H7i4ePZ0&part=snippet&callback=?', function (track){
            if (typeof(track.items[0]) === 'undefined'){
              var name = obj.dj.username;
              API.sendChat(subChat(pirataBot.chat.notavailable, {name: name}));
              if (pirataBot.settings.smartSkip){
                return pirataBot.roomUtilities.smartSkip();
              }
              else {
                return API.moderateForceSkip();
              }
            }
          });
        }
        else {
          var checkSong = SC.get('/tracks/' + cid, function (track){
            if (typeof track.title === 'undefined'){
              var name = obj.dj.username;
              API.sendChat(subChat(pirataBot.chat.notavailable, {name: name}));
              if (pirataBot.settings.smartSkip){
                return pirataBot.roomUtilities.smartSkip();
              }
              else {
                return API.moderateForceSkip();
              }
            }
          });
        }
      }, 2000);
      clearTimeout(historySkip);
      if (pirataBot.settings.historySkip) {
        var alreadyPlayed = false;
        var apihistory = API.getHistory();
        var name = obj.dj.username;
        var historySkip = setTimeout(function () {
          for (var i = 0; i < apihistory.length; i++) {
            if (apihistory[i].media.cid === obj.media.cid) {
              pirataBot.room.historyList[i].push(+new Date());
              alreadyPlayed = true;
              API.sendChat(subChat(pirataBot.chat.songknown, {name: name}));
              if (pirataBot.settings.smartSkip){
                return pirataBot.roomUtilities.smartSkip();
              }
              else {
                return API.moderateForceSkip();
              }
            }
          }
          if (!alreadyPlayed) {
            pirataBot.room.historyList.push([obj.media.cid, +new Date()]);
          }
        }, 2000);
      }
      if (user.ownSong) {
        API.sendChat(subChat(pirataBot.chat.permissionownsong, {name: user.username}));
        user.ownSong = false;
      }
      clearTimeout(pirataBot.room.autoskipTimer);
      if (pirataBot.settings.autoskip) {
        var remaining = obj.media.duration * 1000;
        var startcid = API.getMedia().cid;
        pirataBot.room.autoskipTimer = setTimeout(function() {
          var endcid = API.getMedia().cid;
          if (startcid === endcid) {
            //API.sendChat('Song stuck, skipping...');
            API.moderateForceSkip();
          }
        }, remaining + 5000);
      }
      storeToStorage();
      sendToSocket();
    },
    eventWaitlistupdate: function (users) {
      if (users.length < 50) {
        if (pirataBot.room.queue.id.length > 0 && pirataBot.room.queueable) {
          pirataBot.room.queueable = false;
          setTimeout(function () {
            pirataBot.room.queueable = true;
          }, 500);
          pirataBot.room.queueing++;
          var id, pos;
          setTimeout(
            function () {
              id = pirataBot.room.queue.id.splice(0, 1)[0];
              pos = pirataBot.room.queue.position.splice(0, 1)[0];
              API.moderateAddDJ(id, pos);
              setTimeout(
                function (id, pos) {
                  API.moderateMoveDJ(id, pos);
                  pirataBot.room.queueing--;
                  if (pirataBot.room.queue.id.length === 0) setTimeout(function () {
                    pirataBot.roomUtilities.booth.unlockBooth();
                  }, 1000);
                }, 1000, id, pos);
              }, 1000 + pirataBot.room.queueing * 2500);
            }
          }
          for (var i = 0; i < users.length; i++) {
            var user = pirataBot.userUtilities.lookupUser(users[i].id);
            pirataBot.userUtilities.updatePosition(user, API.getWaitListPosition(users[i].id) + 1);
          }
        },
        chatcleaner: function (chat) {
          if (!pirataBot.settings.filterChat) return false;
          if (pirataBot.userUtilities.getPermission(chat.uid) > 1) return false;
          var msg = chat.message;
          var containsLetters = false;
          for (var i = 0; i < msg.length; i++) {
            ch = msg.charAt(i);
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === ':' || ch === '^') containsLetters = true;
          }
          if (msg === '') {
            return true;
          }
          if (!containsLetters && (msg.length === 1 || msg.length > 3)) return true;
          msg = msg.replace(/[ ,;.:\/=~+%^*\-\\"'&@#]/g, '');
          var capitals = 0;
          var ch;
          for (var i = 0; i < msg.length; i++) {
            ch = msg.charAt(i);
            if (ch >= 'A' && ch <= 'Z') capitals++;
          }
          if (capitals >= 40) {
            API.sendChat(subChat(pirataBot.chat.caps, {name: chat.un}));
            return true;
          }
          msg = msg.toLowerCase();
          if (msg === 'skip') {
            API.sendChat(subChat(pirataBot.chat.askskip, {name: chat.un}));
            return true;
          }
          for (var j = 0; j < pirataBot.chatUtilities.spam.length; j++) {
            if (msg === pirataBot.chatUtilities.spam[j]) {
              API.sendChat(subChat(pirataBot.chat.spam, {name: chat.un}));
              return true;
            }
          }
          return false;
        },
        chatUtilities: {
          chatFilter: function (chat) {
            var msg = chat.message;
            var perm = pirataBot.userUtilities.getPermission(chat.uid);
            var user = pirataBot.userUtilities.lookupUser(chat.uid);
            var isMuted = false;
            for (var i = 0; i < pirataBot.room.mutedUsers.length; i++) {
              if (pirataBot.room.mutedUsers[i] === chat.uid) isMuted = true;
            }
            if (isMuted) {
              API.moderateDeleteChat(chat.cid);
              return true;
            }
            if (pirataBot.settings.lockdownEnabled) {
              if (perm === 0) {
                API.moderateDeleteChat(chat.cid);
                return true;
              }
            }
            if (pirataBot.chatcleaner(chat)) {
              API.moderateDeleteChat(chat.cid);
              return true;
            }
            if (pirataBot.settings.cmdDeletion && msg.startsWith(pirataBot.settings.commandLiteral)) {
              API.moderateDeleteChat(chat.cid);
            }
            /**
            var plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            if (plugRoomLinkPatt.exec(msg)) {
            if (perm === 0) {
            API.sendChat(subChat(pirataBot.chat.roomadvertising, {name: chat.un}));
            API.moderateDeleteChat(chat.cid);
            return true;
            }
            }
            **/
            if (msg.indexOf('http://adf.ly/') > -1) {
              API.moderateDeleteChat(chat.cid);
              API.sendChat(subChat(pirataBot.chat.adfly, {name: chat.un}));
              return true;
            }
            if (msg.indexOf('autojoin was not enabled') > 0 || msg.indexOf('AFK message was not enabled') > 0 || msg.indexOf('!afkdisable') > 0 || msg.indexOf('!joindisable') > 0 || msg.indexOf('autojoin disabled') > 0 || msg.indexOf('AFK message disabled') > 0) {
              API.moderateDeleteChat(chat.cid);
              return true;
            }

            var rlJoinChat = pirataBot.chat.roulettejoin;
            var rlLeaveChat = pirataBot.chat.rouletteleave;

            var joinedroulette = rlJoinChat.split('%%NAME%%');
            if (joinedroulette[1].length > joinedroulette[0].length) joinedroulette = joinedroulette[1];
            else joinedroulette = joinedroulette[0];

            var leftroulette = rlLeaveChat.split('%%NAME%%');
            if (leftroulette[1].length > leftroulette[0].length) leftroulette = leftroulette[1];
            else leftroulette = leftroulette[0];

            if ((msg.indexOf(joinedroulette) > -1 || msg.indexOf(leftroulette) > -1) && chat.uid === pirataBot.loggedInID) {
              setTimeout(function (id) {
                API.moderateDeleteChat(id);
              }, 5 * 1000, chat.cid);
              return true;
            }
            return false;
          },
          commandCheck: function (chat) {
            var cmd;
            if (chat.message.charAt(0) === pirataBot.settings.commandLiteral) {
              var space = chat.message.indexOf(' ');
              if (space === -1) {
                cmd = chat.message;
              }
              else cmd = chat.message.substring(0, space);
            }
            else return false;
            var userPerm = pirataBot.userUtilities.getPermission(chat.uid);
            //console.log("name: " + chat.un + ", perm: " + userPerm);
            if (chat.message !== pirataBot.settings.commandLiteral + 'join' && chat.message !== pirataBot.settings.commandLiteral + "leave") {
              if (userPerm === 0 && !pirataBot.room.usercommand) return void (0);
              if (!pirataBot.room.allcommand) return void (0);
            }
            if (chat.message === pirataBot.settings.commandLiteral + 'eta' && pirataBot.settings.etaRestriction) {
              if (userPerm < 2) {
                var u = pirataBot.userUtilities.lookupUser(chat.uid);
                if (u.lastEta !== null && (Date.now() - u.lastEta) < 1 * 60 * 60 * 1000) {
                  API.moderateDeleteChat(chat.cid);
                  return void (0);
                }
                else u.lastEta = Date.now();
              }
            }
            var executed = false;

            for (var comm in pirataBot.commands) {
              var cmdCall = pirataBot.commands[comm].command;
              if (!Array.isArray(cmdCall)) {
                cmdCall = [cmdCall]
              }
              for (var i = 0; i < cmdCall.length; i++) {
                if (pirataBot.settings.commandLiteral + cmdCall[i] === cmd) {
                  pirataBot.commands[comm].functionality(chat, pirataBot.settings.commandLiteral + cmdCall[i]);
                  executed = true;
                  break;
                }
              }
            }

            if (executed && userPerm === 0) {
              pirataBot.room.usercommand = false;
              setTimeout(function () {
                pirataBot.room.usercommand = true;
              }, pirataBot.settings.commandCooldown * 1000);
            }
            if (executed) {
              /*if (pirataBot.settings.cmdDeletion) {
              API.moderateDeleteChat(chat.cid);
              }*/

              //pirataBot.room.allcommand = false;
              //setTimeout(function () {
              pirataBot.room.allcommand = true;
              //}, 5 * 1000);
            }
            return executed;
          },
          action: function (chat) {
            var user = pirataBot.userUtilities.lookupUser(chat.uid);
            if (chat.type === 'message') {
              for (var j = 0; j < pirataBot.room.users.length; j++) {
                if (pirataBot.userUtilities.getUser(pirataBot.room.users[j]).id === chat.uid) {
                  pirataBot.userUtilities.setLastActivity(pirataBot.room.users[j]);
                }

              }
            }
            pirataBot.room.roomstats.chatmessages++;
          },
          spam: [
            'hueh', 'hu3', 'brbr', 'heu', 'brbr', 'kkkk', 'spoder', 'mafia', 'zuera', 'zueira',
            'zueria', 'aehoo', 'aheu', 'alguem', 'algum', 'brazil', 'zoeira', 'fuckadmins', 'affff', 'vaisefoder', 'huenaarea',
            'hitler', 'ashua', 'ahsu', 'ashau', 'lulz', 'huehue', 'hue', 'huehuehue', 'merda', 'pqp', 'puta', 'mulher', 'pula', 'retarda', 'caralho', 'filha', 'ppk',
            'gringo', 'fuder', 'foder', 'hua', 'ahue', 'modafuka', 'modafoka', 'mudafuka', 'mudafoka', 'ooooooooooooooo', 'foda'
          ],
          curses: [
            'nigger', 'faggot', 'nigga', 'niqqa', 'motherfucker', 'modafocka'
          ]
        },
        connectAPI: function () {
          this.proxy = {
            eventChat: $.proxy(this.eventChat, this),
            eventUserskip: $.proxy(this.eventUserskip, this),
            eventUserjoin: $.proxy(this.eventUserjoin, this),
            eventUserleave: $.proxy(this.eventUserleave, this),
            //eventFriendjoin: $.proxy(this.eventFriendjoin, this),
            eventVoteupdate: $.proxy(this.eventVoteupdate, this),
            eventCurateupdate: $.proxy(this.eventCurateupdate, this),
            eventRoomscoreupdate: $.proxy(this.eventRoomscoreupdate, this),
            eventDjadvance: $.proxy(this.eventDjadvance, this),
            //eventDjupdate: $.proxy(this.eventDjupdate, this),
            eventWaitlistupdate: $.proxy(this.eventWaitlistupdate, this),
            eventVoteskip: $.proxy(this.eventVoteskip, this),
            eventModskip: $.proxy(this.eventModskip, this),
            eventChatcommand: $.proxy(this.eventChatcommand, this),
            eventHistoryupdate: $.proxy(this.eventHistoryupdate, this),

          };
          API.on(API.CHAT, this.proxy.eventChat);
          API.on(API.USER_SKIP, this.proxy.eventUserskip);
          API.on(API.USER_JOIN, this.proxy.eventUserjoin);
          API.on(API.USER_LEAVE, this.proxy.eventUserleave);
          API.on(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
          API.on(API.GRAB_UPDATE, this.proxy.eventCurateupdate);
          API.on(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
          API.on(API.ADVANCE, this.proxy.eventDjadvance);
          API.on(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
          API.on(API.MOD_SKIP, this.proxy.eventModskip);
          API.on(API.CHAT_COMMAND, this.proxy.eventChatcommand);
          API.on(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        disconnectAPI: function () {
          API.off(API.CHAT, this.proxy.eventChat);
          API.off(API.USER_SKIP, this.proxy.eventUserskip);
          API.off(API.USER_JOIN, this.proxy.eventUserjoin);
          API.off(API.USER_LEAVE, this.proxy.eventUserleave);
          API.off(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
          API.off(API.CURATE_UPDATE, this.proxy.eventCurateupdate);
          API.off(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
          API.off(API.ADVANCE, this.proxy.eventDjadvance);
          API.off(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
          API.off(API.MOD_SKIP, this.proxy.eventModskip);
          API.off(API.CHAT_COMMAND, this.proxy.eventChatcommand);
          API.off(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        startup: function () {
          Function.prototype.toString = function () {
            return 'Function.'
          };
          var u = API.getUser();
          if (pirataBot.userUtilities.getPermission(u) < 2) return API.chatLog(pirataBot.chat.greyuser);
          if (pirataBot.userUtilities.getPermission(u) === 2) API.chatLog(pirataBot.chat.bouncer);
          pirataBot.connectAPI();
          API.moderateDeleteChat = function (cid) {
            $.ajax({
              url: "https://plug.dj/_/chat/" + cid,
              type: "DELETE"
            })
          };

          pirataBot.room.name = window.location.pathname;
          var Check;

          console.log(pirataBot.room.name);

          var detect = function(){
            if(pirataBot.room.name != window.location.pathname){
              console.log("Killing bot after room change.");
              storeToStorage();
              pirataBot.disconnectAPI();
              setTimeout(function () {
                kill();
              }, 1000);
              if (pirataBot.settings.roomLock){
                window.location = 'https://plug.dj' + pirataBot.room.name;
              }
              else {
                clearInterval(Check);
              }
            }
          };

          Check = setInterval(function(){ detect() }, 2000);

          retrieveSettings();
          retrieveFromStorage();
          window.bot = pirataBot;
          pirataBot.roomUtilities.updateBlacklists();
          setInterval(pirataBot.roomUtilities.updateBlacklists, 60 * 60 * 1000);
          pirataBot.getNewBlacklistedSongs = pirataBot.roomUtilities.exportNewBlacklistedSongs;
          pirataBot.logNewBlacklistedSongs = pirataBot.roomUtilities.logNewBlacklistedSongs;
          if (pirataBot.room.roomstats.launchTime === null) {
            pirataBot.room.roomstats.launchTime = Date.now();
          }

          for (var j = 0; j < pirataBot.room.users.length; j++) {
            pirataBot.room.users[j].inRoom = false;
          }
          var userlist = API.getUsers();
          for (var i = 0; i < userlist.length; i++) {
            var known = false;
            var ind = null;
            for (var j = 0; j < pirataBot.room.users.length; j++) {
              if (pirataBot.room.users[j].id === userlist[i].id) {
                known = true;
                ind = j;
              }
            }
            if (known) {
              pirataBot.room.users[ind].inRoom = true;
            }
            else {
              pirataBot.room.users.push(new pirataBot.User(userlist[i].id, userlist[i].username));
              ind = pirataBot.room.users.length - 1;
            }
            var wlIndex = API.getWaitListPosition(pirataBot.room.users[ind].id) + 1;
            pirataBot.userUtilities.updatePosition(pirataBot.room.users[ind], wlIndex);
          }
          pirataBot.room.afkInterval = setInterval(function () {
            pirataBot.roomUtilities.afkCheck()
          }, 10 * 1000);
          pirataBot.room.autodisableInterval = setInterval(function () {
            pirataBot.room.autodisableFunc();
          }, 60 * 60 * 1000);
          pirataBot.loggedInID = API.getUser().id;
          pirataBot.status = true;
          API.sendChat('/cap ' + pirataBot.settings.startupCap);
          API.setVolume(pirataBot.settings.startupVolume);
          if (pirataBot.settings.autowoot) {
            $("#woot").click();
          }
          if (pirataBot.settings.startupEmoji) {
            var emojibuttonoff = $(".icon-emoji-off");
            if (emojibuttonoff.length > 0) {
              emojibuttonoff[0].click();
            }
            API.chatLog(':smile: Emojis enabled.');
          }
          else {
            var emojibuttonon = $(".icon-emoji-on");
            if (emojibuttonon.length > 0) {
              emojibuttonon[0].click();
            }
            API.chatLog('Emojis disabled.');
          }
          API.chatLog('Avatars capped at ' + pirataBot.settings.startupCap);
          API.chatLog('Volume set to ' + pirataBot.settings.startupVolume);
          socket();
          loadChat(API.sendChat(subChat(pirataBot.chat.online, {botname: pirataBot.settings.botName, version: pirataBot.version})));
        },
        commands: {
          executable: function (minRank, chat) {
            var id = chat.uid;
            var perm = pirataBot.userUtilities.getPermission(id);
            var minPerm;
            switch (minRank) {
              case 'admin':
              minPerm = 10;
              break;
              case 'ambassador':
              minPerm = 7;
              break;
              case 'host':
              minPerm = 5;
              break;
              case 'cohost':
              minPerm = 4;
              break;
              case 'manager':
              minPerm = 3;
              break;
              case 'mod':
              if (pirataBot.settings.bouncerPlus) {
                minPerm = 2;
              }
              else {
                minPerm = 3;
              }
              break;
              case 'bouncer':
              minPerm = 2;
              break;
              case 'residentdj':
              minPerm = 1;
              break;
              case 'user':
              minPerm = 0;
              break;
              default:
              API.chatLog('error assigning minimum permission');
            }
            return perm >= minPerm;

          },
          /**
          command: {
          command: 'cmd',
          rank: 'user/bouncer/mod/manager',
          type: 'startsWith/exact',
          functionality: function(chat, cmd){
          if(this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
          if( !pirataBot.commands.executable(this.rank, chat) ) return void (0);
          else{

          }
          }
          },
          **/

          activeCommand: {
            command: 'active',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var now = Date.now();
                var chatters = 0;
                var time;

                var launchT = pirataBot.room.roomstats.launchTime;
                var durationOnline = Date.now() - launchT;
                var since = durationOnline / 1000;

                if (msg.length === cmd.length) time = since;
                else {
                  time = msg.substring(cmd.length + 1);
                  if (isNaN(time)) return API.sendChat(subChat(pirataBot.chat.invalidtime, {name: chat.un}));
                }
                for (var i = 0; i < pirataBot.room.users.length; i++) {
                  userTime = pirataBot.userUtilities.getLastActivity(pirataBot.room.users[i]);
                  if ((now - userTime) <= (time * 60 * 1000)) {
                    chatters++;
                  }
                }
                API.sendChat(subChat(pirataBot.chat.activeusersintime, {name: chat.un, amount: chatters, time: time}));
              }
            }
          },

          addCommand: {
            command: 'add',
            rank: 'mod',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substr(cmd.length + 2);
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (msg.length > cmd.length + 2) {
                  if (typeof user !== 'undefined') {
                    if (pirataBot.room.roomevent) {
                      pirataBot.room.eventArtists.push(user.id);
                    }
                    API.moderateAddDJ(user.id);
                  } else API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                }
              }
            }
          },

          afklimitCommand: {
            command: 'afklimit',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nolimitspecified, {name: chat.un}));
                var limit = msg.substring(cmd.length + 1);
                if (!isNaN(limit)) {
                  pirataBot.settings.maximumAfk = parseInt(limit, 10);
                  API.sendChat(subChat(pirataBot.chat.maximumafktimeset, {name: chat.un, time: pirataBot.settings.maximumAfk}));
                }
                else API.sendChat(subChat(pirataBot.chat.invalidlimitspecified, {name: chat.un}));
              }
            }
          },

          afkremovalCommand: {
            command: 'afkremoval',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.afkRemoval) {
                  pirataBot.settings.afkRemoval = !pirataBot.settings.afkRemoval;
                  clearInterval(pirataBot.room.afkInterval);
                  API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.afkremoval}));
                }
                else {
                  pirataBot.settings.afkRemoval = !pirataBot.settings.afkRemoval;
                  pirataBot.room.afkInterval = setInterval(function () {
                    pirataBot.roomUtilities.afkCheck()
                  }, 2 * 1000);
                  API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.afkremoval}));
                }
              }
            }
          },

          afkresetCommand: {
            command: 'afkreset',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring(cmd.length + 2);
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                pirataBot.userUtilities.setLastActivity(user);
                API.sendChat(subChat(pirataBot.chat.afkstatusreset, {name: chat.un, username: name}));
              }
            }
          },

          afktimeCommand: {
            command: 'afktime',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring(cmd.length + 2);
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                var lastActive = pirataBot.userUtilities.getLastActivity(user);
                var inactivity = Date.now() - lastActive;
                var time = pirataBot.roomUtilities.msToStr(inactivity);

                var launchT = pirataBot.room.roomstats.launchTime;
                var durationOnline = Date.now() - launchT;

                if (inactivity == durationOnline){
                  API.sendChat(subChat(pirataBot.chat.inactivelonger, {botname: pirataBot.settings.botName, name: chat.un, username: name}));
                } else {
                  API.sendChat(subChat(pirataBot.chat.inactivefor, {name: chat.un, username: name, time: time}));
                }
              }
            }
          },

          autodisableCommand: {
            command: 'autodisable',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.autodisable) {
                  pirataBot.settings.autodisable = !pirataBot.settings.autodisable;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.autodisable}));
                }
                else {
                  pirataBot.settings.autodisable = !pirataBot.settings.autodisable;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.autodisable}));
                }

              }
            }
          },

          autoskipCommand: {
            command: 'autoskip',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.autoskip) {
                  pirataBot.settings.autoskip = !pirataBot.settings.autoskip;
                  clearTimeout(pirataBot.room.autoskipTimer);
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.autoskip}));
                }
                else {
                  pirataBot.settings.autoskip = !pirataBot.settings.autoskip;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.autoskip}));
                }
              }
            }
          },

          autowootCommand: {
            command: 'autowoot',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat(pirataBot.chat.autowoot);
              }
            }
          },

          baCommand: {
            command: 'ba',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat(pirataBot.chat.brandambassador);
              }
            }
          },

          ballCommand: {
            command: ['8ball', 'ask'],
            rank: 'user',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var crowd = API.getUsers();
                var msg = chat.message;
                var argument = msg.substring(cmd.length + 1).replace(/@/g, '');
                var randomUser = Math.floor(Math.random() * crowd.length);
                var randomBall = Math.floor(Math.random() * pirataBot.chat.balls.length);
                var randomSentence = Math.floor(Math.random() * 1);
                API.sendChat(subChat(pirataBot.chat.ball, {name: chat.un, botname: pirataBot.settings.botName, question: argument, response: pirataBot.chat.balls[randomBall]}));
              }
            }
          },

          banCommand: {
            command: 'ban',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substr(cmd.length + 2);
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                API.moderateBanUser(user.id, 1, API.BAN.DAY);
              }
            }
          },

          blacklistCommand: {
            command: ['blacklist', 'bl'],
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nolistspecified, {name: chat.un}));
                var list = msg.substr(cmd.length + 1);
                if (typeof pirataBot.room.blacklists[list] === 'undefined') return API.sendChat(subChat(pirataBot.chat.invalidlistspecified, {name: chat.un}));
                else {
                  var media = API.getMedia();
                  var timeLeft = API.getTimeRemaining();
                  var timeElapsed = API.getTimeElapsed();
                  var track = {
                    list: list,
                    author: media.author,
                    title: media.title,
                    mid: media.format + ':' + media.cid
                  };
                  pirataBot.room.newBlacklisted.push(track);
                  pirataBot.room.blacklists[list].push(media.format + ':' + media.cid);
                  API.sendChat(subChat(pirataBot.chat.newblacklisted, {name: chat.un, blacklist: list, author: media.author, title: media.title, mid: media.format + ':' + media.cid}));
                  if (pirataBot.settings.smartSkip && timeLeft > timeElapsed){
                    pirataBot.roomUtilities.smartSkip();
                  }
                  else {
                    API.moderateForceSkip();
                  }
                  if (typeof pirataBot.room.newBlacklistedSongFunction === 'function') {
                    pirataBot.room.newBlacklistedSongFunction(track);
                  }
                }
              }
            }
          },

          blinfoCommand: {
            command: 'blinfo',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var author = API.getMedia().author;
                var title = API.getMedia().title;
                var name = chat.un;
                var format = API.getMedia().format;
                var cid = API.getMedia().cid;
                var songid = format + ":" + cid;

                API.sendChat(subChat(pirataBot.chat.blinfo, {name: name, author: author, title: title, songid: songid}));
              }
            }
          },

          bouncerPlusCommand: {
            command: 'bouncer+',
            rank: 'manager',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (pirataBot.settings.bouncerPlus) {
                  pirataBot.settings.bouncerPlus = false;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': 'Bouncer+'}));
                }
                else {
                  if (!pirataBot.settings.bouncerPlus) {
                    var id = chat.uid;
                    var perm = pirataBot.userUtilities.getPermission(id);
                    if (perm > 2) {
                      pirataBot.settings.bouncerPlus = true;
                      return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': 'Bouncer+'}));
                    }
                  }
                  else return API.sendChat(subChat(pirataBot.chat.bouncerplusrank, {name: chat.un}));
                }
              }
            }
          },

          botnameCommand: {
            command: 'botname',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) return API.sendChat(subChat(pirataBot.chat.currentbotname, {botname: pirataBot.settings.botName}));
                var argument = msg.substring(cmd.length + 1);
                if (argument) {
                  pirataBot.settings.botName = argument;
                  API.sendChat(subChat(pirataBot.chat.botnameset, {botName: pirataBot.settings.botName}));
                }
              }
            }
          },

          clearchatCommand: {
            command: 'clearchat',
            rank: 'manager',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var currentchat = $('#chat-messages').children();
                for (var i = 0; i < currentchat.length; i++) {
                  API.moderateDeleteChat(currentchat[i].getAttribute("data-cid"));
                }
                return API.sendChat(subChat(pirataBot.chat.chatcleared, {name: chat.un}));
              }
            }
          },

          commandsCommand: {
            command: 'commands',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat(subChat(pirataBot.chat.commandslink, {botname: pirataBot.settings.botName, link: pirataBot.cmdLink}));
              }
            }
          },

          cmddeletionCommand: {
            command: ['commanddeletion', 'cmddeletion', 'cmddel'],
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.cmdDeletion) {
                  pirataBot.settings.cmdDeletion = !pirataBot.settings.cmdDeletion;
                  API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.cmddeletion}));
                }
                else {
                  pirataBot.settings.cmdDeletion = !pirataBot.settings.cmdDeletion;
                  API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.cmddeletion}));
                }
              }
            }
          },

          cookieCommand: {
            command: 'cookie',
            rank: 'user',
            type: 'startsWith',
            getCookie: function (chat) {
              var c = Math.floor(Math.random() * pirataBot.chat.cookies.length);
              return pirataBot.chat.cookies[c];
            },
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;

                var space = msg.indexOf(' ');
                if (space === -1) {
                  API.sendChat(pirataBot.chat.eatcookie);
                  return false;
                }
                else {
                  var name = msg.substring(space + 2);
                  var user = pirataBot.userUtilities.lookupUserName(name);
                  if (user === false || !user.inRoom) {
                    return API.sendChat(subChat(pirataBot.chat.nousercookie, {name: name}));
                  }
                  else if (user.username === chat.un) {
                    return API.sendChat(subChat(pirataBot.chat.selfcookie, {name: name}));
                  }
                  else {
                    return API.sendChat(subChat(pirataBot.chat.cookie, {nameto: user.username, namefrom: chat.un, cookie: this.getCookie()}));
                  }
                }
              }
            }
          },

          cycleCommand: {
            command: 'cycle',
            rank: 'manager',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                pirataBot.roomUtilities.changeDJCycle();
              }
            }
          },

          cycleguardCommand: {
            command: 'cycleguard',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.cycleGuard) {
                  pirataBot.settings.cycleGuard = !pirataBot.settings.cycleGuard;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.cycleguard}));
                }
                else {
                  pirataBot.settings.cycleGuard = !pirataBot.settings.cycleGuard;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.cycleguard}));
                }

              }
            }
          },

          cycletimerCommand: {
            command: 'cycletimer',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var cycleTime = msg.substring(cmd.length + 1);
                if (!isNaN(cycleTime) && cycleTime !== "") {
                  pirataBot.settings.maximumCycletime = cycleTime;
                  return API.sendChat(subChat(pirataBot.chat.cycleguardtime, {name: chat.un, time: pirataBot.settings.maximumCycletime}));
                }
                else return API.sendChat(subChat(pirataBot.chat.invalidtime, {name: chat.un}));

              }
            }
          },

          dclookupCommand: {
            command: ['dclookup', 'dc'],
            rank: 'user',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var name;
                if (msg.length === cmd.length) name = chat.un;
                else {
                  name = msg.substring(cmd.length + 2);
                  var perm = pirataBot.userUtilities.getPermission(chat.uid);
                  if (perm < 2) return API.sendChat(subChat(pirataBot.chat.dclookuprank, {name: chat.un}));
                }
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                var toChat = pirataBot.userUtilities.dclookup(user.id);
                API.sendChat(toChat);
              }
            }
          },

          /*deletechatCommand: {
          command: 'deletechat',
          rank: 'mod',
          type: 'startsWith',
          functionality: function (chat, cmd) {
          if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
          if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
          else {
          var msg = chat.message;
          if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
          var name = msg.substring(cmd.length + 2);
          var user = pirataBot.userUtilities.lookupUserName(name);
          if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
          var chats = $('.from');
          var message = $('.message');
          var emote = $('.emote');
          var from = $('.un.clickable');
          for (var i = 0; i < chats.length; i++) {
          var n = from[i].textContent;
          if (name.trim() === n.trim()) {

          // var messagecid = $(message)[i].getAttribute('data-cid');
          // var emotecid = $(emote)[i].getAttribute('data-cid');
          // API.moderateDeleteChat(messagecid);

          // try {
          //     API.moderateDeleteChat(messagecid);
          // }
          // finally {
          //     API.moderateDeleteChat(emotecid);
          // }

          if (typeof $(message)[i].getAttribute('data-cid') == "undefined"){
          API.moderateDeleteChat($(emote)[i].getAttribute('data-cid')); // works well with normal messages but not with emotes due to emotes and messages are seperate.
          } else {
          API.moderateDeleteChat($(message)[i].getAttribute('data-cid'));
          }
          }
          }
          API.sendChat(subChat(pirataBot.chat.deletechat, {name: chat.un, username: name}));
          }
          }
          },*/

          emojiCommand: {
            command: 'emoji',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var link = 'http://www.emoji-cheat-sheet.com/';
                API.sendChat(subChat(pirataBot.chat.emojilist, {link: link}));
              }
            }
          },

          englishCommand: {
            command: 'english',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if(chat.message.length === cmd.length) return API.sendChat('/me No user specified.');
                var name = chat.message.substring(cmd.length + 2);
                var user = pirataBot.userUtilities.lookupUserName(name);
                if(typeof user === 'boolean') return API.sendChat('/me Invalid user specified.');
                var lang = pirataBot.userUtilities.getUser(user).language;
                var ch = '/me @' + name + ' ';
                switch(lang){
                  case 'en': break;
                  case 'da': ch += 'Vær venlig at tale engelsk.'; break;
                  case 'de': ch += 'Bitte sprechen Sie Englisch.'; break;
                  case 'es': ch += 'Por favor, hable Inglés.'; break;
                  case 'fr': ch += 'Parlez anglais, s\'il vous plaît.'; break;
                  case 'nl': ch += 'Spreek Engels, alstublieft.'; break;
                  case 'pl': ch += 'Proszę mówić po angielsku.'; break;
                  case 'pt': ch += 'Por favor, fale Inglês.'; break;
                  case 'sk': ch += 'Hovorte po anglicky, prosím.'; break;
                  case 'cs': ch += 'Mluvte prosím anglicky.'; break;
                  case 'sr': ch += 'Молим Вас, говорите енглески.'; break;
                }
                ch += ' English please.';
                API.sendChat(ch);
              }
            }
          },

          etaCommand: {
            command: 'eta',
            rank: 'user',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var perm = pirataBot.userUtilities.getPermission(chat.uid);
                var msg = chat.message;
                var dj = API.getDJ().username;
                var name;
                if (msg.length > cmd.length) {
                  if (perm < 2) return void (0);
                  name = msg.substring(cmd.length + 2);
                } else name = chat.un;
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                var pos = API.getWaitListPosition(user.id);
                var realpos = pos + 1;
                if (name == dj) return API.sendChat(subChat(pirataBot.chat.youaredj, {name: name}));
                if (pos < 0) return API.sendChat(subChat(pirataBot.chat.notinwaitlist, {name: name}));
                if (pos == 0) return API.sendChat(subChat(pirataBot.chat.youarenext, {name: name}));
                var timeRemaining = API.getTimeRemaining();
                var estimateMS = ((pos + 1) * 4 * 60 + timeRemaining) * 1000;
                var estimateString = pirataBot.roomUtilities.msToStr(estimateMS);
                API.sendChat(subChat(pirataBot.chat.eta, {name: name, time: estimateString, position: realpos}));
              }
            }
          },

          fbCommand: {
            command: 'fb',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (typeof pirataBot.settings.fbLink === "string")
                API.sendChat(subChat(pirataBot.chat.facebook, {link: pirataBot.settings.fbLink}));
              }
            }
          },

          filterCommand: {
            command: 'filter',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.filterChat) {
                  pirataBot.settings.filterChat = !pirataBot.settings.filterChat;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.chatfilter}));
                }
                else {
                  pirataBot.settings.filterChat = !pirataBot.settings.filterChat;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.chatfilter}));
                }
              }
            }
          },

          forceskipCommand: {
            command: ['forceskip', 'fs'],
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat(subChat(pirataBot.chat.forceskip, {name: chat.un}));
                API.moderateForceSkip();
                pirataBot.room.skippable = false;
                setTimeout(function () {
                  pirataBot.room.skippable = true
                }, 5 * 1000);

              }
            }
          },

          ghostbusterCommand: {
            command: 'ghostbuster',
            rank: 'user',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var name;
                if (msg.length === cmd.length) name = chat.un;
                else {
                  name = msg.substr(cmd.length + 2);
                }
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (user === false || !user.inRoom) {
                  return API.sendChat(subChat(pirataBot.chat.ghosting, {name1: chat.un, name2: name}));
                }
                else API.sendChat(subChat(pirataBot.chat.notghosting, {name1: chat.un, name2: name}));
              }
            }
          },

          gifCommand: {
            command: ['gif', 'giphy'],
            rank: 'user',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length !== cmd.length) {
                  function get_id(api_key, fixedtag, func)
                  {
                    $.getJSON(
                      "https://tv.giphy.com/v1/gifs/random?",
                      {
                        "format": "json",
                        "api_key": api_key,
                        "rating": rating,
                        "tag": fixedtag
                      },
                      function(response)
                      {
                        func(response.data.id);
                      }
                    )
                  }
                  var api_key = "dc6zaTOxFJmzC"; // public beta key
                  var rating = "pg-13"; // PG 13 gifs
                  var tag = msg.substr(cmd.length + 1);
                  var fixedtag = tag.replace(/ /g,"+");
                  var commatag = tag.replace(/ /g,", ");
                  get_id(api_key, tag, function(id) {
                    if (typeof id !== 'undefined') {
                      API.sendChat(subChat(pirataBot.chat.validgiftags, {name: chat.un, id: id, tags: commatag}));
                    } else {
                      API.sendChat(subChat(pirataBot.chat.invalidgiftags, {name: chat.un, tags: commatag}));
                    }
                  });
                }
                else {
                  function get_random_id(api_key, func)
                  {
                    $.getJSON(
                      "https://tv.giphy.com/v1/gifs/random?",
                      {
                        "format": "json",
                        "api_key": api_key,
                        "rating": rating
                      },
                      function(response)
                      {
                        func(response.data.id);
                      }
                    )
                  }
                  var api_key = "dc6zaTOxFJmzC"; // public beta key
                  var rating = "pg-13"; // PG 13 gifs
                  get_random_id(api_key, function(id) {
                    if (typeof id !== 'undefined') {
                      API.sendChat(subChat(pirataBot.chat.validgifrandom, {name: chat.un, id: id}));
                    } else {
                      API.sendChat(subChat(pirataBot.chat.invalidgifrandom, {name: chat.un}));
                    }
                  });
                }
              }
            }
          },

          helpCommand: {
            command: 'help',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var link = "(Updated link coming soon)";
                API.sendChat(subChat(pirataBot.chat.starterhelp, {link: link}));
              }
            }
          },

          historyskipCommand: {
            command: 'historyskip',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.historySkip) {
                  pirataBot.settings.historySkip = !pirataBot.settings.historySkip;
                  API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.historyskip}));
                }
                else {
                  pirataBot.settings.historySkip = !pirataBot.settings.historySkip;
                  API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.historyskip}));
                }
              }
            }
          },

          joinCommand: {
            command: 'join',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.room.roulette.rouletteStatus && pirataBot.room.roulette.participants.indexOf(chat.uid) < 0) {
                  pirataBot.room.roulette.participants.push(chat.uid);
                  API.sendChat(subChat(pirataBot.chat.roulettejoin, {name: chat.un}));
                }
              }
            }
          },

          jointimeCommand: {
            command: 'jointime',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring(cmd.length + 2);
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                var join = pirataBot.userUtilities.getJointime(user);
                var time = Date.now() - join;
                var timeString = pirataBot.roomUtilities.msToStr(time);
                API.sendChat(subChat(pirataBot.chat.jointime, {namefrom: chat.un, username: name, time: timeString}));
              }
            }
          },

          kickCommand: {
            command: 'kick',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var lastSpace = msg.lastIndexOf(' ');
                var time;
                var name;
                if (lastSpace === msg.indexOf(' ')) {
                  time = 0.25;
                  name = msg.substring(cmd.length + 2);
                }
                else {
                  time = msg.substring(lastSpace + 1);
                  name = msg.substring(cmd.length + 2, lastSpace);
                }

                var user = pirataBot.userUtilities.lookupUserName(name);
                var from = chat.un;
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));

                var permFrom = pirataBot.userUtilities.getPermission(chat.uid);
                var permTokick = pirataBot.userUtilities.getPermission(user.id);

                if (permFrom <= permTokick)
                return API.sendChat(subChat(pirataBot.chat.kickrank, {name: chat.un}));

                if (!isNaN(time)) {
                  API.sendChat(subChat(pirataBot.chat.kick, {name: chat.un, username: name, time: time}));
                  if (time > 24 * 60 * 60) API.moderateBanUser(user.id, 1, API.BAN.PERMA);
                  else API.moderateBanUser(user.id, 1, API.BAN.DAY);
                  setTimeout(function (id, name) {
                    API.moderateUnbanUser(id);
                    console.log('Unbanned @' + name + '. (' + id + ')');
                  }, time * 60 * 1000, user.id, name);
                }
                else API.sendChat(subChat(pirataBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          killCommand: {
            command: 'kill',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                storeToStorage();
                sendToSocket();
                API.sendChat(pirataBot.chat.kill);
                pirataBot.disconnectAPI();
                setTimeout(function () {
                  kill();
                }, 1000);
              }
            }
          },

          languageCommand: {
            command: 'language',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) return API.sendChat(subChat(pirataBot.chat.currentlang, {language: pirataBot.settings.language}));
                var argument = msg.substring(cmd.length + 1);

                $.get("https://rawgit.com/Yemasthui/pirataBot/master/lang/langIndex.json", function (json) {
                  var langIndex = json;
                  var link = langIndex[argument.toLowerCase()];
                  if (typeof link === "undefined") {
                    API.sendChat(subChat(pirataBot.chat.langerror, {link: "http://git.io/vJ9nI"}));
                  }
                  else {
                    pirataBot.settings.language = argument;
                    loadChat();
                    API.sendChat(subChat(pirataBot.chat.langset, {language: pirataBot.settings.language}));
                  }
                });
              }
            }
          },

          leaveCommand: {
            command: 'leave',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var ind = pirataBot.room.roulette.participants.indexOf(chat.uid);
                if (ind > -1) {
                  pirataBot.room.roulette.participants.splice(ind, 1);
                  API.sendChat(subChat(pirataBot.chat.rouletteleave, {name: chat.un}));
                }
              }
            }
          },

          linkCommand: {
            command: 'link',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var media = API.getMedia();
                var from = chat.un;
                var user = pirataBot.userUtilities.lookupUser(chat.uid);
                var perm = pirataBot.userUtilities.getPermission(chat.uid);
                var dj = API.getDJ().id;
                var isDj = false;
                if (dj === chat.uid) isDj = true;
                if (perm >= 1 || isDj) {
                  if (media.format === 1) {
                    var linkToSong = "http://youtu.be/" + media.cid;
                    API.sendChat(subChat(pirataBot.chat.songlink, {name: from, link: linkToSong}));
                  }
                  if (media.format === 2) {
                    SC.get('/tracks/' + media.cid, function (sound) {
                      API.sendChat(subChat(pirataBot.chat.songlink, {name: from, link: sound.permalink_url}));
                    });
                  }
                }
              }
            }
          },

          lockCommand: {
            command: 'lock',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                pirataBot.roomUtilities.booth.lockBooth();
              }
            }
          },

          lockdownCommand: {
            command: 'lockdown',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var temp = pirataBot.settings.lockdownEnabled;
                pirataBot.settings.lockdownEnabled = !temp;
                if (pirataBot.settings.lockdownEnabled) {
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.lockdown}));
                }
                else return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.lockdown}));
              }
            }
          },

          lockguardCommand: {
            command: 'lockguard',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.lockGuard) {
                  pirataBot.settings.lockGuard = !pirataBot.settings.lockGuard;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.lockguard}));
                }
                else {
                  pirataBot.settings.lockGuard = !pirataBot.settings.lockGuard;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.lockguard}));
                }
              }
            }
          },

          lockskipCommand: {
            command: 'lockskip',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.room.skippable) {
                  var dj = API.getDJ();
                  var id = dj.id;
                  var name = dj.username;
                  var msgSend = '@' + name + ': ';
                  pirataBot.room.queueable = false;

                  if (chat.message.length === cmd.length) {
                    API.sendChat(subChat(pirataBot.chat.usedlockskip, {name: chat.un}));
                    pirataBot.roomUtilities.booth.lockBooth();
                    setTimeout(function (id) {
                      API.moderateForceSkip();
                      pirataBot.room.skippable = false;
                      setTimeout(function () {
                        pirataBot.room.skippable = true
                      }, 5 * 1000);
                      setTimeout(function (id) {
                        pirataBot.userUtilities.moveUser(id, pirataBot.settings.lockskipPosition, false);
                        pirataBot.room.queueable = true;
                        setTimeout(function () {
                          pirataBot.roomUtilities.booth.unlockBooth();
                        }, 1000);
                      }, 1500, id);
                    }, 1000, id);
                    return void (0);
                  }
                  var validReason = false;
                  var msg = chat.message;
                  var reason = msg.substring(cmd.length + 1);
                  for (var i = 0; i < pirataBot.settings.lockskipReasons.length; i++) {
                    var r = pirataBot.settings.lockskipReasons[i][0];
                    if (reason.indexOf(r) !== -1) {
                      validReason = true;
                      msgSend += pirataBot.settings.lockskipReasons[i][1];
                    }
                  }
                  if (validReason) {
                    API.sendChat(subChat(pirataBot.chat.usedlockskip, {name: chat.un}));
                    pirataBot.roomUtilities.booth.lockBooth();
                    setTimeout(function (id) {
                      API.moderateForceSkip();
                      pirataBot.room.skippable = false;
                      API.sendChat(msgSend);
                      setTimeout(function () {
                        pirataBot.room.skippable = true
                      }, 5 * 1000);
                      setTimeout(function (id) {
                        pirataBot.userUtilities.moveUser(id, pirataBot.settings.lockskipPosition, false);
                        pirataBot.room.queueable = true;
                        setTimeout(function () {
                          pirataBot.roomUtilities.booth.unlockBooth();
                        }, 1000);
                      }, 1500, id);
                    }, 1000, id);
                    return void (0);
                  }
                }
              }
            }
          },

          locktimerCommand: {
            command: 'locktimer',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var lockTime = msg.substring(cmd.length + 1);
                if (!isNaN(lockTime) && lockTime !== "") {
                  pirataBot.settings.maximumLocktime = lockTime;
                  return API.sendChat(subChat(pirataBot.chat.lockguardtime, {name: chat.un, time: pirataBot.settings.maximumLocktime}));
                }
                else return API.sendChat(subChat(pirataBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          logoutCommand: {
            command: 'logout',
            rank: 'manager',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat(subChat(pirataBot.chat.logout, {name: chat.un, botname: pirataBot.settings.botName}));
                setTimeout(function () {
                  $(".logout").mousedown()
                }, 1000);
              }
            }
          },

          maxlengthCommand: {
            command: 'maxlength',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var maxTime = msg.substring(cmd.length + 1);
                if (!isNaN(maxTime)) {
                  pirataBot.settings.maximumSongLength = maxTime;
                  return API.sendChat(subChat(pirataBot.chat.maxlengthtime, {name: chat.un, time: pirataBot.settings.maximumSongLength}));
                }
                else return API.sendChat(subChat(pirataBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          motdCommand: {
            command: 'motd',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) return API.sendChat('/me MotD: ' + pirataBot.settings.motd);
                var argument = msg.substring(cmd.length + 1);
                if (!pirataBot.settings.motdEnabled) pirataBot.settings.motdEnabled = !pirataBot.settings.motdEnabled;
                if (isNaN(argument)) {
                  pirataBot.settings.motd = argument;
                  API.sendChat(subChat(pirataBot.chat.motdset, {msg: pirataBot.settings.motd}));
                }
                else {
                  pirataBot.settings.motdInterval = argument;
                  API.sendChat(subChat(pirataBot.chat.motdintervalset, {interval: pirataBot.settings.motdInterval}));
                }
              }
            }
          },

          moveCommand: {
            command: 'move',
            rank: 'mod',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var firstSpace = msg.indexOf(' ');
                var lastSpace = msg.lastIndexOf(' ');
                var pos;
                var name;
                if (isNaN(parseInt(msg.substring(lastSpace + 1)))) {
                  pos = 1;
                  name = msg.substring(cmd.length + 2);
                }
                else {
                  pos = parseInt(msg.substring(lastSpace + 1));
                  name = msg.substring(cmd.length + 2, lastSpace);
                }
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                if (user.id === pirataBot.loggedInID) return API.sendChat(subChat(pirataBot.chat.addbotwaitlist, {name: chat.un}));
                if (!isNaN(pos)) {
                  API.sendChat(subChat(pirataBot.chat.move, {name: chat.un}));
                  pirataBot.userUtilities.moveUser(user.id, pos, false);
                } else return API.sendChat(subChat(pirataBot.chat.invalidpositionspecified, {name: chat.un}));
              }
            }
          },

          muteCommand: {
            command: 'mute',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var lastSpace = msg.lastIndexOf(' ');
                var time = null;
                var name;
                if (lastSpace === msg.indexOf(' ')) {
                  name = msg.substring(cmd.length + 2);
                  time = 45;
                }
                else {
                  time = msg.substring(lastSpace + 1);
                  if (isNaN(time) || time == "" || time == null || typeof time == "undefined") {
                    return API.sendChat(subChat(pirataBot.chat.invalidtime, {name: chat.un}));
                  }
                  name = msg.substring(cmd.length + 2, lastSpace);
                }
                var from = chat.un;
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                var permFrom = pirataBot.userUtilities.getPermission(chat.uid);
                var permUser = pirataBot.userUtilities.getPermission(user.id);
                if (permFrom > permUser) {
                  /*
                  pirataBot.room.mutedUsers.push(user.id);
                  if (time === null) API.sendChat(subChat(pirataBot.chat.mutednotime, {name: chat.un, username: name}));
                  else {
                  API.sendChat(subChat(pirataBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                  setTimeout(function (id) {
                  var muted = pirataBot.room.mutedUsers;
                  var wasMuted = false;
                  var indexMuted = -1;
                  for (var i = 0; i < muted.length; i++) {
                  if (muted[i] === id) {
                  indexMuted = i;
                  wasMuted = true;
                  }
                  }
                  if (indexMuted > -1) {
                  pirataBot.room.mutedUsers.splice(indexMuted);
                  var u = pirataBot.userUtilities.lookupUser(id);
                  var name = u.username;
                  API.sendChat(subChat(pirataBot.chat.unmuted, {name: chat.un, username: name}));
                  }
                  }, time * 60 * 1000, user.id);
                  }
                  */
                  if (time > 45) {
                    API.sendChat(subChat(pirataBot.chat.mutedmaxtime, {name: chat.un, time: "45"}));
                    API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                  }
                  else if (time === 45) {
                    API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                    API.sendChat(subChat(pirataBot.chat.mutedtime, {name: chat.un, username: name, time: time}));

                  }
                  else if (time > 30) {
                    API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                    API.sendChat(subChat(pirataBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                    setTimeout(function (id) {
                      API.moderateUnmuteUser(id);
                    }, time * 60 * 1000, user.id);
                  }
                  else if (time > 15) {
                    API.moderateMuteUser(user.id, 1, API.MUTE.MEDIUM);
                    API.sendChat(subChat(pirataBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                    setTimeout(function (id) {
                      API.moderateUnmuteUser(id);
                    }, time * 60 * 1000, user.id);
                  }
                  else {
                    API.moderateMuteUser(user.id, 1, API.MUTE.SHORT);
                    API.sendChat(subChat(pirataBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                    setTimeout(function (id) {
                      API.moderateUnmuteUser(id);
                    }, time * 60 * 1000, user.id);
                  }
                }
                else API.sendChat(subChat(pirataBot.chat.muterank, {name: chat.un}));
              }
            }
          },

          opCommand: {
            command: 'op',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (typeof pirataBot.settings.opLink === "string")
                return API.sendChat(subChat(pirataBot.chat.oplist, {link: pirataBot.settings.opLink}));
              }
            }
          },

          pingCommand: {
            command: 'ping',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat(pirataBot.chat.pong)
              }
            }
          },

          refreshCommand: {
            command: 'refresh',
            rank: 'manager',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                sendToSocket();
                storeToStorage();
                pirataBot.disconnectAPI();
                setTimeout(function () {
                  window.location.reload(false);
                }, 1000);

              }
            }
          },

          reloadCommand: {
            command: 'reload',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat(pirataBot.chat.reload);
                sendToSocket();
                storeToStorage();
                pirataBot.disconnectAPI();
                kill();
                setTimeout(function () {
                  $.getScript(pirataBot.scriptLink);
                }, 2000);
              }
            }
          },

          removeCommand: {
            command: 'remove',
            rank: 'mod',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length > cmd.length + 2) {
                  var name = msg.substr(cmd.length + 2);
                  var user = pirataBot.userUtilities.lookupUserName(name);
                  if (typeof user !== 'boolean') {
                    user.lastDC = {
                      time: null,
                      position: null,
                      songCount: 0
                    };
                    if (API.getDJ().id === user.id) {
                      API.moderateForceSkip();
                      setTimeout(function () {
                        API.moderateRemoveDJ(user.id);
                      }, 1 * 1000, user);
                    }
                    else API.moderateRemoveDJ(user.id);
                  } else API.sendChat(subChat(pirataBot.chat.removenotinwl, {name: chat.un, username: name}));
                } else API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
              }
            }
          },

          restrictetaCommand: {
            command: 'restricteta',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.etaRestriction) {
                  pirataBot.settings.etaRestriction = !pirataBot.settings.etaRestriction;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.etarestriction}));
                }
                else {
                  pirataBot.settings.etaRestriction = !pirataBot.settings.etaRestriction;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.etarestriction}));
                }
              }
            }
          },

          rouletteCommand: {
            command: 'roulette',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (!pirataBot.room.roulette.rouletteStatus) {
                  pirataBot.room.roulette.startRoulette();
                }
              }
            }
          },

          rulesCommand: {
            command: 'rules',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (typeof pirataBot.settings.rulesLink === "string")
                return API.sendChat(subChat(pirataBot.chat.roomrules, {link: pirataBot.settings.rulesLink}));
              }
            }
          },

          sessionstatsCommand: {
            command: 'sessionstats',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var from = chat.un;
                var woots = pirataBot.room.roomstats.totalWoots;
                var mehs = pirataBot.room.roomstats.totalMehs;
                var grabs = pirataBot.room.roomstats.totalCurates;
                API.sendChat(subChat(pirataBot.chat.sessionstats, {name: from, woots: woots, mehs: mehs, grabs: grabs}));
              }
            }
          },

          skipCommand: {
            command: ['skip', 'smartskip'],
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.room.skippable) {

                  var timeLeft = API.getTimeRemaining();
                  var timeElapsed = API.getTimeElapsed();
                  var dj = API.getDJ();
                  var name = dj.username;
                  var msgSend = '@' + name + ', ';

                  if (chat.message.length === cmd.length) {
                    API.sendChat(subChat(pirataBot.chat.usedskip, {name: chat.un}));
                    if (pirataBot.settings.smartSkip && timeLeft > timeElapsed){
                      pirataBot.roomUtilities.smartSkip();
                    }
                    else {
                      API.moderateForceSkip();
                    }
                  }
                  var validReason = false;
                  var msg = chat.message;
                  var reason = msg.substring(cmd.length + 1);
                  for (var i = 0; i < pirataBot.settings.skipReasons.length; i++) {
                    var r = pirataBot.settings.skipReasons[i][0];
                    if (reason.indexOf(r) !== -1) {
                      validReason = true;
                      msgSend += pirataBot.settings.skipReasons[i][1];
                    }
                  }
                  if (validReason) {
                    API.sendChat(subChat(pirataBot.chat.usedskip, {name: chat.un}));
                    if (pirataBot.settings.smartSkip && timeLeft > timeElapsed){
                      pirataBot.roomUtilities.smartSkip(msgSend);
                    }
                    else {
                      API.moderateForceSkip();
                      setTimeout(function () {
                        API.sendChat(msgSend);
                      }, 500);
                    }
                  }
                }
              }
            }
          },

          skipposCommand: {
            command: 'skippos',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var pos = msg.substring(cmd.length + 1);
                if (!isNaN(pos)) {
                  pirataBot.settings.skipPosition = pos;
                  return API.sendChat(subChat(pirataBot.chat.skippos, {name: chat.un, position: pirataBot.settings.skipPosition}));
                }
                else return API.sendChat(subChat(pirataBot.chat.invalidpositionspecified, {name: chat.un}));
              }
            }
          },

          songstatsCommand: {
            command: 'songstats',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.songstats) {
                  pirataBot.settings.songstats = !pirataBot.settings.songstats;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.songstats}));
                }
                else {
                  pirataBot.settings.songstats = !pirataBot.settings.songstats;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.songstats}));
                }
              }
            }
          },

          sourceCommand: {
            command: 'source',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                API.sendChat('/me This bot was created by ' + botCreator + ', but is now maintained by ' + botMaintainer + ".");
              }
            }
          },

          statusCommand: {
            command: 'status',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var from = chat.un;
                var msg = '[@' + from + '] ';

                msg += pirataBot.chat.afkremoval + ': ';
                if (pirataBot.settings.afkRemoval) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';
                msg += pirataBot.chat.afksremoved + ": " + pirataBot.room.afkList.length + '. ';
                msg += pirataBot.chat.afklimit + ': ' + pirataBot.settings.maximumAfk + '. ';

                msg += 'Bouncer+: ';
                if (pirataBot.settings.bouncerPlus) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.blacklist + ': ';
                if (pirataBot.settings.blacklistEnabled) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.lockguard + ': ';
                if (pirataBot.settings.lockGuard) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.cycleguard + ': ';
                if (pirataBot.settings.cycleGuard) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.timeguard + ': ';
                if (pirataBot.settings.timeGuard) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.chatfilter + ': ';
                if (pirataBot.settings.filterChat) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.historyskip + ': ';
                if (pirataBot.settings.historySkip) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.voteskip + ': ';
                if (pirataBot.settings.voteSkip) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.cmddeletion + ': ';
                if (pirataBot.settings.cmdDeletion) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                msg += pirataBot.chat.autoskip + ': ';
                if (pirataBot.settings.autoskip) msg += 'ON';
                else msg += 'OFF';
                msg += '. ';

                // TODO: Display more toggleable bot settings.

                var launchT = pirataBot.room.roomstats.launchTime;
                var durationOnline = Date.now() - launchT;
                var since = pirataBot.roomUtilities.msToStr(durationOnline);
                msg += subChat(pirataBot.chat.activefor, {time: since});

                /*
                // least efficient way to go about this, but it works :)
                if (msg.length > 256){
                firstpart = msg.substr(0, 256);
                secondpart = msg.substr(256);
                API.sendChat(firstpart);
                setTimeout(function () {
                API.sendChat(secondpart);
                }, 300);
                }
                else {
                API.sendChat(msg);
                }
                */

                // This is a more efficient solution
                if (msg.length > 241){
                  var split = msg.match(/.{1,241}/g);
                  for (var i = 0; i < split.length; i++) {
                    var func = function(index) {
                      setTimeout(function() {
                        API.sendChat("/me " + split[index]);
                      }, 500 * index);
                    }
                    func(i);
                  }
                }
                else {
                  return API.sendChat(msg);
                }
              }
            }
          },

          swapCommand: {
            command: 'swap',
            rank: 'mod',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var firstSpace = msg.indexOf(' ');
                var lastSpace = msg.lastIndexOf(' ');
                var name1 = msg.substring(cmd.length + 2, lastSpace);
                var name2 = msg.substring(lastSpace + 2);
                var user1 = pirataBot.userUtilities.lookupUserName(name1);
                var user2 = pirataBot.userUtilities.lookupUserName(name2);
                if (typeof user1 === 'boolean' || typeof user2 === 'boolean') return API.sendChat(subChat(pirataBot.chat.swapinvalid, {name: chat.un}));
                if (user1.id === pirataBot.loggedInID || user2.id === pirataBot.loggedInID) return API.sendChat(subChat(pirataBot.chat.addbottowaitlist, {name: chat.un}));
                var p1 = API.getWaitListPosition(user1.id) + 1;
                var p2 = API.getWaitListPosition(user2.id) + 1;
                if (p1 < 0 || p2 < 0) return API.sendChat(subChat(pirataBot.chat.swapwlonly, {name: chat.un}));
                API.sendChat(subChat(pirataBot.chat.swapping, {'name1': name1, 'name2': name2}));
                if (p1 < p2) {
                  pirataBot.userUtilities.moveUser(user2.id, p1, false);
                  setTimeout(function (user1, p2) {
                    pirataBot.userUtilities.moveUser(user1.id, p2, false);
                  }, 2000, user1, p2);
                }
                else {
                  pirataBot.userUtilities.moveUser(user1.id, p2, false);
                  setTimeout(function (user2, p1) {
                    pirataBot.userUtilities.moveUser(user2.id, p1, false);
                  }, 2000, user2, p1);
                }
              }
            }
          },

          themeCommand: {
            command: 'theme',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (typeof pirataBot.settings.themeLink === "string")
                API.sendChat(subChat(pirataBot.chat.genres, {link: pirataBot.settings.themeLink}));
              }
            }
          },

          timeguardCommand: {
            command: 'timeguard',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.timeGuard) {
                  pirataBot.settings.timeGuard = !pirataBot.settings.timeGuard;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.timeguard}));
                }
                else {
                  pirataBot.settings.timeGuard = !pirataBot.settings.timeGuard;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.timeguard}));
                }

              }
            }
          },

          toggleblCommand: {
            command: 'togglebl',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var temp = pirataBot.settings.blacklistEnabled;
                pirataBot.settings.blacklistEnabled = !temp;
                if (pirataBot.settings.blacklistEnabled) {
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.blacklist}));
                }
                else return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.blacklist}));
              }
            }
          },

          togglemotdCommand: {
            command: 'togglemotd',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.motdEnabled) {
                  pirataBot.settings.motdEnabled = !pirataBot.settings.motdEnabled;
                  API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.motd}));
                }
                else {
                  pirataBot.settings.motdEnabled = !pirataBot.settings.motdEnabled;
                  API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.motd}));
                }
              }
            }
          },

          togglevoteskipCommand: {
            command: 'togglevoteskip',
            rank: 'bouncer',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.voteSkip) {
                  pirataBot.settings.voteSkip = !pirataBot.settings.voteSkip;
                  API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.voteskip}));
                }
                else {
                  pirataBot.settings.voteSkip = !pirataBot.settings.voteSkip;
                  API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.voteskip}));
                }
              }
            }
          },

          unbanCommand: {
            command: 'unban',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                $(".icon-population").click();
                $(".icon-ban").click();
                setTimeout(function (chat) {
                  var msg = chat.message;
                  if (msg.length === cmd.length) return API.sendChat();
                  var name = msg.substring(cmd.length + 2);
                  var bannedUsers = API.getBannedUsers();
                  var found = false;
                  var bannedUser = null;
                  for (var i = 0; i < bannedUsers.length; i++) {
                    var user = bannedUsers[i];
                    if (user.username === name) {
                      bannedUser = user;
                      found = true;
                    }
                  }
                  if (!found) {
                    $(".icon-chat").click();
                    return API.sendChat(subChat(pirataBot.chat.notbanned, {name: chat.un}));
                  }
                  API.moderateUnbanUser(bannedUser.id);
                  console.log("Unbanned " + name);
                  setTimeout(function () {
                    $(".icon-chat").click();
                  }, 1000);
                }, 1000, chat);
              }
            }
          },

          unlockCommand: {
            command: 'unlock',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                pirataBot.roomUtilities.booth.unlockBooth();
              }
            }
          },

          unmuteCommand: {
            command: 'unmute',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var permFrom = pirataBot.userUtilities.getPermission(chat.uid);
                /**
                if (msg.indexOf('@') === -1 && msg.indexOf('all') !== -1) {
                if (permFrom > 2) {
                pirataBot.room.mutedUsers = [];
                return API.sendChat(subChat(pirataBot.chat.unmutedeveryone, {name: chat.un}));
                }
                else return API.sendChat(subChat(pirataBot.chat.unmuteeveryonerank, {name: chat.un}));
                }
                **/
                var from = chat.un;
                var name = msg.substr(cmd.length + 2);

                var user = pirataBot.userUtilities.lookupUserName(name);

                if (typeof user === 'boolean') return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));

                var permUser = pirataBot.userUtilities.getPermission(user.id);
                if (permFrom > permUser) {
                  /*
                  var muted = pirataBot.room.mutedUsers;
                  var wasMuted = false;
                  var indexMuted = -1;
                  for (var i = 0; i < muted.length; i++) {
                  if (muted[i] === user.id) {
                  indexMuted = i;
                  wasMuted = true;
                  }

                  }
                  if (!wasMuted) return API.sendChat(subChat(pirataBot.chat.notmuted, {name: chat.un}));
                  pirataBot.room.mutedUsers.splice(indexMuted);
                  API.sendChat(subChat(pirataBot.chat.unmuted, {name: chat.un, username: name}));
                  */
                  try {
                    API.moderateUnmuteUser(user.id);
                    API.sendChat(subChat(pirataBot.chat.unmuted, {name: chat.un, username: name}));
                  }
                  catch (e) {
                    API.sendChat(subChat(pirataBot.chat.notmuted, {name: chat.un}));
                  }
                }
                else API.sendChat(subChat(pirataBot.chat.unmuterank, {name: chat.un}));
              }
            }
          },

          usercmdcdCommand: {
            command: 'usercmdcd',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var cd = msg.substring(cmd.length + 1);
                if (!isNaN(cd)) {
                  pirataBot.settings.commandCooldown = cd;
                  return API.sendChat(subChat(pirataBot.chat.commandscd, {name: chat.un, time: pirataBot.settings.commandCooldown}));
                }
                else return API.sendChat(subChat(pirataBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          usercommandsCommand: {
            command: 'usercommands',
            rank: 'manager',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.usercommandsEnabled) {
                  API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.usercommands}));
                  pirataBot.settings.usercommandsEnabled = !pirataBot.settings.usercommandsEnabled;
                }
                else {
                  API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.usercommands}));
                  pirataBot.settings.usercommandsEnabled = !pirataBot.settings.usercommandsEnabled;
                }
              }
            }
          },

          voteratioCommand: {
            command: 'voteratio',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length === cmd.length) return API.sendChat(subChat(pirataBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring(cmd.length + 2);
                var user = pirataBot.userUtilities.lookupUserName(name);
                if (user === false) return API.sendChat(subChat(pirataBot.chat.invaliduserspecified, {name: chat.un}));
                var vratio = user.votes;
                var ratio = vratio.woot / vratio.meh;
                API.sendChat(subChat(pirataBot.chat.voteratio, {name: chat.un, username: name, woot: vratio.woot, mehs: vratio.meh, ratio: ratio.toFixed(2)}));
              }
            }
          },

          voteskipCommand: {
            command: 'voteskip',
            rank: 'manager',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) return API.sendChat(subChat(pirataBot.chat.voteskiplimit, {name: chat.un, limit: pirataBot.settings.voteSkipLimit}));
                var argument = msg.substring(cmd.length + 1);
                if (!pirataBot.settings.voteSkip) pirataBot.settings.voteSkip = !pirataBot.settings.voteSkip;
                if (isNaN(argument)) {
                  API.sendChat(subChat(pirataBot.chat.voteskipinvalidlimit, {name: chat.un}));
                }
                else {
                  pirataBot.settings.voteSkipLimit = argument;
                  API.sendChat(subChat(pirataBot.chat.voteskipsetlimit, {name: chat.un, limit: pirataBot.settings.voteSkipLimit}));
                }
              }
            }
          },

          welcomeCommand: {
            command: 'welcome',
            rank: 'mod',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (pirataBot.settings.welcome) {
                  pirataBot.settings.welcome = !pirataBot.settings.welcome;
                  return API.sendChat(subChat(pirataBot.chat.toggleoff, {name: chat.un, 'function': pirataBot.chat.welcomemsg}));
                }
                else {
                  pirataBot.settings.welcome = !pirataBot.settings.welcome;
                  return API.sendChat(subChat(pirataBot.chat.toggleon, {name: chat.un, 'function': pirataBot.chat.welcomemsg}));
                }
              }
            }
          },

          websiteCommand: {
            command: 'website',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (typeof pirataBot.settings.website === "string")
                API.sendChat(subChat(pirataBot.chat.website, {link: pirataBot.settings.website}));
              }
            }
          },

          whoisCommand: {
            command: 'whois',
            rank: 'bouncer',
            type: 'startsWith',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                var msg = chat.message;
                var name;
                if (msg.length === cmd.length) name = chat.un;
                else {
                  name = msg.substr(cmd.length + 2);
                }
                users = API.getUsers();
                var len = users.length;
                for (var i = 0; i < len; ++i){
                  if (users[i].username == name){
                    var id = users[i].id;
                    var avatar = API.getUser(id).avatarID;
                    var level = API.getUser(id).level;
                    var rawjoined = API.getUser(id).joined;
                    var joined = rawjoined.substr(0, 10);
                    var rawlang = API.getUser(id).language;
                    if (rawlang == "en"){
                      var language = "portuguese";
                    } else if (rawlang == "bg"){
                      var language = "Bulgarian";
                    } else if (rawlang == "cs"){
                      var language = "Czech";
                    } else if (rawlang == "fi"){
                      var language = "Finnish"
                    } else if (rawlang == "fr"){
                      var language = "French"
                    } else if (rawlang == "pt"){
                      var language = "Portuguese"
                    } else if (rawlang == "zh"){
                      var language = "Chinese"
                    } else if (rawlang == "sk"){
                      var language = "Slovak"
                    } else if (rawlang == "nl"){
                      var language = "Dutch"
                    } else if (rawlang == "ms"){
                      var language = "Malay"
                    }
                    var rawrank = API.getUser(id).role;
                    if (rawrank == "0"){
                      var rank = "User";
                    } else if (rawrank == "1"){
                      var rank = "Resident DJ";
                    } else if (rawrank == "2"){
                      var rank = "Bouncer";
                    } else if (rawrank == "3"){
                      var rank = "Manager"
                    } else if (rawrank == "4"){
                      var rank = "Co-Host"
                    } else if (rawrank == "5"){
                      var rank = "Host"
                    } else if (rawrank == "7"){
                      var rank = "Brand Ambassador"
                    } else if (rawrank == "10"){
                      var rank = "Admin"
                    }
                    var slug = API.getUser(id).slug;
                    if (typeof slug !== 'undefined') {
                      var profile = "https://plug.dj/@/" + slug;
                    } else {
                      var profile = "~";
                    }

                    API.sendChat(subChat(pirataBot.chat.whois, {name1: chat.un, name2: name, id: id, avatar: avatar, profile: profile, language: language, level: level, joined: joined, rank: rank}));
                  }
                }
              }
            }
          },

          youtubeCommand: {
            command: 'youtube',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
              if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
              if (!pirataBot.commands.executable(this.rank, chat)) return void (0);
              else {
                if (typeof pirataBot.settings.youtubeLink === "string")
                API.sendChat(subChat(pirataBot.chat.youtube, {name: chat.un, link: pirataBot.settings.youtubeLink}));
              }
            }
          }
        }
      };

      loadChat(pirataBot.startup);
    }).call(this);

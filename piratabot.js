(Function () {

  /*window.onerror = function () {
  sala de var = JSON.parse (localStorage.getItem ("pirataBotRoom"));
  window.location = "https://plug.dj '+ room.name;
  }; * /

  API.getWaitListPosition = function (id) {
    if (id typeof === 'indefinido' || id === null) {
      id = API.getUser () id.;
    }
    var wl = API.getWaitList ();
    for (var i = 0; i <wl.length; i ++) {
      if (WL id [i] .id ===) {
        voltar i;
      }
    }
    retornar -1;
  };

  var matança = function () {
    clearInterval (basicBot.room.autodisableInterval);
    clearInterval (basicBot.room.afkInterval);
    basicBot.status = false;
  };

  // Este servidor de soquete é usado exclusivamente para fins estatísticos e de resolução de problemas.
  // Este servidor não pode ser sempre para cima, mas vai ser usado para obter dados em tempo real em qualquer momento.

  var soquete = function () {
    loadSocket função () {
      SockJS.prototype.msg = function (a) {this.send (JSON.stringify (a))};
      meias = new SockJS ('https://socket-bnzi.c9.io/basicbot');
      sock.onopen = function () {
        console.log ('ligado à tomada!');
        sendToSocket ();
      };
      sock.onclose = function () {
        console.log ('desligado da tomada, reconectando a cada minuto ..');
        var reconexão = setTimeout (function () {loadSocket ()}, 60 * 1000);
      };
      sock.onmessage = function (broadcast) {
        var rawBroadcast = broadcast.data;
        var BroadcastMessage = rawBroadcast.replace (/ ["\\] + / g, '');
        API.chatLog (BroadcastMessage);
        console.log (BroadcastMessage);
      };
    }
    if (typeof SockJS == 'indefinido') {
      .getScript $ ('Https://cdn.jsdelivr.net/sockjs/0.3.4/sockjs.min.js', loadSocket);
    } Else loadSocket ();
  }

  var sendToSocket = function () {
    basicBotSettings var = basicBot.settings;
    var basicBotRoom = basicBot.room;
    var = {basicBotInfo
      tempo: Date.now (),
      versão: basicBot.version
    };
    var data = {users:API.getUsers(),userinfo:API.getUser(),room:location.pathname,basicBotSettings:basicBotSettings,basicBotRoom:basicBotRoom,basicBotInfo:basicBotInfo};
    retornar sock.msg (dados);
  };

  var storeToStorage = function () {
    localStorage.setItem ("basicBotsettings", JSON.stringify basicBot.settings ());
    localStorage.setItem ("basicBotRoom", JSON.stringify (basicBot.room));
    var = {basicBotStorageInfo
      tempo: Date.now (),
      armazenado: true,
      versão: basicBot.version
    };
    localStorage.setItem ("basicBotStorageInfo", JSON.stringify (basicBotStorageInfo));

  };

  var subChat = function (chat, obj) {
    if (typeof === bate-papo "undefined") {
      API.chatLog ("Há falta de um texto de bate-papo.");
      console.log ("Há falta de um texto de bate-papo.");
      retorno "[erro] Nenhuma mensagem de texto encontrado.";

      // TODO: Obter faltando mensagens de chat a partir da fonte.
    }
    var iluminado = '%%';
    for (var prop em obj) {
      conversar = chat.replace (lit + prop.toUpperCase () + aceso, obj [prop]);
    }
    retornar conversar;
  };

  var loadChat = function (cb) {
    if (cb!) cb = function () {
    };
    $ .get ("Https://rawgit.com/Yemasthui/basicBot/master/lang/langIndex.json", function (JSON) {
      ligação var = basicBot.chatLink;
      if (json! == null && typeof json! == "undefined") {
        langIndex = json;
        link = langIndex [basicBot.settings.language.toLowerCase ()];
        se (basicBot.settings.chatLink! == basicBot.chatLink) {
          link = basicBot.settings.chatLink;
        }
        outro {
          if (typeof ligação === "undefined") {
            link = basicBot.chatLink;
          }
        }
        $ .get (Link, função (JSON) {
          if (json! == null && typeof json! == "undefined") {
            if (typeof JSON === "string") json = JSON.parse (JSON);
            basicBot.chat = json;
            cb ();
          }
        });
      }
      outro {
        $ .get (BasicBot.chatLink, função (JSON) {
          if (json! == null && typeof json! == "undefined") {
            if (typeof JSON === "string") json = JSON.parse (JSON);
            basicBot.chat = json;
            cb ();
          }
        });
      }
    });
  };

  retrieveSettings var = function () {
    configurações var = JSON.parse (localStorage.getItem (basicBotsettings ""));
    if (configurações! == null) {
      for (var prop nas configurações) {
        basicBot.settings [prop] = configurações [prop];
      }
    }
  };

  var retrieveFromStorage = function () {
    Informação var = localStorage.getItem ("basicBotStorageInfo");
    if (Informação === null) API.chatLog (basicBot.chat.nodatafound);
    outro {
      configurações var = JSON.parse (localStorage.getItem (basicBotsettings ""));
      sala de var = JSON.parse (localStorage.getItem ("basicBotRoom"));
      var decorrido = Date.now () - JSON.parse (info) .time;
      if ((decorrido <1 * 60 * 60 * 1000)) {
        API.chatLog (basicBot.chat.retrievingdata);
        for (var prop nas configurações) {
          basicBot.settings [prop] = configurações [prop];
        }
        basicBot.room.users = room.users;
        basicBot.room.afkList = room.afkList;
        basicBot.room.historyList = room.historyList;
        basicBot.room.mutedUsers = room.mutedUsers;
        //basicBot.room.autoskip = room.autoskip;
        basicBot.room.roomstats = room.roomstats;
        basicBot.room.messages = room.messages;
        basicBot.room.queue = room.queue;
        basicBot.room.newBlacklisted = room.newBlacklisted;
        API.chatLog (basicBot.chat.datarestored);
      }
    }
    var json_sett = null;
    var roominfo = document.getElementById ("Quarto-settings");
    info = roominfo.textContent;
    var ref_bot = "@ basicBot =";
    var ind_ref = info.indexOf (ref_bot);
    if (ind_ref> 0) {
      ligação var = info.substring (ind_ref + ref_bot.length, info.length);
      var ind_space = null;
      se (link.indexOf ("") <link.indexOf ("\ n")) ind_space link.indexOf = ("");
      mais ind_space = link.indexOf ("\ n");
      link = link.substring (0, ind_space);
      $ .get (Link, função (JSON) {
        if (json! == null && typeof json! == "undefined") {
          json_sett = JSON.parse (JSON);
          for (var prop em json_sett) {
            basicBot.settings [prop] = json_sett [prop];
          }
        }
      });
    }

  };

  String.prototype.splitBetween = function (a, b) {
    var auto = this;
    auto = this.split (a);
    for (var i = 0; i <self.length; i ++) {
      auto [i] = auto [i] .Split (b);
    }
    var arr = [];
    for (var i = 0; i <self.length; i ++) {
      if (Array.isArray (self [i])) {
        for (var j = 0; j auto <[i] .length; j ++) {
          arr.push (self [i] [j]);
        }
      }
      mais arr.push (self [i]);
    }
    retornar arr;
  };

  String.prototype.startsWith = function (str) {
    retornar this.substring (0, str.length) === str;
  };

  var linkFixer = function (msg) {
    partes var = msg.splitBetween ('<a href="','<\/a>');
    para (var i = 1; i <parts.length; i = i + 2) {
      link de var = partes [i] .Split ('"') [0];
      partes [i] = ligação;
    }
    var m = '';
    for (var i = 0; i <parts.length; i ++) {
      M + = partes [i];
    }
    retornar m;
  };

  var decodeEntities = function (s) {
    var str, temp = document.createElement ('p');
    temp.innerHTML = S;
    str = temp.textContent || temp.innerText;
    temp = null;
    retornar str;
  };

  var botCreator = "Mateus (Yemasthui)";
  var botMaintainer = "Benzi (Quoona)"
  botCreatorIDs var = ["3851534", "4105209"];

  var = {basicBot
    versão: "2.8.9",
    Status: false,
    name: "basicBot",
    loggedInID: null,
    ScriptLink: "https://rawgit.com/Yemasthui/basicBot/master/basicBot.js",
    cmdLink: "http://git.io/245Ppg",
    chatLink: "https://rawgit.com/Yemasthui/basicBot/master/lang/en.json",
    chat: nulo,
    loadChat: loadChat,
    retrieveSettings: retrieveSettings,
    retrieveFromStorage: retrieveFromStorage,
    configurações: {
      botname: "piratabot",
      idioma: "português",
      chatLink: "https://rawgit.com/Yemasthui/basicBot/master/lang/en.json",
      roomLock: false, // Requer uma extensão de voltar a carregar o script
      startupCap: 1, // 1-200
      startupVolume: 0, // 0-100
      startupEmoji: false, // verdadeiro ou falso
      autowoot: true,
      AUTOSKIP: false,
      smartSkip: true,
      cmdDeletion: true,
      maximumAfk: 120,
      afkRemoval: true,
      maximumDc: 60,
      bouncerPlus: true,
      blacklistEnabled: true,
      lockdownEnabled: false,
      LockGuard: false,
      maximumLocktime: 10,
      CycleGuard: true,
      maximumCycletime: 10,
      voteSkip: false,
      voteSkipLimit: 10,
      historySkip: false,
      TIMEGUARD: true,
      maximumSongLength: 10,
      autodisable: true,
      commandCooldown: 30,
      usercommandsEnabled: true,
      skipPosition: 3,
      skipReasons: [
        ["Tema", "Essa música não se encaixa no tema do quarto."],
        ["Op", "Esta canção está na lista de OP."],
        ["História", "Essa música é na história."],
        ["Misturar", "Você jogou um mix, que é contra as regras."],
        ["Som", "A canção que você jogou teve má qualidade do som ou nenhum som."],
        ["NSFW", "A música que continha era NSFW (imagem ou som)."],
        ["Indisponível", "A canção que você jogou não estava disponível para alguns usuários."]
      ],
      afkpositionCheck: 15,
      afkRankCheck: "embaixador",
      motdEnabled: false,
      motdInterval: 5,
      motd: "Mensagem Temporária do Dia",
      filterChat: true,
      etaRestriction: false,
      boas-vindas: true,
      Oplink: null,
      rulesLink: null,
      themeLink: null,
      fbLink: null,
      youtubeLink: null,
      site: nulo,
      intervalMessages: [],
      messageInterval: 5,
      songstats: verdadeiro,
      commandLiteral: "!",
      blacklists: {
        NSFW: "https://rawgit.com/Yemasthui/basicBot-customization/master/blacklists/NSFWlist.json",
        OP: "https://rawgit.com/Yemasthui/basicBot-customization/master/blacklists/OPlist.json",
        PROIBIDO: "https://rawgit.com/Yemasthui/basicBot-customization/master/blacklists/BANNEDlist.json"
      }
    },
    quarto: {
      Nome: nulo,
      usuários: [],
      afkList: [],
      mutedUsers: [],
      bannedUsers: [],
      skippable: true,
      usercommand: true,
      allcommand: true,
      afkInterval: null,
      // AUTOSKIP: false,
      autoskipTimer: null,
      autodisableInterval: null,
      autodisableFunc: function () {
        if (basicBot.status && basicBot.settings.autodisable) {
          API.sendChat ('! Afkdisable');
          API.sendChat ('! Joindisable');
        }
      },
      filas: 0,
      queueable: true,
      currentDJID: null,
      historyList: [],
      cycleTimer: setTimeout (function () {
      }, 1),
      roomstats: {
        accountname: null,
        totalWoots: 0,
        totalCurates: 0,
        totalMehs: 0,
        launchTime: null,
        songCount: 0,
        chatmessages: 0
      },
      mensagens: {
        de: [],
        para: [],
        message: []
      },
      fila: {
        id: [],
        posição: []
      },
      blacklists: {

      },
      newBlacklisted: [],
      newBlacklistedSongFunction: null,
      roleta: {
        rouletteStatus: false,
        participantes: [],
        Contagem regressiva: null,
        startRoulette: function () {
          basicBot.room.roulette.rouletteStatus = true;
          basicBot.room.roulette.countdown = setTimeout (function () {
            basicBot.room.roulette.endRoulette ();
          }, 60 * 1000);
          API.sendChat (basicBot.chat.isopen);
        },
        endRoulette: function () {
          basicBot.room.roulette.rouletteStatus = false;
          var ind = Math.floor (Math.random () * basicBot.room.roulette.participants.length);
          Vencedor do var = basicBot.room.roulette.participants [ind];
          basicBot.room.roulette.participants = [];
          var pos = Math.floor (. (Math.random () * API.getWaitList () comprimento) + 1);
          usuário var = basicBot.userUtilities.lookupUser (vencedor);
          var name = user.username;
          API.sendChat (subChat (basicBot.chat.winnerpicked, {name: nome, cargo: pos}));
          setTimeout (function (vencedor, pos) {
            basicBot.userUtilities.moveUser (vencedor, pos, false);
          }, 1 * 1000, vencedor, pos);
        }
      }
    },
    Usuário: function (id, nome) {
      this.id = id;
      this.username = nome;
      this.jointime Date.now = ();
      this.lastActivity Date.now = ();
      this.votes = {
        woot: 0,
        meh: 0,
        curador: 0
      };
      this.lastEta = null;
      this.afkWarningCount = 0;
      this.afkCountdown = null;
      this.inRoom = true;
      this.isMuted = false;
      this.lastDC = {
        tempo: nulo,
        posição: null,
        songCount: 0
      };
      this.lastKnownPosition = null;
    },
    userUtilities: {
      getJointime: function (usuário) {
        retornar user.jointime;
      },
      getUser: function (usuário) {
        retornar API.getUser (user.id);
      },
      updatePosition: function (usuário, NewPOS) {
        user.lastKnownPosition = NewPOS;
      },
      updateDC: function (usuário) {
        user.lastDC.time Date.now = ();
        user.lastDC.position = user.lastKnownPosition;
        user.lastDC.songCount = basicBot.room.roomstats.songCount;
      },
      setLastActivity: function (usuário) {
        user.lastActivity Date.now = ();
        user.afkWarningCount = 0;
        clearTimeout (user.afkCountdown);
      },
      getLastActivity: function (usuário) {
        retornar user.lastActivity;
      },
      getWarningCount: function (usuário) {
        retornar user.afkWarningCount;
      },
      setWarningCount: function (usuário, value) {
        user.afkWarningCount = value;
      },
      lookupUser: function (id) {
        for (var i = 0; i <basicBot.room.users.length; i ++) {
          if (basicBot.room.users [i] .id === id) {
            retornar basicBot.room.users [i];
          }
        }
        return false;
      },
      lookupUserName: function (nome) {
        for (var i = 0; i <basicBot.room.users.length; i ++) {
          var match = basicBot.room.users [i] .username.trim () == name.trim ();
          if (jogo) {
            retornar basicBot.room.users [i];
          }
        }
        return false;
      },
      voteRatio: function (id) {
        usuário var = basicBot.userUtilities.lookupUser (id);
        var = user.votes votos;
        se (votes.meh === 0) votes.ratio = 1;
        mais votes.ratio = (votes.woot / votes.meh) .toFixed (2);
        retornar votos;

      },
      GetPermission: function (obj) {// 1 Pedidos
        var u;
        if (obj typeof === "objeto") u = obj;
        mais u = API.getUser (obj);
        for (var i = 0; i <botCreatorIDs.length; i ++) {
          if (botCreatorIDs [i] .indexOf (u.id)> -1) return 10;
        }
        if (u.gRole <2) retornar u.role;
        outro {
          switch (u.gRole) {
            case 2:
            retornar 7;
            case 3:
            retornar 8;
            case 4:
            retornar 9;
            Caso 5:
            retornar 10;
          }
        }
        retornar 0;
      },
      MOVEUSER: function (id, pos, prioridade) {
        usuário var = basicBot.userUtilities.lookupUser (id);
        var wlist API.getWaitList = ();
        if (API.getWaitListPosition (id) === -1) {
          se (wlist.length <50) {
            API.moderateAddDJ (id);
            if (pos! == 0) setTimeout (function (id, pos) {
              API.moderateMoveDJ (id, pos);
            }, 1250, id, pos);
          }
          outro {
            var alreadyQueued = -1;
            for (var i = 0; i <basicBot.room.queue.id.length; i ++) {
              if (basicBot.room.queue.id id [i] ===) alreadyQueued = i;
            }
            se (alreadyQueued! == -1) {
              basicBot.room.queue.position [alreadyQueued] = pos;
              retorno API.sendChat (subChat (basicBot.chat.alreadyadding, {position: basicBot.room.queue.position [alreadyQueued]}));
            }
            basicBot.roomUtilities.booth.lockBooth ();
            if (prioridade) {
              basicBot.room.queue.id.unshift (id);
              basicBot.room.queue.position.unshift (pos);
            }
            outro {
              basicBot.room.queue.id.push (id);
              basicBot.room.queue.position.push (pos);
            }
            var name = user.username;
            retornar API.sendChat (subChat (basicBot.chat.adding, {name: nome, cargo: basicBot.room.queue.position.length}));
          }
        }
        mais API.moderateMoveDJ (id, pos);
      },
      dclookup: function (id) {
        usuário var = basicBot.userUtilities.lookupUser (id);
        if (typeof usuário === 'booleano') retornar basicBot.chat.usernotfound;
        var name = user.username;
        if (user.lastDC.time === null) return subChat (basicBot.chat.notdisconnected, {name: name});
        var dc = user.lastDC.time;
        var pos = user.lastDC.position;
        if (pos === null) basicBot.chat.noposition retorno;
        var timeDc = Date.now () - dc;
        var validDC = false;
        if (basicBot.settings.maximumDc * 60 * 1000> timeDc) {
          validDC = true;
        }
        tempo = var basicBot.roomUtilities.msToStr (timeDc);
        if (! validDC) retorno (subChat (basicBot.chat.toolongago, {name: basicBot.userUtilities.getUser (usuário) .username, tempo: time}));
        var songsPassed = basicBot.room.roomstats.songCount - user.lastDC.songCount;
        var afksRemoved = 0;
        var afkList = basicBot.room.afkList;
        for (var i = 0; i <afkList.length; i ++) {
          var timeAfk = afkList [i] [1];
          var posAfk = afkList [i] [2];
          if (dc <timeAfk && posAfk <pos) {
            afksRemoved ++;
          }
        }
        var newPosition = user.lastDC.position - songsPassed - afksRemoved;
        if (newPosition <= 0) return subChat (basicBot.chat.notdisconnected, {name: name});
        var msg = subChat (basicBot.chat.valid, {name: basicBot.userUtilities.getUser (usuário) .username, tempo: tempo, posição: newPosition});
        basicBot.userUtilities.moveUser (user.id, newPosition, true);
        retornar msg;
      }
    },

    roomUtilities: {
      rankToNumber: function (rankString) {
        var rankInt = null;
        switch (rankString) {
          caso "admin":
          rankInt = 10;
          parar;
          caso "embaixador":
          rankInt = 7;
          parar;
          caso "host":
          rankInt = 5;
          parar;
          caso "CoHost":
          rankInt = 4;
          parar;
          gerente de caso ":
          rankInt = 3;
          parar;
          caso "leão de chácara":
          rankInt = 2;
          parar;
          caso "residentdj":
          rankInt = 1;
          parar;
          caso "user":
          rankInt = 0;
          parar;
        }
        retornar rankInt;
      },
      msToStr: function (msTime) {
        ms var, msg, timeAway;
        msg = '';
        timeAway = {
          "Dias": 0,
          'Horas': 0,
          'Minutos': 0,
          'segundos': 0
        };
        ms = {
          'Dia': 24 * 60 * 60 * 1000,
          'Hora': 60 * 60 * 1000,
          'Minutos': 60 * 1000,
          'Segunda': 1000
        };
        se (msTime> ms.day) {
          timeAway.days = Math.floor (msTime / ms.day);
          msTime = msTime% ms.day;
        }
        se (msTime> ms.hour) {
          timeAway.hours = Math.floor (msTime / ms.hour);
          msTime = msTime% ms.hour;
        }
        se (msTime> ms.minute) {
          timeAway.minutes = Math.floor (msTime / ms.minute);
          msTime = msTime% ms.minute;
        }
        se (msTime> ms.second) {
          timeAway.seconds = Math.floor (msTime / ms.second);
        }
        if (timeAway.days! == 0) {
          msg + = timeAway.days.toString () + 'd';
        }
        if (timeAway.hours! == 0) {
          msg + = timeAway.hours.toString () + 'h';
        }
        if (timeAway.minutes! == 0) {
          msg + = timeAway.minutes.toString () + 'm';
        }
        if (timeAway.minutes <1 && timeAway.hours <1 && timeAway.days <1) {
          msg + = timeAway.seconds.toString () + 's';
        }
        if (msg! == '') {
          retornar msg;
        } Outro {
          return false;
        }
      },
      estande: {
        lockTimer: setTimeout (function () {
        }, 1000),
        bloqueado: false,
        lockBooth: function () {
          API.moderateLockWaitList (basicBot.roomUtilities.booth.locked!);
          basicBot.roomUtilities.booth.locked = false;
          se (basicBot.settings.lockGuard) {
            basicBot.roomUtilities.booth.lockTimer = setTimeout (function () {
              API.moderateLockWaitList (basicBot.roomUtilities.booth.locked);
            }, BasicBot.settings.maximumLocktime * 60 * 1000);
          }
        },
        unlockBooth: function () {
          API.moderateLockWaitList (basicBot.roomUtilities.booth.locked);
          clearTimeout (basicBot.roomUtilities.booth.lockTimer);
        }
      },
      afkCheck: function () {
        if (! basicBot.status || basicBot.settings.afkRemoval) vazio retorno (0);
        Rank var = basicBot.roomUtilities.rankToNumber (basicBot.settings.afkRankCheck);
        var djlist API.getWaitList = ();
        var lastPos = Math.min (djlist.length, basicBot.settings.afkpositionCheck);
        if (lastPos - 1> djlist.length) vazio retorno (0);
        for (var i = 0; i <lastPos; i ++) {
          if (typeof djlist [i]! == 'indefinido') {
            var id = djlist [i] .id;
            usuário var = basicBot.userUtilities.lookupUser (id);
            if (typeof usuário! == 'booleano') {
              var plugUser = basicBot.userUtilities.getUser (usuário);
              if (grau! == null && basicBot.userUtilities.getPermission (plugUser) <= rank) {
                var name = plugUser.username;
                var lastActive = basicBot.userUtilities.getLastActivity (usuário);
                var inatividade = Date.now () - lastActive;
                var tempo = basicBot.roomUtilities.msToStr (inatividade);
                var warncount = user.afkWarningCount;
                if (inatividade> basicBot.settings.maximumAfk * 60 * 1000) {
                  se (warncount === 0) {
                    API.sendChat (subChat (basicBot.chat.warning1, {name: nome, tempo: time}));
                    user.afkWarningCount = 3;
                    user.afkCountdown = setTimeout (function (userToChange) {
                      userToChange.afkWarningCount = 1;
                    }, 90 * 1000, do usuário);
                  }
                  else if (warncount === 1) {
                    API.sendChat (subChat (basicBot.chat.warning2, {name: name}));
                    user.afkWarningCount = 3;
                    user.afkCountdown = setTimeout (function (userToChange) {
                      userToChange.afkWarningCount = 2;
                    }, 30 * 1000, do usuário);
                  }
                  else if (warncount === 2) {
                    var pos = API.getWaitListPosition (id);
                    if (pos! == -1) {
                      pos ++;
                      basicBot.room.afkList.push ([id, Date.now (), pos]);
                      user.lastDC = {

                        tempo: nulo,
                        posição: null,
                        songCount: 0
                      };
                      API.moderateRemoveDJ (id);
                      API.sendChat (subChat (basicBot.chat.afkremove, {name: nome, o tempo: hora, a posição: pos, maximumafk: basicBot.settings.maximumAfk}));
                    }
                    user.afkWarningCount = 0;
                  }
                }
              }
            }
          }
        }
      },
      smartSkip: function (razão) {
        var dj = API.getDJ ();
        id = var dj.id;
        . var waitlistlength = API.getWaitList () Comprimento;
        var bloqueado = false;
        basicBot.room.queueable = false;

        se (waitlistlength == 50) {
          basicBot.roomUtilities.booth.lockBooth ();
          trancada = true;
        }
        setTimeout (function (id) {
          API.moderateForceSkip ();
          setTimeout (function () {
            if (typeof razão! == 'indefinido') {
              API.sendChat (razão);
            }
          }, 500);
          basicBot.room.skippable = false;
          setTimeout (function () {
            basicBot.room.skippable = true
          }, 5 * 1000);
          setTimeout (function (id) {
            basicBot.userUtilities.moveUser (id, basicBot.settings.skipPosition, false);
            basicBot.room.queueable = true;
            if (bloqueado) {
              setTimeout (function () {
                basicBot.roomUtilities.booth.unlockBooth ();
              }, 1000);
            }
          }, 1500, id);
        }, 1000, id);
      },
      changeDJCycle: function () {
        var alternância = $ ("ciclo de alternância.");
        if (toggle.hasClass ("disabled")) {
          toggle.click ();
          se (basicBot.settings.cycleGuard) {
            basicBot.room.cycleTimer = setTimeout (function () {
              if (toggle.hasClass ("habilitado")) toggle.click ();
            }, BasicBot.settings.cycleMaxTime * 60 * 1000);
          }
        }
        outro {
          toggle.click ();
          clearTimeout (basicBot.room.cycleTimer);
        }

        // TODO: Use API.moderateDJCycle (true / false)
      },
      intervalMessage: function () {
        intervalo var;
        if (basicBot.settings.motdEnabled) interval = basicBot.settings.motdInterval;
        outro intervalo = basicBot.settings.messageInterval;
        if ((basicBot.room.roomstats.songCount% intervalo) === 0 && basicBot.status) {
          var msg;
          se (basicBot.settings.motdEnabled) {
            msg = basicBot.settings.motd;
          }
          outro {
            if (basicBot.settings.intervalMessages.length === 0) retorno void (0);
            var MessageNumber = basicBot.room.roomstats.songCount% basicBot.settings.intervalMessages.length;
            msg = basicBot.settings.intervalMessages [MessageNumber];
          }
          API.sendChat ('/ me' + msg);
        }
      },
      updateBlacklists: function () {
        for (var bl em basicBot.settings.blacklists) {
          basicBot.room.blacklists [bl] = [];
          if (typeof basicBot.settings.blacklists [bl] === 'função') {
            basicBot.room.blacklists [bl] basicBot.settings.blacklists = ();
          }
          else if (typeof basicBot.settings.blacklists [bl] === 'string') {
            if (basicBot.settings.blacklists [bl] === '') {
              continuar;
            }
            tentar {
              (Function (l) {
                $ .get (basicBot.settings.blacklists [L], função (dados) {
                  if (typeof dados === 'string') {
                    data = JSON.parse (de dados);
                  }
                  lista var = [];
                  for (var prop em dados) {
                    if (typeof dados [prop] .mid! == 'indefinido') {
                      list.push (dados [prop] .mid);
                    }
                  }
                  basicBot.room.blacklists [L] = lista;
                })
              }) (Bl);
            }
            catch (e) {
              API.chatLog ('configuração de erro' + bl + 'lista negra.');
              console.log ('configuração de erro' + bl + 'lista negra.');
              console.log (e);
            }
          }
        }
      },
      logNewBlacklistedSongs: function () {
        if (typeof console.table! == 'indefinido') {
          console.table (basicBot.room.newBlacklisted);
        }
        outro {
          console.log (basicBot.room.newBlacklisted);
        }
      },
      exportNewBlacklistedSongs: function () {
        lista var = {};
        for (var i = 0; i <basicBot.room.newBlacklisted.length; i ++) {
          var pista = basicBot.room.newBlacklisted [i];
          lista [track.list] = [];
          lista [track.list] .faça pressão sobre ({
            Título: track.title,
            autor: track.author,
            mid: track.mid
          });
        }
        lista de retornar;
      }
    },
    eventChat: function (chat) {
      chat.message = linkFixer (chat.message);
      chat.message = decodeEntities (chat.message);
      chat.message chat.message.trim = ();
      for (var i = 0; i <basicBot.room.users.length; i ++) {
        if (basicBot.room.users [i] .id === chat.uid) {
          basicBot.userUtilities.setLastActivity (basicBot.room.users [i]);
          if (basicBot.room.users [i] .username! == chat.un) {
            basicBot.room.users [i] = .username chat.un;
          }
        }
      }
      if (basicBot.chatUtilities.chatFilter (chat)) vazio retorno (0);
      if (! basicBot.chatUtilities.commandCheck (chat))
      basicBot.chatUtilities.action (chat);
    },
    eventUserjoin: function (usuário) {
      var conhecido = false;
      var index = null;
      for (var i = 0; i <basicBot.room.users.length; i ++) {
        if (basicBot.room.users [i] .id === user.id) {
          conhecido = true;
          index = i;
        }
      }
      var greet = true;
      var welcomeback = null;
      se (conhecido) {
        basicBot.room.users [índice] .inRoom = true;
        var u = basicBot.userUtilities.lookupUser (user.id);
        var jt = u.jointime;
        var t = Date.now () - jt;
        if (t <10 * 1000) cumprimentar = false;
        mais welcomeback = true;
      }
      outro {
        basicBot.room.users.push (novo basicBot.User (user.id, user.username));
        welcomeback = false;
      }
      para (var j = 0; j <basicBot.room.users.length; j ++) {
        if (basicBot.userUtilities.getUser (basicBot.room.users [j]). id === user.id) {
          basicBot.userUtilities.setLastActivity (basicBot.room.users [j]);
          basicBot.room.users [j] = .jointime Date.now ();
        }

      }
      if (basicBot.settings.welcome && cumprimentar) {
        bem vindo de volta?
        setTimeout (function (usuário) {
          API.sendChat (subChat (basicBot.chat.welcomeback, {name: user.username}));
        }, 1 * 1000, usuário)
        :
        setTimeout (function (usuário) {
          API.sendChat (subChat (basicBot.chat.welcome, {name: user.username}));
        }, 1 * 1000, do usuário);
      }
    },
    eventUserleave: function (usuário) {
      var lastDJ = API.getHistory () [0] .user.id;
      for (var i = 0; i <basicBot.room.users.length; i ++) {
        if (basicBot.room.users [i] .id === user.id) {
          basicBot.userUtilities.updateDC (basicBot.room.users [i]);
          basicBot.room.users [i] .inRoom = false;
          if (lastDJ == user.id) {
            usuário var = basicBot.userUtilities.lookupUser (basicBot.room.users [i] .id);
            basicBot.userUtilities.updatePosition (usuário, 0);
            user.lastDC.time = null;
            user.lastDC.position = user.lastKnownPosition;
          }
        }
      }
    },
    eventVoteupdate: function (obj) {
      for (var i = 0; i <basicBot.room.users.length; i ++) {
        if (basicBot.room.users [i] .id === obj.user.id) {
          se (=== obj.vote 1) {
            basicBot.room.users [i] .votes.woot ++;
          }
          outro {
            basicBot.room.users [i] .votes.meh ++;
          }
        }
      }

      var mehs = API.getScore () negativo.;
      var woots = API.getScore () positivo.;
      var dj = API.getDJ ();
      var timeleft = API.getTimeRemaining ();
      var timeElapsed API.getTimeElapsed = ();

      se (basicBot.settings.voteSkip) {
        if ((mehs - woots)> = (basicBot.settings.voteSkipLimit)) {
          API.sendChat (subChat (basicBot.chat.voteskipexceededlimit, {name: dj.username, limite: basicBot.settings.voteSkipLimit}));
          if (basicBot.settings.smartSkip && timeleft> timeElapsed) {
            basicBot.roomUtilities.smartSkip ();
          }
          outro {
            API.moderateForceSkip ();
          }
        }
      }

    },
    eventCurateupdate: function (obj) {
      for (var i = 0; i <basicBot.room.users.length; i ++) {
        if (basicBot.room.users [i] .id === obj.user.id) {
          basicBot.room.users [i] .votes.curate ++;
        }
      }
    },
    eventDjadvance: function (obj) {
      se (basicBot.settings.autowoot) {
        . $ ("# Woot") clique (); // Autowoot
      }

      usuário var = basicBot.userUtilities.lookupUser (obj.dj.id)
      for (var i = 0; i <basicBot.room.users.length; i ++) {
        if (basicBot.room.users [i] .id === user.id) {
          basicBot.room.users [i] .lastDC = {
            tempo: nulo,
            posição: null,
            songCount: 0
          };
        }
      }

      var lastplay = obj.lastPlay;
      if (typeof lastplay === 'indefinido') return;
      if (basicBot.settings.songstats) {
        if (typeof basicBot.chat.songstatistics === "undefined") {
          API.sendChat ("/ me" + lastplay.media.author + "-" + lastplay.media.title + ":" + lastplay.score.positive + "W /" + lastplay.score.grabs + "G /" lastplay.score.negative + + "M.")
        }
        outro {
          API.sendChat (subChat (basicBot.chat.song estatísticas, {artista: lastplay.media.author, título: lastplay.media.title, woots: lastplay.score.positive, ganchos: lastplay.score.grabs, mehs: lastplay. score.negative}))
        }
      }
      basicBot.room.roomstats.totalWoots + = lastplay.score.positive;
      basicBot.room.roomstats.totalMehs + = lastplay.score.negative;
      basicBot.room.roomstats.totalCurates + = lastplay.score.grabs;
      basicBot.room.roomstats.songCount ++;
      basicBot.roomUtilities.intervalMessage ();
      basicBot.room.currentDJID = obj.dj.id;

      var blacklistSkip = setTimeout (function () {
        var mid = obj.media.format + ':' + obj.media.cid;
        for (var bl em basicBot.room.blacklists) {
          se (basicBot.settings.blacklistEnabled) {
            if (basicBot.room.blacklists [bl] .indexOf (mid)> -1) {
              API.sendChat (subChat (basicBot.chat.isblacklisted, {lista negra: bl}));
              se (basicBot.settings.smartSkip) {
                retornar basicBot.roomUtilities.smartSkip ();
              }
              outro {
                retornar API.moderateForceSkip ();
              }
            }
          }
        }
      }, 2000);
      var NewMedia = obj.media;
      var timeLimitSkip = setTimeout (function () {
        if (basicBot.settings.timeGuard && newMedia.duration> basicBot.settings.maximumSongLength * 60 &&! basicBot.room.roomevent) {
          var name = obj.dj.username;
          API.sendChat (subChat (basicBot.chat.timelimit, {name: nome, maxlength: basicBot.settings.maximumSongLength}));
          se (basicBot.settings.smartSkip) {
            retornar basicBot.roomUtilities.smartSkip ();
          }
          outro {
            retornar API.moderateForceSkip ();
          }
        }
      }, 2000);
      formato var = obj.media.format;
      var cid = obj.media.cid;
      var naSkip = setTimeout (function () {
        se (formato == 1) {
          $ .getJSON ('Https://www.googleapis.com/youtube/v3/videos?id=' + cid + '& key = AIzaSyDcfWu9cGaDnTjPKhg_dy9mUh6H7i4ePZ0 & parte = trecho & callback =?', Function (pista) {
            if (typeof (track.items [0]) === 'indefinido') {
              var name = obj.dj.username;
              API.sendChat (subChat (basicBot.chat.notavailable, {name: name}));
              se (basicBot.settings.smartSkip) {
                retornar basicBot.roomUtilities.smartSkip ();
              }
              outro {
                retornar API.moderateForceSkip ();
              }
            }
          });
        }
        outro {
          var checkSong = SC.get ('/ faixas /' + cid, função (faixa) {
            if (typeof track.title === 'indefinido') {
              var name = obj.dj.username;
              API.sendChat (subChat (basicBot.chat.notavailable, {name: name}));
              se (basicBot.settings.smartSkip) {
                retornar basicBot.roomUtilities.smartSkip ();
              }
              outro {
                retornar API.moderateForceSkip ();
              }
            }
          });
        }
      }, 2000);
      clearTimeout (historySkip);
      se (basicBot.settings.historySkip) {
        var alreadyPlayed = false;
        var apihistory API.getHistory = ();
        var name = obj.dj.username;
        var historySkip = setTimeout (function () {
          for (var i = 0; i <apihistory.length; i ++) {
            if (apihistory [i] .media.cid === obj.media.cid) {
              basicBot.room.historyList [i] .faça pressão sobre (+ new Date ());
              alreadyPlayed = true;
              API.sendChat (subChat (basicBot.chat.songknown, {name: name}));
              se (basicBot.settings.smartSkip) {
                retornar basicBot.roomUtilities.smartSkip ();
              }
              outro {
                retornar API.moderateForceSkip ();
              }
            }
          }
          se (alreadyPlayed!) {
            basicBot.room.historyList.push ([obj.media.cid, + new Date ()]);
          }
        }, 2000);
      }
      se (user.ownSong) {
        API.sendChat (subChat (basicBot.chat.permissionownsong, {name: user.username}));
        user.ownSong = false;
      }
      clearTimeout (basicBot.room.autoskipTimer);
      se (basicBot.settings.autoskip) {
        var restante obj.media.duration * = 1000;
        . var startcid = API.getMedia () cid;
        basicBot.room.autoskipTimer = setTimeout (function () {
          . var endcid = API.getMedia () cid;
          se (startcid === endcid) {
            //API.sendChat('Song Preso, pular ... ');
            API.moderateForceSkip ();
          }
        }, Permanecendo + 5000);
      }
      storeToStorage ();
      sendToSocket ();
    },
    eventWaitlistupdate: function (usuários) {
      se (users.length <50) {
        se (basicBot.room.queue.id.length> 0 && basicBot.room.queueable) {
          basicBot.room.queueable = false;
          setTimeout (function () {
            basicBot.room.queueable = true;
          }, 500);
          basicBot.room.queueing ++;
          ID de var, pos;
          setTimeout (
            function () {
              ID = basicBot.room.queue.id.splice (0, 1) [0];
              pos basicBot.room.queue.position.splice = (0, 1) [0];
              API.moderateAddDJ (id, pos);
              setTimeout (
                function (id, pos) {
                  API.moderateMoveDJ (id, pos);
                  basicBot.room.queueing--;
                  if (basicBot.room.queue.id.length === 0) setTimeout (function () {
                    basicBot.roomUtilities.booth.unlockBooth ();
                  }, 1000);
                }, 1000, id, pos);
              }, 1000 + basicBot.room.queueing * 2500);
            }
          }
          for (var i = 0; i <users.length; i ++) {
            usuário var = basicBot.userUtilities.lookupUser (usuários [i] .id);
            basicBot.userUtilities.updatePosition (usuário, API.getWaitListPosition (usuários [i] .id) + 1);
          }
        },
        chatcleaner: function (chat) {
          Se retornar falso (basicBot.settings.filterChat!);
          if (basicBot.userUtilities.getPermission (chat.uid)> 1) return false;
          var msg = chat.message;
          containsLetters var = false;
          for (var i = 0; i <msg.length; i ++) {
            CH = msg.charAt (i);
            if ((ch> = 'a' && ch <= 'z') || (ch> = 'A' && ch <= 'Z') || (ch> = '0' && ch <= '9' ) || ch === ':' || ch === '^') containsLetters = true;
          }
          if (msg === '') {
            return true;
          }
          if (containsLetters && (=== msg.length 1 || msg.length> 3)!) return true;
          msg = msg.replace (/ [,;:. \ / = ~ +% ^ * \ - \\ "'& @ #] / g,' ');
          var capitais = 0;
          var CH;
          for (var i = 0; i <msg.length; i ++) {
            CH = msg.charAt (i);
            if (ch> = 'A' && ch <= 'Z') capitais ++;
          }
          if (capitais> = 40) {
            API.sendChat (subChat (basicBot.chat.caps, {name: chat.un}));
            return true;
          }
          msg = msg.toLowerCase ();
          if (msg === 'pular') {
            API.sendChat (subChat (basicBot.chat.askskip, {name: chat.un}));
            return true;
          }
          para (var j = 0; j <basicBot.chatUtilities.spam.length; j ++) {
            if (msg === basicBot.chatUtilities.spam [j]) {
              API.sendChat (subChat (basicBot.chat.spam, {name: chat.un}));
              return true;
            }
          }
          return false;
        },
        chatUtilities: {
          chatFilter: function (chat) {
            var msg = chat.message;
            var perm = basicBot.userUtilities.getPermission (chat.uid);
            usuário var = basicBot.userUtilities.lookupUser (chat.uid);
            var IsMuted = false;
            for (var i = 0; i <basicBot.room.mutedUsers.length; i ++) {
              if (basicBot.room.mutedUsers [i] === chat.uid) IsMuted = true;
            }
            se (IsMuted) {
              API.moderateDeleteChat (chat.cid);
              return true;
            }
            se (basicBot.settings.lockdownEnabled) {
              if (perm === 0) {
                API.moderateDeleteChat (chat.cid);
                return true;
              }
            }
            if (basicBot.chatcleaner (chat)) {
              API.moderateDeleteChat (chat.cid);
              return true;
            }
            if (basicBot.settings.cmdDeletion && msg.startsWith (basicBot.settings.commandLiteral)) {
              API.moderateDeleteChat (chat.cid);
            }
            / **
            var plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[- A-Z0-9 + & # @ \ /% = ~ _ |]) / ig;
            if (plugRoomLinkPatt.exec (msg)) {
            if (perm === 0) {
            API.sendChat (subChat (basicBot.chat.roomadvertising, {name: chat.un}));
            API.moderateDeleteChat (chat.cid);
            return true;
            }
            }
            ** /
            se (msg.indexOf ('http://adf.ly/')> -1) {
              API.moderateDeleteChat (chat.cid);
              API.sendChat (subChat (basicBot.chat.adfly, {name: chat.un}));
              return true;
            }
            if (msg.indexOf ('autojoin não foi ativado')> 0 || msg.indexOf ('AFK mensagem não foi ativado')> 0 || msg.indexOf ('! afkdisable')> 0 || msg.indexOf ( '! joindisable')> 0 || msg.indexOf ('autojoin deficientes')> 0 || msg.indexOf ('AFK mensagem desativado') 0>) {
              API.moderateDeleteChat (chat.cid);
              return true;
            }

            var rlJoinChat = basicBot.chat.roulettejoin;
            var rlLeaveChat = basicBot.chat.rouletteleave;

            var joinedroulette = rlJoinChat.split ('%% NAME %%');
            se (joinedroulette [1] .length> joinedroulette [0] .length) joinedroulette = joinedroulette [1];
            mais joinedroulette = joinedroulette [0];

            var leftroulette = rlLeaveChat.split ('%% NAME %%');
            se (leftroulette [1] .length> leftroulette [0] .length) leftroulette = leftroulette [1];
            mais leftroulette = leftroulette [0];

            if ((msg.indexOf (joinedroulette)> -1 || msg.indexOf (leftroulette) -1>) && chat.uid === basicBot.loggedInID) {
              setTimeout (function (id) {
                API.moderateDeleteChat (id);
              }, 5 * 1000, chat.cid);
              return true;
            }
            return false;
          },
          commandCheck: function (chat) {
            cmd var;
            se (chat.message.charAt (0) === basicBot.settings.commandLiteral) {
              espaço var = chat.message.indexOf ('');
              se (espaço === -1) {
                cmd = chat.message;
              }
              mais cmd = chat.message.substring (0, espaço);
            }
            outra coisa return false;
            var userPerm = basicBot.userUtilities.getPermission (chat.uid);
            //console.log("name: "+ chat.un +", perm: "+ userPerm);
            if (chat.message! == basicBot.settings.commandLiteral + 'juntar' && chat.message! == basicBot.settings.commandLiteral + "sair") {
              if (! userPerm === 0 && basicBot.room.usercommand) vazio retorno (0);
              if (! basicBot.room.allcommand) vazio retorno (0);
            }
            if (chat.message === basicBot.settings.commandLiteral + 'eta' && basicBot.settings.etaRestriction) {
              se (userPerm <2) {
                var u = basicBot.userUtilities.lookupUser (chat.uid);
                if (! u.lastEta == null && (Date.now () - u.lastEta) <1 * 60 * 60 * 1000) {
                  API.moderateDeleteChat (chat.cid);
                  retorno void (0);
                }
                mais u.lastEta = Date.now ();
              }
            }
            var executado = false;

            for (var comm em basicBot.commands) {
              var cmdCall = basicBot.commands [comm] .command;
              if (! Array.isArray (cmdCall)) {
                cmdCall = [cmdCall]
              }
              for (var i = 0; i <cmdCall.length; i ++) {
                if (basicBot.settings.commandLiteral + cmdCall [i] === cmd) {
                  basicBot.commands [comm] .functionality (chat, basicBot.settings.commandLiteral + cmdCall [i]);
                  executado = true;
                  parar;
                }
              }
            }

            if (executada && userPerm === 0) {
              basicBot.room.usercommand = false;
              setTimeout (function () {
                basicBot.room.usercommand = true;
              }, BasicBot.settings.commandCooldown * 1000);
            }
            se (executado) {
              / * If (basicBot.settings.cmdDeletion) {
              API.moderateDeleteChat (chat.cid);
              } * /

              //basicBot.room.allcommand = false;
              // SetTimeout (function () {
              basicBot.room.allcommand = true;
              } //, 5 * 1000);
            }
            voltar executadas;
          },
          ação: function (chat) {
            usuário var = basicBot.userUtilities.lookupUser (chat.uid);
            if (chat.type === 'mensagem') {
              para (var j = 0; j <basicBot.room.users.length; j ++) {
                if (basicBot.userUtilities.getUser (basicBot.room.users [j]). id === chat.uid) {
                  basicBot.userUtilities.setLastActivity (basicBot.room.users [j]);
                }

              }
            }
            basicBot.room.roomstats.chatmessages ++;
          },
          Spam: [
            'HUEH', 'HU3', 'brbr "," urânio altamente enriquecido "," brbr "," kkkk "," spoder', 'máfia', 'zuera', 'zueira',
            'Zueria', 'aehoo', 'aheu', 'alguem', 'algum', 'Brasil', 'zoeira', 'fuckadmins', 'affff', 'vaisefoder', 'huenaarea',
            'Hitler', 'ashua', 'ahsu', 'ashau "," lulz "," Huehue', 'tonalidade', 'huehuehue', 'merda', 'PQP', 'puta', 'mulher', 'pula ',' retarda ',' caralho ',' filha ',' ppk ',
            'Gringo', 'fuder', 'foder', 'hua', 'ahue', 'modafuka', 'modafoka', 'mudafuka', 'mudafoka', 'ooooooooooooooo', 'foda'
          ],
          amaldiçoa: [
            'Nigger', 'bicha', 'mano', 'niqqa "," filho da puta "," modafocka'
          ]
        },
        connectAPI: function () {
          this.proxy = {
            eventChat: $ .proxy (this.eventChat, this),
            eventUserskip: $ .proxy (this.eventUserskip, this),
            eventUserjoin: $ .proxy (this.eventUserjoin, this),
            eventUserleave: $ .proxy (this.eventUserleave, this),
            // EventFriendjoin: $ .proxy (this.eventFriendjoin, this),
            eventVoteupdate: $ .proxy (this.eventVoteupdate, this),
            eventCurateupdate: $ .proxy (this.eventCurateupdate, this),
            eventRoomscoreupdate: $ .proxy (this.eventRoomscoreupdate, this),
            eventDjadvance: $ .proxy (this.eventDjadvance, this),
            // EventDjupdate: $ .proxy (this.eventDjupdate, this),
            eventWaitlistupdate: $ .proxy (this.eventWaitlistupdate, this),
            eventVoteskip: $ .proxy (this.eventVoteskip, this),
            eventModskip: $ .proxy (this.eventModskip, this),
            eventChatcommand: $ .proxy (this.eventChatcommand, this),
            eventHistoryupdate: $ .proxy (this.eventHistoryupdate, this),

          };
          API.on (API.CHAT, this.proxy.eventChat);
          API.on (API.USER_SKIP, this.proxy.eventUserskip);
          API.on (API.USER_JOIN, this.proxy.eventUserjoin);
          API.on (API.USER_LEAVE, this.proxy.eventUserleave);
          API.on (API.VOTE_UPDATE, this.proxy.eventVoteupdate);
          API.on (API.GRAB_UPDATE, this.proxy.eventCurateupdate);
          API.on (API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
          API.on (API.ADVANCE, this.proxy.eventDjadvance);
          API.on (API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
          API.on (API.MOD_SKIP, this.proxy.eventModskip);
          API.on (API.CHAT_COMMAND, this.proxy.eventChatcommand);
          API.on (API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        disconnectAPI: function () {
          API.off (API.CHAT, this.proxy.eventChat);
          API.off (API.USER_SKIP, this.proxy.eventUserskip);
          API.off (API.USER_JOIN, this.proxy.eventUserjoin);
          API.off (API.USER_LEAVE, this.proxy.eventUserleave);
          API.off (API.VOTE_UPDATE, this.proxy.eventVoteupdate);
          API.off (API.CURATE_UPDATE, this.proxy.eventCurateupdate);
          API.off (API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
          API.off (API.ADVANCE, this.proxy.eventDjadvance);
          API.off (API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
          API.off (API.MOD_SKIP, this.proxy.eventModskip);
          API.off (API.CHAT_COMMAND, this.proxy.eventChatcommand);
          API.off (API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        inicialização: function () {
          Function.prototype.toString = function () {
            'Função'. retorno
          };
          var u = API.getUser ();
          if (basicBot.userUtilities.getPermission (u) <2) retornar API.chatLog (basicBot.chat.greyuser);
          se (basicBot.userUtilities.getPermission (u) === 2) API.chatLog (basicBot.chat.bouncer);
          basicBot.connectAPI ();
          API.moderateDeleteChat = function (cid) {
            $ .ajax ({
              url: "https://plug.dj/_/chat/" + cid,
              digite: "DELETE"
            })
          };

          basicBot.room.name = window.location.pathname;
          var Verifique;

          console.log (basicBot.room.name);

          var detectar = function () {
            se (basicBot.room.name! = window.location.pathname) {
              console.log ("Killing bot após mudança de quarto.");
              storeToStorage ();
              basicBot.disconnectAPI ();
              setTimeout (function () {
                matar ();
              }, 1000);
              se (basicBot.settings.roomLock) {
                window.location = "https://plug.dj '+ basicBot.room.name;
              }
              outro {
                clearInterval (Check);
              }
            }
          };

          Confira = setInterval (function () {detectar ()}, 2000);

          retrieveSettings ();
          retrieveFromStorage ();
          window.bot = basicBot;
          basicBot.roomUtilities.updateBlacklists ();
          setInterval (basicBot.roomUtilities.updateBlacklists, 60 * 60 * 1000);
          basicBot.getNewBlacklistedSongs = basicBot.roomUtilities.exportNewBlacklistedSongs;
          basicBot.logNewBlacklistedSongs = basicBot.roomUtilities.logNewBlacklistedSongs;
          if (basicBot.room.roomstats.launchTime === null) {
            basicBot.room.roomstats.launchTime Date.now = ();
          }

          para (var j = 0; j <basicBot.room.users.length; j ++) {
            basicBot.room.users [j] .inRoom = false;
          }
          var UserList API.getUsers = ();
          for (var i = 0; i <userlist.length; i ++) {
            var conhecido = false;
            var ind = null;
            para (var j = 0; j <basicBot.room.users.length; j ++) {
              if (basicBot.room.users [j] .id === userlist [i] .id) {
                conhecido = true;
                ind = j;
              }
            }
            se (conhecido) {
              basicBot.room.users [ind] .inRoom = true;
            }
            outro {
              basicBot.room.users.push (novo basicBot.User (userlist [i] .id, userlist [i] .username));
              ind basicBot.room.users.length = - 1;
            }
            var wlIndex = API.getWaitListPosition (basicBot.room.users [ind] .id) + 1;
            basicBot.userUtilities.updatePosition (basicBot.room.users [ind], wlIndex);
          }
          basicBot.room.afkInterval = setInterval (function () {
            basicBot.roomUtilities.afkCheck ()
          }, 10 * 1000);
          basicBot.room.autodisableInterval = setInterval (function () {
            basicBot.room.autodisableFunc ();
          }, 60 * 60 * 1000);
          basicBot.loggedInID = API.getUser () id.;
          basicBot.status = true;
          API.sendChat ('/ cap' + basicBot.settings.startupCap);
          API.setVolume (basicBot.settings.startupVolume);
          se (basicBot.settings.autowoot) {
            . $ ("# Woot") clique ();
          }
          se (basicBot.settings.startupEmoji) {
            var emojibuttonoff = $ ("icon-emoji-off.");
            if (emojibuttonoff.length> 0) {
              emojibuttonoff [0] .click ();
            }
            API.chatLog (': sorrir: Emojis habilitado.');
          }
          outro {
            var emojibuttonon = $ ("ícone-emoji diante.");
            if (emojibuttonon.length> 0) {
              emojibuttonon [0] .click ();
            }
            API.chatLog ('Emojis desativado.');
          }
          API.chatLog ('Avatares limitado a' + basicBot.settings.startupCap);
          API.chatLog ('Volume definido como' + basicBot.settings.startupVolume);
          socket ();
          loadChat (API.sendChat (subChat (basicBot.chat.online, {botname: basicBot.settings.botName, versão: basicBot.version})));
        },
        comandos: {
          executável: function (minRank, chat) {
            id = var chat.uid;
            var perm = basicBot.userUtilities.getPermission (id);
            var minPerm;
            switch (minRank) {
              caso 'admin':
              minPerm = 10;
              parar;
              caso "embaixador":
              minPerm = 7;
              parar;
              caso 'host':
              minPerm = 5;
              parar;
              caso 'CoHost':
              minPerm = 4;
              parar;
              gerente de caso ':
              minPerm = 3;
              parar;
              caso 'mod':
              se (basicBot.settings.bouncerPlus) {
                minPerm = 2;
              }
              outro {
                minPerm = 3;
              }
              parar;
              caso 'saltador':
              minPerm = 2;
              parar;
              caso 'residentdj':
              minPerm = 1;
              parar;
              caso 'user':
              minPerm = 0;
              parar;
              padrão:
              API.chatLog ('atribuindo permissão mínima de erro');
            }
            retornar perm> = minPerm;

          },
          / **
          comando: {
          comando: "cmd",
          classificação: 'user / leão de chácara / mod / manager',
          digite: 'startsWith / exato,
          funcionalidade: function (bate-papo, cmd) {
          if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
          (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
          outro {

          }
          }
          },
          ** /

          ActiveCommand: {
            comando: 'ativa',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var agora Date.now = ();
                chatters var = 0;
                var tempo;

                var launchT = basicBot.room.roomstats.launchTime;
                var durationOnline = Date.now () - launchT;
                var desde durationOnline = / 1000;

                se (msg.length === cmd.length) = tempo desde;
                outro {
                  tempo = msg.substring (cmd.length + 1);
                  if (isNaN (tempo)) return API.sendChat (subChat (basicBot.chat.invalidtime, {name: chat.un}));
                }
                for (var i = 0; i <basicBot.room.users.length; i ++) {
                  userTime = basicBot.userUtilities.getLastActivity (basicBot.room.users [i]);
                  if ((agora - userTime) <= (hora * 60 * 1000)) {
                    chatters ++;
                  }
                }
                API.sendChat (subChat (basicBot.chat.activeusersintime, {name: chat.un, quantidade: vibra, tempo: time}));
              }
            }
          },

          addCommand: {
            comando: "adicionar",
            classificação: 'mod',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substr (cmd.length + 2);
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                se (msg.length> cmd.length + 2) {
                  if (typeof usuário! == 'indefinido') {
                    se (basicBot.room.roomevent) {
                      basicBot.room.eventArtists.push (user.id);
                    }
                    API.moderateAddDJ (user.id);
                  } Else API.sendChat (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                }
              }
            }
          },

          afklimitCommand: {
            comando: 'afklimit',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nolimitspecified, {name: chat.un}));
                limite var = msg.substring (cmd.length + 1);
                if (! isNaN (limite)) {
                  basicBot.settings.maximumAfk = parseInt (limite, 10);
                  API.sendChat (subChat (basicBot.chat.maximumafktimeset, {name: chat.un, tempo: basicBot.settings.maximumAfk}));
                }
                mais API.sendChat (subChat (basicBot.chat.invalidlimitspecified, {name: chat.un}));
              }
            }
          },

          afkremovalCommand: {
            comando: 'afkremoval',
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.afkRemoval) {
                  basicBot.settings.afkRemoval = basicBot.settings.afkRemoval!;
                  clearInterval (basicBot.room.afkInterval);
                  API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.afkremoval}));
                }
                outro {
                  basicBot.settings.afkRemoval = basicBot.settings.afkRemoval!;
                  basicBot.room.afkInterval = setInterval (function () {
                    basicBot.roomUtilities.afkCheck ()
                  }, 2 * 1000);
                  API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.afkremoval}));
                }
              }
            }
          },

          afkresetCommand: {
            comando: 'afkreset',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring (cmd.length + 2);
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                basicBot.userUtilities.setLastActivity (usuário);
                API.sendChat (subChat (basicBot.chat.afkstatusreset, {name: chat.un, nome de usuário: nome}));
              }
            }
          },

          afktimeCommand: {
            comando: 'afktime',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring (cmd.length + 2);
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                var lastActive = basicBot.userUtilities.getLastActivity (usuário);
                var inatividade = Date.now () - lastActive;
                var tempo = basicBot.roomUtilities.msToStr (inatividade);

                var launchT = basicBot.room.roomstats.launchTime;
                var durationOnline = Date.now () - launchT;

                if (inatividade == durationOnline) {
                  API.sendChat (subChat (basicBot.chat.inactivelonger, {botname: basicBot.settings.botName, name: chat.un, nome de usuário: nome}));
                } Outro {
                  API.sendChat (subChat (basicBot.chat.inactivefor, {name: chat.un, nome de usuário: nome, tempo: time}));
                }
              }
            }
          },

          autodisableCommand: {
            comando: 'autodisable',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.autodisable) {
                  basicBot.settings.autodisable = basicBot.settings.autodisable!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.autodisable}));
                }
                outro {
                  basicBot.settings.autodisable = basicBot.settings.autodisable!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.autodisable}));
                }

              }
            }
          },

          autoskipCommand: {
            comando: 'AUTOSKIP',
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.autoskip) {
                  basicBot.settings.autoskip = basicBot.settings.autoskip!;
                  clearTimeout (basicBot.room.autoskipTimer);
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.autoskip}));
                }
                outro {
                  basicBot.settings.autoskip = basicBot.settings.autoskip!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.autoskip}));
                }
              }
            }
          },

          autowootCommand: {
            comando: 'autowoot',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat (basicBot.chat.autowoot);
              }
            }
          },

          baCommand: {
            comando: 'ba',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat (basicBot.chat.brandambassador);
              }
            }
          },

          ballCommand: {
            comando: ['8ball', 'pedir'],
            classificação: 'usuário',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var multidão API.getUsers = ();
                var msg = chat.message;
                argumento var = msg.substring (cmd.length + 1) .replace (/ @ / g, '');
                var Randomuser = Math.floor (Math.random () * crowd.length);
                var randomBall = Math.floor (Math.random () * basicBot.chat.balls.length);
                var randomSentence = Math.floor (Math.random () * 1);
                API.sendChat (subChat (basicBot.chat.ball, {name: chat.un, botname: basicBot.settings.botName, pergunta: argumento, a resposta: basicBot.chat.balls [randomBall]}));
              }
            }
          },

          banCommand: {
            comando: "proibição",
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substr (cmd.length + 2);
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                API.moderateBanUser (user.id, 1, API.BAN.DAY);
              }
            }
          },

          {: blacklistCommand
            comando: ['lista negra', 'bl'],
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nolistspecified, {name: chat.un}));
                lista var = msg.substr (cmd.length + 1);
                if (typeof basicBot.room.blacklists [lista] === 'indefinido') API.sendChat retorno (subChat (basicBot.chat.invalidlistspecified, {name: chat.un}));
                outro {
                  var media = API.getMedia ();
                  var timeleft = API.getTimeRemaining ();
                  var timeElapsed API.getTimeElapsed = ();
                  var pista = {
                    lista: lista,
                    autor: media.author,
                    Título: media.title,
                    mid: media.format + ':' + media.cid
                  };
                  basicBot.room.newBlacklisted.push (pista);
                  basicBot.room.blacklists [lista] .faça pressão sobre (media.format + ':' + media.cid);
                  API.sendChat (subChat (basicBot.chat.newblacklisted, {name: chat.un, lista negra: lista, autor: media.author, título: media.title, mid: media.format + ':' + media.cid}) );
                  if (basicBot.settings.smartSkip && timeleft> timeElapsed) {
                    basicBot.roomUtilities.smartSkip ();
                  }
                  outro {
                    API.moderateForceSkip ();
                  }
                  if (typeof "função" basicBot.room.newBlacklistedSongFunction ===) {
                    basicBot.room.newBlacklistedSongFunction (pista);
                  }
                }
              }
            }
          },

          blinfoCommand: {
            comando: 'blinfo',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var author = API.getMedia () autor.;
                . title = var API.getMedia () título;
                var name = chat.un;
                . formato var = API.getMedia () formato;
                var cid = API.getMedia () cid.;
                var MotoID = formato + ":" + cid;

                API.sendChat (subChat (basicBot.chat.blinfo, {name: nome, do autor: autor, título: título, MotoID: MotoID}));
              }
            }
          },

          bouncerPlusCommand: {
            comando: 'bouncer +',
            classificação: 'manager',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                se (basicBot.settings.bouncerPlus) {
                  basicBot.settings.bouncerPlus = false;
                  retorno API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': 'Bouncer +'}));
                }
                outro {
                  se (basicBot.settings.bouncerPlus!) {
                    id = var chat.uid;
                    var perm = basicBot.userUtilities.getPermission (id);
                    se (perm 2>) {
                      basicBot.settings.bouncerPlus = true;
                      retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': 'Bouncer +'}));
                    }
                  }
                  mais API.sendChat retorno (subChat (basicBot.chat.bouncerplusrank, {name: chat.un}));
                }
              }
            }
          },

          {: botnameCommand
            comando: 'botname',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) retorno API.sendChat (subChat (basicBot.chat.currentbotname, {botname: basicBot.settings.botName}));
                argumento var = msg.substring (cmd.length + 1);
                if (argumento) {
                  basicBot.settings.botName = argumento;
                  API.sendChat (subChat (basicBot.chat.botnameset, {botname: basicBot.settings.botName}));
                }
              }
            }
          },

          clearchatCommand: {
            comando: 'CLEARCHAT',
            classificação: 'manager',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var currentchat = $ ('# chat-mensagens') crianças (.);
                for (var i = 0; i <currentchat.length; i ++) {
                  API.moderateDeleteChat (currentchat [i] .getAttribute ("data-cid"));
                }
                retornar API.sendChat (subChat (basicBot.chat.chatcleared, {name: chat.un}));
              }
            }
          },

          commandsCommand: {
            comando: 'comandos',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat (subChat (basicBot.chat.commandslink, {botname: basicBot.settings.botName, link: basicBot.cmdLink}));
              }
            }
          },

          cmddeletionCommand: {
            comando: ['commanddeletion', 'cmddeletion', 'cmddel'],
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.cmdDeletion) {
                  basicBot.settings.cmdDeletion = basicBot.settings.cmdDeletion!;
                  API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.cmddeletion}));
                }
                outro {
                  basicBot.settings.cmdDeletion = basicBot.settings.cmdDeletion!;
                  API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.cmddeletion}));
                }
              }
            }
          },

          cookieCommand: {
            comando: 'cookie',
            classificação: 'usuário',
            digite: 'startsWith',
            GetCookie: function (chat) {
              var c = Math.floor (Math.random () * basicBot.chat.cookies.length);
              retornam basicBot.chat.cookies [C];
            },
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;

                espaço var = msg.indexOf ('');
                se (espaço === -1) {
                  API.sendChat (basicBot.chat.eatcookie);
                  return false;
                }
                outro {
                  var name = msg.substring (espaço + 2);
                  usuário var = basicBot.userUtilities.lookupUserName (nome);
                  if (usuário falso === ||! user.inRoom) {
                    retornar API.sendChat (subChat (basicBot.chat.nousercookie, {name: name}));
                  }
                  else if (user.username === chat.un) {
                    retornar API.sendChat (subChat (basicBot.chat.selfcookie, {name: name}));
                  }
                  outro {
                    retornar API.sendChat (subChat (basicBot.chat.cookie, {nameto: user.username, namefrom: chat.un, biscoito: this.getCookie ()}));
                  }
                }
              }
            }
          },

          cycleCommand: {
            comando: 'ciclo',
            classificação: 'manager',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                basicBot.roomUtilities.changeDJCycle ();
              }
            }
          },

          cycleguardCommand: {
            comando: 'CycleGuard',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.cycleGuard) {
                  basicBot.settings.cycleGuard = basicBot.settings.cycleGuard!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.cycleguard}));
                }
                outro {
                  basicBot.settings.cycleGuard = basicBot.settings.cycleGuard!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.cycleguard}));
                }

              }
            }
          },

          cycletimerCommand: {
            comando: 'cycletimer',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var CycleTime = msg.substring (cmd.length + 1);
                if (! isNaN (CycleTime) && CycleTime! == "") {
                  basicBot.settings.maximumCycletime = CycleTime;
                  retornar API.sendChat (subChat (basicBot.chat.cycleguardtime, {name: chat.un, tempo: basicBot.settings.maximumCycletime}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.invalidtime, {name: chat.un}));

              }
            }
          },

          dclookupCommand: {
            comando: ['dclookup', 'dc'],
            classificação: 'usuário',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var nome;
                if (msg.length === cmd.length) name = chat.un;
                outro {
                  name = msg.substring (cmd.length + 2);
                  var perm = basicBot.userUtilities.getPermission (chat.uid);
                  if (perm <2) API.sendChat retorno (subChat (basicBot.chat.dclookuprank, {name: chat.un}));
                }
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                var toChat = basicBot.userUtilities.dclookup (user.id);
                API.sendChat (toChat);
              }
            }
          },

          / * DeletechatCommand: {
          comando: 'deletechat',
          classificação: 'mod',
          digite: 'startsWith',
          funcionalidade: function (bate-papo, cmd) {
          if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
          (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
          outro {
          var msg = chat.message;
          if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
          var name = msg.substring (cmd.length + 2);
          usuário var = basicBot.userUtilities.lookupUserName (nome);
          if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
          var chats = $ ('a partir.');
          mensagem var = $ ('. mensagem');
          var emote = $ ('emocionar.');
          var from = $ ('un.clickable.');
          for (var i = 0; i <chats.length; i ++) {
          n = var a partir de [i] .textContent;
          se (name.trim () === n.trim ()) {

          // Var messagecid = $ (mensagem) [i] .getAttribute ('data-cid');
          // Var emotecid = $ (emote) [i] .getAttribute ('data-cid');
          // API.moderateDeleteChat (messagecid);

          // Tentar {
          // API.moderateDeleteChat (messagecid);
          //}
          // Finalmente {
          // API.moderateDeleteChat (emotecid);
          //}

          if (typeof $ (mensagem) [i] .getAttribute ('data-cid ") ==" undefined ") {
          API.moderateDeleteChat ($ (emote) [i] .getAttribute ('data-cid')); // Funciona bem com mensagens normais, mas não com emotes devido a emotes e mensagens são separados.
          } Outro {
          API.moderateDeleteChat ($ (mensagem) [i] .getAttribute ('data-cid'));
          }
          }
          }
          API.sendChat (subChat (basicBot.chat.deletechat, {name: chat.un, nome de usuário: nome}));
          }
          }
          }, * /

          emojiCommand: {
            comando: "emoji",
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                ligação var = 'http://www.emoji-cheat-sheet.com/';
                API.sendChat (subChat (basicBot.chat.emojilist, {link: link}));
              }
            }
          },

          englishCommand: {
            comando: 'Inglês',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (chat.message.length === cmd.length) return API.sendChat ('/ me Nenhum usuário especificado.');
                var name = chat.message.substring (cmd.length + 2);
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') return API.sendChat ('/ me usuário inválido especificado.');
                var lang = basicBot.userUtilities.getUser (usuário) .language;
                var ch = '/ me @' + nome + '';
                switch (lang) {
                  caso 'en': break;
                  caso 'da': ch + = 'Vær venlig no conto engelsk.'; parar;
                  caso 'de': ch + = "Bitte sprechen Sie Englisch. '; parar;
                  caso «ES»: ch + = '. Por favor, hable Inglés'; parar;
                  caso 'fr': ch + = "Parlez anglais, s \ 'il vous plaît.'; parar;
                  caso 'nl': ch + = 'Spreek Engels, alstublieft.'; parar;
                  caso 'pl': ch + = 'prosze mówić po angielsku.'; parar;
                  caso 'pt': ch + =; 'Por favor, fale Inglês.' parar;
                  caso 'sk': ch + = 'Hovorte po anglicky, prosím.'; parar;
                  caso 'cs': ch + = 'Mluvte prosím anglicky.'; parar;
                  caso 'sr': ch + = 'Молим Вас, говорите енглески.'; parar;
                }
                ch + = 'Inglês, por favor.';
                API.sendChat (ch);
              }
            }
          },

          etaCommand: {
            comando: 'eta',
            classificação: 'usuário',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var perm = basicBot.userUtilities.getPermission (chat.uid);
                var msg = chat.message;
                var dj = API.getDJ () username.;
                var nome;
                se (msg.length> cmd.length) {
                  if (perm <2) vazio retorno (0);
                  name = msg.substring (cmd.length + 2);
                } Else name = chat.un;
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                var pos = API.getWaitListPosition (user.id);
                var RealPOS = pos + 1;
                if (nome == dj) API.sendChat retorno (subChat (basicBot.chat.youaredj, {name: name}));
                if (pos <0) return API.sendChat (subChat (basicBot.chat.notinwaitlist, {name: name}));
                if (pos == 0) API.sendChat retorno (subChat (basicBot.chat.youarenext, {name: name}));
                var timeRemaining API.getTimeRemaining = ();
                estimateMS var = ((pos + 1) * 4 * 60 + timeRemaining) * 1000;
                var estimateString = basicBot.roomUtilities.msToStr (estimateMS);
                API.sendChat (subChat (basicBot.chat.eta, {name: nome, tempo: estimateString, posição: RealPOS}));
              }
            }
          },

          fbCommand: {
            comando: FB ',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (typeof basicBot.settings.fbLink === "string")
                API.sendChat (subChat (basicBot.chat.facebook, {link: basicBot.settings.fbLink}));
              }
            }
          },

          filterCommand: {
            comando: 'filtro',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.filterChat) {
                  ! basicBot.settings.filterChat = basicBot.settings.filterChat;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.chatfilter}));
                }
                outro {
                  ! basicBot.settings.filterChat = basicBot.settings.filterChat;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.chatfilter}));
                }
              }
            }
          },

          forceskipCommand: {
            comando: ['forceskip', 'fs'],
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat (subChat (basicBot.chat.forceskip, {name: chat.un}));
                API.moderateForceSkip ();
                basicBot.room.skippable = false;
                setTimeout (function () {
                  basicBot.room.skippable = true
                }, 5 * 1000);

              }
            }
          },

          ghostbusterCommand: {
            comando: 'ghostbuster',
            classificação: 'usuário',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var nome;
                if (msg.length === cmd.length) name = chat.un;
                outro {
                  name = msg.substr (cmd.length + 2);
                }
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (usuário falso === ||! user.inRoom) {
                  retornar API.sendChat (subChat (basicBot.chat.ghosting, {nome1: chat.un, name2: name}));
                }
                mais API.sendChat (subChat (basicBot.chat.notghosting, {nome1: chat.un, name2: name}));
              }
            }
          },

          gifCommand: {
            comando: ['gif', 'giphy'],
            classificação: 'usuário',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                se (msg.length! == cmd.length) {
                  função get_id (api_key, fixedtag, func)
                  {
                    $ .getJSON (
                      "Https://tv.giphy.com/v1/gifs/random?",
                      {
                        "Formatar": "json",
                        "Api_key": api_key,
                        "Rating": classificação,
                        "Tag": fixedtag
                      },
                      function (response)
                      {
                        func (response.data.id);
                      }
                    )
                  }
                  var api_key = "dc6zaTOxFJmzC"; // Chave beta público
                  Classificação var = "PG-13"; // PG 13 gifs
                  tag var = msg.substr (cmd.length + 1);
                  var fixedtag = tag.replace (/ / g, "+");
                  var commatag = tag.replace (/ / g, ",");
                  get_id (api_key, tag, função (id) {
                    if (typeof id! == 'indefinido') {
                      API.sendChat (subChat (basicBot.chat.validgiftags, {name: chat.un, id: id, tags: commatag}));
                    } Outro {
                      API.sendChat (subChat (basicBot.chat.invalidgiftags, {name: chat.un, tags: commatag}));
                    }
                  });
                }
                outro {
                  função get_random_id (api_key, func)
                  {
                    $ .getJSON (
                      "Https://tv.giphy.com/v1/gifs/random?",
                      {
                        "Formatar": "json",
                        "Api_key": api_key,
                        "Rating": classificação
                      },
                      function (response)
                      {
                        func (response.data.id);
                      }
                    )
                  }
                  var api_key = "dc6zaTOxFJmzC"; // Chave beta público
                  Classificação var = "PG-13"; // PG 13 gifs
                  get_random_id (api_key, função (id) {
                    if (typeof id! == 'indefinido') {
                      API.sendChat (subChat (basicBot.chat.validgifrandom, {name: chat.un, id: id}));
                    } Outro {
                      API.sendChat (subChat (basicBot.chat.invalidgifrandom, {name: chat.un}));
                    }
                  });
                }
              }
            }
          },

          HelpCommand: {
            comando: 'ajuda',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                ligação var = "(link Atualizado em breve)";
                API.sendChat (subChat (basicBot.chat.starterhelp, {link: link}));
              }
            }
          },

          Hist oryskipCommand: {
            comando: 'historyskip',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.historySkip) {
                  basicBot.settings.historySkip = basicBot.settings.historySkip!;
                  API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.historyskip}));
                }
                outro {
                  basicBot.settings.historySkip = basicBot.settings.historySkip!;
                  API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.historyskip}));
                }
              }
            }
          },

          joinCommand: {
            comando: 'juntar',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (basicBot.room.roulette.rouletteStatus && basicBot.room.roulette.participants.indexOf (chat.uid) <0) {
                  basicBot.room.roulette.participants.push (chat.uid);
                  API.sendChat (subChat (basicBot.chat.roulettejoin, {name: chat.un}));
                }
              }
            }
          },

          jointimeCommand: {
            comando: 'jointime',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring (cmd.length + 2);
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                var join = basicBot.userUtilities.getJointime (usuário);
                var tempo = Date.now () - participar;
                var TimeString = basicBot.roomUtilities.msToStr (tempo);
                API.sendChat (subChat (basicBot.chat.jointime, {namefrom: chat.un, nome de usuário: nome, tempo: TimeString}));
              }
            }
          },

          kickCommand: {
            comando: 'chute',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var lastSpace msg.lastIndexOf = ('');
                var tempo;
                var nome;
                se (lastSpace === msg.indexOf ('')) {
                  tempo = 0,25;
                  name = msg.substring (cmd.length + 2);
                }
                outro {
                  tempo = msg.substring (lastSpace + 1);
                  name = msg.substring (cmd.length + 2, lastSpace);
                }

                usuário var = basicBot.userUtilities.lookupUserName (nome);
                var from = chat.un;
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));

                var permFrom = basicBot.userUtilities.getPermission (chat.uid);
                var permTokick = basicBot.userUtilities.getPermission (user.id);

                if (permFrom <= permTokick)
                retornar API.sendChat (subChat (basicBot.chat.kickrank, {name: chat.un}));

                if (! isNaN (tempo)) {
                  API.sendChat (subChat (basicBot.chat.kick, {name: chat.un, nome de usuário: nome, tempo: time}));
                  if (hora> 24 * 60 * 60) API.moderateBanUser (user.id, 1, API.BAN.PERMA);
                  mais API.moderateBanUser (user.id, 1, API.BAN.DAY);
                  setTimeout (function (id, nome) {
                    API.moderateUnbanUser (id);
                    console.log ('. (' 'Unbanned @' + nome + + ID + ')');
                  }, O tempo * 60 * 1000, user.id, nome);
                }
                mais API.sendChat (subChat (basicBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          killCommand: {
            comando: 'matar',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                storeToStorage ();
                sendToSocket ();
                API.sendChat (basicBot.chat.kill);
                basicBot.disconnectAPI ();
                setTimeout (function () {
                  matar ();
                }, 1000);
              }
            }
          },

          languageCommand: {
            comando: 'linguagem',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) retorno API.sendChat (subChat (basicBot.chat.currentlang, {language: basicBot.settings.language}));
                argumento var = msg.substring (cmd.length + 1);

                $ .get ("https://rawgit.com/Yemasthui/basicBot/master/lang/pt-BR.json", function (JSON) {
                  var langIndex = json;
                  ligação var = langIndex [argument.toLowerCase ()];
                  if (typeof ligação === "undefined") {
                    API.sendChat (subChat (basicBot.chat.langerror, {link: "http://git.io/vJ9nI"}));
                  }
                  outro {
                    basicBot.settings.language = argumento;
                    loadChat ();
                    API.sendChat (subChat (basicBot.chat.langset, {language: basicBot.settings.language}));
                  }
                });
              }
            }
          },

          leaveCommand: {
            comando: 'sair',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var ind = basicBot.room.roulette.participants.indexOf (chat.uid);
                se (ind> -1) {
                  basicBot.room.roulette.participants.splice (IND, 1);
                  API.sendChat (subChat (basicBot.chat.rouletteleave, {name: chat.un}));
                }
              }
            }
          },

          linkCommand: {
            comando: 'link',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var media = API.getMedia ();
                var from = chat.un;
                usuário var = basicBot.userUtilities.lookupUser (chat.uid);
                var perm = basicBot.userUtilities.getPermission (chat.uid);
                var dj = API.getDJ () id.;
                var isDj = false;
                if (dj === chat.uid) isDj = true;
                if (perm> = 1 || isDj) {
                  se (media.format === 1) {
                    var linkToSong = "http://youtu.be/" + media.cid;
                    API.sendChat (subChat (basicBot.chat.songlink, {name: de, link: linkToSong}));
                  }
                  se (media.format === 2) {
                    SC.get ('/ faixas /' + media.cid, função (som) {
                      API.sendChat (subChat (basicBot.chat.songlink, {name: de, link: sound.permalink_url}));
                    });
                  }
                }
              }
            }
          },

          lockCommand: {
            comando: 'bloquear',
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                basicBot.roomUtilities.booth.lockBooth ();
              }
            }
          },

          lockdownCommand: {
            comando: 'bloqueio',
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var temp = basicBot.settings.lockdownEnabled;
                ! basicBot.settings.lockdownEnabled = temperatura;
                se (basicBot.settings.lockdownEnabled) {
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.lockdown}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.lockdown}));
              }
            }
          },

          lockguardCommand: {
            comando: 'LockGuard',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.lockGuard) {
                  basicBot.settings.lockGuard = basicBot.settings.lockGuard!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.lockguard}));
                }
                outro {
                  basicBot.settings.lockGuard = basicBot.settings.lockGuard!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.lockguard}));
                }
              }
            }
          },

          lockskipCommand: {
            comando: 'lockskip',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.room.skippable) {
                  var dj = API.getDJ ();
                  id = var dj.id;
                  var name = dj.username;
                  var msgSend = '@' + nome + ':';
                  basicBot.room.queueable = false;

                  se (chat.message.length === cmd.length) {
                    API.sendChat (subChat (basicBot.chat.usedlockskip, {name: chat.un}));
                    basicBot.roomUtilities.booth.lockBooth ();
                    setTimeout (function (id) {
                      API.moderateForceSkip ();
                      basicBot.room.skippable = false;
                      setTimeout (function () {
                        basicBot.room.skippable = true
                      }, 5 * 1000);
                      setTimeout (function (id) {
                        basicBot.userUtilities.moveUser (id, basicBot.settings.lockskipPosition, false);
                        basicBot.room.queueable = true;
                        setTimeout (function () {
                          basicBot.roomUtilities.booth.unlockBooth ();
                        }, 1000);
                      }, 1500, id);
                    }, 1000, id);
                    retorno void (0);
                  }
                  var validReason = false;
                  var msg = chat.message;
                  var razão = msg.substring (cmd.length + 1);
                  for (var i = 0; i <basicBot.settings.lockskipReasons.length; i ++) {
                    var r = basicBot.settings.lockskipReasons [i] [0];
                    se (reason.indexOf (R)! == -1) {
                      validReason = true;
                      msgSend + = basicBot.settings.lockskipReasons [i] [1];
                    }
                  }
                  se (validReason) {
                    API.sendChat (subChat (basicBot.chat.usedlockskip, {name: chat.un}));
                    basicBot.roomUtilities.booth.lockBooth ();
                    setTimeout (function (id) {
                      API.moderateForceSkip ();
                      basicBot.room.skippable = false;
                      API.sendChat (msgSend);
                      setTimeout (function () {
                        basicBot.room.skippable = true
                      }, 5 * 1000);
                      setTimeout (function (id) {
                        basicBot.userUtilities.moveUser (id, basicBot.settings.lockskipPosition, false);
                        basicBot.room.queueable = true;
                        setTimeout (function () {
                          basicBot.roomUtilities.booth.unlockBooth ();
                        }, 1000);
                      }, 1500, id);
                    }, 1000, id);
                    retorno void (0);
                  }
                }
              }
            }
          },

          locktimerCommand: {
            comando: 'locktimer',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var locktime = msg.substring (cmd.length + 1);
                if (! isNaN (locktime) && locktime! == "") {
                  basicBot.settings.maximumLocktime = locktime;
                  retornar API.sendChat (subChat (basicBot.chat.lockguardtime, {name: chat.un, tempo: basicBot.settings.maximumLocktime}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          logoutCommand: {
            comando: 'Sair',
            classificação: 'manager',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat (subChat (basicBot.chat.logout, {name: chat.un, botname: basicBot.settings.botName}));
                setTimeout (function () {
                  $ (". Logout"). Mousedown ()
                }, 1000);
              }
            }
          },

          maxlengthCommand: {
            comando: "maxlength",
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var MaxTime = msg.substring (cmd.length + 1);
                if (! isNaN (MaxTime)) {
                  basicBot.settings.maximumSongLength = MaxTime;
                  retornar API.sendChat (subChat (basicBot.chat.maxlengthtime, {name: chat.un, tempo: basicBot.settings.maximumSongLength}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          motdCommand: {
            comando: 'motd',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) API.sendChat retorno ('/ motd me:' + basicBot.settings.motd);
                argumento var = msg.substring (cmd.length + 1);
                se basicBot.settings.motdEnabled = basicBot.settings.motdEnabled (basicBot.settings.motdEnabled!!);
                if (isNaN (argumento)) {
                  basicBot.settings.motd = argumento;
                  API.sendChat (subChat (basicBot.chat.motdset, {msg: basicBot.settings.motd}));
                }
                outro {
                  basicBot.settings.motdInterval = argumento;
                  API.sendChat (subChat (basicBot.chat.motdintervalset, {intervalo: basicBot.settings.motdInterval}));
                }
              }
            }
          },

          moveCommand: {
            comando: 'move',
            classificação: 'mod',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var firstSpace msg.indexOf = ('');
                var lastSpace msg.lastIndexOf = ('');
                pos var;
                var nome;
                se (isNaN (parselnt (msg.substring (lastSpace + 1)))) {
                  pos = 1;
                  name = msg.substring (cmd.length + 2);
                }
                outro {
                  pos = parseInt (msg.substring (lastSpace + 1));
                  name = msg.substring (cmd.length + 2, lastSpace);
                }
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                if (user.id === basicBot.loggedInID) API.sendChat retorno (subChat (basicBot.chat.addbotwaitlist, {name: chat.un}));
                if (! isNaN (pos)) {
                  API.sendChat (subChat (basicBot.chat.move, {name: chat.un}));
                  basicBot.userUtilities.moveUser (user.id, pos, false);
                } Else API.sendChat retorno (subChat (basicBot.chat.invalidpositionspecified, {name: chat.un}));
              }
            }
          },

          muteCommand: {
            comando: 'mute',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var lastSpace msg.lastIndexOf = ('');
                var tempo = null;
                var nome;
                se (lastSpace === msg.indexOf ('')) {
                  name = msg.substring (cmd.length + 2);
                  tempo = 45;
                }
                outro {
                  tempo = msg.substring (lastSpace + 1);
                  if (isNaN (tempo) || tempo == "" || tempo == null || typeof tempo == "undefined") {
                    retornar API.sendChat (subChat (basicBot.chat.invalidtime, {name: chat.un}));
                  }
                  name = msg.substring (cmd.length + 2, lastSpace);
                }
                var from = chat.un;
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                var permFrom = basicBot.userUtilities.getPermission (chat.uid);
                var permUser = basicBot.userUtilities.getPermission (user.id);
                se (permFrom> permUser) {
                  / *
                  basicBot.room.mutedUsers.push (user.id);
                  if (tempo === null) API.sendChat (subChat (basicBot.chat.mutednotime, {name: chat.un, nome de usuário: nome}));
                  outro {
                  API.sendChat (subChat (basicBot.chat.mutedtime, {name: chat.un, nome de usuário: nome, tempo: time}));
                  setTimeout (function (id) {
                  var silenciado = basicBot.room.mutedUsers;
                  var wasMuted = false;
                  var indexMuted = -1;
                  for (var i = 0; i <muted.length; i ++) {
                  if (silenciado id [i] ===) {
                  indexMuted = i;
                  wasMuted = true;
                  }
                  }
                  se (indexMuted> -1) {
                  basicBot.room.mutedUsers.splice (indexMuted);
                  var u = basicBot.userUtilities.lookupUser (id);
                  var name = u.username;
                  API.sendChat (subChat (basicBot.chat.unmuted, {name: chat.un, nome de usuário: nome}));
                  }
                  }, Tempo * 60 * 1000, user.id);
                  }
                  * /
                  if (hora> 45) {
                    API.sendChat (subChat (basicBot.chat.mutedmaxtime, {name: chat.un, o tempo: "45"}));
                    API.moderateMuteUser (user.id, 1, API.MUTE.LONG);
                  }
                  else if (tempo === 45) {
                    API.moderateMuteUser (user.id, 1, API.MUTE.LONG);
                    API.sendChat (subChat (basicBot.chat.mutedtime, {name: chat.un, nome de usuário: nome, tempo: time}));

                  }
                  else if (hora> 30) {
                    API.moderateMuteUser (user.id, 1, API.MUTE.LONG);
                    API.sendChat (subChat (basicBot.chat.mutedtime, {name: chat.un, nome de usuário: nome, tempo: time}));
                    setTimeout (function (id) {
                      API.moderateUnmuteUser (id);
                    }, Tempo * 60 * 1000, user.id);
                  }
                  else if (hora> 15) {
                    API.moderateMuteUser (user.id, 1, API.MUTE.MEDIUM);
                    API.sendChat (subChat (basicBot.chat.mutedtime, {name: chat.un, nome de usuário: nome, tempo: time}));
                    setTimeout (function (id) {
                      API.moderateUnmuteUser (id);
                    }, Tempo * 60 * 1000, user.id);
                  }
                  outro {
                    API.moderateMuteUser (user.id, 1, API.MUTE.SHORT);
                    API.sendChat (subChat (basicBot.chat.mutedtime, {name: chat.un, nome de usuário: nome, tempo: time}));
                    setTimeout (function (id) {
                      API.moderateUnmuteUser (id);
                    }, Tempo * 60 * 1000, user.id);
                  }
                }
                mais API.sendChat (subChat (basicBot.chat.muterank, {name: chat.un}));
              }
            }
          },

          {: opCommand
            comando: 'op',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (typeof basicBot.settings.opLink === "string")
                retornar API.sendChat (subChat (basicBot.chat.oplist, {link: basicBot.settings.opLink}));
              }
            }
          },

          pingCommand: {
            comando: 'ping',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat (basicBot.chat.pong)
              }
            }
          },

          refreshCommand: {
            comando: 'refresh',
            classificação: 'manager',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                sendToSocket ();
                storeToStorage ();
                basicBot.disconnectAPI ();
                setTimeout (function () {
                  window.location.reload (false);
                }, 1000);

              }
            }
          },

          reloadCommand: {
            comando: 'recarregar',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat (basicBot.chat.reload);
                sendToSocket ();
                storeToStorage ();
                basicBot.disconnectAPI ();
                matar ();
                setTimeout (function () {
                  $ .getScript (BasicBot.scriptLink);
                }, 2000);
              }
            }
          },

          removeCommand: {
            comando: "remover",
            classificação: 'mod',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                se (msg.length> cmd.length + 2) {
                  var name = msg.substr (cmd.length + 2);
                  usuário var = basicBot.userUtilities.lookupUserName (nome);
                  if (typeof usuário! == 'booleano') {
                    user.lastDC = {
                      tempo: nulo,
                      posição: null,
                      songCount: 0
                    };
                    if (API.getDJ (). id === user.id) {
                      API.moderateForceSkip ();
                      setTimeout (function () {
                        API.moderateRemoveDJ (user.id);
                      }, 1 * 1000, do usuário);
                    }
                    mais API.moderateRemoveDJ (user.id);
                  } Else API.sendChat (subChat (basicBot.chat.removenotinwl, {name: chat.un, nome de usuário: nome}));
                } Else API.sendChat (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
              }
            }
          },

          restrictetaCommand: {
            comando: 'restricteta',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.etaRestriction) {
                  basicBot.settings.etaRestriction = basicBot.settings.etaRestriction!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.etarestriction}));
                }
                outro {
                  basicBot.settings.etaRestriction = basicBot.settings.etaRestriction!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.etarestriction}));
                }
              }
            }
          },

          rouletteCommand: {
            comando: 'roulette',
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.room.roulette.rouletteStatus!) {
                  basicBot.room.roulette.startRoulette ();
                }
              }
            }
          },

          rulesCommand: {
            comando: 'regras',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (typeof basicBot.settings.rulesLink === "string")
                retornar API.sendChat (subChat (basicBot.chat.roomrules, {link: basicBot.settings.rulesLink}));
              }
            }
          },

          sessionstatsCommand: {
            comando: 'sessionstats',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var from = chat.un;
                woots var = basicBot.room.roomstats.totalWoots;
                mehs var = basicBot.room.roomstats.totalMehs;
                var agarra = basicBot.room.roomstats.totalCurates;
                API.sendChat (subChat (basicBot.chat.sessionstats, {name: de, woots: woots, mehs: mehs, agarra agarra:}));
              }
            }
          },

          skipCommand: {
            comando: ['pular', 'smartskip'],
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.room.skippable) {

                  var timeleft = API.getTimeRemaining ();
                  var timeElapsed API.getTimeElapsed = ();
                  var dj = API.getDJ ();
                  var name = dj.username;
                  var msgSend = '@' + nome + ',';

                  se (chat.message.length === cmd.length) {
                    API.sendChat (subChat (basicBot.chat.usedskip, {name: chat.un}));
                    if (basicBot.settings.smartSkip && timeleft> timeElapsed) {
                      basicBot.roomUtilities.smartSkip ();
                    }
                    outro {
                      API.moderateForceSkip ();
                    }
                  }
                  var validReason = false;
                  var msg = chat.message;
                  var razão = msg.substring (cmd.length + 1);
                  for (var i = 0; i <basicBot.settings.skipReasons.length; i ++) {
                    var r = basicBot.settings.skipReasons [i] [0];
                    se (reason.indexOf (R)! == -1) {
                      validReason = true;
                      msgSend + = basicBot.settings.skipReasons [i] [1];
                    }
                  }
                  se (validReason) {
                    API.sendChat (subChat (basicBot.chat.usedskip, {name: chat.un}));
                    if (basicBot.settings.smartSkip && timeleft> timeElapsed) {
                      basicBot.roomUtilities.smartSkip (msgSend);
                    }
                    outro {
                      API.moderateForceSkip ();
                      setTimeout (function () {
                        API.sendChat (msgSend);
                      }, 500);
                    }
                  }
                }
              }
            }
          },

          skipposCommand: {
            comando: 'skippos',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var pos = msg.substring (cmd.length + 1);
                if (! isNaN (pos)) {
                  basicBot.settings.skipPosition = pos;
                  retornar API.sendChat (subChat (basicBot.chat.skippos, {name: chat.un, posição: basicBot.settings.skipPosition}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.invalidpositionspecified, {name: chat.un}));
              }
            }
          },

          songstatsCommand: {
            comando: 'songstats',
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (basicBot.settings.songstats) {
                  ! basicBot.settings.songstats = basicBot.settings.songstats;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.songstats}));
                }
                outro {
                  ! basicBot.settings.songstats = basicBot.settings.songstats;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.songstats}));
                }
              }
            }
          },

          sourceCommand: {
            comando: 'fonte',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                API.sendChat ('/ me Este bot foi criado por' + botCreator + ', mas agora é mantido por' + botMaintainer + ".");
              }
            }
          },

          statusCommand: {
            comando: 'status',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var from = chat.un;
                var msg = '[@' + de + ']';

                msg + = basicBot.chat.afkremoval + ':';
                if (basicBot.settings.afkRemoval) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';
                msg + = basicBot.chat.afksremoved + ":" + basicBot.room.afkList.length + '. ';
                msg + = basicBot.chat.afklimit + ':' + basicBot.settings.maximumAfk + '. ';

                msg + = 'Bouncer +:';
                if (basicBot.settings.bouncerPlus) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.blacklist + ':';
                if (basicBot.settings.blacklistEnabled) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.lockguard + ':';
                if (basicBot.settings.lockGuard) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.cycleguard + ':';
                if (basicBot.settings.cycleGuard) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.timeguard + ':';
                if (basicBot.settings.timeGuard) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.chatfilter + ':';
                if (basicBot.settings.filterChat) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.historyskip + ':';
                if (basicBot.settings.historySkip) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.voteskip + ':';
                if (basicBot.settings.voteSkip) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.cmddeletion + ':';
                if (basicBot.settings.cmdDeletion) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                msg + = basicBot.chat.autoskip + ':';
                if (basicBot.settings.autoskip) msg ​​+ = 'ON';
                mais msg + = "OFF";
                msg + = '. ';

                // TODO: Mostrar configurações bot mais toggleable.

                var launchT = basicBot.room.roomstats.launchTime;
                var durationOnline = Date.now () - launchT;
                var desde basicBot.roomUtilities.msToStr = (durationOnline);
                msg + = subChat (basicBot.chat.activefor, {tempo: desde});

                / *
                // Maneira menos eficiente de fazer isso, mas funciona :)
                se (msg.length> 256) {
                firstpart msg.substr = (0, 256);
                secondpart = msg.substr (256);
                API.sendChat (firstpart);
                setTimeout (function () {
                API.sendChat (secondpart);
                }, 300);
                }
                outro {
                API.sendChat (msg);
                }
                * /

                // Esta é uma solução mais eficiente
                se (msg.length> 241) {
                  var = msg.match divisão (/ {1241} / g.);
                  for (var i = 0; i <split.length; i ++) {
                    var func = function (índice) {
                      setTimeout (function () {
                        API.sendChat ("me /" + divisão [índice]);
                      }, 500 * índice);
                    }
                    func (i);
                  }
                }
                outro {
                  retornar API.sendChat (msg);
                }
              }
            }
          },

          swapCommand: {
            comando: 'swap ",
            classificação: 'mod',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var firstSpace msg.indexOf = ('');
                var lastSpace msg.lastIndexOf = ('');
                var name1 = msg.substring (cmd.length + 2, lastSpace);
                var name2 = msg.substring (lastSpace + 2);
                var = user1 basicBot.userUtilities.lookupUserName (name1);
                var = user2 basicBot.userUtilities.lookupUserName (name2);
                if (typeof user1 === 'booleano' || typeof user2 === 'booleano') API.sendChat retorno (subChat (basicBot.chat.swapinvalid, {name: chat.un}));
                if (user1.id === basicBot.loggedInID || user2.id === basicBot.loggedInID) return API.sendChat (subChat (basicBot.chat.addbottowaitlist, {name: chat.un}));
                var p1 = API.getWaitListPosition (user1.id) + 1;
                var p2 = API.getWaitListPosition (user2.id) + 1;
                if (p1 <0 || p2 <0) return API.sendChat (subChat (basicBot.chat.swapwlonly, {name: chat.un}));
                API.sendChat (subChat (basicBot.chat.swapping, {'name1': name1 ", name2 ': name2}));
                Se (P1 <P2) {
                  basicBot.userUtilities.moveUser (user2.id, p1, false);
                  setTimeout (function (user1, p2) {
                    basicBot.userUtilities.moveUser (user1.id, p2, false);
                  } De 2000, user1, p2);
                }
                outro {
                  basicBot.userUtilities.moveUser (user1.id, p2, false);
                  setTimeout (function (user2, p1) {
                    basicBot.userUtilities.moveUser (user2.id, p1, false);
                  } De 2000, user2, p1);
                }
              }
            }
          },

          themeCommand: {
            comando: "tema",
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (typeof basicBot.settings.themeLink === "string")
                API.sendChat (subChat (basicBot.chat.genres, {link: basicBot.settings.themeLink}));
              }
            }
          },

          timeguardCommand: {
            comando: 'TimeGuard',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.timeGuard) {
                  basicBot.settings.timeGuard = basicBot.settings.timeGuard!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.timeguard}));
                }
                outro {
                  basicBot.settings.timeGuard = basicBot.settings.timeGuard!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.timeguard}));
                }

              }
            }
          },

          toggleblCommand: {
            comando: 'togglebl',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var temp = basicBot.settings.blacklistEnabled;
                ! basicBot.settings.blacklistEnabled = temperatura;
                se (basicBot.settings.blacklistEnabled) {
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.blacklist}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.blacklist}));
              }
            }
          },

          togglemotdCommand: {
            comando: 'togglemotd',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.motdEnabled) {
                  basicBot.settings.motdEnabled = basicBot.settings.motdEnabled!;
                  API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.motd}));
                }
                outro {
                  basicBot.settings.motdEnabled = basicBot.settings.motdEnabled!;
                  API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.motd}));
                }
              }
            }
          },

          togglevoteskipCommand: {
            comando: 'togglevoteskip',
            classificação: "leão de chácara",
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.voteSkip) {
                  basicBot.settings.voteSkip = basicBot.settings.voteSkip!;
                  API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.voteskip}));
                }
                outro {
                  basicBot.settings.voteSkip = basicBot.settings.voteSkip!;
                  API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.voteskip}));
                }
              }
            }
          },

          unbanCommand: {
            comando: 'unban',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                $ ("Ícone populacional.") Clique em (.);
                $ ("Ícone-ban"). Click (.);
                setTimeout (function (chat) {
                  var msg = chat.message;
                  if (msg.length === cmd.length) API.sendChat retorno ();
                  var name = msg.substring (cmd.length + 2);
                  var bannedUsers API.getBannedUsers = ();
                  var found = false;
                  var bannedUser = null;
                  for (var i = 0; i <bannedUsers.length; i ++) {
                    usuário var = bannedUsers [i];
                    if (user.username === nome) {
                      bannedUser = usuário;
                      encontrado = true;
                    }
                  }
                  if (! found) {
                    . $ (". Icon-chat") clique ();
                    retornar API.sendChat (subChat (basicBot.chat.notbanned, {name: chat.un}));
                  }
                  API.moderateUnbanUser (bannedUser.id);
                  console.log ("Unbanned" + nome);
                  setTimeout (function () {
                    . $ (". Icon-chat") clique ();
                  }, 1000);
                }, 1000, chat);
              }
            }
          },

          unlockCommand: {
            comando: "desbloquear",
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                basicBot.roomUtilities.booth.unlockBooth ();
              }
            }
          },

          unmuteCommand: {
            comando: 'unmute',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var permFrom = basicBot.userUtilities.getPermission (chat.uid);
                / **
                if (msg.indexOf ("@") === -1 && msg.indexOf ('all')! == -1) {
                if (permFrom> 2) {
                basicBot.room.mutedUsers = [];
                retornar API.sendChat (subChat (basicBot.chat.unmutedeveryone, {name: chat.un}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.unmuteeveryonerank, {name: chat.un}));
                }
                ** /
                var from = chat.un;
                var name = msg.substr (cmd.length + 2);

                usuário var = basicBot.userUtilities.lookupUserName (nome);

                if (typeof usuário === 'booleano') API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));

                var permUser = basicBot.userUtilities.getPermission (user.id);
                se (permFrom> permUser) {
                  / *
                  var silenciado = basicBot.room.mutedUsers;
                  var wasMuted = false;
                  var indexMuted = -1;
                  for (var i = 0; i <muted.length; i ++) {
                  if (silenciado [i] === user.id) {
                  indexMuted = i;
                  wasMuted = true;
                  }

                  }
                  if (wasMuted!) return API.sendChat (subChat (basicBot.chat.notmuted, {name: chat.un}));
                  basicBot.room.mutedUsers.splice (indexMuted);
                  API.sendChat (subChat (basicBot.chat.unmuted, {name: chat.un, nome de usuário: nome}));
                  * /
                  tentar {
                    API.moderateUnmuteUser (user.id);
                    API.sendChat (subChat (basicBot.chat.unmuted, {name: chat.un, nome de usuário: nome}));
                  }
                  catch (e) {
                    API.sendChat (subChat (basicBot.chat.notmuted, {name: chat.un}));
                  }
                }
                mais API.sendChat (subChat (basicBot.chat.unmuterank, {name: chat.un}));
              }
            }
          },

          usercmdcdCommand: {
            comando: 'usercmdcd',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var cd = msg.substring (cmd.length + 1);
                if (! isNaN (cd)) {
                  basicBot.settings.commandCooldown = cd;
                  retornar API.sendChat (subChat (basicBot.chat.commandscd, {name: chat.un, tempo: basicBot.settings.commandCooldown}));
                }
                mais API.sendChat retorno (subChat (basicBot.chat.invalidtime, {name: chat.un}));
              }
            }
          },

          usercommandsCommand: {
            comando: 'usercommands',
            classificação: 'manager',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.usercommandsEnabled) {
                  API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.usercommands}));
                  basicBot.settings.usercommandsEnabled = basicBot.settings.usercommandsEnabled!;
                }
                outro {
                  API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.usercommands}));
                  basicBot.settings.usercommandsEnabled = basicBot.settings.usercommandsEnabled!;
                }
              }
            }
          },

          voteratioCommand: {
            comando: 'voteratio',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length === cmd.length) API.sendChat retorno (subChat (basicBot.chat.nouserspecified, {name: chat.un}));
                var name = msg.substring (cmd.length + 2);
                usuário var = basicBot.userUtilities.lookupUserName (nome);
                if (usuário === false) API.sendChat retorno (subChat (basicBot.chat.invaliduserspecified, {name: chat.un}));
                var vratio = user.votes;
                rácio var = vratio.woot / vratio.meh;
                API.sendChat (subChat (basicBot.chat.voteratio, {name: chat.un, nome de usuário: nome, woot: vratio.woot, mehs: vratio.meh, razão: ratio.toFixed (2)}));
              }
            }
          },

          voteskipCommand: {
            comando: 'voteskip',
            classificação: 'manager',
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                if (msg.length <= cmd.length + 1) retorno API.sendChat (subChat (basicBot.chat.voteskiplimit, {name: chat.un, limite: basicBot.settings.voteSkipLimit}));
                argumento var = msg.substring (cmd.length + 1);
                se basicBot.settings.voteSkip = basicBot.settings.voteSkip (basicBot.settings.voteSkip!!);
                if (isNaN (argumento)) {
                  API.sendChat (subChat (basicBot.chat.voteskipinvalidlimit, {name: chat.un}));
                }
                outro {
                  basicBot.settings.voteSkipLimit = argumento;
                  API.sendChat (subChat (basicBot.chat.voteskipsetlimit, {name: chat.un, limite: basicBot.settings.voteSkipLimit}));
                }
              }
            }
          },

          welcomeCommand: {
            comando: 'bem-vindo',
            classificação: 'mod',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                se (basicBot.settings.welcome) {
                  basicBot.settings.welcome = basicBot.settings.welcome!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleoff, {name: chat.un, 'função': basicBot.chat.welcomemsg}));
                }
                outro {
                  basicBot.settings.welcome = basicBot.settings.welcome!;
                  retornar API.sendChat (subChat (basicBot.chat.toggleon, {name: chat.un, 'função': basicBot.chat.welcomemsg}));
                }
              }
            }
          },

          websiteCommand: {
            comando: 'site',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (typeof basicBot.settings.website === "string")
                API.sendChat (subChat (basicBot.chat.website, {link: basicBot.settings.website}));
              }
            }
          },

          whoisCommand: {
            comando: 'whois',
            classificação: "leão de chácara",
            digite: 'startsWith',
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                var msg = chat.message;
                var nome;
                if (msg.length === cmd.length) name = chat.un;
                outro {
                  name = msg.substr (cmd.length + 2);
                }
                users = API.getUsers ();
                var len = users.length;
                for (var i = 0; i <len; ++ i) {
                  if (usuários [i] == .username nome) {
                    var id = usuários [i] .id;
                    var avatar API.getUser = (id) .avatarID;
                    nível var = API.getUser (id) .level;
                    var rawjoined = API.getUser (id) .joined;
                    var juntou = rawjoined.substr (0, 10);
                    var rawlang = API.getUser (id) .language;
                    se (== rawlang "en") {
                      língua var = "português";
                    } Else if (rawlang == "bg") {
                      língua var = "Búlgaro";
                    } Else if (rawlang == "cs") {
                      língua var = "Checo";
                    } Else if (rawlang == "fi") {
                      língua var = "Finnish"
                    } Else if (rawlang == "fr") {
                      língua var = "Francês"
                    } Else if (rawlang == "pt") {
                      língua var = "Português"
                    } Else if (rawlang == "zh") {
                      língua var = "chinês"
                    } Else if (rawlang == "sk") {
                      língua var = "Slovak"
                    } Else if (rawlang == "nl") {
                      língua var = "Dutch"
                    } Else if (rawlang == "") {ms
                      língua var = "Malay"
                    }
                    var rawrank = API.getUser (id) .role;
                    se (rawrank == "0") {
                      var rank = "Usuário";
                    } Else if (rawrank == "1") {
                      var rank = "Resident DJ";
                    } Else if (rawrank == "2") {
                      var rank = "Bouncer";
                    } Else if (rawrank == "3") {
                      Rank var = "Manager"
                    } Else if (rawrank == "4") {
                      Rank var = "Co-Host"
                    } Else if (rawrank == "5") {
                      Rank var = "Host"
                    } Else if (rawrank == "7") {
                      Rank var = "embaixador da marca"
                    } Else if (rawrank == "10") {
                      Rank var = "Admin"
                    }
                    var lesma = API.getUser (id) .slug;
                    if (typeof lesma! == 'indefinido') {
                      perfil var = "https://plug.dj/@/" + lesma;
                    } Outro {
                      perfil var = "~";
                    }

                    API.sendChat (subChat (basicBot.chat.whois, {nome1: chat.un, name2: nome, id: id, avatar: avatar, perfil: perfil, linguagem: a linguagem, nível: nível, juntou-se: se juntou, classificação: classificação }));
                  }
                }
              }
            }
          },

          youtubeCommand: {
            comando: 'youtube',
            classificação: 'usuário',
            Tipo: «exacta»,
            funcionalidade: function (bate-papo, cmd) {
              if (! this.type === 'exata' && chat.message.length == cmd.length) vazio retorno (0);
              (! basicBot.commands.executable (this.rank, chat)) se vazio retorno (0);
              outro {
                if (typeof basicBot.settings.youtubeLink === "string")
                API.sendChat (subChat (basicBot.chat.youtube, {name: chat.un, link: basicBot.settings.youtubeLink}));
              }
            }
          }
        }
      };

      loadChat (basicBot.startup);
    .}) Chamada (this);

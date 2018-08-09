//TODO: Class variable list
//TODO: operation with variables (count = count + 1)
//TODO: if else
//TODO: body of event, function can contain not only call of functions

let japyrus = {};

japyrus.helloTamriel = function() {
    return 'HelloTamriel';
};

//module.exports = japyrus;

// next part of this file was copied from https://m.habr.com/post/224081/

japyrus.Pattern = function(exec) {
    this.exec = exec;
}


japyrus.txt = function (text) {
    return new japyrus.Pattern(function (str, pos) {
        if (str.substr(pos, text.length) == text)
            return { res: text, end: pos + text.length };
    });
}

japyrus.rgx = function (regexp) {
    return new japyrus.Pattern(function (str, pos) {
        var m = regexp.exec(str.slice(pos));
        if (m && m.index === 0)
            return { res: m[0], end: pos + m[0].length };
    });
}

japyrus.opt = function(pattern) {
    return new japyrus.Pattern(function (str, pos) {
        return pattern.exec(str, pos) || { res: void 0, end: pos };
    });
}

japyrus.exc = function(pattern, except) {
    return new japyrus.Pattern(function (str, pos) {
        return !except.exec(str, pos) && pattern.exec(str, pos);
    });
}

japyrus.any = function(...patterns) {
    return new japyrus.Pattern(function (str, pos) {
        for (var r, i = 0; i < patterns.length; i++)
            if (r = patterns[i].exec(str, pos))
                return r;
    });
}

japyrus.seq = function(...patterns) {
    return new japyrus.Pattern(function (str, pos) {
        var i, r, end = pos, res = [];

        for (i = 0; i < patterns.length; i++) {
            r = patterns[i].exec(str, end);
            if (!r) return;
            res.push(r.res);
            end = r.end;
        }

        return { res: res, end: end };
    });
}

japyrus.rep = function(pattern, separator) {
    var separated = !separator ? pattern :
        seq(separator, pattern).then(r => r[1]);

    return new japyrus.Pattern(function (str, pos) {
        var res = [], end = pos, r = pattern.exec(str, end);

        while (r && r.end > end) {
            res.push(r.res);
            end = r.end;
            r = separated.exec(str, end);
        }

        return { res: res, end: end };
    });
}

//end of copy
japyrus.findWord = japyrus.rgx(/\w+/i);
japyrus.findSpace = japyrus.rgx(/\s+/i); //space must be, if there is no space -> undefined
japyrus.findOptionalSpace = japyrus.rgx(/\s*/i);
japyrus.findNumber = japyrus.rgx(/\d+/i);
japyrus.findVarName = japyrus.rgx(/[\d\w_]+/i);
japyrus.findVarArg = japyrus.rgx(/[\d\w,".!@#№;$%^:?&*()-_+=~]+/i);

/*
class variable {
  var variableList = [];

  getVariable(name) {
     for(let i = 0; i<this.variableList.length; i++)
     {
        if(this.variableList[i].name == name)
        {
           return this.variableList[i];
        }
     }
  }
  push(variable) {
    this.variableList.push(variable);
  }

}

japyrus.vars = new variable();
*/

japyrus.varlist = [];
japyrus.varlist.getVariable = function(name){
    for(let i = 0; i<japyrus.varlist.length; i++)
    {
       if(japyrus.varlist[i].name == name)
       {
         return japyrus.varlist[i];
       }
    }
    return undefined;
}
//japyrus.varlist.push = function(variable){
  //  japyrus.varlist.push(variable);
//}

japyrus.isString = function(str) {
    if(str[0] == `"` && str[str.length-1] == `"`) return true;
    return false;
}

//japyrus.isInteger = Number.isInteger;
japyrus.isInt = function(n){
    return Number(n) === n && n % 1 === 0;
}
japyrus.isFloat = function(n){
    return Number(n) === n && n % 1 !== 0;
}

japyrus.isVarValueCorrect = function(type, value) {
  console.log(type + ' '+ typeof(value));
    if(type.toLowerCase() == "int" && japyrus.isInt(Number(value))) return true;
    if(type.toLowerCase() == "float" && japyrus.isFloat(parseFloat(value))) return true;
    if(type.toLowerCase() == "string" && japyrus.isString(value)) return true;
    if(type.toLowerCase() == "bool" && typeof(value) == typeof(true)) return true;
    return false;
}


japyrus.parseScriptname = function(str) {
    let result = japyrus.seq(japyrus.txt('Scriptname'), japyrus.findSpace, japyrus.findWord, japyrus.findSpace, japyrus.txt('extends'), japyrus.findSpace, japyrus.findWord);
    let res1 = result.exec(str, 0);
    if(res1 == undefined) return undefined;
    let assertResult = {};
    assertResult.scriptname = res1.res[2];
    assertResult.extends = res1.res[4];
    return assertResult;
}

japyrus.parseArguments = function(str) {
  let args = [];
  let reg = japyrus.seq(japyrus.findOptionalSpace, japyrus.findWord, japyrus.findSpace, japyrus.findWord);
  let res;
  if(str.indexOf(',')!=-1)
  {
      let list = str.split(',');
      for(let i=0; i<list.length;i++)
      {
         res = reg.exec(list[i], 0);
         if(res == undefined) return undefined;
         args[i] = {};
         args[i].type = res.res[1];
         args[i].name = res.res[3];
      }
  } else {
      res = reg.exec(str, 0);
      if(res == undefined) return undefined;
      args[0] = {};
      args[0].type = res.res[1];
      args[0].name = res.res[3];
  }
  return args;
}

japyrus.parseCertainArguments = function(str) {
  let args = [];
  //let reg = japyrus.seq(japyrus.findOptionalSpace, japyrus.findWord, japyrus.findSpace, japyrus.findWord);
  let trimStr = str.trim();
  let pos = 0;
  let isStr = false;
  for(let i=0; i<trimStr.length; i++)
  {
      if(!isStr) {
          if(trimStr[i]==',') {
              args.push(trimStr.slice(pos,i).trim());
              pos = i+1;
          }
      }
      if(trimStr[i]=='"')
      {
          isStr = !isStr;
      }
  }
  args.push(trimStr.slice(pos,trimStr.length).trim());
  return args;
}



japyrus.parseCallOfFunction = function(str) {
    let result = {};
    let reg = japyrus.seq(japyrus.findOptionalSpace, japyrus.findWord,japyrus.txt('.'), japyrus.findWord);
    let res = reg.exec(str,0);
    if(res == undefined) return undefined;
    result.object = res.res[1];
    result.method = res.res[3];
    result.args = japyrus.parseCertainArguments(str.slice(res.end+1,str.length-1));
    return result;
}
/*
Event OnActivate(ObjectReference akActionRef)
   Debug.MessageBox("Hello, World!")
endEvent
*/

japyrus.parseEvent = function(str) {
  //let _arguments = //japyrus.txt('Debug.MessageBox("Hello, World!")'), findSpace,
  let eventResult = {};
  let beforeArgs = japyrus.seq(japyrus.txt('Event'), japyrus.findSpace, japyrus.findWord);//, japyrus.txt('('), japyrus.findWord, japyrus.findSpace, japyrus.findWord, japyrus.txt(')'), japyrus.findSpace, /*parse arguments*/japyrus.txt('Debug.MessageBox("Hello, World!")'), japyrus.findSpace,/*parse arguments end*/japyrus.txt('endEvent') );
  let res1 = beforeArgs.exec(str, 0);
  if(res1 == undefined) return undefined;
  let pos1 = res1.end+1;
  let argend1 = str.indexOf(')');
  let endEvent = str.indexOf('endEvent');
  if(argend1 == -1 || endEvent == -1) return undefined;

  let args1 = japyrus.parseArguments(str.slice(pos1,argend1));
  eventResult.blocktype = "Event";
  eventResult.name = res1.res[2];
  eventResult.args = args1;



  eventResult.body = [];
  let body = str.slice(argend1+1,endEvent).trim().split('\n');
  console.log("body");
  console.log(body);
  for(let i = 0; i<body.length; i++)
  {
  //  console.log(japyrus.parseCallOfFunction(body[i]));
    eventResult.body.push(japyrus.parseCallOfFunction(body[i]));
  }
  //eventResult.body = japyrus.parseCallOfFunction(body);
  return eventResult;
}

japyrus.parseVar = function(str) {
  let variable = {};
  let trimStr = str.trim();
  let reg = japyrus.seq(japyrus.findVarName, japyrus.findSpace, japyrus.findVarName, japyrus.findOptionalSpace, japyrus.opt(japyrus.seq(japyrus.txt('='), japyrus.findOptionalSpace, japyrus.findVarArg)));
  let res = reg.exec(str,0);
  if(res == undefined) return undefined;
  variable.type = res.res[0].toLowerCase();
  variable.name = res.res[2];
    if(res.res[4] == undefined)
      variable.value = undefined;
    else
    {
      if(!japyrus.isVarValueCorrect(variable.type, res.res[4][2])) return undefined;
      variable.value = res.res[4][2];
    }
  console.log(variable);
  //japyrus.varlist.push(variable);
  return variable;
   //or error: value doesn't match type
}

module.exports = japyrus;

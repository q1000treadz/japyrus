
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

japyrus.parseScriptname = function(str) {
  let findWord = japyrus.rgx(/\w+/i);
  let findSpace = japyrus.rgx(/\s*/i);
  let result = japyrus.seq(japyrus.txt('Scriptname'), findSpace, findWord, findSpace, japyrus.txt('extends'), findSpace, findWord);
  let res1 = result.exec(str, 0);
  let assertResult = {};
  assertResult.scriptname = res1.res[2];
  assertResult.extends = res1.res[4];
  return assertResult;
}


module.exports = japyrus;

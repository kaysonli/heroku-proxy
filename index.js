var express = require('express');
var request = require('request');
var concat = require('concat-stream');
var cheerio = require('cheerio');
var zlib = require('zlib');
var parse = require('url-parse');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var inputBox = `<div style="height: 50px; line-height: 50px;background-color: #333;color: #fff;">
        <span>网址：</span><input value="http://" type="text" id="proxy-url" style="width: 400px;margin-right: 10px;font-size: 16px"><button id="browse">GO</button>
    </div>
    <script>
        +function() {
            function browse(url) {
                if(url.indexOf('http') < 0) {
                    url = 'http://' + url;
                }
                window.location = window.location.href.split('?')[0] + '?u=' + encodeURIComponent(url);
            }
            var input = document.getElementById('proxy-url');
            input.addEventListener('keyup', function(e) {
                if(e.keyCode === 13) {
                    browse(input.value);
                }
            });
            window.addEventListener('load', function() {
                console.log(location.href, input)
                if(location.href.split('?').lenght > 1) {
                    input.value = location.href.split('?')[1].split('=')[1];
                }
            })
            document.getElementById('browse').addEventListener('click', function() {
                var url = input.value;
                browse(url);
            })
        }()
    </script>
    `
var style = `<link rel="stylesheet" href="//so.surge.sh/union.css">`
var baidu = `<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?0dcad04ab625721394250abdc8d28817";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
`

var proxy = function(req, res) {
    if (!req.query.u) {
        res.end(inputBox);
        return;
    }
    var url = parse(decodeURIComponent(req.query.u));
    var con = concat(function(response) {
        if (!!response.copy && res._headers['content-type'].indexOf('text/html') > -1) {
            zlib.gunzip(response, function(err, decoded) {
                var data = decoded && decoded.toString();
                var $ = data && cheerio.load(data);
                if ($) {
                    $('head').append(style);
                    $('body').prepend(inputBox);
                    $('body').append(baidu);
                    var reg = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                    // console.log($.html().match(reg));
                    data = $.html().replace(reg, function(rep) {
                        if (rep.indexOf('//') === 0) {
                            rep = 'https:' + rep;
                        }
                        if (rep.indexOf('http') < 0) {
                            rep = 'https://' + rep;
                        }
                        return '/?u=' + encodeURIComponent(rep);
                    });
                }
                zlib.gzip(data, function(err, encoded) {
                    res.end(encoded);
                });
            });
        } else {
            if (response.copy) {
                res.end(response)
            } else {
                res.end('')
            }
        }
    });
    req.pipe(request(url.href).on('response', function(response, body) {
        res.writeHead(response.statusCode, response.headers);
    })).pipe(con);
}
app.use(proxy);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
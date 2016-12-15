var express = require('express');  
var request = require('request');
var concat = require('concat-stream');
var cheerio = require('cheerio');
var zlib = require('zlib');


var app = express();


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
var jd = `<script type="text/javascript">var jd_union_unid="4505866",jd_ad_ids="509:6",jd_union_pid="CICUqLGKKxCKgpMCGgAg7tmziAIqAA==";var jd_width=120;var jd_height=240;var jd_union_euid="";var p="BhcFXBhYFAIbNwpfBkgyTUMIRmtKRk9aZV8ETVxNNwpfBkgyTl8TQx5iAkJiBn0yT0dVbzxJX3BdVAtZK1wQBBAOVxxdJQcWBlESXBIyIlgRRgYlSXwGZUQfSF8iB1ASWhYGFQNWGF0RACIGZStr";</script><script type="text/javascript" charset="utf-8" src="//google2.surge.sh/auto.js"></script>`
jd = `<iframe src="http://u.x.jd.com/auto?spread_type=2&ad_type=7&ad_ids=520:6&union_id=4505866&pid=CPmSmu6KKxCKgpMCGgAg3N+0iAIqAA==&euid=&ref=http%3A%2F%2Fjd.surge.sh%2F&t=%E4%BA%AC%E4%B8%9C%E6%90%9C%E7%B4%A2&_=1480386129907&p=BhcFXBhYFAIbNwpfBkgyTUMIRmtKRk9aZV8ETVxNNwpfBkgyakFXAR1UAHpnAGkaR2lpDwgSXmFERAtZK1wQBBAOVxxdJQcWBlESXBIyIlgRRgYlSXwGZUQfSF8iB1ASWhcLFwRVE18VByIGZStr"></iframe>`;
jd = `<div class="ad-box" style="width:360px; height:300px;position:absolute;right: 0; top: 100px;">
	 			<div class="mark"><a href="http://media.jd.com/" target="_blank" title="京东联盟推广">JD</a></div>
				
				<a target="_blank" href="http://union.click.jd.com/jdc?type=union&amp;p=BhUHVBJcFAYaN1UrXxEHEw9TGV4RMhEHUBlaFQUiQwpDBUpZUDcMXh5UCQwZDV4PSR1JUkpJBUkcEQdQGVoVBQ1eEEcGJQtFAwJJUhNVEFcFGF4VUEIOXRtaEwAVUAJOXRdXQQJcK1wQBBAOVxxdJQcWBlESXBIyImYnKwl72qSxjb7qCdW2hoOK6w==&amp;t=W1dCFBBFC1pXUwkEAEAdQFkJBVgVBxAGVRxETEdOWg==&amp;e=">
					<img src="http://img14.360buyimg.com/N6/jfs/t2974/241/2438925704/101741/87c847a/57ad4678N901f518c.jpg" width="240" height="240">
				</a>
		  		<div class="info">
	 				<a id="J_2143016" class="item-price" target="_blank" href="http://union.click.jd.com/jdc?type=union&amp;p=BhUHVBJcFAYaN1UrXxEHEw9TGV4RMhEHUBlaFQUiQwpDBUpZUDcMXh5UCQwZDV4PSR1JUkpJBUkcEQdQGVoVBQ1eEEcGJQtFAwJJUhNVEFcFGF4VUEIOXRtaEwAVUAJOXRdXQQJcK1wQBBAOVxxdJQcWBlESXBIyImYnKwl72qSxjb7qCdW2hoOK6w==&amp;t=W1dCFBBFC1pXUwkEAEAdQFkJBVgVBxAGVRxETEdOWg==&amp;e="><em>￥6288.00</em></a>
		  			<a target="_blank" href="http://union.click.jd.com/jdc?type=union&amp;p=BhUHVBJcFAYaN1UrXxEHEw9TGV4RMhEHUBlaFQUiQwpDBUpZUDcMXh5UCQwZDV4PSR1JUkpJBUkcEQdQGVoVBQ1eEEcGJQtFAwJJUhNVEFcFGF4VUEIOXRtaEwAVUAJOXRdXQQJcK1wQBBAOVxxdJQcWBlESXBIyImYnKwl72qSxjb7qCdW2hoOK6w==&amp;t=W1dCFBBFC1pXUwkEAEAdQFkJBVgVBxAGVRxETEdOWg==&amp;e=">
	 					<i title="微软（Microsoft）Surface Pro 4 12.3英寸（Intel i5 4G内存 128G存储 触控笔 预装Win10）">微软（Microsoft）Surface Pro 4 12.3英寸（Intel i5 4G内存 128G存储 触控笔 预装Win10）</i>
	 				</a>
	 			</div>
		</div>`
jd = `<div class="union">
		<a href="https://s.click.taobao.com/8itAcKx?hmsr=%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88&amp;hmpl=%E5%8F%8C%E5%8D%81%E4%BA%8C&amp;hmcu=%E4%B8%BB%E5%9C%BA&amp;hmkw=&amp;hmci=" target="_blank"><img src="https://img.alicdn.com/tps/TB1WhZcOpXXXXbbXVXXXXXXXXXX-440-180.jpg" alt=""></a>
		<div class="title"><a href="https://s.click.taobao.com/8itAcKx?hmsr=%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88&amp;hmpl=%E5%8F%8C%E5%8D%81%E4%BA%8C&amp;hmcu=%E4%B8%BB%E5%9C%BA&amp;hmkw=&amp;hmci=" target="_blank">厉害了，千万现金红包要不要？</a></div>
	</div>`;
var style = `	<link rel="stylesheet" href="https://so.surge.sh/union.css">`
var proxy = function(req, res) {  
  var host = 'https://www.google.com/';
  if(req.url.indexOf('/union') === 0) {
    host = 'http://u.x.jd.com/';
  }
  var url = host + req.url;
  console.log('url: ', req.url)
  res.set('X-Product', 'GOFORIT');
  
  var con = concat(function(response) {
    if(!!response.copy && res._headers['content-type'].indexOf('text/html') > -1) {
      zlib.gunzip(response, function (err, decoded) {
          var data = decoded && decoded.toString();
          var $ = data && cheerio.load(data);
          //$('head').append(style);
          $('body').append(baidu);
          data = $.html();
          zlib.gzip(data, function(err, encoded) {
            res.end(encoded);
          });
      });  
    } else {
      if(response.copy) {
        res.end(response)
      } else {
        res.end('')  
      }
    }
  });
  req.pipe(request(url).on('response', function(response, body) {
    // console.log(response.length);
    res.writeHead(response.statusCode, response.headers);
  })).pipe(con);
}

app.use("/union", function(req, res) {
  var host = 'http://u.x.jd.com/';
  var url = host + 'auto?spread_type=2&ad_type=7&ad_ids=520:6&union_id=4505866&pid=CPmSmu6KKxCKgpMCGgAg3N+0iAIqAA==&euid=&ref=http%3A%2F%2Fjd.surge.sh%2F&t=京东搜索&_=1480386129907&p=BhcFXBhYFAIbNwpfBkgyTUMIRmtKRk9aZV8ETVxNNwpfBkgyakFXAR1UAHpnAGkaR2lpDwgSXmFERAtZK1wQBBAOVxxdJQcWBlESXBIyIlgRRgYlSXwGZUQfSF8iB1ASWhcLFwRVE18VByIGZStr';
  console.log('union url: ', req.url)
  console.log(req.headers)
  var con = concat(function(response) {
    if(!!response.copy && res._headers['content-type'].indexOf('text/html') > -1) {
      zlib.gunzip(response, function (err, decoded) {
          var data = decoded && decoded.toString();
          var $ = data && cheerio.load(data);
          
          data = $.html();
          zlib.gzip(data, function(err, encoded) {
            res.end(encoded);
          });
      });  
    } else {
      if(response.copy) {
        res.end(response)
      } else {
        res.end('')  
      }
    }
  });
  req.pipe(request(url).on('response', function(response, body) {
    // console.log(response.length);
    res.writeHead(response.statusCode, response.headers);
  })).pipe(con);
});
app.use('/', proxy);
// app.post('/', proxy);


// app.use("/", function (req, resp) {
//   var write = concat(function(response) {
//     // Here you can modify the body
//     // As an example I am replacing . with spaces
//     if (response) {
//       // response = response.toString().replace(/\./g, " ");
//     }
//     resp.end(response);
//   });

//   request.get('https://www.google.com/' + req.url)
//       .on('response',
//         function (response) {
//           //Here you can modify the headers
//           resp.writeHead(response.statusCode, response.headers);
//         }
//       ).pipe(write);
// });

app.listen(process.env.PORT || 3000); 

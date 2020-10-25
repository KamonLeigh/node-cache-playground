const http = require('http');
const { createHash }  = require('crypto');

function md5(str) {
    return createHash("md5").update(str).digest("hex")
}

const server = http.createServer((req, res) => {
 
    switch(req.url) {
        case '/': {
             let html = createPage('title');
             let etag = md5(html);

            // res.setHeader("cache-control", "no-store") prevent browser caching on default when using back/ forward button

                if (etag === req.headers['if-none-match']) {
                    res.writeHead(304);
                    res.end()
                } else {

                res.writeHead(200, {
                // "cache-control": "max-age=0, must-revalidate",
                "cache-control": "max-age=10",
                etag
            })
                res.end(html);
                }
            }
        break;
        case '/page-1': {
             let html = createPage('page 1');
            res.end(html);
          }
        break;
        default:
            res.end('<p> Page is not found </p>')
    }

});

server.listen(3000, () => {
    console.log('Server has started');
})

function createPage(title) {
    return`
        <!doctype html>

        <html lang="en">
        <head>
            <title>${title}</title>
            <meta charset=utf-8>

        </head>
            <body>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/page-1">Page - 1</a></li>
                </ul>
                    <h1>${title}</h1>
                    <hr>
                ${Array.from({ length: 100}, (a, i) => `<p>${i}</p>`).join("\n")}
            </body>
        </html
    `;
}
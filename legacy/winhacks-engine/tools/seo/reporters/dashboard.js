const fs = require("fs-extra");
const path = require("path");

const REPORTS = path.join(process.cwd(), "reports");

const cards = [

    {
        title:"Resumen",
        file:"summary.md",
        color:"#0078D4"
    },

    {
        title:"Metadata",
        file:"metadata.md",
        color:"#00B894"
    },

    {
        title:"Links",
        file:"links.md",
        color:"#6C5CE7"
    },

    {
        title:"Images",
        file:"images.md",
        color:"#E17055"
    },

    {
        title:"Schema",
        file:"schema.md",
        color:"#00CEC9"
    },

    {
        title:"Discover",
        file:"discover.md",
        color:"#FDCB6E"
    },

    {
        title:"GEO",
        file:"geo.md",
        color:"#0984E3"
    },

    {
        title:"Headings",
        file:"headings.md",
        color:"#E84393"
    },

    {
        title:"Performance",
        file:"performance.md",
        color:"#2D3436"
    }

];

module.exports = async function(result){

    const html=[];

    html.push(`<!DOCTYPE html>`);
    html.push(`<html lang="es">`);
    html.push(`<head>`);
    html.push(`<meta charset="utf-8">`);
    html.push(`<meta name="viewport" content="width=device-width,initial-scale=1">`);
    html.push(`<title>WinHacks SEO Dashboard</title>`);

    html.push(`<style>

body{

background:#070B12;
color:#F5F5F5;
font-family:Inter,Arial,sans-serif;
padding:40px;

}

h1{

font-size:40px;

}

.grid{

display:grid;

grid-template-columns:repeat(auto-fill,minmax(260px,1fr));

gap:20px;

margin-top:40px;

}

.card{

padding:25px;

border-radius:14px;

text-decoration:none;

color:white;

transition:.25s;

}

.card:hover{

transform:translateY(-6px);

}

.score{

font-size:50px;

font-weight:bold;

margin:20px 0;

}

.small{

opacity:.8;

}

</style>`);

    html.push(`</head>`);

    html.push(`<body>`);

    html.push(`<h1>WinHacks SEO Dashboard</h1>`);

    html.push(`<div class="score">${result.score}/100</div>`);

    html.push(`<div class="small">

Páginas analizadas:
${result.totalPages}

</div>`);

    html.push(`<div class="grid">`);

    for(const card of cards){

        html.push(`

<a
class="card"
style="background:${card.color}"
href="${card.file}">

<h2>${card.title}</h2>

Abrir reporte →

</a>

`);

    }

    html.push(`</div>`);

    html.push(`</body>`);

    html.push(`</html>`);

    await fs.ensureDir(REPORTS);

    await fs.writeFile(

        path.join(REPORTS,"index.html"),

        html.join("\n"),

        "utf8"

    );

    console.log("✅ Dashboard generado");

}
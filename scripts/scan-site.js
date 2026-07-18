const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const glob = require("fast-glob");

const ROOT = path.join(__dirname, "..");

const OUTPUT = path.join(ROOT, "content", "pages.json");

const IGNORE = [
"node_modules/**",
"build/**",
"content/**",
"scripts/**",
"generators/**",
"assets/**"
];

async function scan(){

const files=await glob([
"**/*.html",
...IGNORE.map(i=>"!"+i)
],{

cwd:ROOT

});

const pages=[];

for(const file of files){

const html=await fs.readFile(path.join(ROOT,file),"utf8");

const $=cheerio.load(html);

const title=$("title").text().trim();

const description=$('meta[name="description"]').attr("content")||"";

const canonical=$('link[rel="canonical"]').attr("href")||"";

const ogimage=$('meta[property="og:image"]').attr("content")||"";

const robots=$('meta[name="robots"]').attr("content")||"";

const keywords=$('meta[name="keywords"]').attr("content")||"";

const article={

title,

description,

canonical,

image:ogimage,

keywords,

robots,

file,

url:
"/"+
file
.replace(/index\.html$/,"")
.replace(/\.html$/,"")
.replace(/\\/g,"/"),

category:file.split("/")[0],

updated:new Date().toISOString()

};

const scripts=$('script[type="application/ld+json"]');

scripts.each((i,e)=>{

try{

const json=JSON.parse($(e).html());

if(json["@type"]==="Article"){

article.published=json.datePublished||"";

article.modified=json.dateModified||"";

}

if(json["@type"]==="VideoObject"){

article.youtube=json.embedUrl||"";

}

}catch(err){}

});

pages.push(article);

}

await fs.ensureDir(path.join(ROOT,"content"));

await fs.writeJson(OUTPUT,pages,{spaces:2});

console.log("");

console.log("================================");

console.log("WinHacks Scan terminado");

console.log("================================");

console.log("");

console.log("Artículos encontrados:",pages.length);

console.log("");

console.log("Archivo generado:");

console.log("content/pages.json");

}

scan();
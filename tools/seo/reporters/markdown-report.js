const fs = require("fs-extra");
const path = require("path");

const REPORTS = path.join(process.cwd(), "reports");

const GROUPS = {
    metadata: [
        "title",
        "description",
        "canonical",
        "robots",
        "og",
        "twitter"
    ],

    links: [
        "link"
    ],

    images: [
        "image"
    ],

    schema: [
        "schema"
    ],

    discover: [
        "discover"
    ],

    headings: [
        "h1",
        "h2",
        "h3"
    ],

    performance: [
        "performance",
        "css",
        "js"
    ],

    geo: [
        "geo",
        "llms"
    ]
};

function belongs(issue, list){

    return list.some(prefix=>issue.type.startsWith(prefix));

}

async function writeFile(name,title,list){

    let md=`# ${title}\n\n`;

    md+=`Generado automáticamente por WinHacks SEO Auditor.\n\n`;

    md+=`---\n\n`;

    if(list.length===0){

        md+="✅ Sin problemas encontrados.\n";

    }

    for(const issue of list){

        md+=`## ${issue.file}\n\n`;

        md+=`**Severidad:** ${issue.severity.toUpperCase()}\n\n`;

        md+=`**Tipo:** ${issue.type}\n\n`;

        md+=`${issue.message}\n\n`;

        if(issue.value){

            md+="```text\n";

            md+=issue.value;

            md+="\n```\n\n";

        }

    }

    await fs.writeFile(

        path.join(REPORTS,name),

        md,

        "utf8"

    );

}

module.exports=async(report)=>{

    await fs.ensureDir(REPORTS);

    for(const group of Object.keys(GROUPS)){

        const issues=report.issues.filter(issue=>belongs(issue,GROUPS[group]));

        await writeFile(

            `${group}.md`,

            group.toUpperCase(),

            issues

        );

    }

};
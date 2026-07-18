const fs = require("fs-extra");
const path = require("path");

const REPORTS = path.join(process.cwd(), "reports");

function groupByCategory(issues) {
    const groups = {};

    for (const issue of issues) {
        const category = issue.category || "general";

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(issue);
    }

    return groups;
}

function sortSeverity(a, b) {
    const order = {
        critical: 1,
        high: 2,
        medium: 3,
        low: 4
    };

    return (order[a.severity] || 99) - (order[b.severity] || 99);
}

async function writeMarkdown(filename, title, issues) {

    issues.sort(sortSeverity);

    let md = `# ${title}\n\n`;

    md += `Total encontrados: **${issues.length}**\n\n`;

    const groups = groupByCategory(issues);

    for (const category of Object.keys(groups).sort()) {

        md += `---\n\n`;

        md += `## ${category.toUpperCase()}\n\n`;

        for (const issue of groups[category]) {

            md += `### ${issue.file}\n\n`;

            md += `**Severidad:** ${issue.severity.toUpperCase()}\n\n`;

            md += `**Código:** ${issue.code}\n\n`;

            md += `**Descripción**\n\n`;

            md += `${issue.message}\n\n`;

            if (issue.fix) {

                md += `**Sugerencia**\n\n`;

                md += `${issue.fix}\n\n`;

            }

        }

    }

    await fs.ensureDir(REPORTS);

    await fs.writeFile(
        path.join(REPORTS, filename),
        md,
        "utf8"
    );

}

module.exports = async function generateMarkdownReports(result){

    const issues = result.issues;

    await writeMarkdown(
        "summary.md",
        "Resumen General",
        issues
    );

    await writeMarkdown(
        "metadata.md",
        "Metadata",
        issues.filter(i =>
            [
                "title",
                "description",
                "canonical",
                "og",
                "twitter"
            ].includes(i.category)
        )
    );

    await writeMarkdown(
        "links.md",
        "Enlaces",
        issues.filter(i=>i.category==="links")
    );

    await writeMarkdown(
        "images.md",
        "Imágenes",
        issues.filter(i=>i.category==="images")
    );

    await writeMarkdown(
        "schema.md",
        "Schema",
        issues.filter(i=>i.category==="schema")
    );

    await writeMarkdown(
        "discover.md",
        "Google Discover",
        issues.filter(i=>i.category==="discover")
    );

    await writeMarkdown(
        "geo.md",
        "GEO",
        issues.filter(i=>i.category==="geo")
    );

    await writeMarkdown(
        "headings.md",
        "Headings",
        issues.filter(i=>i.category==="headings")
    );

    await writeMarkdown(
        "performance.md",
        "Performance",
        issues.filter(i=>i.category==="performance")
    );

    console.log("✅ Reportes Markdown generados");

};
const fs=require("fs-extra");
const path=require("path");
const fg=require("fast-glob");
const Ajv2020=require("ajv/dist/2020");
const addFormats=require("ajv-formats");

const ROOT=path.join(__dirname,"..");
const KNOWLEDGE=path.join(ROOT,"knowledge");
const SCHEMA=path.join(KNOWLEDGE,"schema");
const REPORTS=path.join(ROOT,"reports");

const MAP={
  procedures:"procedure.schema.json",
  symptoms:"symptom.schema.json",
  tools:"tool.schema.json",
  commands:"command.schema.json",
  questions:"question.schema.json",
  rules:"rule.schema.json",
  validations:"validation.schema.json"
};

(async()=>{
  console.log("\n=========================================");
  console.log(" WinHacks Knowledge Validator");
  console.log("=========================================\n");

  await fs.ensureDir(REPORTS);
  const ajv=new Ajv2020({allErrors:true,strict:false,allowUnionTypes:true});
  addFormats(ajv);

  const validators={};
  for(const [folder,file] of Object.entries(MAP)){
    validators[folder]=ajv.compile(await fs.readJson(path.join(SCHEMA,file)));
  }

  const results=[];
  const ids=new Map();
  const slugs=new Map();

  for(const folder of Object.keys(MAP)){
    const dir=path.join(KNOWLEDGE,folder);
    if(!(await fs.pathExists(dir))) continue;

    const files=await fg(["**/*.json"],{cwd:dir,absolute:true,onlyFiles:true});

    for(const file of files){
      const rel=path.relative(ROOT,file);
      let data;
      try{data=await fs.readJson(file);}
      catch(e){
        results.push({file:rel,type:folder,valid:false,errors:[`JSON inválido: ${e.message}`]});
        console.log("✗",rel);
        continue;
      }

      const validate=validators[folder];
      const ok=validate(data);
      const errors=ok?[]:(validate.errors||[]).map(e=>`${e.instancePath||"/"} ${e.message}`);

      if(data.id){
        if(ids.has(data.id)) errors.push(`ID duplicado: ${data.id} también aparece en ${ids.get(data.id)}`);
        else ids.set(data.id,rel);
      }

      if(data.slug){
        const key=`${folder}:${data.slug}`;
        if(slugs.has(key)) errors.push(`Slug duplicado: ${data.slug} también aparece en ${slugs.get(key)}`);
        else slugs.set(key,rel);
      }

      results.push({file:rel,type:folder,id:data.id||"",valid:errors.length===0,errors});
      console.log(errors.length?"✗":"✓",rel);
    }
  }

  const procedureIds=new Set(results.filter(r=>r.type==="procedures"&&r.id).map(r=>r.id));

  for(const result of results.filter(r=>r.type==="procedures"&&r.valid)){
    const data=await fs.readJson(path.join(ROOT,result.file));
    const refs=[...(data.nextProcedures||[]),...((data.failureActions||[]).map(x=>x.nextProcedure).filter(Boolean))];
    for(const ref of refs){
      if(!procedureIds.has(ref)){
        result.valid=false;
        result.errors.push(`Procedimiento referenciado no existe: ${ref}`);
      }
    }
  }

  const summary={
    generatedAt:new Date().toISOString(),
    total:results.length,
    valid:results.filter(r=>r.valid).length,
    invalid:results.filter(r=>!r.valid).length
  };

  await fs.writeJson(path.join(REPORTS,"knowledge-validation.json"),{summary,results},{spaces:2});

  const md=["# WinHacks Knowledge Validation","",`Generado: ${summary.generatedAt}`,"",`- Total: **${summary.total}**`,`- Válidos: **${summary.valid}**`,`- Inválidos: **${summary.invalid}**`,"","---",""];
  for(const r of results){
    md.push(`## ${r.valid?"✅":"❌"} ${r.file}`,"");
    if(r.errors.length) r.errors.forEach(e=>md.push(`- ${e}`));
    else md.push("Sin errores.");
    md.push("");
  }
  await fs.writeFile(path.join(REPORTS,"knowledge-validation.md"),md.join("\n"),"utf8");

  console.log("\nResumen:");
  console.log("Archivos:",summary.total);
  console.log("Válidos:",summary.valid);
  console.log("Inválidos:",summary.invalid);
  console.log("\nReportes:");
  console.log("pc-rescue-kit/reports/knowledge-validation.json");
  console.log("pc-rescue-kit/reports/knowledge-validation.md\n");

  if(summary.invalid>0) process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});

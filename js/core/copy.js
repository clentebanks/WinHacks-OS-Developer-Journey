// ============================================================
// WINHACKS ENGINE v1.0
// FILE: copy.js
// Sistema universal para copiar comandos
// ============================================================

class WinHacksCopy {

    constructor(){

        this.init();

    }

    init(){

        document.addEventListener("click",(event)=>{

            const button = event.target.closest(".copy-btn");

            if(!button) return;

            this.copy(button);

        });

    }

    async copy(button){

        const text = button.dataset.copy;

        if(!text) return;

        try{

            if(navigator.clipboard && window.isSecureContext){

                await navigator.clipboard.writeText(text);

            }else{

                this.fallbackCopy(text);

            }

            this.success(button);

        }

        catch(error){

            console.error("Error al copiar:",error);

        }

    }

    fallbackCopy(text){

        const textarea=document.createElement("textarea");

        textarea.value=text;

        textarea.style.position="fixed";

        textarea.style.left="-9999px";

        document.body.appendChild(textarea);

        textarea.focus();

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

    }

    success(button){

        const original=button.innerHTML;

        button.disabled=true;

        button.classList.add("copied");

        button.innerHTML="✓ Copiado";

        setTimeout(()=>{

            button.innerHTML=original;

            button.classList.remove("copied");

            button.disabled=false;

        },2000);

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    new WinHacksCopy();

});
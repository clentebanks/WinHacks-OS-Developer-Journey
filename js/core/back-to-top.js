// ============================================================
// WINHACKS ENGINE v1.0
// FILE: back-to-top.js
// PURPOSE: Botón flotante "Volver arriba"
// ============================================================

class WinHacksBackToTop {

    constructor(){

        this.button=document.querySelector(".to-top");

        if(!this.button) return;

        this.init();

    }

    init(){

        window.addEventListener("scroll",()=>{

            this.toggleButton();

        });

        this.button.addEventListener("click",(event)=>{

            event.preventDefault();

            this.scrollTop();

        });

        this.toggleButton();

    }

    toggleButton(){

        if(window.scrollY>350){

            this.button.classList.add("show");

        }

        else{

            this.button.classList.remove("show");

        }

    }

    scrollTop(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    new WinHacksBackToTop();

});
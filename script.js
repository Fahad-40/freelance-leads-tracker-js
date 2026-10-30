const FormModalBackdrop = document.querySelector(".js-modal-backdrop");
const addLeadBtn = document.querySelector(".js-add-lead-btn");
const form = document.querySelector(".js-lead-form");
const leadCard = document.querySelector(".lead-card");
const leadsContainer = document.querySelector(".js-leads-container");
const modalBackdrop = document.querySelector(".js-modal-backdrop");
const detailBackdrop = document.querySelector(".js-detail-backdrop");

let leadsArray = JSON.parse(localStorage.getItem("LSleadsArray")) || [];
renderCards(leadsArray);
function saveToLS() {
    localStorage.setItem("LSleadsArray", JSON.stringify(leadsArray));
}

addLeadBtn.addEventListener("click", () => {
    FormModalBackdrop.classList.remove("hidden")
    FormModalBackdrop.classList.add("flex")
})

function timeAgo(dateString) {
    let diffMS = new Date() - new Date(dateString);

    let minutes = Math.floor(diffMS / (1000 * 60));
    let hours = Math.floor(diffMS / (1000 * 60 * 60));
    let days = Math.floor(diffMS / (1000 * 60 * 60 * 24));
    let weeks = Math.floor(days / 7);
    let months = Math.floor(days / 30);
    let years = Math.floor(days / 365);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
    if (days < 30) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    if (days < 365) return `${months} ${months === 1 ? "month" : "months"} ago`;
    return `${years} ${years === 1 ? "year" : "years"} ago`;

}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    let newLead = {
        id: Date.now(),
        leadAddedDate: new Date().toISOString(),
        projectTitle: data.projectTitle,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        country: data.country,
        city: data.city,
        platform: data.platform,
        budget: Number(data.budget),
        leadStatus: data.status,
        projectBrief: data.projectBrief
    }

    leadsArray.push(newLead);
    saveToLS();
    renderCards(leadsArray);
    console.log(leadsArray)
    form.reset();
    FormModalBackdrop.classList.add("hidden")
    FormModalBackdrop.classList.remove("flex")
});

modalBackdrop.addEventListener("click", function (e) {
    if (e.target === modalBackdrop) {
        modalBackdrop.classList.add("hidden");
    }
    else if (e.target.closest(".js-close-modal")) {
        modalBackdrop.classList.add("hidden");
    }

});

detailBackdrop.addEventListener("click", (e) => {
    if (e.target === detailBackdrop) {
        detailBackdrop.classList.add("hidden");
    }
    
    else if (e.target.closest(".js-close-detail")) {
        detailBackdrop.classList.add("hidden");
    }
})

renderCards(leadsArray);

function renderCards(leadsArray) {

    leadsContainer.innerHTML = "";

    leadsArray.forEach(lead => {

        leadsContainer.innerHTML += `

 <article class="lead-card flex flex-col bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-sm transition-all hover:border-light-accent dark:hover:border-dark-accent group" data-id="1">
                <div data-id = "${lead.id}" class="card-upper-part p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <span class="inline-flex items-center space-x-2 border border-[#D97706]/30 dark:border-[#F59E0B]/30 bg-[#FFFBEB] dark:bg-[#451A03]/20 text-[#B45309] dark:text-[#FBBF24] px-3 py-1 text-[10px] uppercase tracking-widest font-sans rounded-sm">
                            <i class="fa-solid fa-clock text-[8px]"></i> <span>${lead.leadStatus}</span>
                        </span>
                        <span class="js-lead-ago text-light-textSecondary dark:text-dark-textSecondary font-sans text-xs tracking-wide">${timeAgo(lead.leadAddedDate)}</span>
                    </div>
                    <h2 class="js-lead-project-title font-serif text-xl font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1 line-clamp-2">${lead.projectTitle}</h2>
                    <p class="js-lead-name font-sans text-sm tracking-wide text-light-textSecondary dark:text-dark-textSecondary mb-6">${lead.clientName}</p>
                    
                    <div class="mt-auto pt-6 border-t border-light-border dark:border-dark-border flex justify-between items-end">
                        <div>
                            <p class="font-sans text-[10px] uppercase tracking-widest text-light-textSecondary dark:text-dark-textSecondary mb-1">Budget</p>
                            <p class="font-sans text-lg tracking-wider font-light text-light-textPrimary dark:text-dark-textPrimary">$${lead.budget}</p>
                        </div>
                        <div class="flex items-center space-x-2 text-light-textSecondary dark:text-dark-textSecondary font-sans text-xs tracking-wider">
                            <i class="fa-brands fa-${lead.platform.toLowerCase()}"></i>
                            <span>${lead.platform}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-light-bg dark:bg-dark-bg border-t border-light-border dark:border-dark-border p-4 flex justify-between items-center rounded-b-sm">
                    
                    <!-- UPDATED STATUS DROPDOWN SELECTION -->
                    <div class="relative w-36">
                        <select data-id = "${lead.id}" class="js-status-select w-full appearance-none bg-light-card dark:bg-dark-card text-light-textPrimary dark:text-dark-textPrimary border border-light-border dark:border-dark-border font-sans text-[10px] tracking-widest uppercase py-2 pl-3 pr-10 outline-none rounded-sm cursor-pointer focus:border-light-accent dark:focus:border-dark-accent focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors">
                            <option value="pending" selected>Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                        </select>
                        <div class="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center border-l border-light-border dark:border-dark-border pointer-events-none">
                            <i class="fa-solid fa-chevron-down text-light-textSecondary dark:text-dark-textSecondary text-[9px]"></i>
                        </div>
                    </div>

                    <div class="flex space-x-3">
                        <button data-id = "${lead.id}" class="js-edit-btn text-light-textSecondary dark:text-dark-textSecondary hover:text-light-accent dark:hover:text-dark-accent transition-colors"><i class="fa-regular fa-pen-to-square text-sm"></i></button>
                        <button data-id = "${lead.id}" class="js-delete-btn text-light-textSecondary dark:text-dark-textSecondary hover:text-red-700 dark:hover:text-red-400 transition-colors"><i class="fa-regular fa-trash-can text-sm"></i></button>
                    </div>
                </div>
                <!-- Hidden elements for structural specs -->
                <span class="js-lead-date hidden">2023-10-14</span>
            </article>
`

    })

}

leadsContainer.addEventListener("click", (e) => {

    if (e.target.closest(".js-delete-btn")) {
        let card = e.target.closest(".js-delete-btn");
        let leadID = Number(card.dataset.id)
        leadsArray = leadsArray.filter(lead => lead.id !== leadID);
        saveToLS();
        renderCards(leadsArray);
        return;
    }

    if (e.target.closest(".card-upper-part")) {
        detailBackdrop.innerHTML = "";
        let card = e.target.closest(".card-upper-part");
        let cardID = Number(card.dataset.id);

        let clickedCard = leadsArray.find(lead => lead.id === cardID);
        console.log(clickedCard)
        detailBackdrop.innerHTML += `

  <div class="w-full max-w-5xl h-[85vh] flex flex-col md:flex-row shadow-2xl rounded-sm overflow-hidden border border-light-border dark:border-dark-border relative">
            <button class="js-close-detail absolute top-6 right-6 z-10 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors w-10 h-10 bg-light-card dark:bg-dark-card rounded-full flex items-center justify-center shadow-sm">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>
            
            <!-- Left Structural Pillar -->
            <div class="md:w-1/3 bg-light-bg dark:bg-dark-bg border-b md:border-b-0 md:border-r border-light-border dark:border-dark-border p-8 md:p-12 flex flex-col justify-between overflow-y-auto">
                <div>
                    <div class="mb-12">
                        <span class="js-detail-status inline-flex items-center space-x-2 border border-light-border dark:border-dark-border px-3 py-1 text-[10px] uppercase tracking-widest font-sans rounded-sm text-light-textPrimary dark:text-dark-textPrimary mb-8">
                            <i class="fa-solid fa-circle text-[6px] text-light-textSecondary dark:text-dark-textSecondary"></i> <span>${clickedCard.leadStatus}</span>
                        </span>
                        <p class="font-sans text-[10px] uppercase tracking-widest text-light-textSecondary dark:text-dark-textSecondary mb-2">Client Identity</p>
                        <h3 class="js-detail-name font-serif text-2xl text-light-textPrimary dark:text-dark-textPrimary">${clickedCard.clientName}</h3>
                    </div>
                    
                    <div class="space-y-8">
                        <div>
                            <p class="font-sans text-[10px] uppercase tracking-widest text-light-textSecondary dark:text-dark-textSecondary mb-2">Contact Email</p>
                            <p class="js-detail-email font-sans tracking-wide text-sm text-light-textPrimary dark:text-dark-textPrimary truncate">${clickedCard.clientEmail}</p>
                        </div>
                        <div>
                            <p class="font-sans text-[10px] uppercase tracking-widest text-light-textSecondary dark:text-dark-textSecondary mb-2">Location</p>
                            <p class="js-detail-location font-sans tracking-wide text-sm text-light-textPrimary dark:text-dark-textPrimary">${clickedCard.city}, ${clickedCard.country}</p>
                        </div>
                        <div>
                            <p class="font-sans text-[10px] uppercase tracking-widest text-light-textSecondary dark:text-dark-textSecondary mb-2">Sourced From</p>
                            <p class="js-detail-platform font-sans tracking-wide text-sm text-light-textPrimary dark:text-dark-textPrimary capitalize">${clickedCard.platform}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Structural Pillar -->
            <div class="md:w-2/3 bg-light-card dark:bg-dark-card p-8 md:p-16 overflow-y-auto">
                <p class="font-sans text-xs uppercase tracking-[0.2em] text-light-accent dark:text-dark-accent mb-4">Project Overview</p>
                <h2 class="js-detail-title font-serif text-4xl md:text-5xl font-medium leading-tight text-light-textPrimary dark:text-dark-textPrimary mb-10">${clickedCard.projectTitle}</h2>
                
                <div class="js-detail-brief font-sans text-base leading-relaxed tracking-wide text-light-textSecondary dark:text-dark-textSecondary whitespace-pre-line max-w-2xl">
                    ${clickedCard.projectBrief}
                </div>
            </div>
        </div>           

`
        console.log("upper part")
        detailBackdrop.classList.remove("hidden")
        detailBackdrop.classList.add("flex")
    }

    })

leadsContainer.addEventListener("change", (e) => {
    
    if (e.target.closest(".js-status-select")) {
        
        let cardSelect = e.target.closest(".js-status-select");
        let cardSelectID = Number(cardSelect.dataset.id);
        
        console.log(e.target.value);
        
        
        
        // let clickedCardDropdown = leadsArray.find()
    }

})
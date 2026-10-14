const FormModalBackdrop = document.querySelector(".js-modal-backdrop");
const addLeadBtn = document.querySelector(".js-add-lead-btn");
const form = document.querySelector(".js-lead-form");
const leadsContainer = document.querySelector(".js-leads-container");
const modalBackdrop = document.querySelector(".js-modal-backdrop");

let leadsArray = JSON.parse(localStorage.getItem("LSleadsArray")) || [];

function saveToLS() {
  localStorage.setItem("LSleadsArray", JSON.stringify(leadsArray)); 
}

addLeadBtn.addEventListener("click", () => {
    FormModalBackdrop.classList.remove("hidden")
    FormModalBackdrop.classList.add("flex")
})

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


function renderCards() {
    leadsContainer.innerHTML = "";

leadsArray.forEach(lead => {

leadsContainer.innerHTML += `

 <article class="lead-card flex flex-col bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-sm transition-all hover:border-light-accent dark:hover:border-dark-accent group" data-id="1">
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <span class="inline-flex items-center space-x-2 border border-[#D97706]/30 dark:border-[#F59E0B]/30 bg-[#FFFBEB] dark:bg-[#451A03]/20 text-[#B45309] dark:text-[#FBBF24] px-3 py-1 text-[10px] uppercase tracking-widest font-sans rounded-sm">
                            <i class="fa-solid fa-clock text-[8px]"></i> <span>${lead.leadStatus}</span>
                        </span>
                        <span class="js-lead-ago text-light-textSecondary dark:text-dark-textSecondary font-sans text-xs tracking-wide">2 hrs ago</span>
                    </div>
                    <h2 class="js-lead-project-title font-serif text-xl font-medium text-light-textPrimary dark:text-dark-textPrimary mb-1 line-clamp-2">E-Commerce Brand Identity Redesign</h2>
                    <p class="js-lead-name font-sans text-sm tracking-wide text-light-textSecondary dark:text-dark-textSecondary mb-6">Alexandra Dupont</p>
                    
                    <div class="mt-auto pt-6 border-t border-light-border dark:border-dark-border flex justify-between items-end">
                        <div>
                            <p class="font-sans text-[10px] uppercase tracking-widest text-light-textSecondary dark:text-dark-textSecondary mb-1">Budget</p>
                            <p class="font-sans text-lg tracking-wider font-light text-light-textPrimary dark:text-dark-textPrimary">$4,500</p>
                        </div>
                        <div class="flex items-center space-x-2 text-light-textSecondary dark:text-dark-textSecondary font-sans text-xs tracking-wider">
                            <i class="fa-brands fa-linkedin"></i>
                            <span>LinkedIn</span>
                        </div>
                    </div>
                </div>
                <div class="bg-light-bg dark:bg-dark-bg border-t border-light-border dark:border-dark-border p-4 flex justify-between items-center rounded-b-sm">
                    
                    <!-- UPDATED STATUS DROPDOWN SELECTION -->
                    <div class="relative w-36">
                        <select class="js-status-select w-full appearance-none bg-light-card dark:bg-dark-card text-light-textPrimary dark:text-dark-textPrimary border border-light-border dark:border-dark-border font-sans text-[10px] tracking-widest uppercase py-2 pl-3 pr-10 outline-none rounded-sm cursor-pointer focus:border-light-accent dark:focus:border-dark-accent focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors">
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
                        <button class="js-edit-btn text-light-textSecondary dark:text-dark-textSecondary hover:text-light-accent dark:hover:text-dark-accent transition-colors"><i class="fa-regular fa-pen-to-square text-sm"></i></button>
                        <button class="js-delete-btn text-light-textSecondary dark:text-dark-textSecondary hover:text-red-700 dark:hover:text-red-400 transition-colors"><i class="fa-regular fa-trash-can text-sm"></i></button>
                    </div>
                </div>
                <!-- Hidden elements for structural specs -->
                <span class="js-lead-date hidden">2023-10-14</span>
            </article>

` 
    
})

}

const FormModalBackdrop = document.querySelector(".js-modal-backdrop");
const addLeadBtn = document.querySelector(".js-add-lead-btn");
const form = document.querySelector(".js-lead-form");
const leadCard = document.querySelector(".lead-card");
const leadsContainer = document.querySelector(".js-leads-container");
const modalBackdrop = document.querySelector(".js-modal-backdrop");
const detailBackdrop = document.querySelector(".js-detail-backdrop");
const statusFilter = document.querySelector(".status-filter");
const searchInput = document.querySelector(".js-search-input");
const wonEl = document.querySelector(".js-stat-won");
const totalLeadsDisplay = document.querySelector(".js-stat-total");
const pipeLinedDisplay = document.querySelector(".js-stat-pipeline");
const winRateDisplay = document.querySelector(".js-stat-winrate");
const chartDisplay = document.querySelector(".js-status-chart-empty");
const platformDisplay = document.querySelector(".js-platform-chart-empty");
const cardEditBtn = document.querySelector(".js-edit-btn");
const htmlTag = document.querySelector(".html-tag");
const colorModeChanger = document.querySelector(".fa-circle-half-stroke");

let colorMode = localStorage.getItem("mode");
colorModeChanger.addEventListener("click", () => {
    if (htmlTag.classList.contains("dark")) {
        htmlTag.classList.remove("dark");
        htmlTag.classList.add("light");
        colorMode = localStorage.setItem("mode", "light")
    }
    else {
        htmlTag.classList.remove("light");
        htmlTag.classList.add("dark");

        colorMode = localStorage.setItem("mode", "dark")
    }
})
htmlTag.classList.add(`${colorMode}`)

let winRate = 0;
let editingId = null;
let statusStyles = {
    pending: {
        label: "Pending",
        colors: "inline-flex items-center space-x-2 border border-[#DC2626]/30 dark:border-[#EF4444]/30 bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 text-[#B91C1C] dark:text-[#F87171] px-3 py-1 text-[10px] uppercase tracking-widest font-sans rounded-sm",
    },
    lost: {
        label: "Lost",
        colors: "inline-flex items-center space-x-2 border border-[#DC2626]/30 dark:border-[#EF4444]/30 bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 text-[#B91C1C] dark:text-[#F87171] px-3 py-1 text-[10px] uppercase tracking-widest font-sans rounded-sm",
    },
    contacted: {
        label: "Contacted",
        colors: "inline-flex items-center space-x-2 border border border-[#2563EB]/30 dark:border-[#3B82F6]/30 bg-[#EFF6FF] dark:bg-[#172554]/20 text-[#1D4ED8] dark:text-[#60A5FA] px-3 py-1 text-[10px] uppercase tracking-widest font-sans rounded-sm",
    },
    won: {
        label: "Won",
        colors: "inline-flex items-center space-x-2 border border border-[#16A34A]/30 dark:border-[#22C55E]/30 bg-[#F0FDF4] dark:bg-[#052E16]/20 text-[#15803D] dark:text-[#4ADE80] px-3 py-1 text-[10px] uppercase tracking-widest font-sans rounded-sm",
    },
};


let leadsArray = JSON.parse(localStorage.getItem("LSleadsArray")) || [];

renderCards(leadsArray);
function saveToLS() {
    localStorage.setItem("LSleadsArray", JSON.stringify(leadsArray));
}

function renderStats() {

    let wonEarnings = leadsArray.reduce((sum, lead) => {
        if (lead.leadStatus === "won") {
            return sum + lead.budget;
        }
        return sum;
    }, 0);

    let pipeLine = leadsArray.reduce((sum, lead) => {
        if (lead.leadStatus === "contacted" || lead.leadStatus === "pending") {
            return sum + lead.budget;
        }
        return sum;
    }, 0);

    const wonCount = leadsArray.filter(function (lead) {
        return lead.leadStatus === "won";
    }).length;

    if (leadsArray.length > 0) {
        winRate = Math.round((wonCount / leadsArray.length) * 100);
        winRateDisplay.textContent = `${winRate}%`
    }

    wonEl.textContent = "$" + wonEarnings + ".00"
    totalLeadsDisplay.textContent = leadsArray.length;
    pipeLinedDisplay.textContent = "$" + pipeLine + ".00";

}
renderStats()

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

    if (editingId) {
        editingId.projectTitle = data.projectTitle;
        editingId.clientName = data.clientName;
        editingId.clientEmail = data.clientEmail;
        editingId.country = data.country;
        editingId.city = data.city;
        editingId.platform = data.platform;
        editingId.budget = Number(data.budget);
        editingId.leadStatus = data.status.toLowerCase();
        editingId.projectBrief = data.projectBrief;

        editingId = null;
    } else {

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
            leadStatus: data.status.toLowerCase(),
            projectBrief: data.projectBrief
        };
        leadsArray.push(newLead);
    }
    saveToLS();
    renderCards(leadsArray);
    renderStats()
    renderCharts()
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

let currentSearch = "";
let currentPlatform = "all";
let currentStatus = "all";

const baseClasses =
    "filter-btn font-sans text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all";

const activeClasses =
    "bg-light-textPrimary dark:bg-dark-textPrimary text-light-bg dark:text-dark-bg border border-transparent";

const inactiveClasses =
    "bg-transparent text-light-textSecondary dark:text-dark-textSecondary border border-light-border dark:border-dark-border hover:bg-light-textPrimary/5 dark:hover:bg-white/5";


function updatedActiveFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        const isActive = btn.dataset.status === currentStatus;
        btn.className = baseClasses + " " + (isActive ? activeClasses : inactiveClasses)
    })
}
function applyFilters() {
    let filtered = leadsArray.filter((lead) => {
        let matchesSearch = lead.clientName.toLowerCase().includes(currentSearch.toLowerCase())
        let matchesStatus = currentStatus === "all" || lead.leadStatus === currentStatus;
        return matchesSearch && matchesStatus;
    })
    renderCards(filtered)
    renderStats();
    renderCharts()
    updatedActiveFilters()
}

function renderCards(leadsArray) {

    leadsContainer.innerHTML = "";

    leadsArray.forEach(lead => {

        leadsContainer.innerHTML += `

 <article class="lead-card flex flex-col bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-sm transition-all hover:border-light-accent dark:hover:border-dark-accent group" data-id="1">
                <div data-id = "${lead.id}" class="card-upper-part p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-4">

<span class="${statusStyles[lead.leadStatus].colors}">
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
                            <option value="${lead.leadStatus}" selected>${lead.leadStatus}</option>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="won">Won</option>
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
        renderStats()
        return;
    }
    if (e.target.closest(".js-edit-btn")) {
        let card = e.target.closest(".js-edit-btn");
        let leadID = Number(card.dataset.id)
        editingId = leadsArray.find(lead => lead.id === leadID);

        form.elements.clientName.value = editingId.clientName
        form.elements.projectTitle.value = editingId.projectTitle;
        form.elements.clientName.value = editingId.clientName;
        form.elements.clientEmail.value = editingId.clientEmail;
        form.elements.country.value = editingId.country;
        form.elements.city.value = editingId.city;
        form.elements.platform.value = editingId.platform;
        form.elements.budget.value = editingId.budget;
        form.elements.status.value = editingId.leadStatus;
        form.elements.projectBrief.value = editingId.projectBrief;


        modalBackdrop.classList.remove("hidden");
        modalBackdrop.classList.add("flex");
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

        let changedValue = e.target.value;
        console.log(changedValue)
        let clickedCardDropdown = leadsArray.find(card => card.id === cardSelectID)

        clickedCardDropdown.leadStatus = changedValue;
        saveToLS();
        renderCards(leadsArray);
        renderStats()
        renderCharts()
    }

})

statusFilter.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    currentStatus = btn.dataset.status;

    applyFilters();
})

searchInput.addEventListener("click", (e) => {
    currentSearch = e.target.value;
    applyFilters();
})


// else if (e.target.closest(".filter-btn-pending")) {
//     let filteredArray = leadsArray.filter(card => card.leadStatus === "pending");
//     console.log("pending")
//     return renderCards(filteredArray)
// }
// else if (e.target.closest(".filter-btn-contacted")) {
//     let filteredArray = leadsArray.filter(card => card.leadStatus === "contacted");
//     console.log("pending")
//     return renderCards(filteredArray)
// }
// else if (e.target.closest(".filter-btn-won")) {
//     let filteredArray = leadsArray.filter(card => card.leadStatus === "won");
//     console.log("pending")
//     return renderCards(filteredArray)
// }
// else if (e.target.closest(".filter-btn-lost")) {
//     let filteredArray = leadsArray.filter(card => card.leadStatus === "lost");
//     console.log("pending")
//     return renderCards(filteredArray)
// }

const statusChartEl = document.getElementById("statusChart");
const platformChartEl = document.getElementById("platformChart");
let statusChart;
let platformChart;

if (leadsArray.length === 0) {
    chartDisplay.textContent = "No Data yet"
    platformDisplay.textContent = "No Data yet"
}
else {
    renderCharts()
}

function renderCharts() {
    const statuses = ["pending", "contacted", "won", "lost"];

    const counts = statuses.map(function (s) {
        return leadsArray.filter(function (lead) {
            return lead.leadStatus === s;
        }).length;
    });

    if (statusChart) statusChart.destroy();

    statusChart = new Chart(statusChartEl, {
        type: "bar",
        data: {
            labels: ["Pending", "Contacted", "Won", "Lost"],
            datasets: [
                {
                    label: "Leads",
                    data: counts,
                    backgroundColor: ["#D97706", "#2563EB", "#16A34A", "#DC2626"],
                    borderRadius: 2,
                    maxBarThickness: 48,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { color: "rgba(128,128,128,0.15)" },
                },
            },
        },
    });

    const platforms = ["upwork", "fiverr", "linkedin", "instagram", "whatsapp", "facebook", "other"];
    const platformCounts = platforms.map((platform) => {
        return leadsArray.filter(function (lead) {
            return lead.platform === platform;
        }).length;
    });

    if (platformChart) platformChart.destroy();

    platformChart = new Chart(platformChartEl, {
        type: "doughnut",
        data: {
            labels: ["Upwork", "Fiverr", "LinkedIn", "Instagram", "WhatsApp", "Facebook", "Other"],
            datasets: [
                {
                    data: platformCounts,
                    backgroundColor: ["#16A34A", "#EAB308", "#2563EB", "#DB2777", "#0D9488", "#7C3AED", "#6B7280"],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "55%",
            plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } },
        },
    });

}


const exportBtn = document.querySelector(".js-export-btn");

function escapeCSV(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
}

function exportToCSV() {
    if (leadsArray.length === 0) return;

    const headers = ["clientName", "projectTitle", "clientEmail", "country", "city", "platform", "budget", "leadStatus", "projectBrief", "leadAddedDate"];

    const rows = leadsArray.map(function (lead) {
        return headers
            .map(function (h) {
                return escapeCSV(lead[h]);
            })
            .join(",");
    });

    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();

    URL.revokeObjectURL(url);
}

exportBtn.addEventListener("click", exportToCSV);
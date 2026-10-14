const FormModalBackdrop = document.querySelector(".js-modal-backdrop");
const addLeadBtn = document.querySelector(".js-add-lead-btn");
const form = document.querySelector(".js-lead-form");
const modalBackdrop = document.querySelector(".js-modal-backdrop");

let leadsArray = JSON.parse(localStorage.getItem("LSleadsArray")) || [];

function saveToLS() {
  // Yahan se quotes hata diye hain taake variable pass ho
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


export function showToast(message, type = "info") {

    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    let icon = "";

    switch(type){

        case "success":
            icon = "✓";
            break;

        case "error":
            icon = "✕";
            break;

        case "warning":
            icon = "⚠";
            break;

        default:
            icon = "ℹ";

    }

    toast.innerHTML = `<strong>${icon}</strong> ${message} `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {

            toast.remove();

        },5000);

    },3000);

}
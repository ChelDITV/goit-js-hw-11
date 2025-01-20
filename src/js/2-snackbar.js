import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.querySelector(".form").addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;

    createPromise(delay, state)
        .then((delay) => {
            iziToast.success({
                title: "✅ OK",
                message: `Fulfilled promise in ${delay}ms`,
                position: "topRight",
                timeout: 5000,
            });
        })
        .catch((delay) => {
            iziToast.error({
                title: "❌ Error",
                message: `Rejected promise in ${delay}ms`,
                position: "topRight",
                timeout: 5000,
            });
        });

    form.reset();
});

function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}

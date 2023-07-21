// Получаем все фотографии
const images = document.querySelectorAll(".before_after__images_grid img")

// Получаем модальное окно
const modal = document.createElement("div")
modal.classList.add("modal")
modal.innerHTML = `
<div class="before_after__modal">
  <img src="" alt="" class="before_after__modal_img"/>
</div>
`
document.body.appendChild(modal)

// Получаем ссылки на элементы модального окна
const modalImage = modal.querySelector(".before_after__modal_img")
const modalWrapper = modal.querySelector(".before_after__modal")
modalImage.classList.add("cursor-before_after__modal_img__cursor_default")
// Обработчик клика на фотографию
images.forEach((image) => {
    image.addEventListener("click", () => {
        // Устанавливаем изображение в модальное окно
        modalImage.src = image.src
        // Открываем модальное окно
        modal.style.display = "block"
    })
})

// Обработчик клика вне модального окна
window.addEventListener("click", (event) => {
    if (event.target === modalWrapper) {
        modal.style.display = "none"
    }
})

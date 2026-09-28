const template = document.getElementById('contact-card') 
const main = document.getElementById('main')
const contents = [
    {
        img: './img/11.webp',
        name: 'песик',
        email: 'asdasd@gmail.com',
        number: '899999999'
    },
    {
        img: './img/2.jpg',
        name: 'лысипопи',
        email: 'popi1@gmail.com',
        number: '999999999'
    },
    {
        img: './img/3.jpg',
        name: 'соннипопи',
        email: 'popi2@gmail.com',
        number: '898888888'
    }
]

contents.forEach(function (content) {
    const cont = template.content.cloneNode(true)

    cont.querySelector('.img1').src = content.img
    cont.querySelector('.name').textContent = content.name
    cont.querySelector('.emeil').textContent = content.email
    cont.querySelector('.tel').textContent = content.number

    main.appendChild(cont)
})
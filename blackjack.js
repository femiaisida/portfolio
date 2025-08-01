let cards = []
let sum = 0
let hasBlackjack = false
let isAlive = false
let message = ""
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let startOrRestart= document.getElementById("start-el")
let showEl = document.getElementById("show-el")
let hideEl= document.getElementById("hide-el")

let player = {
    name:"Player",
    chips: 100

}



let playerEl= document.getElementById("player-el")
playerEl.textContent = player.name + ": $" + player.chips

function getRandomCard () {
    let randomNumber = Math.floor(Math.random() * 13) +1
    if (randomNumber === 1){
        return 11
    }else if (randomNumber > 10){
        return 10
    }else {
        return randomNumber
    }
}

function startGame() {
    if (player.chips >= 2) {
    isAlive = true
    let firstcard= getRandomCard ()
    let secondCard = getRandomCard ()
    cards = [firstcard, secondCard]
    sum = firstcard + secondCard
    renderGame()

    }  else  {

         startOrRestart.textContent=("NO MONEY LEFT")
    }

        if (startOrRestart.textContent == "RESTART GAME"){

            showRules ()


        }
    
}

function renderGame() {

    

    player.chips+= -2
playerEl.textContent = player.name + ": $" + player.chips

    cardsEl.textContent = ("Cards: " )
for (let i=0 ; i < cards.length; i++) {

    cardsEl.textContent += cards[i] + " "
    sumEl.textContent = ("Sum: " + sum)
}



sumEl.textContent = ("Sum: " + sum)

if (sum <= 20) {

    message=("Do you want to draw a new card?")
} else if (sum === 21) {

    player.chips+=5
    message=("Woohoo! You've got Blackjack!")
    hasBlackjack = true
    startOrRestart.textContent=("WINNER")
    hasBlackjack=false
    
}else {

    message=(" Bust! You're out of the game!")
    isAlive = false

}

messageEl.textContent =(message)
startOrRestart.textContent=("RESTART GAME")


}

function newCard() {

    if (isAlive === true && hasBlackjack === false && player.chips> 2) {

    let card= getRandomCard ()
    sum+= card
    cards.push(card)
    renderGame()

    }

}

function showRules() {

    showEl.textContent=""
    hideEl.textContent="CLICK TO SHOW RULES"
    
}





function hideRules () {

    hideEl.textContent=""
    showEl.textContent="Rules: You need 21 to get Blackjack. Each new card costs $2 but if you get Blackjack you receive your original bet +$3"
   showEl.innerHTMl += `
   <style> 
   .rules {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2em;
    margin-bottom: 2em;
    text-align: left;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    background: #145214;
    </style>
    `
}










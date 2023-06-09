'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

//Functions:

const date = new Date();
const month = `${date.getMonth() + 1}`.padStart(2,0);
const day = `${date.getDate()}`.padStart(2,0);
const year = `${date.getFullYear()}`.padStart(2,0);
const hours = `${date.getHours()}`.padStart(2,0);
const minutes = `${date.getMinutes()}`.padStart(2,0);

/* /userName generation method;











const userName = function() {
    accounts.forEach(acc => {
        acc.userName = acc.owner
        .toLowerCase()
        .split(' ')
        .slice()
        .map(elem => elem.slice(0,1))
        .join('');
    })
    console.log(accounts);
}

userName();

//display balance

const displayBalance = function(acc) {
    const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = balance;
    labelDate.textContent = `${month}/${day}/${year} ${hours}:${minutes}`;
}


//display movements

const displayMovements = function(acc, sorted = false) {

    const movements = sorted ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

    containerMovements.innerHTML = '';

        movements.forEach((mov, i) => {
        
        const date = new Date(acc.movementsDates[i]);
        const month = `${date.getMonth() + 1}`.padStart(2,0);
        const day = `${date.getDate()}`.padStart(2,0);
        const year = `${date.getFullYear()}`.padStart(2,0);

        const transferDate = `${month}/${day}/${year}`;

        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${transferDate}</div>
        <div class="movements__value">${mov}€</div>
      </div>`

      containerMovements.insertAdjacentHTML('afterbegin', html);

    })
}

//display summary

const displaySummary = function(acc) {

    const inputs = acc.movements.filter(mov => mov > 0).reduce((acc, movs) => acc + movs, 0);
    labelSumIn.textContent = `${inputs.toFixed(2)}€`;

    const outputs = acc.movements.filter(mov => mov < 0).reduce((acc, movs) => acc + movs, 0);
    labelSumOut.textContent = `${outputs.toFixed(2)}€`

    const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0).toFixed(2);
  labelSumInterest.textContent = `${interest}€`;
}

//group functions

const updateUI = function(acc) {
    displayBalance(acc);
    displayMovements(acc);
    displaySummary(acc);
}


const logOutTimer = function() {

    let time =  300;
    let minutes = `${Math.floor(time/60)}`.padStart(2,0);
    let seconds = `${time}`.padStart(2,0);

    const tick = function() {
        let minutes = `${Math.floor(time/60)}`.padStart(2,0);
        let seconds = `${time % 60}`.padStart(2,0);

        labelTimer.textContent = `${minutes}:${seconds}`;

        time--;
    }

    if (time == 0) {
        clearInterval(timer);
        containerApp.style.opacity = 0;
        labelWelcome.textContent =  `Login to Get Started`;
    }

    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}

let currentUser, timer;

//login event listener

btnLogin.addEventListener('click', function(e) {
    e.preventDefault();

    currentUser = accounts.find(acc => acc.userName == inputLoginUsername.value);
    if (currentUser.pin == +(inputLoginPin.value)) {
        containerApp.style.opacity = 100;
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        if(timer) clearInterval(timer);
        timer = logOutTimer();
        if (hours > 6 && hours <= 12) {
            labelWelcome.textContent = `Good Morning, ${currentUser.owner.split(' ')[0]}!`;
        }
        else if (hours > 12 && hours <= 17) {
            labelWelcome.textContent = `Good Day, ${currentUser.owner.split(' ')[0]}!`;
        }
        else if (hours > 17 && hours <= 23) {
            labelWelcome.textContent = `Good Evening, ${currentUser.owner.split(' ')[0]}!`;
        }
        else {
            labelWelcome.textContent = `Good Night, ${currentUser.owner.split(' ')[0]}!`;
        }
        updateUI(currentUser);
    }
})




//Transfer event listener

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();

    const newDate = new Date();
    const amount = +(inputTransferAmount.value)
    const transferAccount = accounts.find(acc => acc.userName == inputTransferTo.value);
    if(amount > 0 && transferAccount !== currentUser) {
        currentUser.movements.push(-amount);
        currentUser.movementsDates.push(newDate.toISOString());
        transferAccount.movements.push(amount);
        transferAccount.movementsDates.push(newDate.toISOString());
        inputTransferTo.value = inputTransferAmount.value = '';
        inputTransferAmount.blur();
        updateUI(currentUser);
        if(timer) clearInterval(timer);
        timer = logOutTimer();
    }

})


//Loan Event listener

btnLoan.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = +(inputLoanAmount.value);
    
    if(amount > 0) {
        currentUser.movements.push(amount);
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
        setTimeout(function() {
            updateUI(currentUser); 
        }, 3000);
        if(timer) clearInterval(timer);
        timer = logOutTimer();
    }

})


//sort event listener
let sorted = false;

btnSort.addEventListener('click', function(e) {
    e.preventDefault();

    displayMovements(currentUser, !sorted);
    sorted = !sorted;
    if(timer) clearInterval(timer);
    timer = logOutTimer();

})


//Close event listener

btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    const user = accounts.find(acc => acc.userName == inputCloseUsername.value);
    const index = accounts.findIndex(acc => acc == currentUser);
    if(user.pin == Number(inputClosePin.value)) {
        containerApp.style.opacity = 0;
        accounts.splice(index, 1);
        labelWelcome.textContent = 'Login to get Started';
        containerApp.style.opacity = 0;
        inputCloseUsername.value = inputClosePin.value = '';
        inputClosePin.blur();
        if(timer) clearInterval(timer);
        timer = logOutTimer();
    }

}) */


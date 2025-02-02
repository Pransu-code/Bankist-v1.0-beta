'use strict';
// Data

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
  

  const displayMovements = function(acc,sort){

    containerMovements.innerHTML = '';
    console.log(acc.movements);
    const movs = sort?acc.movements.slice().sort((a,b) => a-b) : acc.movements;

    movs.forEach(function(mov,i){

        const type = mov > 0 ? "deposit" : "withdrawal";

        const date = new Date(acc.movementsDates[i]);
        const day = `${date.getDate()}`.padStart(2,0);
        const month = `${date.getMonth() + 1}`.padStart(2,0);
        const year = `${date.getFullYear()}`; 
       

        const displayDate = `${day}/${month}/${year}`;
        
        const html =`
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${mov}</div>
        </div>
        `;
        // labelDate.textContent = `${displayDate}`;
        containerMovements.insertAdjacentHTML('afterbegin',html);
    });
  };

  // displayMovements(account1.movements);

  const calcDisplaySummary = function(movements) {
    // console.log(movements);
    const incomes = movements.filter(mov => mov > 0).reduce((acc,mov) => acc+mov,0);
    // console.log(incomes);
    labelSumIn.textContent = `${incomes}$`;
    
  
  
    const out = movements.filter(mov => mov<0).reduce((acc,mov)=> acc+mov, 0);

    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}$`;

  }
// calcDisplaySummary(account1.movements);
const interests = function(interestRate,movements){
  // console.log(interestRate,movements);
  const interest = movements.filter(mov => mov > 0).map(deposit => (deposit*interestRate)/100).reduce((acc,mov) => acc+mov,0);
  console.log(interest);
  labelSumInterest.textContent = `${interest.toFixed(2)}%`;

};


// const arr = [10,20,30,40];

// const calcAverageAge = arr.reduce((acc,mov,i,arr)=> acc+mov / arr.length,0);
 
// console.log(calcAverageAge);

const displayBalance = function(acc){

  acc.balance = acc.movements.reduce((acc,mov) => acc+mov,0);
  labelBalance.textContent = `${acc.balance}$`;

}


const createUsernames = function(acc) {
 
  acc.forEach(function(accs){
    accs.username = accs.owner.toLowerCase().split(' ').map(names=>names[0]).join('');
    
  })

}

createUsernames(accounts);
// console.log(accounts);
//event handlers


//update UI

const updateUi = function(currentAccount){
  displayMovements(currentAccount );
  calcDisplaySummary(currentAccount.movements);
  displayBalance(currentAccount);
}



const startLogoutTimer = function(){
  //set tinme to 5 minutes
  const tick = function(){
    
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);

    labelTimer.textContent = `${min}:${sec}`;
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;

   
};
  //call timer every second
  let time = 600;
  tick();
  const timer = setInterval(tick,1000);
  return timer;
}

let currentAccount,timerr;


//current date and time

let now = new Date();
const day = `${now.getDate()}`.padStart(2,0);
const month = `${now.getMonth() + 1}`.padStart(2,0);
const year = `${now.getFullYear()}`; 
let hour = now.getHours();
let min = now.getMinutes();
labelDate.textContent = `As of ${day}/${month}/${year},${hour}:${min}`;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  // console.log('Login');
  
  currentAccount = accounts.find(acc => acc.username===inputLoginUsername.value);
// console.log(currentAccount);

if(currentAccount?.pin === Number(inputLoginPin.value)) {
  labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;

  containerApp.style.opacity = 100;

  //input clear 
  inputLoginUsername.value = inputLoginPin.value = '';

  interests(currentAccount.interestRate,currentAccount.movements);

  // currentAccount.movementsDates.push(new Date());

  if(timerr) clearInterval(timerr);
  timerr = startLogoutTimer();
  updateUi(currentAccount);

}
})

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  
  if(amount > 0 && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
  clearInterval(timerr);
  timerr = startLogoutTimer();  
  }
})

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  
  // console.log(index);
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index,1);
    console.log('spliced');
    containerApp.style.opacity = 0;
  }
  
})

let sorted = false;

btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount,!sorted);
  sorted = !sorted;

})


btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUi(currentAccount);

      // Reset timer
      clearInterval(timerr);
      timerr = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});
// console.log(new Date(account1.movementsDates[0]));
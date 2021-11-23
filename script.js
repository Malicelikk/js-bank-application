'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
console.log(accounts);

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

const displayMovements = function(acc){

  containerMovements.innerHTML = '';

  acc.movements.forEach(function(mov, i) { // array i foreach e soktuk her eleman mov index i

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);  // her eleman için oluşturdugumuz elementi container a firstchild olarak ekledik

  })
}

// kullanıcıların isimlerinin baş harflerinden kullanıcı adı oluşturup obje üzerine ekleme
const createUsernames = function(accs){

  accs.forEach(function(acc){ // array içindeki her obje için
    console.log(acc.owner);
    console.log(acc.owner.toLowerCase().split(' ')); // kelimeleri ayırarak array oluştur
    console.log(acc.owner.toLowerCase().split(' ').map(name => name[0])); // arrayin elemanlarının ilk harflerinden yeni array
    console.log(acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')); // birleştirerek string dön
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join(''); // objede yeni property oluştur
  });

};

createUsernames(accounts); //const accounts = [account1, account2, account3, account4];

const calcDisplayBalance = function(acc){  // get sum of array for balance with reduce
    const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    acc.balance = balance; // objeye balance property sini ekledik
    labelBalance.textContent = balance + ' €';
    console.log(acc);
}


const calcDisplaySummary = function(acc){ // array filtreleyip toplama
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes} €`;

    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)} €`;

    const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate)/100).reduce((acc, mov) => acc + mov, 0);
    labelSumInterest.textContent = `${Math.round(interest)} €`;

}

const updateUI = function(currentAccount){
  displayMovements(currentAccount); 
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}


let currentAccount;
let timer;

const now = new Date();
const day = now.getDate();
const month = now.getMonth();
const year = now.getFullYear();
const hour = now.getHours();
const min = `${now.getMinutes()}`.padStart(2,0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;



btnLogin.addEventListener('click', function(e){ // Giriş yap dataları getir
  e.preventDefault(); // submit ve sayfa yenilenmesini engellemek için

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount && currentAccount.pin === Number(inputLoginPin.value)){
   
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; // kelimeleri dizi olarak ayır
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }

  updateUI(currentAccount);
  if (timer) clearInterval(timer); // timer varsa durdur
  timer = startLogOutTimer();

});

const startLogOutTimer = function() {

  let time = 100;

  const timer = setInterval(function(){
    labelTimer.textContent = time;
    time--;

    if(time === 0){
      clearInterval(timer); // interval ı durdur
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
  },1000);  // her saniye tekrar çalıştır

  return timer;
};

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  console.log(amount , receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && currentAccount.balance >= amount && receiverAcc && receiverAcc.username !== currentAccount.username){
    currentAccount.movements.push(-amount); // movements arrayine yeni değeri pushladık
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);

    clearInterval(timer); // timer varsa durdur
    timer = startLogOutTimer();
  }

});

btnClose.addEventListener('click',function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){

    const index = accounts.findIndex(acc => acc.username === inputCloseUsername.value);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});


///////////////////////////////////////// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/// Array Map method and for of usage

const eurToUsd = 1.1;

const movementsUSD = movements.map(function(mov){
  return mov * eurToUsd;
});

console.log(movements);
console.log(movementsUSD); // map yeni array yaratır

/////////arrow func of map
const movementsUSDarrow = movements.map(mov => mov * eurToUsd);
console.log(movementsUSDarrow);

///////// for of
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov*eurToUsd);

console.log(movementsUSDfor);

///////////////////// FILTER returns new array

const deposits = movements.filter(function(mov){
  return mov > 0 ;
})

console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


///////////////// FIND returns one and first element

const withdrawalfirst = movements.find(mov => mov < 0);
console.log(withdrawalfirst); // -400

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

const accountfn = accounts.find(function(acc){ // accounts arrayindeki her obje için callback function
  return acc.owner === 'Jessica Davis';
})
console.log(accountfn);

///// compute balance with REDUCE AND FOR OF

const balance = movements.reduce((acc,cur) => acc + cur, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

////// chaining methods
const totalDepositsUSD = movements.filter(mov => mov > 0)
                        .map(mov => mov * eurToUsd)
                        .reduce((acc, mov) => acc + mov, 0);


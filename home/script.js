function openPopup(TriggeredButton) {

    if (TriggeredButton == "Withdraw") {
        action = "Withdraw";

        document.getElementById('WithdrawPopup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';

    } else if (TriggeredButton == "Trade") {
        action = "Trade";

        document.getElementById('TradePopup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';

    } else {
        action = "Deposit";

        document.getElementById('DepositPopup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    };
}

function closePopup() {
    document.getElementById('WithdrawPopup').style.display = 'none';
    document.getElementById('TradePopup').style.display = 'none';
    document.getElementById('DepositPopup').style.display = 'none';
    document.getElementById('AccountPopup').style.display = 'none';

    document.getElementById('overlay').style.display = 'none';
}

async function AccountBreakDown() {
    await GetPrices()

    document.getElementById('AccountPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

async function Withdraw(Amount) {

    const CurrentFileName = "accounts\\" + CurrentUser + ".acc";
    const CurrentFile = await fetch(CurrentFileName);
    const CurrentBalence = await CurrentFile.text();

    const SavingsFileName = "savings\\" + CurrentUser + ".acc";
    const SavingsFile = await fetch(SavingsFileName);
    const SavingsBalence = await SavingsFile.text();

    const NewCurrentBalence = Number(CurrentBalence) + Number(Amount);
    const NewSavingsBalence = Number(SavingsBalence) - Number(Amount);

    if (NewSavingsBalence > -500) {
        WriteToFile("home\\" + CurrentFileName, String(NewCurrentBalence))
        WriteToFile("home\\" + SavingsFileName, String(NewSavingsBalence))

        alert("Did that")
    } else {
        alert("Too poor broke ahh bi-")
    }

}

async function Deposit(Amount) {

    const CurrentFileName = "accounts\\" + CurrentUser + ".acc";
    const CurrentFile = await fetch(CurrentFileName);
    const CurrentBalence = await CurrentFile.text();

    const SavingsFileName = "savings\\" + CurrentUser + ".acc";
    const SavingsFile = await fetch(SavingsFileName);
    const SavingsBalence = await SavingsFile.text();

    const NewCurrentBalence = Number(CurrentBalence) - Number(Amount);
    const NewSavingsBalence = Number(SavingsBalence) + Number(Amount);

    if (NewCurrentBalence > -500) {
        WriteToFile("home\\" + CurrentFileName, String(NewCurrentBalence))
        WriteToFile("home\\" + SavingsFileName, String(NewSavingsBalence))

        alert("Did that")
    } else {
        alert("Too poor broke ahh bi-")
    }

}

async function trade(TargetUser, Amount) {

    const CurrentFileName = "accounts\\" + CurrentUser + ".acc";
    const CurrentFile = await fetch(CurrentFileName);
    const CurrentBalence = await CurrentFile.text();

    const TargetFileName = "accounts\\" + TargetUser.slice(0, -1) + ".acc";
    const TargetFile = await fetch(TargetFileName);
    const TargetBalence = await TargetFile.text();

    const BankFileName = "accounts\\bank.acc";
    const BankFile = await fetch(BankFileName);
    const BankBalence = await BankFile.text();

    const CurrentNewBalence = Number(CurrentBalence) - Number(Amount);
    const TargetNewBalence = Number(TargetBalence) + Number(Amount) * 0.95;
    const NewBankBalence = Number(BankBalence) + Number(Amount) * 0.05;
    
    if (CurrentNewBalence > -500) {
        WriteToFile("home\\" + CurrentFileName, String(CurrentNewBalence));
        WriteToFile("home\\" + TargetFileName, String(TargetNewBalence));
        WriteToFile("home\\" + BankFileName, String(NewBankBalence));

        alert("Did that")
    } else {
        alert("Too poor broke ahh bi-")
    }
}

async function confirmAction() {
    // Add your confirmation logic here
    const Dropdown = document.getElementById("dropdown");
    const UserName = Dropdown.value;

    if (action == "Trade") {
        const NumberInput = document.getElementById("amount1");
        const Amount = NumberInput.value;

        if (Amount < 0) {alert("Has to me more than zero")};

        await trade(UserName, Amount);

    } else if (action == "Withdraw") {
        const NumberInput = document.getElementById("amount2");
        const Amount = NumberInput.value;

        if (Amount < 0) {alert("Has to me more than zero")};

        await Withdraw(Amount);

    } else {
        const NumberInput = document.getElementById("amount3");
        const Amount = NumberInput.value;

        if (Amount < 0) {alert("Has to me more than zero")};

        await Deposit(Amount);
    }

    closePopup();
    GetPrices();
}

async function GetFileContents(FileName) {
    const file = await fetch(FileName);
    const data = await file.text();

    return data;
}

// Function to load data from a file
function loadDataFromFile(file, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const xArray = [];
            const yArray = [];

            lines.forEach(line => {
                const [x, y] = line.split(' ').map(Number);
                xArray.push(x);
                yArray.push(y);
            });

            callback(xArray, yArray);
        })
        .catch(error => console.error('Error loading data:', error));
}

async function fetchOptions() {
    try {
        const data = await GetFileContents('Data\\options.txt')

        // Split the options by newline and populate the dropdown
        const options = data.split('\n');
        const dropdown = document.getElementById('dropdown');

        options.forEach(option => {
            if (option.trim() != CurrentUser.trim()) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.text = option;
                dropdown.add(optionElement);
            }
        });
    } catch (error) {
        console.error('Error fetching options:', error);
    }
}

async function GetPrices() {
    try {
        const prices = await GetFileContents('Data\\prices.txt')
        const Prices = prices.split('\n');
        const UNTtoEUR = document.getElementById('UNTtoEUR');
        const EURtoUNT = document.getElementById('EURtoUNT');

        UNTtoEUR.textContent = "1 UNT = " + Prices[0] + " EUR";
        EURtoUNT.textContent = "1 EUR = " + Prices[1] + " UNT";


        const CurrentBalence = await GetFileContents('accounts\\' + CurrentUser + '.acc')
        const CurrentsBalenceEUR = Math.round(CurrentBalence * Prices[0] * 1000)/1000;
        const CurrentBalUNT = document.getElementById('CurrentBalUNT');
        const CurrentBalEUR = document.getElementById('CurrentBalEUR');

        CurrentBalUNT.textContent = String(CurrentBalence) + " UNT";
        CurrentBalEUR.textContent = String(CurrentsBalenceEUR + " EUR");


        const SavingsBalence = await GetFileContents('savings\\' + CurrentUser + '.acc');
        const SavingsBalenceEUR = Math.round(SavingsBalence * Prices[0] * 1000)/1000;
        const SavingsBalUNT = document.getElementById('SavingsBalUNT');
        const SavingsBalEUR = document.getElementById('SavingsBalEUR');

        SavingsBalUNT.textContent = String(SavingsBalence) + " UNT";
        SavingsBalEUR.textContent = String(SavingsBalenceEUR) + " EUR";


        const TotalBalUNT = document.getElementById('TotalBalUNT');
        const TotalBalEUR = document.getElementById('TotalBalEUR');

        TotalBalUNT.textContent = "UNT " + (Number(CurrentBalence) + Number(SavingsBalence));
        TotalBalEUR.textContent = "€ " + (Number(CurrentsBalenceEUR) + Number(SavingsBalenceEUR));

    } catch {
        console.error('Error fetching prices:');
    }

};

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
};

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    window.location.reload()
}

async function WriteToFile(fileName, data) {
    try {
        const response = await fetch('/writeToFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName, data }), // Include fileName in the payload
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const message = await response.text();
    } catch (error) {
        console.error('Error:', error);
    }
}


// Load data from file and create the plot
loadDataFromFile('Data\\data1.txt', (xArray, yArray) => {
    // Define Data
    const data = [{
        x: xArray,
        y: yArray,
        mode: "lines",
        type: "scatter"
    }];

    var Xstart = xArray[0]-10
    
    if (Xstart < 0) {
        Xstart = 0
    }

    // Define Layout
    const layout = {
        xaxis: {range: [Xstart, 160], title: "Time"},
        yaxis: {range: [0, 16], title: "Price"},
        title: "EUR -> UNT"
    };

    // Display using Plotly
    Plotly.newPlot("Graph1", data, layout);
});

loadDataFromFile('Data\\data2.txt', (xArray, yArray) => {
    // Define Data
    const data = [{
        x: xArray,
        y: yArray,
        mode: "lines",
        type: "scatter"
    }];

    var Xstart = xArray[0]-10

    if (Xstart < 0) {
        Xstart = 0
    }

    // Define Layout
    const layout = {        
        xaxis: {range: [Xstart, 160], title: "Time"},
        yaxis: {range: [0, 16], title: "Price"},
        title: "UNT -> EUR"
    };

    // Display using Plotly
    Plotly.newPlot("Graph2", data, layout);
});

let action = "";
const CurrentUser = getCookie("LoginID");

if (CurrentUser == "") {
    window.location.href = '/';
};

fetchOptions();
GetPrices();
import os
import time

EURAMOUNT = 74.2
MARKETCAP = 100000
MAXCHANGE = 500
UBIISSUED = 100


ACCPREFIX = "home\\accounts\\"
SAVPREFIX = "home\\savings\\"

def CurrentAccountTax():
    dirs = os.listdir(ACCPREFIX)

    for dir in dirs:
        if dir == f"{ACCPREFIX}bank.acc": continue

        bal = GetBal(dir[:-4])
        Tax, Final = GetTaxBracket(bal)

        UpdateUserAccount(dir[:-4], Final, replace=True)
        UpdateUserAccount("bank", Tax)

def GetPrice():
    Total = 0
    files = os.listdir(SAVPREFIX)

    for file in files:
        with open(f"{ACCPREFIX}{file}", "r") as f:
            Total += float(f.read())

    with open(f"{ACCPREFIX}bank.acc", "r") as f:
        Total += float(f.read())

    return Total/EURAMOUNT, EURAMOUNT/Total


def GetTotal(BankBal):
    Total = BankBal
    files = os.listdir("accounts")

    for file in files:
        if file == "bank.acc": continue

        with open(f"{ACCPREFIX}{file}", "r") as f:
            Total += float(f.read())

    return Total


def GetTaxBracket(total):
    if total <= 5000: return (0, total)
    if 5000 < total <= 10000: return  (total * 0.02, total * 0.98)
    if 10000 < total <= 20000: return (total * 0.06, total * 0.94)
    if 20000 < total <= 35000: return (total * 0.14, total * 0.86)
    if 35000 < total <= 50000: return (total * 0.3, total * 0.7)
    if total > 50000: return (total * 0.5) * 2


def UpdateUserAccount(UserName, amount, replace=False):
    if replace == False:
        with open(f"{ACCPREFIX}{UserName}.acc", "r") as f:
            TargetBalence = float(f.read())

        with open(f"{ACCPREFIX}{UserName}.acc", "w") as f:
            NewBal = float(TargetBalence + amount) 
            f.write(str(NewBal))

    else:
        with open(f"{ACCPREFIX}{UserName}.acc", "w") as f:
            NewBal = float(amount) 
            f.write(str(NewBal))


def UpdateSavings(UserName, amount, replace=False):
    if replace == False:
        with open(f"{SAVPREFIX}{UserName}.acc", "r") as f:
            TargetBalence = float(f.read())

        with open(f"{SAVPREFIX}{UserName}.acc", "w") as f:
            NewBal = float(TargetBalence + amount) 
            f.write(str(NewBal))

    else:
        with open(f"{SAVPREFIX}{UserName}.acc", "w") as f:
            NewBal = float(amount) 
            f.write(str(NewBal))


def GetBal(UserName):
    with open(f"{ACCPREFIX}{UserName}.acc", "r") as f:
        return float(f.read())

class bank:
    def __init__(self) -> None:
        if not os.path.exists(f"{ACCPREFIX}bank.acc"):
            with open(f"{ACCPREFIX}bank.acc", "a") as f:
                f.close()

        with open(f"{ACCPREFIX}bank.acc", "r") as f:
            self.balence = float(f.read())


    def stablize(self):
        global UBIISSUED

        Total = GetTotal(self.ReadBal())

        print(f"Total:{round(Total)} Balence:{round(self.balence)} Target:{MARKETCAP - Total}")

        if Total < MARKETCAP:
            self.prints(Total)

        if Total > MARKETCAP + 10000:
            self.burn(Total)

        if Total > MARKETCAP:
            UBIISSUED += 100

        if Total < MARKETCAP/10:
            UBIISSUED -= 100


    def prints(self, Total):
        Final = (MARKETCAP - Total)
        if Final > MARKETCAP:
            return
        
        if Final > MAXCHANGE:
            Final = MAXCHANGE

        self.balence = Final

        UpdateUserAccount("bank", Final)


    def burn(self, Total):
        Final = float(Total - MARKETCAP)
        if Final < 0:
            return

        if Final > MAXCHANGE:
            Final = MAXCHANGE
        
        self.balence = Final

        UpdateUserAccount("bank", -Final)


    def ReadBal(self):
        with open(f"{ACCPREFIX}bank.acc") as f:
            self.balence = float(f.read())
            return self.balence
        

    def UBI(self):
        dirs = os.listdir(f"{ACCPREFIX}")

        TotalDue = (len(dirs)-1) * UBIISSUED

        if TotalDue >= self.balence:
            return
        
        for dir in dirs:
            if dir == f"{ACCPREFIX}bank.acc": continue
            UpdateUserAccount(dir[:-4], UBIISSUED)
            UpdateUserAccount("bank", -UBIISSUED)


    def reset(self, Really=False):
        if Really:
            if os.path.exists(f"{ACCPREFIX}bank.acc"):
                os.remove(f"{ACCPREFIX}bank.acc")

Bank = bank()

exit()

while True:
    for i in range(24):
        time.sleep(3600)
        Bank.stablize()
        UNTprice, EURprice = GetPrice()
        with open("home\\Data\\prices.txt", "w") as f:
            f.write(f"{UNTprice}\n{EURprice}")

    Bank.UBI()
    CurrentAccountTax()